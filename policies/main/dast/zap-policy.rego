package policy

import rego.v1

violation contains {
    "vulnerability": alert.alert,
    "severity": alert.riskdesc,
    "riskcode": alert.riskcode,
    "url": site["@name"],
    "description": alert.desc
} if {
    some site in input.site
    some alert in site.alerts

    risk := to_number(alert.riskcode)
    risk >= 3
}
