@inline function get_pixel(ptr: usize, px: u32): f32 {
  return load<f32>(ptr + px * sizeof<f32>());
}

@inline function set_pixel(ptr: usize, px: u32, val: f32): void {
  store<f32>(ptr + px * sizeof<f32>(), val);
}

export function process(ptr: usize, width: u32, height: u32): void {
  let width4 = width * sizeof<f32>();

  for (let y: u32 = 0; y < height; y++) {
    let y0 = y + 0;
    let y1 = y + 1;
    let y2 = y + 2;

    if (y1 >= height) y1 = height - 1;
    if (y2 >= height) y2 = height - 1;

    let ptr0: usize = ptr + y0 * width4;
    let ptr1: usize = ptr + y1 * width4;
    let ptr2: usize = ptr + y2 * width4;

    for (let x: u32 = 0; x < width; x++) {
      let x0 = x + 0;
      let x1 = x + 1;
      let x2 = x + 2;

      if (x1 >= width) x1 = width - 1;
      if (x2 >= width) x2 = width - 1;

      // Extract values from image
      let val0 = get_pixel(ptr0, x0);
      let val1 = get_pixel(ptr0, x1);
      let val2 = get_pixel(ptr0, x2);

      let val3 = get_pixel(ptr1, x0);
      let val5 = get_pixel(ptr1, x2);

      let val6 = get_pixel(ptr2, x0);
      let val7 = get_pixel(ptr2, x1);
      let val8 = get_pixel(ptr2, x2);
      // Apply Sobel kernel
      let gx = (val5 - val3) * 2 + (val2 + val8) - (val0 + val6);
      let gy = (val7 - val1) * 2 + (val6 + val8) - (val0 + val2);

      let mag = Mathf.min(Mathf.sqrt(gx * gx + gy * gy), 1);
      set_pixel(ptr0, x, mag);
    }
  }
}
