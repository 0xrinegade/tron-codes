import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

export class WalletManager {
  constructor() {
    this.connection = new Connection("https://api.devnet.solana.com");
    this.wallet = null;
  }

  async connect() {
    try {
      if (!window.solana) {
        throw new Error("Solana wallet not found! Please install Phantom.");
      }

      await window.solana.connect();
      this.wallet = window.solana;
      return this.wallet.publicKey.toString();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
    }
  }

  isConnected() {
    return this.wallet?.isConnected || false;
  }

  async signTransaction(transaction) {
    if (!this.wallet) throw new Error("Wallet not connected");
    return await this.wallet.signTransaction(transaction);
  }
}