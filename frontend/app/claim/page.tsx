"use client";
import { useState } from "react";
import { claimReward } from "../../utils/contracts";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";

export default function ClaimPage() {
    const [reportId, setReportId] = useState("");
    const [secret, setSecret] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClaim = async () => {
        try {
            setLoading(true);
            const tx = await claimReward(Number(reportId), secret);
            alert(`Success! Funds withdrawn to your wallet.\nTx: ${tx}`);
        } catch (e: any) {
            console.error(e);
            alert("Claim Failed: " + (e.reason || e.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-900/30 p-4 rounded-full">
                        <Wallet className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-white mb-2">Anonymous Withdrawal</h1>
                <p className="text-center text-slate-400 text-sm mb-8">
                    Enter your Report ID and the Secret Key you saved. Funds will be sent to your connected wallet.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-slate-400">Report ID</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-slate-700 rounded p-3 mt-1 text-white"
                            placeholder="e.g. 0"
                            value={reportId}
                            onChange={(e) => setReportId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-400">Secret Key</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-950 border border-slate-700 rounded p-3 mt-1 text-white"
                            placeholder="0x..."
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={handleClaim}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex justify-center items-center space-x-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                        <span>{loading ? "Withdrawing..." : "Withdraw Funds"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}