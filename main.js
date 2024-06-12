import {Image} from "../mapping/image.js"
import { getAverage, getCSV } from "./image_processing.js";
import fs from "fs";


// const csv = fs.readFileSync('averages.csv').toString();
// var lines = csv.split("\n");
// lines = lines.map(str => str.trim("\r"));
// const colors = new Set();

// lines.forEach(color => {
//     color = color.split(",");
//     colors.add(color);
// })

console.log(getCSV());




const img = Image.loadImageFromFile("images/blocks/cherry_wood_planks.png");
getAverage(img);

console.log("cherry_wood_planks" === "cherry_wood_planks")