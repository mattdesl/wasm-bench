// TODO: Wrap into wasm somehow?

fn get_pixel(ptr: &[f32], px: usize, py: usize, columns: usize, rows: usize) -> f32 {
  let mut x = px;
  let mut y = py;

  if x < 0 { x = 0; }
  if y < 0 { y = 0; }
  if x >= columns { x = columns - 1; }
  if y >= rows { y = rows - 1; }

  return ptr[x + y * columns];
}

pub fn process(ptr: &mut [f32], width: usize, height: usize) {
  for y in 0..height {
      for x in 0..width {
          let val0 = get_pixel(&ptr, x, y, width, height);
          let val1 = get_pixel(&ptr, x + 1, y, width, height);
          let val2 = get_pixel(&ptr, x + 2, y, width, height);
          let val3 = get_pixel(&ptr, x, y + 1, width, height);
          let val5 = get_pixel(&ptr, x + 2, y + 1, width, height);
          let val6 = get_pixel(&ptr, x, y + 2, width, height);
          let val7 = get_pixel(&ptr, x + 1, y + 2, width, height);
          let val8 = get_pixel(&ptr, x + 2, y + 2, width, height);

          let gx = -1.0 * val0 + -2.0 * val3 + -1.0 * val6 + val2 + 2.0 * val5 + val8;
          let gy = -1.0 * val0 + -2.0 * val1 + -1.0 * val2 + val6 + 2.0 * val7 + val8;
          let mut mag = (gx * gx + gy * gy).sqrt();
          mag = mag.max(0.0).min(1.0);
          ptr[x + y * width] = mag;
      }
  }
}