def ai_threat_analysis(analysis_result):
    """
    Simple Explainable AI engine for file-based threat analysis
    Input: analysis_result (dict from file_analyzer)
    Output: AI-style threat assessment
    """

    entropy = analysis_result.get("entropy",0) # high entropy = high encryption
    mime = analysis_result.get("mime_type", "")
    detected_type = analysis_result.get("detected_type", "")

    threat_level = "Low" # baseline assumption
    confidence = 30 # baseline assumption
    behaviour = []
    technique = []

    #Rule 1: High Entropy
    if entropy >=7.5:
        threat_level = "High"
        confidence +=40
        behaviour.append("File shows encrypted or packed characteristics")
        technique.append("Payload packing / obfuscation")

    #Rule 2: Executable content
    if "exe" in mime or detected_type =="exe":
        threat_level = "High"
        confidence +=20
        behaviour.append("Executable code deected")
        technique.append("Malware dropper behaviour")

    #Rule 3: Unknown header
    if not detected_type:
        threat_level = "Medium"
        confidence +=15
        behaviour.append("Header did not match known file signatures")
        technique.append("File spoofing technique") 

    #Normalize confidence i,e,. caps confidence at 100% maximum
    if confidence >100:
        confidence =100

    return {
        "ai_threat_level": threat_level,
        "ai_confidence": confidence,
        "ai_behavior_summary": behaviour,
        "ai_attack_techniques": technique
    }    

