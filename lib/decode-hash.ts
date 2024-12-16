const characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~";

const decodeCharacterMap: Record<string, number> = {};
for (let i = 0; i < characters.length; i++) {
  decodeCharacterMap[characters[i]] = i;
}

export const decodeBlurhash = (
  hash: string,
  width: number,
  height: number,
  punch: number = 1
): Uint8Array => {
  if (!isValidBlurhash(hash)) {
    throw new Error("Invalid blurhash.");
  }

  const sizeFlag = decode83(hash[0]);
  const numY = Math.floor(sizeFlag / 9) + 1;
  const numX = (sizeFlag % 9) + 1;

  const quantizedMaxValue = decode83(hash[1]);
  const maxValue = (quantizedMaxValue + 1) / 166;

  const colors: [number, number, number][] = [];
  for (let i = 0; i < numX * numY; i++) {
    if (i === 0) {
      const value = decode83(hash.substring(2, 6));
      colors.push(decodeDC(value));
    } else {
      const value = decode83(hash.substring(4 + i * 2, 6 + i * 2));
      colors.push(decodeAC(value, maxValue * punch));
    }
  }

  const pixels = new Uint8Array(width * height * 3);

  const cosX = precomputeCosines(width, numX);
  const cosY = precomputeCosines(height, numY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let j = 0; j < numY; j++) {
        for (let i = 0; i < numX; i++) {
          const basis = cosX[x][i] * cosY[y][j];
          const color = colors[j * numX + i];
          r += color[0] * basis;
          g += color[1] * basis;
          b += color[2] * basis;
        }
      }

      const pixelIndex = 3 * (y * width + x);
      pixels[pixelIndex + 0] = linearToSRGB(r);
      pixels[pixelIndex + 1] = linearToSRGB(g);
      pixels[pixelIndex + 2] = linearToSRGB(b);
    }
  }

  return pixels;
};

const decode83 = (str: string): number => {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const index = decodeCharacterMap[str[i]];
    if (index === undefined) {
      throw new Error(`Invalid character: ${str[i]}`);
    }
    value = value * 83 + index;
  }
  return value;
};

const decodeDC = (value: number): [number, number, number] => {
  const r = sRGBToLinear((value >> 16) & 255);
  const g = sRGBToLinear((value >> 8) & 255);
  const b = sRGBToLinear(value & 255);
  return [r, g, b];
};

const decodeAC = (
  value: number,
  maxValue: number
): [number, number, number] => {
  const quantR = Math.floor(value / (19 * 19));
  const quantG = Math.floor(value / 19) % 19;
  const quantB = value % 19;

  const r = signPow((quantR - 9) / 9, 2.0) * maxValue;
  const g = signPow((quantG - 9) / 9, 2.0) * maxValue;
  const b = signPow((quantB - 9) / 9, 2.0) * maxValue;

  return [r, g, b];
};

const sRGBToLinear = (value: number): number => {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const linearToSRGB = (value: number): number => {
  const v = Math.max(0, Math.min(1, value));
  return v <= 0.0031308
    ? Math.round(v * 12.92 * 255)
    : Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255);
};

const precomputeCosines = (size: number, components: number): number[][] => {
  const cosines = Array.from({ length: size }, () => new Array(components));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < components; j++) {
      cosines[i][j] = Math.cos((Math.PI * i * j) / size);
    }
  }
  return cosines;
};

const signPow = (value: number, exp: number): number => {
  return Math.sign(value) * Math.pow(Math.abs(value), exp);
};

export const isValidBlurhash = (hash: string): boolean => {
  if (!hash || hash.length < 6) return false;

  const sizeFlag = decode83(hash[0]);
  const numY = Math.floor(sizeFlag / 9) + 1;
  const numX = (sizeFlag % 9) + 1;

  const expectedLength = 4 + 2 * numX * numY;
  return hash.length === expectedLength;
};

export const pixelsToDataUrl = (
  pixels: Uint8Array,
  width: number,
  height: number
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = ctx.createImageData(width, height);
  const rgbaPixels = new Uint8Array(width * height * 4);

  for (let i = 0; i < pixels.length / 3; i++) {
    rgbaPixels[i * 4 + 0] = pixels[i * 3 + 0]; // R
    rgbaPixels[i * 4 + 1] = pixels[i * 3 + 1]; // G
    rgbaPixels[i * 4 + 2] = pixels[i * 3 + 2]; // B
    rgbaPixels[i * 4 + 3] = 255;
  }

  imageData.data.set(rgbaPixels);
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
};
