// frontend/utils/encryption.ts
import { encrypt } from '@metamask/eth-sig-util';

// ⚠️ REPLACE WITH YOUR ADMIN PUBLIC KEY AGAIN
const ADMIN_PUBLIC_KEY = "HZttg7B3Z52DLrXDlZ58BLDMpCt1sMIpf6cykhu1U0s=";
                          
// Helper: Convert string to Hex directly (No Buffer required)
const stringToHex = (str: string) => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return '0x' + hex;
};

export function encryptFileForAdmin(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Read as Base64
    
    reader.onload = () => {
      try {
        const base64Data = reader.result as string;
        
        // Encrypt using eth-sig-util
        const encryptedObject = encrypt({
          publicKey: ADMIN_PUBLIC_KEY,
          data: base64Data,
          version: 'x25519-xsalsa20-poly1305',
        });

        resolve(JSON.stringify(encryptedObject));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function decryptFileWithWallet(encryptedJson: string, userAddress: string): Promise<string> {
  console.log("1. Starting Decryption...");
  console.log("   Target Address:", userAddress);

  try {
    // 1. Validate JSON
    const encryptedObject = JSON.parse(encryptedJson);
    console.log("2. JSON Parsed successfully");

    // 2. Convert to Hex using browser native method
    const encryptedString = JSON.stringify(encryptedObject);
    const encryptedHex = stringToHex(encryptedString);
    console.log("3. Hex Conversion Done. Length:", encryptedHex.length);

    // 3. Send to MetaMask
    console.log("4. Sending 'eth_decrypt' request to MetaMask...");
    
    // NOTE: 'eth_decrypt' is the legacy method name, but widely supported. 
    // If this fails, some wallets prefer 'personal_decrypt'.
    const decryptedBase64 = await (window as any).ethereum.request({
      method: 'eth_decrypt',
      params: [encryptedHex, userAddress],
    });

    console.log("5. Decryption Successful!");
    return decryptedBase64;

  } catch (error: any) {
    console.error("DECRYPTION ERROR:", error);
    throw new Error(error.message || "Decryption failed");
  }
}