import {Image} from "../mapping/image.js"
import { getAverage } from "./image_processing.js";
import fs from "fs";


const csv = fs.readFileSync('averages.csv').toString();
console.log(csv);
var lines = csv.split("\n");
console.log(lines);
lines = lines.map(str => str.trim("\r"));
const colors = [];

lines.forEach(color => {
    color = color.split(",");
    colors.push(color);
})

console.log(colors);




const img = Image.loadImageFromFile("images/cherry_wood_planks.png");
getAverage(img);

