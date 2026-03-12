package policy

import rego.v1

violation[result] if {
    some i, j
    vuln := input.dependencies[i].vulnerabilities[j]

    vuln.severity == "high"

    result = {
        "id": vuln.source,
        "severity": vuln.severity
    }
}

violation[result] if {
    some i, j
    vuln := input.dependencies[i].vulnerabilities[j]

    vuln.severity == "critical"

    result = {
        "id": vuln.source,
        "severity": vuln.severity
    }
}