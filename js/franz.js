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

/* allows numeric sorting for built in js sort */
function sortNumber(a,b) { return a - b;}

/* Franz - this is where the magic happens, pay close attention. ;) */
var franz = {
	canvas: {},
	ctx: {},
    img: {},
	
	rgb: {
		alpha: [],
		red: [],
		green: [],
		blue: []
	},
	
	hsvl: {
		hue: [],
		satV: [],
		value: [],
		satL: [],
		light: []
	},	

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
            franz.rgb.red[i] = imageData[i*4];
            franz.rgb.green[i] = imageData[i*4 + 1];
            franz.rgb.blue[i] = imageData[i*4 + 2];
			franz.rgb.alpha[i] = imageData[i*4 + 3];
        }

		/* get hue sat val array */
		franz.RGBtoHSVHL();

		/* show original image */
		franz.displayImg();
		
		return false;
	},
	
	/* Converts RGB to the Hue/Saturation/Value, Saturation/Lightness model */
	RGBtoHSVHL: function() {
		var min, max;
		
		for(var i = 0; i < franz.rgb.alpha.length; i++) {
			franz.hsvl.value[i] = franz.getValHSV(franz.rgb.red[i],franz.rgb.green[i],franz.rgb.blue[i]);
			franz.hsvl.satV[i] = franz.getSatHSV(franz.rgb.red[i],franz.rgb.green[i],franz.rgb.blue[i]);
			franz.hsvl.hue[i] = franz.getHue(franz.rgb.red[i],franz.rgb.green[i],franz.rgb.blue[i]);
			
			franz.hsvl.satL[i] = franz.getSatHSL(franz.rgb.red[i],franz.rgb.green[i],franz.rgb.blue[i]);
			franz.hsvl.light[i] = franz.getLightHSL(franz.rgb.red[i],franz.rgb.green[i],franz.rgb.blue[i]);
		}
		
		return false
	},

	getHue: function(red,green,blue) {
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
	
    getSatHSV: function(red, green, blue) {
		var min, max, delta, sat;
		
		min = Math.min(red,Math.min(green,blue));
		max = Math.max(red,Math.max(green,blue));
		delta = max - min;
		sat = delta / max;
		
		return sat;
	},
	
	getValHSV: function(red, green, blue) { return Math.max(red,Math.max(green,blue)); },
	
	getSatHSL: function(red, green, blue) {
		var min, max, sat;
		var lightness = franz.getLightHSL();
		
		min = Math.min(red,Math.min(green,blue));
		max = Math.max(red,Math.max(green,blue));
		
		if (min == max)	return 0;
		
		if (lightness < 1/2)	sat = (max-min)/(max+min);
		else	sat = (max-min)/(2 - (max+min));
		
		return sat;		
	},
	
	getLightHSL: function(red, green, blue) {
		var min, max;
		min = Math.min(red,Math.min(green,blue));
		max = Math.max(red,Math.max(green,blue));
		return 1/2*(min+max);
	},
	
	/* routines to display color swatches */
	displayColors: function(order_array) {
		var docString = "";
		
		for(var i = 0; i < franz.rgb.alpha.length; i++) {
			docString += '<div class="color_box" style="background-color: rgb(' + franz.rgb.red[order_array[i]] + ', ' +  franz.rgb.green[order_array[i]] + ',' + franz.rgb.blue[order_array[i]] + ');"></div>';
		}
        
        document.getElementById("log_colors").innerHTML = docString;
        $("#container_bottom").fadeIn("slow");
		
		return false;
	},

	resetIndex: function() {
		/* keep track of original index so we don't have to revert
		back to RGB just to display output */
		for (var i=0; i < franz.rgb.alpha.length; i++) {
            franz.origIndex[i] = i;
		}
		return false;
	},

	displayImg: function() {
		franz.resetIndex();
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displayHue: function() {
		franz.bubbleSort(franz.clone(franz.hsvl.hue), 0, franz.rgb.alpha.length);
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displaySat: function() {
		franz.bubbleSort(franz.clone(franz.hsvl.satV), 0, franz.rgb.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displayVal: function() {
		franz.bubbleSort(franz.clone(franz.hsvl.value), 0, franz.rgb.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displaySatL: function() {
		franz.bubbleSort(franz.clone(franz.hsvl.satL), 0, franz.rgb.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displayLight: function() {
		franz.bubbleSort(franz.clone(franz.hsvl.light), 0, franz.rgb.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
	/* bubble sort */
	bubbleSort: function(inputArray, start, end) {
		franz.resetIndex();
		for (var i = start; i < end;  i++) {
			for (var j = start; j < end; j++) {
				var diff = inputArray[j] - inputArray[i]
				if (diff > 0) {
					inputArray.swap(i,j+1);
					franz.origIndex.swap(i,j+1);
				}
			}
		}
	},
	/* quicksort algorithm that also swaps an index array */
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
