package policy

import rego.v1

violation[result] if {
    some path, obj
    walk(input, [path, obj])

    is_object(obj)
    obj.Severity
    obj.Severity in {"HIGH", "CRITICAL"}

    result := {
        "id": obj.VulnerabilityID,
        "severity": obj.Severity,
        "pkg": obj.PkgName
    }
}
