// import { toAverage, getAverage, getCSV, getClosestBlock, computeWindows, mapToBlocks, getWindowAverage} from "./image_processing.js";
// const varName = require(locationName);


function previewFile() {
    const preview = document.querySelector("img");
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
  
    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        preview.src = reader.result;
      },
      false,
    );
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  
  var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src = (URL.createObjectURL(event.target.files[0]));
  };