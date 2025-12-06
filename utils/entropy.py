# utils/entropy.py
import math

def calculate_entropy(data: bytes) -> float:
    """
    Calculate Shannon entropy for byte sequence.
    Returns entropy value (0 - 8), rounded to 4 decimals.
    """
    if not data:
        return 0.0

    # frequency of each byte
    freq = [0] * 256
    for b in data:
        freq[b] += 1

    entropy = 0.0
    length = len(data)
    for count in freq:
        if count == 0:
            continue
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)
