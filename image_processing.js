// actual image processing functions

var Image = require("../mapping/image.js")
var fs = require('fs');


function toAverage(img){
    const copyImg = img.copy();
    const avg = getAverage(img);
    for (let x = 0; x < copyImg.width; ++x) {
        for (let y = 0; y < copyImg.height; ++y) {
          copyImg.setPixel(x, y, avg);
        }
      }
    return copyImg;
}

function getAverage(img){
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

function getWindowAverage(img,interval){
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

function getCSV(){
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

function csvArrayContains(name){
    const contents = getCSV();
    var toReturn = false;
    contents.forEach(sub => {
        if (name === sub[0]) {
            toReturn = true;
        };
    })
    return toReturn;
}

function getClosestBlock(color){ // an rgb array
    // console.log(color);
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



// const WINDOW_SIZE = 100;
const WINDOW_SIZE = 128;

function computeWindows(img){
  const WINDOW_WIDTH = Math.floor(img.width/WINDOW_SIZE)*WINDOW_SIZE;
  const WINDOW_HEIGHT = Math.floor(img.width/WINDOW_SIZE)*WINDOW_SIZE;

  const windowWidth = Math.floor(WINDOW_WIDTH/WINDOW_SIZE); // floor or ceil?
  const windowHeight = Math.floor(WINDOW_HEIGHT/WINDOW_SIZE); 


  let intervals = [];

  let xMin = 0, yMin = 0;

  while (xMin < WINDOW_WIDTH){
    while (yMin < WINDOW_HEIGHT){
      intervals.push([xMin,yMin,xMin+windowWidth,yMin+windowHeight]);
      yMin += windowHeight;
    }
    xMin += windowWidth;
    yMin = 0;
  }

  intervals = intervals.filter(sub=>{
    if ((sub[2] > WINDOW_WIDTH) || (sub[0]>WINDOW_WIDTH)) return false;
    if ((sub[3] > WINDOW_HEIGHT) || (sub[1]>WINDOW_HEIGHT)) return false;
    return true;
  });

  return intervals;
}


function mapToBlocks(image){
  // if (img.width < 128 || img.height < 128) return img; // needs error-handling
  const img = makeNewImage(image);
  const intervals = computeWindows(img);
  const result = Image.create(WINDOW_SIZE,WINDOW_SIZE,[0,0,0]);

  let xCounter = 0, yCounter = 0;

  intervals.forEach(interval=>{
    const avg = getWindowAverage(img,interval);
    const block = getClosestBlock(avg);
    const color = block[1];
    // fs.appendFileSync("image_blocks.csv",block[0].toString()+"\n");

    if (yCounter === WINDOW_SIZE) {
      xCounter += 1;
      yCounter = 0;
    }

    result.setPixel(xCounter,yCounter,color);       
    
    yCounter+=1;
  });
  result.save("pookie");
  return result;
}

function makeNewImage(img){
  const WINDOW_WIDTH = Math.floor(img.width/WINDOW_SIZE)*WINDOW_SIZE;
  const WINDOW_HEIGHT = Math.floor(img.width/WINDOW_SIZE)*WINDOW_SIZE;

  const xDiff = (img.width - WINDOW_WIDTH)/2;
  const yDiff = (img.width - WINDOW_WIDTH)/2;

  let xMin = xDiff;
  let yMin = yDiff;

  let xMax = WINDOW_WIDTH + xDiff;
  let yMax = WINDOW_HEIGHT + yDiff;

  const result = Image.create(xMax-xMin,yMax-yMin,[0,0,0]);

  
  let i = xMin, j = yMin;
  let x = 0, y = 0;
  while (i<img.width){
    while (j<img.height){
      if ( (i>=xMin && i<xMax) && (j>=yMin && j<yMax)) {
        result.setPixel(x,y,img.getPixel(i,j));
      }
      j+=1;
      y+=1;
    }
    j = yMin;
    i+=1;

    y = 0;
    x+=1;
  }

  return result;

}

exports.makeNewImage = makeNewImage;
exports.computeWindows = computeWindows;
exports.mapToBlocks = mapToBlocks;