// import {Image} from "../mapping/image.js"
// import { toAverage, getAverage, getCSV, getClosestBlock, computeWindows, mapToBlocks, getWindowAverage} from "./image_processing.js";
// import fs from "fs";

var Image = require("../mapping/image.js")
var Image_Processing = require("./image_processing.js")


// console.log(getCSV());

// console.log(getClosestBlock([219, 26, 155]));

const img = Image.loadImageFromFile("images/bear.png");
console.log(img.getPixel(128,128));

const intervals = Image_Processing.computeWindows(img);



// intervals.forEach(interval=>console.log(interval));
console.log(intervals.length);

const result = Image_Processing.mapToBlocks(img);
result.show();
console.log(result.width,result.height)


// const canvas = Image.create(27,128,[0,255,0]);

// let xCounter = 0, yCounter = 0, WINDOW_SIZE=28;

// intervals.forEach(interval=>{
//     const avg = getWindowAverage(img,interval);
//     const color = getClosestBlock(avg)[1];

//     if (yCounter === WINDOW_SIZE) {
//       xCounter += 1;
//       yCounter = 0;
//     }

//     canvas.setPixel(xCounter,yCounter,color);       
    
//     yCounter+=1;
//   });

// canvas.show();

// console.log(img.width,img.height);
// console.log(Math.floor(img.width/WINDOW_SIZE),Math.floor(img.height/WINDOW_SIZE));
// REMOVED "type": "module" from json