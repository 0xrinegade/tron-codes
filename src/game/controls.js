export class Controls {
  constructor(gameState) {
    this.gameState = gameState;
    this.setupKeyboardControls();
  }

  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (this.gameState.isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          this.gameState.reset();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          this.gameState.changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          this.gameState.changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          this.gameState.changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          this.gameState.changeDirection({ x: 1, y: 0 });
          break;
      }
    });
  }
}