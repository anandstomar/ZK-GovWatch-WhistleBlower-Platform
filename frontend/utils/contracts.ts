import { ethers, Contract } from "ethers";

// 1. Your Contract Address (Get this from Remix "Deployed Contracts")
const CONTRACT_ADDRESS = '0x44102103cd51b88206E9c452d8ac607Dc1a483eb'//"0x209d2e52EE3c9b425e3087f591c351391fe9aDa8"//"0x0eD1F705f8C64C6dcA0aaE8eB2f5d22fa5979A3F"; //"0x2A7a1a9514d1D640752230f0aB3aDfE57E3D4De2";

// 2. The Minimal ABI (Just the functions we need to talk to)
const CONTRACT_ABI = [
  "function addEmployee(uint256 _identityCommitment) external",
  "function addCitizen(uint256 _identityCommitment) external",
  "function updateReportStatus(uint256 _reportId, uint8 _newStatus) external",
  // Updated submitLeak (added bytes32 rewardHash to tuple)
  "function submitLeak(uint256 groupId, uint256 merkleTreeRoot, uint256 signal, uint256 nullifierHash, uint256 externalNullifier, uint256[8] calldata proof, tuple(string title, string description, string ipfsHash, string category, bytes32 rewardHash) data) external",
  // Updated getAllReports (added reward fields to return)
  "function getAllReports() external view returns (tuple(uint256 reportId, string title, string description, string ipfsHash, string category, uint256 timestamp, bool isEmployee, uint8 status, bytes32 rewardHash, uint256 rewardAmount, bool isClaimed)[])",
  // NEW Functions
  "function verifyAndFundReport(uint256 _reportId, uint8 _newStatus) external payable",
  "function claimReward(uint256 _reportId, string memory _secretKey) external"
];


export async function getOnChainRoot(groupId: string) {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    // We connect directly to the Semaphore Contract to check the root
    const SEMAPHORE_V3_ADDRESS = "0x7752bcd7E00b81d2f39fc0dEa7Dca43996940f2F"; 
    const SEMAPHORE_ABI = ["function getMerkleTreeRoot(uint256 groupId) external view returns (uint256)"];
    
    const semContract = new Contract(SEMAPHORE_V3_ADDRESS, SEMAPHORE_ABI, provider);
    try {
        const root = await semContract.getMerkleTreeRoot(groupId);
        return root.toString();
    } catch (e) {
        console.error("Could not fetch root:", e);
        return "0";
    }
  }
  return "0";
}


export async function fetchAllReports() {
  const contract = await getContract();
  // Note: Solidity structs return as array-like objects in ethers.js
  const reports = await contract.getAllReports(); 
  return reports; 
}

export async function getContract() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  throw new Error("MetaMask not found!");
}


// Updated Submit function
export async function submitReportOnChain(
  groupId: string, merkleTreeRoot: string, signal: string, nullifierHash: string, externalNullifier: string, 
  proof: any, 
  title: string, description: string, ipfsHash: string, category: string,
  rewardHash: string // <--- NEW ARGUMENT
) {
  const contract = await getContract();
  
  const leakData = {
      title, description, ipfsHash, category,
      rewardHash // Pass the hash lock
  };

  const tx = await contract.submitLeak(groupId, merkleTreeRoot, signal, nullifierHash, externalNullifier, proof, leakData);
  await tx.wait();
  return tx.hash;
}


// export async function submitReportOnChain(
//   groupId: string, merkleTreeRoot: string, signal: string, nullifierHash: string, externalNullifier: string, 
//   proof: any, 
//   title: string, description: string, ipfsHash: string, category: string
// ) {
//   const contract = await getContract();
  
//   // 3. UPDATE CALL: Wrap the text fields into an object/array
//   const leakData = {
//       title: title,
//       description: description,
//       ipfsHash: ipfsHash,
//       category: category
//   };

//   const tx = await contract.submitLeak(
//       groupId, 
//       merkleTreeRoot, 
//       signal, 
//       nullifierHash, 
//       externalNullifier, 
//       proof, 
//       leakData 
//   );
  
//   await tx.wait();
//   return tx.hash;
// }

export async function updateReportStatus(reportId: number, newStatus: number) {
  const contract = await getContract();
  const tx = await contract.updateReportStatus(reportId, newStatus);
  await tx.wait();
}

// Add this to fetch the current wallet address (to check if we are admin)
export async function getConnectedAddress() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  }
  return "";
}

// NEW: Admin Funds Report
export async function verifyAndFund(reportId: number, status: number, amountEth: string) {
    const contract = await getContract();
    // Convert ETH to Wei
    const value = ethers.parseEther(amountEth); 
    const tx = await contract.verifyAndFundReport(reportId, status, { value });
    await tx.wait();
}

// NEW: User Claims Reward
export async function claimReward(reportId: number, secret: string) {
    const contract = await getContract();
    const tx = await contract.claimReward(reportId, secret);
    await tx.wait();
    return tx.hash;
}