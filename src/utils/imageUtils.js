export function getBase64Image(img) {
    let dataURL = null;
    if (img.naturalWidth && img.naturalHeight) {
        // Create an empty canvas element
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Copy the image contents to the canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        dataURL = canvas.toDataURL("image/jpeg");
    } else {
        alert('error: captured image height or width size is 0');
    }

    return dataURL;
}