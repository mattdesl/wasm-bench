# wasm-bench

A benchmark of JavaScript, Zig and AssemblyScript on image processing task (Sobel filter).

## Run

Install deps:

- Zig - see [here](https://ziglang.org/learn/getting-started/#installing-zig) on how to install v 0.10 or higher
- `wasm-opt` (optional)

Git clone, then:

```sh
cd wasm-bench

# install deps
npm install

# run regular
npm run start

# or, run with wasm-opt if you have it
npm run start:opt
```

## Results

Outputs from relative toolchains.

```
Image Size: 8192 x 8192 px

javascript: 356 bytes
time: 313.56ms

assemblyscript: 390 bytes
time: 263.965ms

zig: 431 bytes
time: 341.903ms
```

## Other languages

It would be worth comparing C and Rust. There is already a placeholder Rust file, but I haven't gotten it assembled yet to WASM without a bloated binary (dozens of kilobytes).

## Notes

The original implementation performed best in Zig, and worst in pure JavaScript. After optimizations from @MaxGraey, AssemblyScript now performs the best, followed closely by pure JavaScript and Zig now being the slowest.

It seems with some optimizations, all three options can be quite performant. One pitfall I've found with AssemblyScript is a lack of structs/tuples; for example, doing `Vec2` math and passing these structs across functions will likely require an allocator and classes, whereas Zig (and other languages) can support these operations without bringing in an allocator.

## Attributions

Diffuse image from:
https://www.motionforgepictures.com/height-maps/

Using this as a reference for the JavaScript implementation:

https://github.com/dangreco/edgy

Other languages were translated from JavaScript with the help of ChatGPT 4.

## Contributions

Please open a PR or issue if you think you can improve the code here or make it more performant.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/wasm-bench/blob/master/LICENSE.md) for details.
