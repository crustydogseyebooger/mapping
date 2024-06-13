// Wait until the file input is changed
document.getElementById("image_input").onchange = function() {
    const reader = new FileReader();
    reader.onload = function() {
      const image = new Image();
      image.onload = function() {
          // Create canvas which will the image to be modified
        const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
        
        // Set canvas size to image size
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        
        // Add circle
        ctx.beginPath();
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.fill();
        
        // Display the canvas for visualizing purposes
        document.body.appendChild(canvas);
        
          // Set the motified image to be content when the form is submited. 
        document.getElementById("modified_image").value = canvas.toDataURL("image/jpg");      
      }
      image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
  };