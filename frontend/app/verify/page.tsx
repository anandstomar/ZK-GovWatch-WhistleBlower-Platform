"use client";
import { useEffect, useState } from "react";
import { fetchAllReports, updateReportStatus, getConnectedAddress } from "../../utils/contracts";
import { decryptFileWithWallet } from "../../utils/encryption";
import { ShieldCheck, User, ExternalLink, Check, X, Loader2, Lock, Unlock, FileText } from "lucide-react";
import { verifyAndFund } from "../../utils/contracts";

// REPLACE WITH YOUR ADMIN ADDRESS
const ADMIN_ADDRESS = "0xC5467130B6839Cc944315690FFBb076Ae13eA570";

export default function VerifyPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Store decrypted data temporarily
    const [decryptedFiles, setDecryptedFiles] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchAllReports().then(setReports).catch(console.error);
        getConnectedAddress().then(addr => {
            if (addr.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
                setIsAdmin(true);
            }
        });
    }, []);

    const handleStatusChange = async (id: number, status: number) => {
        try {
            setLoadingId(id);

            let amount = "0";
            // If status is "Resolved" (2), ask Admin if they want to pay
            if (status === 2) {
                const shouldPay = confirm("Do you want to send a reward (0.0001 ETH)?");
                if (shouldPay) amount = "0.0001"; // Small test amount
            }

            await verifyAndFund(id, status, amount);
            alert("Status Updated & Funds Sent!");
            window.location.reload();
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleDecrypt = async (reportId: number, ipfsHash: string) => {
        try {
            setLoadingId(reportId);
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const activeAddress = accounts[0];

            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)//`https://ipfs.io/ipfs/${ipfsHash}`);
            const encryptedText = await res.text();

            const base64Data = await decryptFileWithWallet(encryptedText, activeAddress);
            setDecryptedFiles(prev => ({ ...prev, [reportId]: base64Data }));

        } catch (e: any) {
            console.error(e);
            alert("Decryption Failed: " + e.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className= "p-10 bg-slate-950 min-h-screen text-slate-200 font-sans" >
        <div className="max-w-5xl mx-auto" >
            <div className="flex justify-between items-center mb-8" >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" >
                    Oversight Dashboard
                        </h1>
    { isAdmin && <span className="bg-red-900/50 text-red-200 px-3 py-1 rounded text-xs font-bold border border-red-800" > ADMIN MODE </span> }
    </div>

        < div className = "grid gap-4" >
            {
                reports.map((report, i) => {
                    const rId = Number(report.reportId);
                    const status = Number(report.status); // 0:Pending, 2:Resolved, 3:Rejected
                    const isDecrypted = decryptedFiles[rId];

                    return (
                        <div key= { i } className = "bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-start hover:border-slate-700 transition-colors" >

                            <div className="space-y-3" >
                                <div className="flex items-center space-x-3" >
                                    <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-800 uppercase" >
                                        { report.category }
                                        </span>

                    { status === 0 && <span className="text-xs font-bold bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded" > PENDING </span> }
                    { status === 2 && <span className="text-xs font-bold bg-green-500/20 text-green-500 px-2 py-1 rounded" > RESOLVED </span> }
                    { status === 3 && <span className="text-xs font-bold bg-red-500/20 text-red-500 px-2 py-1 rounded" > REJECTED </span> }

                    {
                        report.isEmployee ? (
                            <span className= "flex items-center space-x-1 text-xs font-bold bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded border border-yellow-700/50 uppercase" >
                            <ShieldCheck className="w-3 h-3" /> <span>Verified Employee </span>
                                </span>
                  ) : (
                                    <span className="flex items-center space-x-1 text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 uppercase" >
                                <User className="w-3 h-3" /> <span>Citizen Report </span>
                                </span>
                                )
}
</div>

    < div >
    <h3 className="text-lg font-bold text-white mb-1" > { report.title } </h3>
        < p className = "text-slate-400 text-sm max-w-2xl line-clamp-2" > { report.description } </p>

{/* 👇 PASTE THIS NEW CODE BLOCK HERE 👇 */ }
<div className="flex items-center space-x-4 text-xs text-slate-500 font-mono mt-3" >
    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700" >
        ID: { rId }
</span>
    <span>
{ new Date(Number(report.timestamp) * 1000).toLocaleString() }
</span>
    </div>
{/* 👆 END PASTE 👆 */ }
</div>
    </div>

    < div className = "flex flex-col items-end space-y-2" >

        {/* --- LOGIC UPDATE: SEAL FILE IF NOT PENDING --- */ }
{
    status !== 0 ? (
        // 🔒 CASE CLOSED (Resolved/Rejected) -> DISABLE ACCESS
        <button 
                        disabled
                        className = "flex items-center space-x-2 px-4 py-2 bg-slate-800/50 text-slate-500 rounded-lg text-sm font-medium border border-slate-800 cursor-not-allowed opacity-70"
        >
        <Lock className="w-4 h-4" />
            <span>Evidence Sealed </span>
                </button>
                ) : isDecrypted ? (
        // 📄 FILE READY (Green Button)
        <button 
                        onClick= {() => {
        const win = window.open();
        if (win) win.document.write(`<iframe src="${isDecrypted}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
}
className = "flex items-center space-x-2 px-4 py-2 bg-green-900/50 hover:bg-green-900 text-green-400 rounded-lg text-sm font-medium border border-green-700 transition-all"
    >
    <FileText className="w-4 h-4" />
        <span>View Decrypted File </span>
            </button>
                ) : (
    // 🔓 DECRYPT (Grey Button)
    <button 
                        onClick= {() => handleDecrypt(rId, report.ipfsHash)}
disabled = { loadingId === rId}
className = "flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700"
    >
    { loadingId === rId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-orange-400" />}
<span>{ loadingId === rId ? "Decrypting..." : "Decrypt Evidence"}</span>
    </button>
                )}

{/* ADMIN ACTIONS */ }
{
    isAdmin && status === 0 && (
        <div className="flex space-x-2 mt-2" >
            <button onClick={ () => handleStatusChange(rId, 2) } disabled = { loadingId === rId
} className = "p-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded border border-green-800" > <Check className="w-4 h-4" /> </button>
    < button onClick = {() => handleStatusChange(rId, 3)} disabled = { loadingId === rId} className = "p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded border border-red-800" > <X className="w-4 h-4" /> </button>
        </div>
                )}
</div>

    </div>
          )})}
</div>
    </div>
    </div>
  );
}