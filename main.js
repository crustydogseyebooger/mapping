import {Image} from "../mapping/image.js"
import { toAverage, getAverage, getCSV, getClosestBlock, computeWindows} from "./image_processing.js";
import fs from "fs";


console.log(getCSV());

console.log(getClosestBlock([219, 26, 155]));

const img = Image.create(16,16,[0,0,0]);
computeWindows(img);
img.show();



// const im = Image.loadImageFromFile("images/blocks/cyan_wool.png");
// const avg = toAverage(im)
// console.log(avg.width,avg.height);
// avg.show()