package policy

import rego.v1

violation[result] if {
    some i, j
    failed_check := input[i].results.failed_checks[j]
    failed_check.check_result.result == "FAILED"

    result = {
        "check_name": failed_check.check_name,
        "file_path": failed_check.file_path,
        "resource": failed_check.resource
    }
}
