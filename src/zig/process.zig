const std = @import("std");
const math = std.math;

fn get_pixel(ptr: [*]f32, px: u32, py: u32, columns: u32, rows: u32) f32 {
  var x = px;
  var y = py;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x >= columns) x = columns - 1;
  if (y >= rows) y = rows - 1;
  // const idx:usize = @as(usize, x + y * columns);
  return ptr[x + y * columns];
}

export fn process(ptr: [*]f32, width: u32, height: u32) void {
  var y: u32 = 0;
  // var i: u32 = 0;
  while (y < height) : (y += 1) {
    var x: u32 = 0;
    while (x < width) : (x += 1) {
      const val0 = get_pixel(ptr, x, y, width, height);
      const val1 = get_pixel(ptr, x + 1, y, width, height);
      const val2 = get_pixel(ptr, x + 2, y, width, height);
      const val3 = get_pixel(ptr, x, y + 1, width, height);
      const val5 = get_pixel(ptr, x + 2, y + 1, width, height);
      const val6 = get_pixel(ptr, x, y + 2, width, height);
      const val7 = get_pixel(ptr, x + 1, y + 2, width, height);
      const val8 = get_pixel(ptr, x + 2, y + 2, width, height);
      const gx = -1 * val0 + -2 * val3 + -1 * val6 + val2 + 2 * val5 + val8;
      const gy = -1 * val0 + -2 * val1 + -1 * val2 + val6 + 2 * val7 + val8;

      var mag:f32 = math.sqrt(gx * gx + gy * gy);
      mag = math.max(0, math.min(1, mag));
    
      ptr[x + y * width] = mag;
    }
  }
}