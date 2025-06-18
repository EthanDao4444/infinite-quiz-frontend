import { drawCircle } from "./drawingUtils.js";
import { getFlowerStatus } from "./flowerInteractions.js";

// --- Seeded RNG setup ---
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function createRNG(seed) {
  const seedSum = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return mulberry32(seedSum);
}

// --- Drawing functions ---
function drawStem(ctx, startX, startY, size, stemHeight, rand) {
  const wobbleAmount = rand() * 0.8 + 0.2;

  for (let i = 0; i < stemHeight; i++) {
    const y = startY + i;
    const wobble = Math.round(Math.sin(i * wobbleAmount) * rand() * 2);
    const finalX = startX + wobble;

    ctx.fillStyle = "#5da85d";
    ctx.fillRect(finalX, y, 2, 2);

    if (rand() < 0.1) ctx.fillRect(finalX - 1, y, 1, 1);
    if (rand() < 0.1) ctx.fillRect(finalX + 1, y, 1, 1);
  }
}

function drawPetals(ctx, centerX, centerY, size, rand, options = {}) {
  const {
    forceOverride = false,
    hydration = 0,
    trample = 0
  } = options;

  const baseCount = forceOverride ? 6 : Math.floor(rand() * 6) + 5;
  const maxDrop = Math.min(trample, baseCount - 1);
  const petalCount = Math.max(baseCount - maxDrop, 0);

  const radius = forceOverride ? 16 : rand() * 2 + 12;
  const height = forceOverride ? 12 : rand() * 10 + 8;
  const width = forceOverride ? 5 : rand() * 1.5 + (rand() * 6 + 2);

  const lightness = 60 + hydration * 2 - trample * 3;
  const safeLightness = Math.max(30, Math.min(90, lightness));

  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 * i) / petalCount;

    const dx = Math.sin(angle) * radius;
    const dy = -Math.cos(angle) * radius;

    const petalX = centerX + dx;
    const petalY = centerY + dy;

    ctx.beginPath();
    ctx.ellipse(petalX, petalY, width, height, angle, 0, Math.PI * 2);

    const petalColor = forceOverride
      ? "hsl(0, 100%, 60%)" // red
      : `hsl(${Math.floor(rand() * 360)}, 100%, ${safeLightness}%)`;

    ctx.fillStyle = petalColor;
    ctx.fill();
  }
}

function drawBase(ctx, size, rand, seed) {
  ctx.clearRect(0, 0, size, size);

  const status = getFlowerStatus(seed);
  const centerX = size / 2;
  const isSpecial = seed === "b18fe65d";

  const hydration = status?.hydration ?? 0;
  const trample = status?.trample ?? 0;
  const stemHeight = isSpecial
  ? 60
  : status?.stemHeight ?? Math.floor(rand() * 40) + 30;
  const flowerY = size - stemHeight - 4;


  const hue = Math.floor(rand() * 360);
  const flowerColor = isSpecial
    ? "hsl(0, 100%, 85%)"
    : `hsl(${hue}, 100%, 85%)`;

  const baseRadius = isSpecial ? 6 : Math.floor(rand() * 3) + 6;

  drawPetals(ctx, centerX, flowerY, size, rand, {
    forceOverride: isSpecial,
    hydration,
    trample
  });

  drawCircle(ctx, centerX, flowerY, baseRadius, flowerColor, size);
  drawStem(ctx, centerX, flowerY + 1, size, stemHeight, rand);
}

// --- Main function ---
export function generateFlowerCanvas(seed = "default") {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas 2D context could not be initialized");

  const rand = createRNG(seed);
  drawBase(ctx, size, rand, seed);

  return canvas;
}
