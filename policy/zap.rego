package alert_check

alert_values := {
    "Authentication Request Identified",
    "Suspicious Login Detected",
    "Multiple Failed Logins"
}

detected_alerts[alert] {
    some path, value
    walk(input, [path, value])
    alert_values[value]
    alert := value
}
