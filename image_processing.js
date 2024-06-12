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

// const WINDOW_SIZE = 100;
const WINDOW_SIZE = 128;

export function computeWindows(img){
  const bruh = Math.floor(img.width/WINDOW_SIZE)*WINDOW_SIZE;
  const pookie = Math.floor(img.width/WINDOW_SIZE)*WINDOW_SIZE;
  console.log(bruh,pookie);

  const windowWidth = Math.floor(bruh/WINDOW_SIZE); // floor or ceil?
  const windowHeight = Math.floor(pookie/WINDOW_SIZE); 

  // const windowWidth = Math.floor(img.width/4); // floor or ceil?
  // const windowHeight = Math.floor(img.height/4); 

  let intervals = [];
  let xMin = 0, yMin = 0;

  while (xMin < bruh){
    while (yMin < pookie){
      intervals.push([xMin,yMin,xMin+windowWidth,yMin+windowHeight]);
      yMin += windowHeight;
    }
    xMin += windowWidth;
    yMin = 0;
  }

  intervals = intervals.filter(sub=>{
    if ((sub[2] > bruh) || (sub[0]>bruh)) return false;
    if ((sub[3] > pookie) || (sub[1]>pookie)) return false;
    return true;
  });

  return intervals;
}


export function mapToBlocks(img){
  // if (img.width < 128 || img.height < 128) return img; // needs error-handling

  const intervals = computeWindows(img);
  const result = Image.create(WINDOW_SIZE,WINDOW_SIZE,[0,0,0]);
  // const result = Image.create(4,4,[255,255,255]);

  let xCounter = 0, yCounter = 0;

  intervals.forEach(interval=>{
    const avg = getWindowAverage(img,interval);
    const color = getClosestBlock(avg)[1];
    console.log("color",getClosestBlock(avg)[0]);

    if (yCounter === WINDOW_SIZE) {
      xCounter += 1;
      yCounter = 0;
    }

    result.setPixel(xCounter,yCounter,color);       
    
    yCounter+=1;
  });
  return result;
}

// export function computeWindow(img){
//   // how do we resize a rectangle into a square?
//   // could either make mapping area wider OR crop to square and map


// }
