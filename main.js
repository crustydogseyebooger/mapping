import {Image} from "../mapping/image.js"
import { toAverage, getAverage, getCSV, closestBlock} from "./image_processing.js";
import fs from "fs";


console.log(getCSV());

console.log(closestBlock([0,255,68]));

const im = Image.loadImageFromFile("images/blocks/lime_wool.png");
const avg = toAverage(im)
console.log(avg.width,avg.height);
avg.show()