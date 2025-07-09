import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';

class DecentralizedStorage {
    constructor(ipfsConfig, contractAddress, abi, provider) {
        this.ipfs = create(ipfsConfig); // IPFS client
        this.contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
        this.provider = provider;
    }

    async encryptFile(file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const content = reader.result;
                const encrypted = btoa(content); // simple base64 encoding (not secure for real use)
                resolve(new Blob([encrypted], { type: file.type }));
            };
            reader.onerror = reject;
            reader.readAsBinaryString(file);
        });
    }

    async uploadFile(file, metadata) {
        const encryptedFile = await this.encryptFile(file);
        const added = await this.ipfs.add(encryptedFile);
        const cid = added.path;

        await this.contract.storeFile(metadata.name, cid); // Store reference on blockchain
        return cid;
    }

    async shareFile(cid, recipient) {
        await this.contract.grantAccess(cid, recipient);
    }

    async listUserFiles(userAddress) {
        return await this.contract.getFilesByUser(userAddress); // Get from smart contract
    }
}
