/*  Franz.js - Client side color swatches (Texture library)
 *  
 *  @Author Ryan McGrath (http://twitter.com/ryanmcgrath)
 *  @Author Dominick Pham (http://twitter.com/enotionz)
 */

var texture = {
    /* Temporary, might be consolidated into main library down the road */
    ctx: {},
    canvas: {},

    /*  texture.draw()
     *
     *  @Param: drawingCanvas - id of the canvas to draw on
     *  @Param: baseImage - base image to use (generally a semi-transparent PNG)
     *  @Param: colorArray - array of colors to use in the texture (Right now, this only accepts two colors, primary and secondary)
    */
    draw: function(drawingCanvas, baseImage, colorArray) {
        texture.canvas = document.getElementById(drawingCanvas);
        texture.ctx = texture.canvas.getContext('2d');

		var img = new Image();
       
        img.onload = function() { 
            texture.ctx.fillStyle = colorArray[0];
            texture.ctx.fillRect(0, 0, 50, 50);
            texture.ctx.drawImage(img, 0, 0, 50, 50);
		}
		img.src = baseImage;
    }
}
