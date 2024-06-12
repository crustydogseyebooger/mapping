import {Image} from "../mapping/image.js"
import { toAverage, getAverage, getCSV, getClosestBlock, computeWindows, mapToBlocks} from "./image_processing.js";
import fs from "fs";


// console.log(getCSV());

// console.log(getClosestBlock([219, 26, 155]));

const img = Image.loadImageFromFile("images/snoopy.png");
// console.log(img.width,img.height);
mapToBlocks(img).show();

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// const image = document.getElementById("source");

// image.addEventListener("load", (e) => {
//   ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
// });


