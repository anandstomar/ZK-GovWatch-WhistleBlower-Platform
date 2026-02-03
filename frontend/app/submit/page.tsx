"use client";
import { useState, useEffect } from "react";
import { generateLeakProof, createNewIdentity } from "../../utils/zk-logic";
import { submitReportOnChain, getContract } from "../../utils/contracts";
import { uploadToIPFS } from "../../utils/ipfs";
import { Shield, Upload, FileText, CheckCircle, Loader2, UserPlus, Send, Users } from "lucide-react";
import { encryptFileForAdmin } from "../../utils/encryption";
import { ethers } from "ethers";

// --- HELPER: Persist Identity ---
const getStoredIdentity = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("zk_identity");
  if (stored) return JSON.parse(stored);
  
  const newId = createNewIdentity();
  localStorage.setItem("zk_identity", JSON.stringify(newId));
  return newId;
};

export default function SubmitPage() {
  const [step, setStep] = useState(0); 
  const [category, setCategory] = useState("Corruption");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [generatedSecret, setGeneratedSecret] = useState("");
  
  // NEW: State for Group ID (Default to your known Employee ID)
  const [customGroupId, setCustomGroupId] = useState("3545448723194484"); 

  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [txHash, setTxHash] = useState("");
  const [identity, setIdentity] = useState<any>(null);
  
  useEffect(() => {
    setIdentity(getStoredIdentity());
  }, []);

  const generateSecret = () => {
    const randomBytes = ethers.randomBytes(32);
    const secret = ethers.hexlify(randomBytes); // The Password (Save this!)
    const hash = ethers.keccak256(ethers.solidityPacked(["string"], [secret])); // The Lock (Public)
    return { secret, hash };
};

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // --- ACTION 1: JOIN THE GROUP ---
  const handleJoin = async () => {
    if (!customGroupId) return alert("Enter a Group ID first");
    try {
      addLog(`Initiating Registration for Group ${customGroupId}...`);
      const contract = await getContract();
      
      // Note: In production, you might have different join functions for different groups
      const tx = await contract.addEmployee(identity.commitment);
      addLog("Waiting for transaction confirmation...");
      await tx.wait();
      
      addLog(`Success! Registered in Group ${customGroupId}.`);
      alert("Registration Successful!");
    } catch (e: any) {
      console.error(e);
      alert("Registration Failed: " + (e.reason || e.message));
    }
  };

  // --- ACTION 2: SUBMIT ---
  const handleSubmit = async () => {
    if (!file) return alert("Please upload evidence.");
    if (!title || !desc) return alert("Please fill in details.");
    if (!customGroupId) return alert("Please enter a Group ID.");

    try {
      setStep(1);
      // 1. Encrypt & Upload
      addLog("Encrypting Evidence for Admin...");
      // NEW: Encrypt the file into a JSON string
      const encryptedData = await encryptFileForAdmin(file);
      // 1. Generate Reward Secret
      const { secret, hash } = generateSecret();
      // SAVE THIS TO SHOW USER LATER
      setGeneratedSecret(secret);
      
      // Create a Blob from the encrypted string so we can upload it as a file
      const encryptedBlob = new Blob([encryptedData], { type: "application/json" });
      const encryptedFile = new File([encryptedBlob], "evidence.enc", { type: "application/json" });

      addLog("Uploading Encrypted File to IPFS...");
      // Upload the ENCRYPTED file, not the original
      const ipfsHash = await uploadToIPFS(encryptedFile);
      
      // // 1. Upload IPFS
      // addLog("Uploading to IPFS...");
      // const ipfsHash = await uploadToIPFS(file);
      
      // 2. Generate Proof
      setStep(2);
      addLog(`Generating ZK Proof for Group ${customGroupId}...`);

      const groupMembers = [identity.commitment]; 

      const { fullProof, signal } = await generateLeakProof(
        identity.privateKey, 
        customGroupId, // <--- USING USER INPUT HERE
        groupMembers, 
        ipfsHash
      );

     setStep(3);
      addLog("Sending proof to Relayer (Server)...");
      
      // We construct the payload manually
      const payload = {
          groupId: customGroupId,
          merkleTreeRoot: fullProof.merkleTreeRoot,
          signal,
          nullifierHash: fullProof.nullifier,
          externalNullifier: fullProof.scope,
          proof: fullProof.points, // The Solidity-friendly proof
          title,
          desc: desc, // Note: Make sure property names match API expectation
          description: desc, // Sending both just to be safe with the naming
          ipfsHash,
          category,
          rewardHash: hash // The reward lock
      };

      // Call our API
      console.log("Payload for Relay");
      const response = await fetch("/api/relay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Relay Failed");
      }

      addLog(`Relay Success! Tx: ${data.txHash}`);
      setTxHash(data.txHash);
      setStep(4);

    } catch (e: any) {
      console.error(e);
      alert("Error: " + (e.reason || e.message));
      setStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ZK-GovWatch
          </h1>
          <p className="text-slate-400 mt-2">Anonymous Whistleblower Portal</p>
        </div>

        {/* IDENTITY CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
                <h3 className="font-bold text-white">Your Digital Identity</h3>
                <p className="text-xs text-slate-500 font-mono mt-1 break-all">
                    {identity ? identity.commitment : "Loading..."}
                </p>
            </div>
            
            {/* NEW: GROUP ID INPUT IN REGISTRATION AREA */}
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        className="bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm w-40 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Group ID"
                        value={customGroupId}
                        onChange={(e) => setCustomGroupId(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleJoin}
                    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                >
                    Register
                </button>
            </div>
        </div>

        {/* SUBMISSION FORM */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {step === 4 ? (
            <div className="text-center space-y-6 py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Submission Verified</h2>
              
              {/* SHOW THE SECRET KEY */}
              <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-xl text-left">
                  <h3 className="text-yellow-400 font-bold mb-2">💰 SAVE THIS PAYMENT KEY</h3>
                  <p className="text-sm text-slate-300 mb-2">
                      If your report is verified, you need this key to withdraw funds anonymously.
                      We do not save this. If you lose it, the money is gone.
                  </p>
                  <code className="block bg-black p-3 rounded text-green-400 font-mono break-all select-all cursor-text border border-slate-700">
                      {generatedSecret}
                  </code>
              </div>

              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" className="text-blue-400 hover:underline block truncate">
                View Transaction
              </a>
              <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-white">Submit Another</button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* DISPLAY SELECTED GROUP */}
              <div className="bg-slate-950/50 p-3 rounded border border-slate-800 text-sm text-slate-400 flex justify-between">
                <span>Target Group ID:</span>
                <span className="font-mono text-white">{customGroupId || "Not Set"}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400">Title</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400">Category</label>
                    <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={category} onChange={e => setCategory(e.target.value)}>
                        <option>Corruption</option>
                        <option>Fraud</option>
                        <option>Harassment</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-400">Description</label>
                <textarea rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={desc} onChange={e => setDesc(e.target.value)} />
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-800/50 cursor-pointer relative transition-colors">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <div className="flex flex-col items-center text-slate-400">
                      {file ? <FileText className="w-8 h-8 mb-2 text-blue-400"/> : <Upload className="w-8 h-8 mb-2"/>}
                      <span className="text-sm">{file ? file.name : "Drag & Drop Evidence (PDF/Image)"}</span>
                  </div>
              </div>

              {step > 0 && (
                <div className="bg-slate-950 p-3 rounded text-xs font-mono text-slate-500 h-24 overflow-y-auto border border-slate-800">
                    {logs.map((l, i) => <div key={i}>&gt; {l}</div>)}
                </div>
              )}

              <button onClick={handleSubmit} disabled={step > 0}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex justify-center items-center space-x-2 shadow-lg shadow-blue-900/20 transition-all">
                {step > 0 ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                <span>{step > 0 ? "Processing..." : "Submit Securely"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}