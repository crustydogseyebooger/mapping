var Image = require("../mapping/image.js")
var Image_Processing = require("./image_processing.js")


// console.log(getCSV());

// console.log(getClosestBlock([219, 26, 155]));

const img = Image.loadImageFromFile("images/evermore.png");
// console.log(img.getPixel(128,128));

// const intervals = Image_Processing.computeWindows(img);



// console.log(intervals.length);

// const result = Image_Processing.mapToBlocks(img);
// result.show();
// console.log(result.width,result.height)

// const result = Image_Processing.makeNewImage(img);
// console.log(result.width,result.height);
// result.show();
const res = Image_Processing.mapToBlocks(img);
res.show();

// result.show();




// TODO: make it so that images are centered, get user to upload then process iamge, list of blocks, list of materials