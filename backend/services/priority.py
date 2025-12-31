def assign_priority(count: int):
    if count <= 2:
        return "Low"
    elif count <= 5:
        return "Medium"
    else:
        return "High"
