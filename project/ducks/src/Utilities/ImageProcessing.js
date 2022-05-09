// can be used to paint a texture 

class ImageProcessing {

    static imageToImageData(image) {
        // turn it into image data by building a complete canvas and sampling it
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        let data = ctx.getImageData(0, 0, image.width, image.height);
        canvas.parentNode?.removeChild(canvas);
        return data;
    }
    
    static paintImage(width, height, paintCallback) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
      
        paintCallback(canvas, ctx);

        return ctx.getImageData(0,0,width, height);
        
        // var image = new Image();
        // image.src = canvas.toDataURL("image/png");
       
        // return new Promise(function (resolve, reject) {
        //     image.onload = () => resolve(image);
        //     image.onerror = () => reject(new Error(`could not convert image data to image`));
        // });
    }
    
    static async imageDataToImage(imagedata) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
    
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
       
        return new Promise(function (resolve, reject) {
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`could not convert image data to image`));
        });
    }
}