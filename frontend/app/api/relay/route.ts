import { NextResponse } from "next/server";
import { ethers } from "ethers";

// 1. Setup the Relayer Wallet
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
// ⚠️ Update this with your LATEST contract address
const CONTRACT_ADDRESS = "0x44102103cd51b88206E9c452d8ac607Dc1a483eb"; 

const CONTRACT_ABI = [
  "function submitLeak(uint256 groupId, uint256 merkleTreeRoot, uint256 signal, uint256 nullifierHash, uint256 externalNullifier, uint256[8] calldata proof, tuple(string title, string description, string ipfsHash, string category, bytes32 rewardHash) data) external"
];

export async function POST(req: Request) {
  try {
    if (!RPC_URL || !PRIVATE_KEY) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // 2. Parse the incoming JSON from the frontend
    const body = await req.json();
    const { 
        groupId, merkleTreeRoot, signal, nullifierHash, externalNullifier, 
        proof, // This is the [8] array
        title, description, ipfsHash, category, rewardHash 
    } = body;

    console.log(`[Relayer] Received Request for Group ${groupId}`);

    // 3. Connect to Blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // 4. Construct Data Tuple
    const leakData = { title, description, ipfsHash, category, rewardHash };

    // 5. Send Transaction (SERVER PAYS GAS)
    console.log("[Relayer] Submitting transaction...");
    const tx = await contract.submitLeak(
        groupId, merkleTreeRoot, signal, nullifierHash, externalNullifier, proof, leakData
    );
    
    console.log(`[Relayer] Transaction sent: ${tx.hash}`);
    await tx.wait(); // Wait for confirmation

    return NextResponse.json({ success: true, txHash: tx.hash });

  } catch (error: any) {
    console.error("[Relayer Error]", error);
    return NextResponse.json({ error: error.message || "Relay failed" }, { status: 500 });
  }
}