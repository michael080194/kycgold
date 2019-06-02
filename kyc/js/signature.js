function signature(){
    var Signature = cordova.require('nl.codeyellow.signature.Signature');
    Signature.getSignature(
        function (imgData) {
           /* This is the "success" callback. */
           screen.orientation.lock('portrait'); // 直                 
           if (!imgData) return; // User clicked cancel, we got no image data.
            var myCanvas = document.getElementById('myCanvas'),
            ctx = myCanvas.getContext('2d');
            myCanvas.width = imgData.width;
            myCanvas.height = imgData.height;
            ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
            ctx.putImageData(imgData, 0, 0);
            convertCanvasToImage(myCanvas);
        }, function (msg) {
           /* This is the "error" callback. */
            alert('Could not obtain a signature due to an error: '+msg);
        },
        {
            title: 'Please put your signature down below',
        });
}    


function convertCanvasToImage(subCanvas) {
    var image = document.getElementById('singnatureImg2');
    // image.src = "https://cdn.framework7.io/placeholder/nature-500x500-1.jpg";
    // $$('#singnatureImg2').attr("data-src","");    
    // $$('#singnatureImg2').attr("data-src",subCanvas.toDataURL("image/png"));
    image.src = subCanvas.toDataURL("image/png");
	return image;
}