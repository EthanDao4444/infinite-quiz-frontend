export function drawPixel(ctx, x, y, color, size = 64) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

export function drawCircle(ctx, cx, cy, radius, color, size = 64) {
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + y * y <= radius * radius) {
        drawPixel(ctx, cx + x, cy + y, color, size);
      }
    }
  }
}
