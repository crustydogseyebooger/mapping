// // helper functions
var assert = require('assert');
var exec = require('child_process');
// var exec = require('exec');
var fs = require('fs');
var os = require('os');
var path = require('path');
var PNG = require('pngjs').PNG;
var tmp = require('tmp');


/**
 * Throws an error if `color` is not a Color
 * @param color An array
 */
function assertValidColor(color) {}

/**
 * Throws an error if `width` or `height` are invalid image dimensions
 * @param width A number
 * @param height A number
 */
function assertValidWidthAndHeight(width, height) {
  assert(width > 0, "[image.ts] Invalid use of Image class. Image width must be greater than 0.");
  assert(height > 0, "[image.ts] Invalid use  of Image class. Image height must be greater than 0.");

  assert(width < 5000, "[image.ts] Invalid use of Image class. Image width must be less than 5000.");
  assert(height < 5000, "[image.ts] Invalid use of Image class. Image height must be less than 5000.");
}



class Image {

  /**
   * Loads an image from the file system into memory as an `Image` object.
   * @param image Path to a PNG, JPG, JPEG file
   * @returns The file represented as an `Image` object.
   */
  static loadImageFromFile(filePath) {
    assert(filePath.endsWith(".png"), "[image.ts] Only `.png` files are supported.");

    if (!fs.existsSync(filePath)) {
      throw new Error(`Unable to locate file: \`${filePath}\``);
    }
    fs.accessSync(filePath, fs.constants.R_OK);

    var name = filePath.trim(".png");

    const png = PNG.sync.read(fs.readFileSync(filePath));
    return new Image(png.width, png.height, Uint8ClampedArray.from(png.data),name);
  }

  /**
   * Creates a new image and sets each pixel to a default color.
   * @param width The width of the image
   * @param height The height of the image
   * @param fillColor The color to set each pixel as
   */
  static create(width, height, fillColor) {
    assertValidWidthAndHeight(width, height);
    assertValidColor(fillColor);

    return new Image(
      width,
      height,
      Uint8ClampedArray.from(
        {
          length: width * height * 4,
        },
        (_, i) => (i % 4 < 3 ? fillColor[i % 4] : 255)
      )
    );
  }


  // class attributes
  width;
  height;

  data; //: Uint8ClampedArray;
  rowSize;

  /**
   * Constructs a new `Image` object. Use `Image.create` to generate an actual image
   * @param width The images width
   * @param height The images height
   * @param data The pixel data of the image
   */
  constructor(width, height, data,name) {
    assertValidWidthAndHeight(width, height);

    this.width = width;
    this.height = height;
    this.data = data;
    this.name = name;

    this.rowSize = this.width * 4;
  }

  /**
   * Returns the color of the pixel at the specified location.
   * @param x The horizontal coordinate from the origin (top, left)
   * @param y The vertical coordinate from the origin (top, left)
   * @returns The color of the pixel at (x, y)
   */
  getPixel(x, y) {
    this.assertCoordinatesInBounds(x, y);
    const offset = this.getOffset(x, y);

    return [this.data[offset], this.data[offset + 1], this.data[offset + 2]];
  }

  /**
   * Updates the color of a pixel in the image.
   * @param x The horizontal coordinate of the pixel
   * @param y The vertical coordinate of the pixel
   * @param color The new color of the pixel
   */
  setPixel(x, y, color) {
    assertValidColor(color);
    this.assertCoordinatesInBounds(x, y);

    const offset = this.getOffset(x, y);

    this.data[offset] = color[0];
    this.data[offset + 1] = color[1];
    this.data[offset + 2] = color[2];
  }

  /**
   * Create a copy of the current state of the image.
   */
  copy() {
    return new Image(this.width, this.height, Uint8ClampedArray.from(this.data));
  }

  /**
   * Write the current state of the image to the file system.
   * All images are saved under the current working directory (cwd) under the path `./images_out/*.png`.
   * @param fileName The name of the image
   */
  save(fileName) {
    assert.match(
      fileName,
      /^(?!.{256,})(?!(aux|clock\$|con|nul|prn|com[1-9]|lpt[1-9])(?:$|\.))[^ ][ .\w-$()+=[\];#@~,&amp;']+[^. ]$/i,
      "[image.ts] Invalid file name."
    );
    const root = process.cwd();
    const images_out = path.resolve(root, "images_out");
    // const blocks_out = path.resolve(root,"blocks_out");
    if (!fs.existsSync(images_out)) {
      fs.mkdirSync(images_out);
    }
    this.saveToPath(path.resolve(images_out, fileName + ".png"));
  }

  /**
   * Attempts to display a preview of the image in VSCode or an image viewer
   * @param label A prefix for the file's name
   */
  show(label = "image.ts") {
    const temp = tmp.fileSync({
      prefix: label,
      postfix: ".png",
    });

    this.saveToPath(temp.name);

    if (os.platform() === "darwin") {
      // macOS
      exec.exec(`open ${temp.name}`);
    } else {
      // if code is not in $PATH, this will not work
      exec.exec(`code --reuse-window ${temp.name}`);
    }
  }

  /**
   * Writes an image to a specified path in the file system
   * @param filePath A file name
   */
  saveToPath(filePath) {
    const png = new PNG({
      width: this.width,
      height: this.height,
    });

    png.data = Buffer.from(this.data.buffer);
    fs.writeFileSync(filePath, PNG.sync.write(png));
  }

  /**
   * A list of all colors in the image
   * @returns An array of the images colors
   */
  pixels() {
    const pixels = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        pixels.push(this.getPixel(x, y));
      }
    }

    return pixels;
  }

  /**
   * A list of all coordinates in the image
   * @returns A two dimensional array of the images pairwise x and y coordinates
   */
  coordinates() {
    const coords = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        coords.push([x, y]);
      }
    }

    return coords;
  }

  getName(){
    let r = this.name.replace("images/blocks/","").replace(".png","");
    return r;
  }

  /**
   * Throws an error if a given x and y are not valid coordinates in the image
   * @param x A number
   * @param y A number
   */
  assertCoordinatesInBounds(x, y) {
    // assert(Number.isInteger(x), "[image.ts] Invalid use of Image class, x coordinate must be an integer.");
    // assert(Number.isInteger(y), "[image.ts] Invalid use of Image class, y coordinate must be an integer.");
    // assert(x >= 0, "[image.ts] Invalid use of Image class, x coordinate must be non-negative.");
    // assert(x < this.width, "[image.ts] Invalid use of Image class,  x coordinate must be smaller than the width.");
    // assert(y >= 0, "[image.ts] Invalid use of Image class, y coordinate must be non-negative.");
    // assert(y < this.height, "[image.ts] Invalid use of Image class, y coordinate must be smaller than the height.");
  }

    getOffset(x, y) {
    return y * this.rowSize + x * 4;
  }
}

module.exports = Image;
