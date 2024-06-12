import {Image} from "../mapping/image.js"
import { toAverage, getAverage, getCSV, getClosestBlock, computeWindows, mapToBlocks, getWindowAverage} from "./image_processing.js";
import fs from "fs";


// console.log(getCSV());

// console.log(getClosestBlock([219, 26, 155]));

const img = Image.loadImageFromFile("images/snoopy.png");
// console.log(img.width,img.height);
// mapToBlocks(img).show();




// const test_image = Image.create(296,172,[0,255,0]);
// for (let i = 0; i<test_image.width;i++){
//     for (let j = 0; j<test_image.height; j++) {
//         if (i%2===0) test_image.setPixel(i,j,[255,0,0]);
//         if (i%3===0) test_image.setPixel(i,j,[255,0,255]);
//         if (i%4===0) test_image.setPixel(i,j,[0,255,255]);
//     }
// }
// test_image.save("uneven_wide");
// const img = Image.loadImageFromFile("images_out/uneven_wide.png");

const intervals = computeWindows(img);

// intervals.forEach(interval=>console.log(interval));
console.log(intervals.length);

const result = mapToBlocks(img);
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
