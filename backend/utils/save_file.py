from pathlib import Path


def save_data_to_file(list_data: list[str], output_file: str):
    """Save a list of links to a file, ensuring the folder exists."""
    # Ensure the folder exists
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Write the links to the file
    with output_path.open('w') as file:
        for data in list_data:
            file.write(f"{data}\n")
