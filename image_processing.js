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
  // const bruh = img.width - img.width % 128;
  // const pookie = img.height - img.height % 128;
  // console.log(bruh,pookie);
  const windowWidth = Math.floor(img.width/128); // floor or ceil?
  const windowHeight = Math.floor(img.height/128); 


  const off = 0;
  let intervals = [];
  let xMin = 0+off, yMin = 0+off;

  while (xMin < img.width){
    while (yMin < img.height){
      intervals.push([xMin,yMin,xMin+windowWidth,yMin+windowHeight]);
      yMin += windowHeight;
    }
    xMin += windowWidth;
    yMin = 0;
  }

  intervals = intervals.filter(sub=>{
    if (sub[2] >= img.width) return false;
    if (sub[3] >= img.height) return false;
    return true;
  });

  const remove = (intervals.length - 16384)/2;
  intervals = intervals.slice(remove,intervals.length-remove);
  return intervals;
}


export function mapToBlocks(img){
  if (img.width < 128 || img.height < 128) return img; // needs error-handling

  const intervals = computeWindows(img);
  // const result = img.copy();
  const result = Image.create(128,128,[0,0,0]);

  let xCounter = 0, yCounter = 0;

  intervals.forEach(interval=>{
    const avg = getWindowAverage(img,interval);
    const color = getClosestBlock(avg)[1];
    
    if (yCounter === 128) {
      xCounter += 1;
      yCounter = 0;
    }

    result.setPixel(xCounter,yCounter,color);
    yCounter += 1;

    

    // map interval
    // for (let i = interval[0]; i<interval[2];i++){
    //   for (let j = interval[1]; j<interval[3]; j++){
    //     result.setPixel(i,j,color);
    //   }
    // }
  });
  return result;
}

