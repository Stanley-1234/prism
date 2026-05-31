# ============================================================
# PRISM BACKEND — SCORING ENGINE
# Takes all category results and produces:
# - overall_score (0–100)
# - grade (A+ to F)
# - verdict (plain English)
# - ai_summary (smart template — no API needed)
# ============================================================

# ------------------------------------------------------------
# CATEGORY WEIGHTS — must add up to 100
# ------------------------------------------------------------

CATEGORY_WEIGHTS = {
    "ssl":        25,
    "headers":    20,
    "reputation": 20,
    "dns":        15,
    "cookies":    10,
    "stack":      10,
}

# ------------------------------------------------------------
# GRADE THRESHOLDS
# ------------------------------------------------------------

GRADE_THRESHOLDS = [
    (97, "A+"),
    (93, "A"),
    (90, "A-"),
    (87, "B+"),
    (83, "B"),
    (80, "B-"),
    (77, "C+"),
    (73, "C"),
    (70, "C-"),
    (60, "D"),
    (0,  "F"),
]

# ------------------------------------------------------------
# VERDICT THRESHOLDS
# ------------------------------------------------------------

VERDICT_THRESHOLDS = [
    (90, "Excellent"),
    (75, "Good"),
    (60, "Moderate Risk"),
    (40, "High Risk"),
    (0,  "Critical Risk"),
]

# ------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------

def get_grade(score: float) -> str:
    for minimum, grade in GRADE_THRESHOLDS:
        if score >= minimum:
            return grade
    return "F"

def get_verdict(score: float) -> str:
    for minimum, verdict in VERDICT_THRESHOLDS:
        if score >= minimum:
            return verdict
    return "Critical Risk"

# ------------------------------------------------------------
# SMART SUMMARY GENERATOR
# Reads actual findings and builds a natural plain-English
# paragraph. No API needed.
# ------------------------------------------------------------

def generate_summary(categories: dict, overall_score: int) -> str:
    """
    Generate a plain-English summary based on real findings.
    Reads critical and warning findings across all categories
    and builds a human-readable paragraph.
    """

    critical_issues = []
    warning_issues  = []
    passing_areas   = []

    for key, category in categories.items():
        if not isinstance(category, dict):
            continue

        status = category.get("status", "warning")
        label  = category.get("label", key)

        if status == "pass":
            passing_areas.append(label)
            continue

        findings = category.get("findings", [])
        for finding in findings:
            if not isinstance(finding, dict):
                continue
            severity = finding.get("severity", "warning")
            message  = finding.get("message", "")
            if severity == "critical" and message:
                critical_issues.append(message)
            elif severity == "warning" and message:
                warning_issues.append(message)

    # Build the summary paragraph
    parts = []

    # Opening based on score
    if overall_score >= 90:
        parts.append(
            "This site has strong security across the board. "
            "It's safe to share your information here."
        )
    elif overall_score >= 75:
        parts.append(
            "This site passes most security checks and is generally safe to use. "
            "A few minor issues were found but nothing that puts you at serious risk."
        )
    elif overall_score >= 60:
        parts.append(
            "This site has a mixed security profile. "
            "It passes some checks but has gaps that could put your data at risk."
        )
    elif overall_score >= 40:
        parts.append(
            "This site has several security weaknesses. "
            "We recommend caution before sharing personal information here."
        )
    else:
        parts.append(
            "This site has critical security problems. "
            "We strongly advise against entering any personal information, passwords, or payment details."
        )

    # Add critical issues
    if critical_issues:
        issue_text = critical_issues[0] if len(critical_issues) == 1 \
            else f"{critical_issues[0]} and {len(critical_issues) - 1} other critical issue{'s' if len(critical_issues) > 2 else ''}"
        parts.append(
            f"The most urgent issue is: {issue_text.lower()}."
        )

    # Add warnings summary
    if warning_issues:
        if len(warning_issues) == 1:
            parts.append(
                f"There is also a warning: {warning_issues[0].lower()}."
            )
        else:
            parts.append(
                f"There are {len(warning_issues)} warnings including: "
                f"{warning_issues[0].lower()}."
            )

    # Add passing areas
    if passing_areas:
        if len(passing_areas) == 1:
            parts.append(f"{passing_areas[0]} looks good.")
        elif len(passing_areas) == 2:
            parts.append(f"{passing_areas[0]} and {passing_areas[1]} both look good.")
        else:
            last = passing_areas[-1]
            rest = ", ".join(passing_areas[:-1])
            parts.append(f"{rest}, and {last} all look good.")

    # Closing recommendation
    if overall_score < 70:
        parts.append(
            "For a full security audit including authenticated testing, "
            "consider booking a penetration test with SIU."
        )

    return " ".join(parts)

# ------------------------------------------------------------
# MAIN SCORING FUNCTION
# ------------------------------------------------------------

def calculate_score(categories: dict) -> dict:
    """
    Calculate the overall weighted score from all categories.
    Generates a plain-English summary from real findings.

    Args:
        categories: dict of category key -> category result dict

    Returns:
        dict with overall_score, grade, verdict, ai_summary
    """

    total_weight = 0
    weighted_sum = 0

    for key, weight in CATEGORY_WEIGHTS.items():
        category = categories.get(key)
        if category and isinstance(category, dict):
            cat_score     = category.get("score", 50)
            weighted_sum  += cat_score * weight
            total_weight  += weight

    if total_weight == 0:
        overall_score = 0
    else:
        overall_score = round(weighted_sum / total_weight)

    # Cap between 0 and 100
    overall_score = max(0, min(100, overall_score))

    grade      = get_grade(overall_score)
    verdict    = get_verdict(overall_score)
    ai_summary = generate_summary(categories, overall_score)

    return {
        "overall_score": overall_score,
        "grade":         grade,
        "verdict":       verdict,
        "ai_summary":    ai_summary,
    }