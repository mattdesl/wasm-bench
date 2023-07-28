const std = @import("std");
const math = std.math;

fn get_pixel(ptr: [*c]f32, px: u32, py: u32, columns: u32) f32 {
    return ptr[px + py * columns];
}

export fn process(data: [*c]f32, width: u32, height: u32) void {
    var y: u32 = 0;
    while (y < height) : (y += 1) {
        var y1 = y + 1;
        var y2 = y + 2;
        if (y1 >= height) y1 = height - 1;
        if (y2 >= height) y2 = height - 1;

        var x: u32 = 0;
        while (x < width) : (x += 1) {
            var x1 = x + 1;
            var x2 = x + 2;
            if (x1 >= width) x1 = width - 1;
            if (x2 >= width) x2 = width - 1;

            const val0 = get_pixel(data, x, y, width);
            const val1 = get_pixel(data, x1, y, width);
            const val2 = get_pixel(data, x2, y, width);
            const val3 = get_pixel(data, x, y1, width);
            const val5 = get_pixel(data, x2, y1, width);
            const val6 = get_pixel(data, x, y2, width);
            const val7 = get_pixel(data, x1, y2, width);
            const val8 = get_pixel(data, x2, y2, width);

            const gx = (val5 - val3) * 2 + (val2 + val8) - (val0 + val6);
            const gy = (val7 - val1) * 2 + (val6 + val8) - (val0 + val2);

            const mag: f32 = math.min(1, math.sqrt(gx * gx + gy * gy));
            data[x + y * width] = mag;
        }
    }
}
