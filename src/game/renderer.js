export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas.width = 128;
    this.canvas.height = 128;
    this.ctx.imageSmoothingEnabled = false;
  }

  render(gameState) {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw trail
    this.ctx.fillStyle = '#0088FF';
    for (const pos of gameState.trail) {
      this.ctx.fillRect(pos.x, pos.y, 1, 1);
    }

    // Draw player
    this.ctx.fillStyle = '#00FF00';
    this.ctx.fillRect(gameState.playerPos.x, gameState.playerPos.y, 1, 1);

    if (gameState.isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '16px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '8px monospace';
      this.ctx.fillText('Press ENTER to restart', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
  }
}