import { GameState } from './game/state.js';
import { Controls } from './game/controls.js';
import { Renderer } from './game/renderer.js';
import { WalletManager } from './solana/wallet.js';
import { SolanaGameState } from './solana/gameState.js';

class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.getElementById('game-container').appendChild(this.canvas);
    
    this.walletManager = new WalletManager();
    this.solanaGameState = new SolanaGameState(this.walletManager);
    
    this.gameState = new GameState();
    this.controls = new Controls(this.gameState);
    this.renderer = new Renderer(this.canvas);
    
    this.lastTime = 0;
    this.accumulator = 0;
    this.timestep = 1000 / 15; // 15 FPS for retro feel

    this.setupWalletUI();
  }

  setupWalletUI() {
    const walletButton = document.createElement('button');
    walletButton.id = 'wallet-button';
    walletButton.textContent = 'Connect Wallet';
    document.getElementById('game-container').appendChild(walletButton);

    walletButton.addEventListener('click', async () => {
      if (this.walletManager.isConnected()) {
        await this.walletManager.disconnect();
        walletButton.textContent = 'Connect Wallet';
      } else {
        try {
          const publicKey = await this.walletManager.connect();
          walletButton.textContent = `Connected: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
          await this.solanaGameState.initialize();
          const savedState = await this.solanaGameState.loadGameState();
          if (savedState) {
            this.gameState.loadState(savedState);
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          alert('Failed to connect wallet. Please make sure you have a Solana wallet installed.');
        }
      }
    });
  }

  async gameLoop(currentTime) {
    if (this.lastTime) {
      const deltaTime = currentTime - this.lastTime;
      this.accumulator += deltaTime;

      while (this.accumulator >= this.timestep) {
        this.gameState.update();
        
        // Save game state to Solana if wallet is connected
        if (this.walletManager.isConnected()) {
          try {
            await this.solanaGameState.saveGameState(this.gameState.getState());
          } catch (error) {
            console.error('Failed to save game state:', error);
          }
        }
        
        this.accumulator -= this.timestep;
      }
    }

    this.renderer.render(this.gameState);
    this.lastTime = currentTime;
    requestAnimationFrame(time => this.gameLoop(time));
  }

  start() {
    requestAnimationFrame(time => this.gameLoop(time));
  }
}

// Start the game when the page loads
window.addEventListener('load', () => {
  const game = new Game();
  game.start();
});