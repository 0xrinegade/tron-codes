import initTurbo, * as turbo from "/pkg/turbo_genesis_host_wasm_bindgen.js";

const APP_NAME = "Tron";
const APP_VERSION = "1.0.0";
const APP_AUTHOR = "StackBlitz";
const APP_DESCRIPTION = "A Tron-style light cycle game with Solana integration";

const RESOLUTION = [144, 256];
const WASM_SRC = "/my_game.wasm";

const SPRITES = [
  "/sprites/pepe.png"
];

async function initGame() {
  try {
    await initTurbo();
    
    const player = document.getElementById("player");
    const loading = document.createElement("canvas");
    player?.appendChild(loading);
    
    const context = loading.getContext("2d");
    context.fillStyle = "white";
    context.font = "bold 14px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Loading...", loading.width / 2, loading.height / 2);

    const spriteData = await Promise.all(
      SPRITES.map(async (src) => {
        try {
          let res = await fetch(src);
          let buf = await res.arrayBuffer();
          return [
            src.replace(/^.*[\\/]/, "").replace(/.(png|jpg|jpeg|gif)$/, ""),
            buf,
          ];
        } catch (err) {
          console.error("Could not fetch sprite:", src);
          return null;
        }
      }).filter((x) => !!x)
    );

    player?.removeChild(loading);
    const canvas = document.createElement("canvas");
    player?.appendChild(canvas);

    await turbo.run(canvas, spriteData, {
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