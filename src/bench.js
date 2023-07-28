// import { createCanvas, loadImage } from "canvas";
// import { statSync } from "node:fs";
// import { readFile, writeFile } from "node:fs/promises";

const { createCanvas, loadImage } = await (async () => {
  if (typeof document !== "undefined") {
    return {
      loadImage: (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        }),
      createCanvas: (width, height) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
      },
    };
  } else {
    return await import("canvas");
  }
})();

async function fileStat(file) {
  if (typeof document !== "undefined") {
    const resp = await fetch(file);
    const blob = await resp.blob();
    return blob.size;
  } else {
    return (await import("node:fs")).statSync(file).size;
  }
}

async function instantiateWASM(url, instanceOpts = {}) {
  try {
    const resp = await fetch(url);
    const { instance } = await WebAssembly.instantiateStreaming(
      resp,
      instanceOpts
    );
    return instance;
  } catch (err) {
    // Hide these for test case
    // console.error(`Error streaming: ${err.message}`);
    // console.error("Falling back to Node.js buffering");
    const { readFile } = await import("node:fs/promises");
    const buf = await readFile(url);
    const compiled = await WebAssembly.compile(buf);
    return WebAssembly.instantiate(compiled, instanceOpts);
  }
}

async function load(width, height, type) {
  if (type === "javascript") {
    const { process } = await import(
      `./javascript/process.js?cachebust=${Date.now()}`
    );
    const view = new Float32Array(width * height);
    return {
      process(_, width, height) {
        process(view, width, height);
      },
      memory: view.buffer,
      view,
    };
  } else {
    const arraySize = (width * height * 4) >>> 0;
    const nPages = ((arraySize + 0xffff) & ~0xffff) >>> 16;
    // console.log(`N Pages: ${nPages}`);
    const memory = new WebAssembly.Memory({ initial: nPages });
    // console.log("Memory Size:", memory.buffer.byteLength);
    // console.log("Creating Buffer:", width * height);
    const view = new Float32Array(memory.buffer, 0, width * height);
    const wasmModule = await instantiateWASM(`build/${type}.wasm`, {
      env: {
        memory,
      },
    });
    const { process } = wasmModule.exports;
    return {
      process,
      view,
      memory,
    };
  }
}

async function displayCanvas(canvas, filename = "download.jpg") {
  if (typeof document !== "undefined") {
    document.body.appendChild(canvas);
  } else {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(filename, canvas.toBuffer("image/jpeg"));
  }
}

async function loadPixels(file, scale = 1) {
  const image = await loadImage(file);
  const width = Math.floor(image.width * scale);
  const height = Math.floor(image.height * scale);
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  return { data, width, height };
}

async function run(type, pixels) {
  const { data, width, height } = pixels;

  const { process, view } = await load(width, height, type);

  // Convert R channel to Luminance
  for (let i = 0; i < width * height; i++) {
    // Rec709 Color Luminance
    const r = data[i * 4 + 0];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const L = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 0xff;
    view[i] = L;
  }

  const pointer = 0;
  console.time("time");
  process(pointer, width, height);
  console.timeEnd("time");

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const imgData = context.createImageData(width, height);
  for (let i = 0; i < width * height; i++) {
    const L = view[i] * 0xff;
    imgData.data[i * 4 + 0] = L;
    imgData.data[i * 4 + 1] = L;
    imgData.data[i * 4 + 2] = L;
    imgData.data[i * 4 + 3] = 0xff;
  }
  context.putImageData(imgData, 0, 0);
  await displayCanvas(canvas, `build/out_${type}.jpg`);
  console.log();
}

const files = [
  ["javascript", "src/javascript/process.min.js"],
  ["assemblyscript", "build/assemblyscript.wasm"],
  ["zig", "build/zig.wasm"],
];

// scale by 2x to accentuate the benchmark speed
const pixels = await loadPixels("assets/diffuse.jpg", 2);
console.log(`Image Size: ${pixels.width} x ${pixels.height} px`);
console.log();
for (let [type, filePath] of files) {
  const stat = await fileStat(filePath);
  console.log(`${type}: ${stat} bytes`);
  await run(type, pixels);
}
