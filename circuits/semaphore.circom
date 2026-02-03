pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";
// If you downloaded the semaphore library manually, adjust the path below
// or just use this standard implementation logic:

template Semaphore(nLevels) {
    signal input identityNullifier;
    signal input identityTrapdoor;
    signal input treePathIndices[nLevels];
    signal input treeSiblings[nLevels];

    signal input signalHash;
    signal input externalNullifier;

    signal output root;
    signal output nullifierHash;

    component poseidon1 = Poseidon(2);
    poseidon1.inputs[0] <== identityNullifier;
    poseidon1.inputs[1] <== identityTrapdoor;

    component poseidon2 = Poseidon(1);
    poseidon2.inputs[0] <== poseidon1.out;
    // secret (identityCommitment) <== poseidon2.out;

    // ... (rest of standard semaphore logic if you have it) ...
    // FOR NOW, let's use the simplest valid import:
}

// *** THIS WAS MISSING ***
// We use 20 levels (supporting ~1 million users)
component main {public [signalHash, externalNullifier]} = Semaphore(20);