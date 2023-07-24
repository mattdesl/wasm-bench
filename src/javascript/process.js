// Reference:
// https://github.com/dangreco/edgy

function get_pixel(data, px, py, columns, rows) {
  if (px < 0) px = 0;
  if (py < 0) py = 0;
  if (px >= columns) px = columns - 1;
  if (py >= rows) py = rows - 1;
  return data[px + py * columns];
}

export function process(data, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Extract values from image
      let val0 = get_pixel(data, x, y, width, height);
      let val1 = get_pixel(data, x + 1, y, width, height);
      let val2 = get_pixel(data, x + 2, y, width, height);
      let val3 = get_pixel(data, x, y + 1, width, height);
      let val5 = get_pixel(data, x + 2, y + 1, width, height);
      let val6 = get_pixel(data, x, y + 2, width, height);
      let val7 = get_pixel(data, x + 1, y + 2, width, height);
      let val8 = get_pixel(data, x + 2, y + 2, width, height);
      // Apply Sobel kernel
      let gx = -1 * val0 + -2 * val3 + -1 * val6 + val2 + 2 * val5 + val8;
      let gy = -1 * val0 + -2 * val1 + -1 * val2 + val6 + 2 * val7 + val8;
      let mag = Math.sqrt(gx * gx + gy * gy);
      mag = Math.max(0, Math.min(1, mag));
      data[x + y * width] = mag;
    }
  }
}
