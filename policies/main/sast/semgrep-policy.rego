package policy

import rego.v1

blocked_severities := {
    "HIGH",
    "CRITICAL"
}

violation[result] if {
    some i

    output := input.results[i]

    impact := upper(output.extra.metadata.impact)

    blocked_severities[impact]

    result := {
        "severity": impact,
        "rule": output.check_id,
        "file": output.path,
        "line": output.start.line,
        "message": output.extra.message
    }
}
