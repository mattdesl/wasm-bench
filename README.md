# wasm-bench

A benchmark of JavaScript, Zig and AssemblyScript on image processing task (Sobel filter).

## Run

Install deps:

- Zig
- `wasm-opt` (optional)
- Rust (optional, not yet included in this benchmark)

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
javascript: 424 bytes
assemblyscript: 458 bytes
zig: 439 bytes

Benchmarking...
Image Size: 8192 x 8192 px
Runner: javascript
process: 818.196ms

Runner: assemblyscript
process: 415.633ms

Runner: zig
process: 293.063ms
```

Using `wasm-opt` after building, to further shrink and improve performance:

```
javascript: 424 bytes
assemblyscript: 458 bytes
zig: 425 bytes

Benchmarking...
Image Size: 8192 x 8192 px
Runner: javascript
process: 826.694ms

Runner: assemblyscript
process: 419.436ms

Runner: zig
process: 297.444ms
```

## Other languages

It would be worth comparing C and Rust. There is already a placeholder Rust file, but I haven't gotten it assembled yet to WASM without a bloated binary (dozens of kilobytes).

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
