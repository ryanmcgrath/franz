var franz = {
	canvas: {},
	ctx: {},
    img: {},
    final_colors: [],

	init: function(canvas_id) {
		franz.canvas = document.getElementById(canvas_id);
		franz.ctx = franz.canvas.getContext('2d');
		return false;
	},

	loadImg: function(img_src) {
		franz.img = new Image();
		franz.img.onload = function() {
            franz.ctx.drawImage(franz.img, 0, 0, 100, 100);
			setTimeout(function() { franz.getColors(); }, 100);
		}
		franz.img.src = img_src;
		return false;
	},

	getColors: function() {
        var hidden_canvas = document.getElementById("lol_hidden"),
            extra_ctx = hidden_canvas.getContext('2d'),
            docString = "";
        
        extra_ctx.drawImage(franz.img, 0, 0, 19, 19);
		var imageData = extra_ctx.getImageData(1, 1, 18, 18).data,
            arr = [];
       
        for(var i = 0; i < imageData.length; i = i + 4) {
            arr[0] = imageData[i];
            arr[1] = imageData[i + 1];
            arr[2] = imageData[i + 2];
            // Ugly 4AM method, don't ask
            docString += '<div class="color_box" style="background-color: rgb(' + arr[0] + ', ' +  arr[1] + ',' + arr[2] + ');"></div>';
        }
        
        document.getElementById("log_colors").innerHTML = docString;
        $("#container_bottom").fadeIn("slow");
        return false;
	}
}
