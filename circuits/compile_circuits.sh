#!/bin/bash

# 0. Create build directory if it doesn't exist
mkdir -p build

# 1. Compile the Circuit
echo "Compiling circuit..."
# Check if circom is installed
if ! command -v circom &> /dev/null
then
    echo "ERROR: circom could not be found. Please install it first."
    exit 1
fi

circom semaphore.circom --r1cs --wasm --output ./build

# 2. Download Powers of Tau (Using curl instead of wget)
# We use a small one (pot12) for testing.
if [ ! -f ./build/powersOfTau28_hez_final_12.ptau ]; then
    echo "Downloading Powers of Tau..."
    curl -L -o ./build/powersOfTau28_hez_final_12.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
fi

# 3. Setup Phase 2 (Groth16)
echo "Generating ZKey..."
snarkjs groth16 setup ./build/semaphore.r1cs ./build/powersOfTau28_hez_final_12.ptau ./build/semaphore_0000.zkey

# 4. Contribute randomness
echo "Contributing randomness..."
# Note: On Windows Git Bash, sometimes interactive inputs fail in scripts. 
# We add -e for non-interactive entropy.
snarkjs zkey contribute ./build/semaphore_0000.zkey ./build/semaphore_final.zkey --name="MyName" -v -e="RandomEntropy123"

# 5. Export Verification Key
echo "Exporting Verification Key..."
snarkjs zkey export verificationkey ./build/semaphore_final.zkey ./build/verification_key.json

# 6. COPY FILES TO FRONTEND
echo "Copying files to frontend public folder..."
mkdir -p ../frontend/public/zk-artifacts
cp ./build/semaphore_js/semaphore.wasm ../frontend/public/zk-artifacts/
cp ./build/semaphore_final.zkey ../frontend/public/zk-artifacts/

echo "Done! Artifacts are in frontend/public/zk-artifacts/"