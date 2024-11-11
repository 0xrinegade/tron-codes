import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { PROGRAM_ID, gameAccountSchema } from './program.js';

export class SolanaGameState {
  constructor(walletManager) {
    this.walletManager = walletManager;
    this.connection = walletManager.connection;
    this.gameAccount = null;
  }

  async initialize() {
    if (!this.walletManager.isConnected()) {
      throw new Error("Wallet not connected");
    }

    // Create a new account for storing game state
    const [gameAccountPda] = await PublicKey.findProgramAddress(
      [Buffer.from("game_state"), this.walletManager.wallet.publicKey.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    this.gameAccount = gameAccountPda;
  }

  async saveGameState(gameState) {
    if (!this.gameAccount) throw new Error("Game not initialized");

    const transaction = new Transaction().add({
      keys: [
        { pubkey: this.gameAccount, isSigner: false, isWritable: true },
        { pubkey: this.walletManager.wallet.publicKey, isSigner: true, isWritable: true },
      ],
      programId: new PublicKey(PROGRAM_ID),
      data: Buffer.from([/* Serialized instruction data */])
    });

    try {
      const signature = await this.walletManager.signAndSendTransaction(transaction);
      await this.connection.confirmTransaction(signature);
    } catch (error) {
      console.error("Failed to save game state:", error);
      throw error;
    }
  }

  async loadGameState() {
    if (!this.gameAccount) throw new Error("Game not initialized");

    try {
      const accountInfo = await this.connection.getAccountInfo(this.gameAccount);
      if (!accountInfo) return null;

      // Deserialize account data according to schema
      return deserializeGameState(accountInfo.data);
    } catch (error) {
      console.error("Failed to load game state:", error);
      throw error;
    }
  }
}