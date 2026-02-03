// frontend/utils/ipfs.ts
import axios from "axios";

// PASTE YOUR PINATA JWT HERE
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZmI3ZTFkOC1kNzI3LTRlMzEtYTg3Zi0wZjI0YjA3YjVlOGEiLCJlbWFpbCI6ImFuYW5kc2luZ2h0b21hcjI1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlNTg3ZGVjOTE4ZTRjOGFkODI3NCIsInNjb3BlZEtleVNlY3JldCI6IjFjYjY4MTczMTJhNjAwYzg2ZjdjNzRlNTZiNWVkMzEyYThjMjI3NDUwYzY3MmMzN2NiZTQ3NGU2MTAzMmZmZWQiLCJleHAiOjE4MDE2NTM3Nzd9.8Vo2KTGDURO2i89gDCIKAsvFcxlRQw4iHpcbKPcWNk0";

export async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: "Evidence_" + Date.now(),
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data;`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );
    // Returns the Real IPFS Hash (CID)
    return res.data.IpfsHash; 
  } catch (error) {
    console.error("IPFS Upload Failed:", error);
    throw new Error("Failed to upload evidence to IPFS");
  }
}