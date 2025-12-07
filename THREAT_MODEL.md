# Cyber Threat Model – Project Security Architecture

This project uses a multi-layered static threat analysis model that combines:

• File signature validation
• Entropy-based anomaly detection
• MIME based fingerprinting
• Explainable AI based heuristic classification

This layered approach mirrors real-world malware sandboxes used in Security Operations Centers.

The system does not execute files and performs only static memory-safe analysis.

Potential future improvements:
– Behavioral sandboxing
– Dynamic memory inspection
– Cloud hash reputation API integration

This design follows basic MITRE ATT&CK methodology for file-based threats.
