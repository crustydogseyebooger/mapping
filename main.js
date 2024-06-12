import {Image} from "../mapping/image.js"
import { toAverage, getAverage, getCSV, closestBlock} from "./image_processing.js";
import fs from "fs";


console.log(getCSV());

console.log(closestBlock([219, 26, 155]));

// const im = Image.loadImageFromFile("images/blocks/cyan_wool.png");
// const avg = toAverage(im)
// console.log(avg.width,avg.height);
// avg.show()