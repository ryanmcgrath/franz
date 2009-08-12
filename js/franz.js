/*  Franz.js - Client side color swatches (awesomeness)
 *  
 *  @Author Ryan McGrath (http://twitter.com/ryanmcgrath)
 *  @Author Dominick Pham (http://twitter.com/enotionz)
 */

/* Define some basic prototypes that we'll require later... */

Array.prototype.swap = function(a, b) {
	var tmp = this[a];
	this[a] = this[b];
	this[b] = tmp;
    return true; /* For the sake of being complete */
}

/* Franz - this is where the magic happens, pay close attention. ;) */
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

    clone: function(obj) {
        /* Recursively iterate through objects and clone them (Don't even try to put this on the Object prototype (recursion fail)) */
        var returnObj = (obj instanceof Array) ? [] : {};
    
        for(i in obj) {
            if(i == 'clone') continue;
            if(obj[i] != null && typeof obj[i] == "object") {
                returnObj[i] = franz.clone(obj[i]);
            } else {
                returnObj[i] = obj[i];
            }
        }

        return returnObj;
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
			franz.val[i] = franz.getValHSV(franz.red[i],franz.green[i],franz.blue[i]);
			franz.sat[i] = franz.getSatHSV(franz.red[i],franz.green[i],franz.blue[i]);
			franz.hue[i] = franz.getHueHSV(franz.red[i],franz.green[i],franz.blue[i]);
		}
		
		return false
	},
	
	getValHSV: function(red, green, blue) { return Math.max(red,Math.max(green,blue)); },
	
    getSatHSV: function(red, green, blue) {
		var min, max, delta, sat;
		
		min = Math.min(red,Math.min(green,blue));
		max = Math.max(red,Math.max(green,blue));
		delta = max - min;
		sat = delta / max;
		
		return sat;
	},

	getHueHSV: function(red,green,blue) {
		var min, max, delta, hue;
		
		min = Math.min(red,Math.min(green,blue));
		max = Math.max(red,Math.max(green,blue));
		delta = max - min;
		
        if (max == 0)
			return -1;
		else {
			if (red == max)
				hue = (green - blue) / delta;	//between yellow & magenta
			else if (green == max)
				hue = 2 + (blue - red) / delta;	//between cyan & yellow
			else
				hue = 4 + (red - green) / delta;	//between magenta & cyan
			
			// hue degrees
			hue = hue * 60;
			if (hue < 0) hue += 360;
		}
		
		return hue;
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
		return false;
	}
	
}
