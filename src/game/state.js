export class GameState {
  constructor() {
    this.playerPos = { x: 64, y: 64 };
    this.direction = { x: 1, y: 0 };
    this.trail = [];
    this.isGameOver = false;
    this.score = 0;
  }

  update() {
    if (this.isGameOver) return;

    this.trail.push({ ...this.playerPos });
    
    this.playerPos.x += this.direction.x;
    this.playerPos.y += this.direction.y;

    // Update score based on trail length
    this.score = this.trail.length;

    // Check wall collision
    if (this.playerPos.x < 0 || this.playerPos.x >= 128 || 
        this.playerPos.y < 0 || this.playerPos.y >= 128) {
      this.isGameOver = true;
    }

    // Check trail collision
    if (this.trail.some(pos => pos.x === this.playerPos.x && pos.y === this.playerPos.y)) {
      this.isGameOver = true;
    }
  }

  changeDirection(newDir) {
    // Prevent 180-degree turns
    if (this.direction.x === -newDir.x && this.direction.y === -newDir.y) {
      return;
    }
    this.direction = newDir;
  }

  reset() {
    this.playerPos = { x: 64, y: 64 };
    this.direction = { x: 1, y: 0 };
    this.trail = [];
    this.isGameOver = false;
    this.score = 0;
  }

  getState() {
    return {
      playerPosition: [this.playerPos.x, this.playerPos.y],
      trail: this.trail.map(pos => [pos.x, pos.y]),
      isGameOver: this.isGameOver,
      score: this.score
    };
  }

  loadState(state) {
    this.playerPos = { x: state.playerPosition[0], y: state.playerPosition[1] };
    this.trail = state.trail.map(([x, y]) => ({ x, y }));
    this.isGameOver = state.isGameOver;
    this.score = state.score;
  }
}