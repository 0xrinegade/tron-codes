import initTurbo, * as turbo from "/pkg/turbo_genesis_host_wasm_bindgen.js";

const APP_NAME = "Tron";
const APP_VERSION = "1.0.0";
const APP_AUTHOR = "StackBlitz";
const APP_DESCRIPTION = "A Tron-style light cycle game with Solana integration";

const RESOLUTION = [128, 128];
const WASM_SRC = "/my_game.wasm";

async function initGame() {
  try {
    // Initialize Turbo's WASM runtime
    await initTurbo();

    // Create the game's canvas
    const player = document.getElementById("player");
    const canvas = document.createElement("canvas");
    player?.appendChild(canvas);

    // Run game
    await turbo.run(canvas, [], {
      source: WASM_SRC,
      meta: {
        appName: APP_NAME,
        appVersion: APP_VERSION,
        appAuthor: APP_AUTHOR,
        appDescription: APP_DESCRIPTION,
      },
      config: {
        resolution: RESOLUTION,
      },
    });

  } catch (err) {
    console.error("Failed to initialize game:", err);
  }
}

initGame();