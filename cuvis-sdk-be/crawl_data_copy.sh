#!/bin/bash

# Set the working directory
WORKDIR="/app/data"
cd "$WORKDIR"

# Download the new zip file
curl -o ./data_dir.zip "https://cloud.cubert-gmbh.de/index.php/s/3oECVGWpC1NpNqC/download?path=%2F&files=lentils.zip"

# Remove existing files in /app/data/lentils
rm -rf ./sample_data

# Extract the new files
unzip data_dir.zip -d ./temp_directory
mv ./temp_directory/* ./sample_data/

# Cleanup: remove the downloaded zip file
rm -f ./data_dir.zip
