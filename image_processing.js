// actual image processing functions

import {Image} from "../mapping/image.js";
import fs from "fs";



export function toAverage(img){
    const copyImg = img.copy();
    const avg = getAverage(img);
    for (let x = 0; x < copyImg.width; ++x) {
        for (let y = 0; y < copyImg.height; ++y) {
          copyImg.setPixel(x, y, avg);
        }
      }
    return copyImg;
}

export function getAverage(img){

    const copyImg = img.copy();
    let count = 0;
    let avg = [0,0,0];

    for (let x = 0; x < copyImg.width; ++x) {
        for (let y = 0; y < copyImg.height; ++y) {
          const pixel = copyImg.getPixel(x, y);
          avg[0] += pixel[0];
          avg[1] += pixel[1];
          avg[2] += pixel[2];
          count +=1;
        }
        count +=1;
      }

    avg = [Math.floor(avg[0]/count),Math.floor(avg[1]/count),Math.floor(avg[2]/count)];
    const toAdd = img.getName()+","+avg.toString()+"\n"
    const name = img.getName();

    if (!csvArrayContains(name)) {
        fs.appendFileSync("averages.csv",toAdd);
    }

    return avg;
}

export function getCSV(){
    const csv = fs.readFileSync('averages.csv').toString();
    var lines = csv.split("\n");
    lines = lines.map(str => str.trim("\r"));
    const colors = new Set();

    lines.forEach(color => {
        color = color.split(",");
        colors.add(color);
    })

    return colors;
}

export function csvArrayContains(name){
    const contents = getCSV();
    var toReturn = false;
    contents.forEach(sub => {
        if (name === sub[0]) {
            toReturn = true;
        };
    })
    return toReturn;
}

export function closestBlock(color){ // an rgb array
    let name = "";
    // let currRed = Infinity, currGreen = Infinity, currBlue = Infinity;
    let threshold = Infinity;
    let red = 0, green = 0, blue = 0;

    const contents = getCSV();
    contents.forEach(sub => {
        if (sub.length!==4) return;

        red = Math.abs(color[0]-sub[1]);
        green = Math.abs(color[1]-sub[2]);
        blue = Math.abs(color[2]-sub[3]);

        if (red*red + green*green + blue*blue <= threshold*threshold) {
            name = sub[0];
            threshold = red + green + blue;
        }
    })

    return name;
}








/**
 * Saturates green color s each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */ 
function saturateGreen(img) {
  const copyImg = img.copy();
  for (let x = 0; x < copyImg.width; ++x) {
    for (let y = 0; y < copyImg.height; ++y) {
      const pixel = copyImg.getPixel(x, y);
      copyImg.setPixel(x, y, [pixel[0], 255, pixel[2]]);
    }
  }
  // img.show("img");
  return copyImg;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
function flipColors(img) {
  const copyImg = img.copy();
  for (let x = 0; x < copyImg.width; ++x) {
    for (let y = 0; y < copyImg.height; ++y) {
      const pixel = copyImg.getPixel(x, y);

      const red = pixel[0];
      const green = pixel[1];
      const blue = pixel[2];

      copyImg.setPixel(x, y, [
        Math.floor((green + blue) / 2),
        Math.floor((red + blue) / 2),
        Math.floor((red + green) / 2),
      ]);
    }
  }
  // img.show("img");
  return copyImg;
}

// /**
//  * Modifies the given `img` such that the value of each pixel
//  * s the given line is the result of applying `func` to the
//  * corresponding pixel of `img`. If `lineNo` is not a valid line
//  * number, then `img` should not be modified.
//  * @param img An image
//  * @param lineNo A line number
//  * @param func A color transformation function
//  */
// export function mapLine(img: Image, lineNo: number, func: (c: Color) => Color): void {
//   // TODO
//   if (lineNo >= img.height || lineNo < 0) return;
//   if (lineNo - Math.floor(lineNo) !== 0) return; // no decimals

//   for (let x = 0; x < img.width; ++x) {
//     const pixel = img.getPixel(x, lineNo);
//     img.setPixel(x, lineNo, func(pixel));
//   }

//   return;
// }

// /**
//  * The result must be a new image with the same dimensions as `img`.
//  * The value of each pixel in the new image should be the result of
//  * applying `func` to the corresponding pixel of `img`.
//  * @param img An image
//  * @param func A color transformation function
//  */
// export function imageMap(img: Image, func: (c: Color) => Color): Image {
//   const copyImg = img.copy();
//   let currentLine = 0;

//   while (currentLine < img.height) {
//     mapLine(copyImg, currentLine, func);
//     currentLine += 1;
//   }

//   return copyImg;
// }

// /**
//  * Helper function for mapToGreen
//  */
// function satGreen(c: Color): Color {
//   return [c[0], 255, c[2]];
// }

// /**
//  * Saturates green color in an image
//  * @param img An image
//  * @returns A new image where each pixel has the green channel has been set to its maximum.
//  */
// export function mapToGreen(img: Image): Image {
//   return imageMap(img, satGreen);
// }

// /**
//  * Helper function for mapFlipColors
//  */
// function flip(c: Color): Color {
//   const red = c[0];
//   const green = c[1];
//   const blue = c[2];

//   return [Math.floor((green + blue) / 2), Math.floor((red + blue) / 2), Math.floor((red + green) / 2)];
// }

// /**
//  * Flips the colors of an image
//  * @param img An image
//  * @returns A new image where each pixels channel has been
//  *  set as the truncated average of the other two
//  */
// export function mapFlipColors(img: Image): Image {
//   return imageMap(img, flip);
// }
