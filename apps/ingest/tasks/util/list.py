def flatten_list(nested_list):
    """
    Flattens a nested list.

    Args:
        nested_list (list): A list that may contain other lists.

    Returns:
        list: A single flattened list.
    """
    flattened = []
    for item in nested_list:
        if isinstance(item, list):
            flattened.extend(flatten_list(item))
        else:
            flattened.append(item)
    return flattened