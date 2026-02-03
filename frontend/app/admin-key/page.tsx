"use client";
import { useState } from "react";


export default function AdminKeyPage() {
  const [key, setKey] = useState("");

  const getPublicKey = async () => {
    if (!(window as any).ethereum) return alert("No Wallet");
    try {
      // Request access to accounts first
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      // Request the Encryption Public Key for the specific account
      const key = await (window as any).ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]], // The active account
      });
      setKey(key);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="p-10 text-white bg-slate-950 min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Admin Setup</h1>
      <p className="text-slate-400">Click below to get your Encryption Public Key</p>
      <button onClick={getPublicKey} className="bg-purple-600 px-6 py-2 rounded font-bold hover:bg-purple-500">
        Get My Public Key
      </button>
      {key && (
        <div className="bg-slate-900 p-4 rounded border border-slate-700 text-center">
          <p className="text-xs text-slate-500 mb-2">COPY THIS KEY:</p>
          <code className="text-green-400 text-lg select-all">{key}</code>
        </div>
      )}
    </div>
  );
}