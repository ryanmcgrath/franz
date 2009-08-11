var franz = {
	canvas: {},
	ctx: {},
    img: {},
    final_colors: [],
	red: [],
	green: [],
	blue: [],
	alpha: [],
	hue: [],
	sat: [],
	val: [],
	origIndex: [],

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
            extra_ctx = hidden_canvas.getContext('2d');
        
        extra_ctx.drawImage(franz.img, 0, 0, 19, 19);
		var imageData = extra_ctx.getImageData(1, 1, 18, 18).data;

        console.log("Initial data array: " + imageData.length);

        for(var i = 0; i*4 < imageData.length; i++) {
            franz.red[i] = imageData[i*4];
            franz.green[i] = imageData[i*4 + 1];
            franz.blue[i] = imageData[i*4 + 2];
			franz.alpha[i] = imageData[i*4 + 3];
        }
		
		/* get hue sat val array */
		franz.RGBtoHSV();

		/* show original image */
		franz.displayImg();
		
		return false;
	},

	displayImg: function() {
		var docString = "";
		
		for(var i = 0; i < franz.alpha.length; i++) {
			docString += '<div class="color_box" style="background-color: rgb(' + franz.red[i] + ', ' +  franz.green[i] + ',' + franz.blue[i] + ');"></div>';
		}
        
        document.getElementById("log_colors").innerHTML = docString;
        $("#container_bottom").fadeIn("slow");
		
		return false;
	},
	
	/* Converts RGB to the Hue/Saturation/Value model */
	RGBtoHSV: function() {
		var min, max, delta;
		
		for(var i = 0; i < franz.alpha.length; i++) {
			
			min = Math.min(franz.red[i],Math.min(franz.green[i],franz.blue[i]));
			max = Math.max(franz.red[i],Math.max(franz.green[i],franz.blue[i]));
			franz.val[i] = max;
            console.log(franz.val[i]);
			
			delta = max - min;
			
			if (max != 0)
				franz.sat[i] = delta / max;
			else {
				// max val is 0, you have black
				franz.sat[i] = 0;
				franz.hue[i] = -1;
				return;
			}
			
			if (franz.red[i] == max)
				franz.hue[i] = ( franz.green[i] - franz.blue[i]) / delta;	//between yellow & magenta
			else if (franz.green[i] == max)
				franz.hue[i] = 2 + (franz.blue[i] - franz.red[i]) / delta;	//between cyan & yellow
			else
				franz.hue[i] = 4 + (franz.red[i] - franz.green[i]) / delta;	//between magenta & cyan
			
			// hue degrees
			franz.hue[i] = franz.hue[i] * 60;
			if (franz.hue[i] < 0)		franz.hue[i] += 360;
		}
	},
	
	displayHue: function() {	
		var docString = "";
		
		/* keep track of original index so we don't have to revert
			back to RGB just to display output */
		for (var i=0; i < franz.alpha.length; i++) {
			franz.origIndex[i] = i;
		}
		
		franz.qsort(franz.hue, 0, franz.hue.length);
		
		for(var i = 0; i < franz.alpha.length; i++) {
			docString += '<div class="color_box" style="background-color: rgb(' + franz.red[franz.origIndex[i]] + ', ' +  franz.green[franz.origIndex[i]] + ',' + franz.blue[franz.origIndex[i]] + ');"></div>';
		}
        
        document.getElementById("log_colors").innerHTML = docString;
        $("#container_bottom").fadeIn("slow");
		
		return false;
	},
	
	displaySat: function() {	
		var docString = "";
		
		/* keep track of original index so we don't have to revert
			back to RGB just to display output */
		for (var i=0; i < franz.alpha.length; i++) {
			franz.origIndex[i] = i;
		}
		
		franz.qsort(franz.sat, 0, franz.sat.length);
		
		for(var i = 0; i < franz.alpha.length; i++) {
			docString += '<div class="color_box" style="background-color: rgb(' + franz.red[franz.origIndex[i]] + ', ' +  franz.green[franz.origIndex[i]] + ',' + franz.blue[franz.origIndex[i]] + ');"></div>';
		}
        
        document.getElementById("log_colors").innerHTML = docString;
        $("#container_bottom").fadeIn("slow");
		
		return false;
	},
	
	displayVal: function() {	
		var docString = "";
		
		/* keep track of original index so we don't have to revert
			back to RGB just to display output */
		for (var i=0; i < franz.alpha.length; i++) {
			franz.origIndex[i] = i;
		}
		
		franz.qsort(franz.val, 0, franz.val.length);
		
		for(var i = 0; i < franz.alpha.length; i++) {
			docString += '<div class="color_box" style="background-color: rgb(' + franz.red[franz.origIndex[i]] + ', ' +  franz.green[franz.origIndex[i]] + ',' + franz.blue[franz.origIndex[i]] + ');"></div>';
		}
        
        document.getElementById("log_colors").innerHTML = docString;
        $("#container_bottom").fadeIn("slow");
		
		return false;
	},
	
	
	/* quicksort algorithm with that also swaps original index */
	sort_Partition: function(array, begin, end, pivot) {
		var piv=array[pivot];
		array.swap(pivot, end-1);
		franz.origIndex.swap(pivot, end-1);
		var store=begin;
		var ix;
		for(ix=begin; ix<end-1; ++ix) {
			if(array[ix]<=piv) {
				array.swap(store, ix);
				franz.origIndex.swap(store, ix);
				++store;
			}
		}
		array.swap(end-1, store);
		franz.origIndex.swap(end-1, store);

		return store;
	},
	
	qsort: function(array, begin, end) {
		if(end-1>begin) {
			var pivot=begin+Math.floor(Math.random()*(end-begin));

			pivot=franz.sort_Partition(array, begin, end, pivot);

			franz.qsort(array, begin, pivot);
			franz.qsort(array, pivot+1, end);
		}
	}
	
}

/* define swap method for Array object */
Array.prototype.swap=function(a, b)
{
	var tmp=this[a];
	this[a]=this[b];
	this[b]=tmp;
}
