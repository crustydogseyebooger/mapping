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

export function getWindowAverage(img,interval){
  let count = 0;
  let avg = [0,0,0];

  for (let i = interval[0]; i < interval[2]; i++) {
    for (let j = interval[1]; j < interval[3]; j++) {
      const pixel = img.getPixel(i, j);
        avg[0] += pixel[0];
        avg[1] += pixel[1];
        avg[2] += pixel[2];
        count +=1;
      }
      count +=1;
    }

    avg = [Math.floor(avg[0]/count),Math.floor(avg[1]/count),Math.floor(avg[2]/count)];
    // console.log(avg);
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

export function getClosestBlock(color){ // an rgb array
    let name = "";
    let threshold = Infinity;
    let red = 0, green = 0, blue = 0;
    let blockAvg = [0,0,0];

    const contents = getCSV();
    contents.forEach(sub => {
        if (sub.length!==4) return;

        red = Math.abs(color[0]-sub[1]);
        green = Math.abs(color[1]-sub[2]);
        blue = Math.abs(color[2]-sub[3]);

        if (red*red + green*green + blue*blue <= threshold*threshold) {
            name = sub[0];
            blockAvg = [sub[1],sub[2],sub[3]];
            threshold = red + green + blue;
        }
    })
    // console.log([name,blockAvg]);
    return [name, blockAvg];
}

// get window average
// get closest block

export function computeWindows(img){
  const windowWidth = Math.floor(img.width/128); // placeholder 4 for a 16 x 16 test image
  const windowHeight = Math.floor(img.width/128);

  // console.log(windowWidth,windowHeight);

  const intervals = [];
  let xMin = 0, yMin = 0;

  while (xMin < img.width){
    while (yMin < img.height){
      intervals.push([xMin,yMin,xMin+windowWidth,yMin+windowHeight]);
      yMin += windowHeight;
    }
    xMin += windowWidth;
    yMin = 0;
  }

  console.log(intervals.length);
  return intervals.map(sub => {
    if (sub[2] > img.width) sub[2] = img.width;
    if (sub[3] > img.height) sub[3] = img.height;
    return sub;
  });


  // intervals.forEach(interval=>{
  //   for (let i = interval[0]; i<interval[2];i++){
  //     for (let j = interval[1]; j<interval[3]; j++){
  //       if (counter % 2 === 0 ) img.setPixel(i,j,[0,0,255]);
  //       else img.setPixel(i,j,[0,255,0])
  //     }
  //   }
  // })
}


export function mapToBlocks(img){
  if (img.width < 128 || img.height < 128) return img; // needs error-handling

  const intervals = computeWindows(img);
  const result = img.copy();

  intervals.forEach(interval=>{
    const avg = getWindowAverage(img,interval);
    const color = getClosestBlock(avg)[1];
    for (let i = interval[0]; i<interval[2];i++){
      for (let j = interval[1]; j<interval[3]; j++){
        result.setPixel(i,j,color);
      }
    }
  });
  return result;
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
