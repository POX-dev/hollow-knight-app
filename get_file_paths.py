import os
from pathlib import Path

# So this is for sw.js, thanqs copilot for the free code

def print_file_paths(directory="."):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            print("\"" + file_path + "\",")

if __name__ == "__main__":
    print_file_paths()