#!/bin/bash

# Define the output file
OUTPUT_FILE="project_file_tree.txt"

# Define the directory to explore
TARGET_DIR="src/app"

# Define the directories to exclude (e.g., node_modules)
EXCLUDE_DIRS="node_modules"

# Check if the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: $TARGET_DIR does not exist."
    exit 1
fi

# Run the tree command for the specific directory, excluding node_modules
# -I excludes directories matching the pattern in EXCLUDE_DIRS
# No -L option to explore all files and directories
tree -I "$EXCLUDE_DIRS" -a "$TARGET_DIR" > "$OUTPUT_FILE"

# Confirm output
echo "File tree for $TARGET_DIR has been saved to $OUTPUT_FILE"
