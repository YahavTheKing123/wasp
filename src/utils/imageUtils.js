export function getBase64Image(img) {
    
    img.crossOrigin = "anonymous";
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/jpeg");    
    return dataURL.replace("data:image/jpeg;base64,", "")
    
    //var qq = ctx.getImageData(0, 0, img.width, img.height);
    //var ww = btoa(String.fromCharCode.apply(null, new Uint8Array(qq))); 
    //return  ww;
}