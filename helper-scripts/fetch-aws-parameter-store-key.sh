#!/bin/bash

# Check if both arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <SSM_PARAMETER_NAME> <OUTPUT_FILE>"
  echo "Example: $0 /ec2/keypair/key-05c35c66f181e9eee MyKey.pem"
  exit 1
fi

# Assign arguments to variables
SSM_PARAMETER_NAME=$1
OUTPUT_FILE=$2

echo "🚀 Retrieving private key from AWS Systems Manager Parameter Store..."
echo "🔹 Parameter Name: $SSM_PARAMETER_NAME"

# Retrieve the private key using AWS CLI
aws ssm get-parameter --name "$SSM_PARAMETER_NAME" --with-decryption --query "Parameter.Value" --output text >"$OUTPUT_FILE"

# Check if the file was created successfully
if [ -s "$OUTPUT_FILE" ]; then
  echo "✅ Private key successfully retrieved and saved as $OUTPUT_FILE"
  chmod 400 "$OUTPUT_FILE" # Set secure permissions
  echo "🔐 Permissions set to 400 for security."
else
  echo "❌ ERROR: Private key file is empty. Check if the parameter exists and you have the correct permissions."
  rm -f "$OUTPUT_FILE" # Remove empty file
  exit 1
fi
