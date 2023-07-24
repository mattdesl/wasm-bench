@inline function get_pixel(ptr: usize, px: u32, py: u32, columns: u32, rows: u32): f32 {
  if (px < 0) px = 0;
  if (py < 0) py = 0;
  if (px >= columns) px = columns - 1;
  if (py >= rows) py = rows - 1;
  return load<f32>(ptr + (px + py * columns) * sizeof<f32>());
}

export function process(ptr: usize, width: u32, height: u32): void {
  for (let y: u32 = 0; y < height; y++) {
    for (let x: u32 = 0; x < width; x++) {
      // Extract values from image
      let val0: f32 = get_pixel(ptr, x, y, width, height);
      let val1: f32 = get_pixel(ptr, x + 1, y, width, height);
      let val2: f32 = get_pixel(ptr, x + 2, y, width, height);
      let val3: f32 = get_pixel(ptr, x, y + 1, width, height);
      let val5: f32 = get_pixel(ptr, x + 2, y + 1, width, height);
      let val6: f32 = get_pixel(ptr, x, y + 2, width, height);
      let val7: f32 = get_pixel(ptr, x + 1, y + 2, width, height);
      let val8: f32 = get_pixel(ptr, x + 2, y + 2, width, height);
      // Apply Sobel kernel
      let gx: f32 = -1 * val0 + -2 * val3 + -1 * val6 + val2 + 2 * val5 + val8;
      let gy: f32 = -1 * val0 + -2 * val1 + -1 * val2 + val6 + 2 * val7 + val8;
      let mag: f32 = Mathf.sqrt(gx * gx + gy * gy);
      mag = Mathf.max(0, Mathf.min(1, mag));
      store<f32>(ptr + (x + y * width) * sizeof<f32>(), mag);
    }
  }
}
