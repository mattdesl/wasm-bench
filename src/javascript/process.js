export function process(data, width, height) {
  for (let y = 0; y < height; y++) {
    let y1 = y + 1;
    let y2 = y + 2;

    if (y1 >= height) y1 = height - 1;
    if (y2 >= height) y2 = height - 1;

    let ptr0 = y * width;
    let ptr1 = y1 * width;
    let ptr2 = y2 * width;

    for (let x = 0; x < width; x++) {
      let x1 = x + 1;
      let x2 = x + 2;

      if (x1 >= width) x1 = width - 1;
      if (x2 >= width) x2 = width - 1;

      // Extract values from image
      let val0 = data[ptr0 + x];
      let val1 = data[ptr0 + x1];
      let val2 = data[ptr0 + x2];

      let val3 = data[ptr1 + x];
      let val5 = data[ptr1 + x2];

      let val6 = data[ptr2 + x];
      let val7 = data[ptr2 + x1];
      let val8 = data[ptr2 + x2];

      // Apply Sobel kernel
      let gx = (val5 - val3) * 2 + (val2 + val8) - (val0 + val6);
      let gy = (val7 - val1) * 2 + (val6 + val8) - (val0 + val2);

      let mag = Math.min(Math.sqrt(gx * gx + gy * gy), 1);
      data[ptr0 + x] = mag;
    }
  }
}
