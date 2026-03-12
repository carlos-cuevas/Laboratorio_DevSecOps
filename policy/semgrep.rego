package semgrep

warning_detectado {
    some i
    input.results[i].extra.severity == "WARNING"
}

deny[msg] {
    warning_detectado
    msg := "Se detectaron WARNING en semgrep que requieren atencion."
}

vulnerability_class[v] {
    some i
    v := input.results[i].extra.metadata.vulnerability_class
}
