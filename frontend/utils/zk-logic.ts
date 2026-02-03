// @ts-ignore
import { Identity } from "@semaphore-protocol/identity";
// @ts-ignore
import { Group } from "@semaphore-protocol/group";
import { ethers } from "ethers";
// @ts-ignore
import * as snarkjs from "snarkjs";

// Helper: Fetch binary files safely
async function fetchArtifact(url: string) {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch artifact: ${url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

export function createNewIdentity() {
    // In V3, this creates a specific Nullifier/Trapdoor identity
    const identity = new Identity();
    return {
        privateKey: identity.toString(), 
        commitment: identity.commitment.toString()
    };
}

export async function generateLeakProof(
    userPrivateKey: string, 
    groupId: string,
    existingMembers: string[], 
    ipfsHash: string
) {
    console.log("Starting SEMAPHORE V3 Proof Generation...");
    
    // 1. Setup Identity
    const identity = new Identity(userPrivateKey);
    const identityCommitment = identity.commitment;

    // 2. Setup Group
    // V3 Group constructor signature: new Group(treeDepth, batchSize)
    // We init it empty, then add members
    const group = new Group(20); 
    
    // Add existing members
    group.addMembers(existingMembers);

    // Force add our user if not present (to ensure logic works locally)
    if (group.indexOf(identityCommitment) === -1) {
        group.addMember(identityCommitment);
    }

    // 3. Generate Merkle Proof
    const index = group.indexOf(identityCommitment);
    const merkleProof = group.generateMerkleProof(index);

    // 4. Prepare Inputs
    const signal = ethers.toBigInt(ethers.keccak256(ethers.toUtf8Bytes(ipfsHash))).toString();
    const scope = groupId; 

    // V3 INPUT STRUCTURE
    // Note: V3 Identity exposes .trapdoor and .nullifier publicly!
    const input = {
        identityNullifier: identity.nullifier.toString(),
        identityTrapdoor: identity.trapdoor.toString(),
        treePathIndices: merkleProof.pathIndices, // V3 uses 'pathIndices'
        treeSiblings: merkleProof.siblings,
        externalNullifier: scope,
        signalHash: signal
    };

    // 5. Load Artifacts
    const wasmBuffer = await fetchArtifact("/zk-artifacts/semaphore.wasm");
    const zkeyBuffer = await fetchArtifact("/zk-artifacts/semaphore.zkey");

    try {
        // 6. CALL SNARKJS
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            wasmBuffer,
            zkeyBuffer
        );

        // 7. Format Output
        const fullProof = {
            merkleTreeRoot: publicSignals[0],
            nullifier: publicSignals[1],
            signal: publicSignals[2],
            scope: publicSignals[3],
            points: [
                proof.pi_a[0], proof.pi_a[1],
                proof.pi_b[0][1], proof.pi_b[0][0],
                proof.pi_b[1][1], proof.pi_b[1][0],
                proof.pi_c[0], proof.pi_c[1]
            ]
        };

        return {
            fullProof,
            signal
        };

    } catch (error) {
        console.error("V3 Proof Logic failed:", error);
        throw error; 
    }
}