export const PROGRAM_ID = "YOUR_PROGRAM_ID"; // Replace with actual program ID

export const gameAccountSchema = {
  struct: {
    highScore: "u64",
    lastGameState: {
      struct: {
        playerPosition: { array: ["u8", 2] },
        trail: { vec: { array: ["u8", 2] } },
        isGameOver: "bool"
      }
    },
    authority: { array: ["u8", 32] }
  }
};