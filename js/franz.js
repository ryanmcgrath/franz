/*  Franz.js - Client side color swatches (awesomeness)
 *  
 *  @Author Ryan McGrath (http://twitter.com/ryanmcgrath)
 *  @Author Dominick Pham (http://twitter.com/enotionz)
 */

/* Define some basic prototypes that we'll require later.. */

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
	
	alpha: [],
	red: [],
	green: [],
	blue: [],
	
	hue: [],
	satV: [],
	value: [],
	satL: [],
	light: [],

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
        
        extra_ctx.drawImage(franz.img, 0, 0, 33, 33);
		var imageData = extra_ctx.getImageData(1, 1, 32, 32).data;

        for(var i = 0; i*4 < imageData.length; i++) {
            franz.red[i] = imageData[i*4];
            franz.green[i] = imageData[i*4 + 1];
            franz.blue[i] = imageData[i*4 + 2];
			franz.alpha[i] = imageData[i*4 + 3];
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
		
		for(var i = 0; i < franz.alpha.length; i++) {
			franz.value[i] = franz.getValHSV(franz.red[i],franz.green[i],franz.blue[i]);
			franz.satV[i] = franz.getSatHSV(franz.red[i],franz.green[i],franz.blue[i]);
			franz.hue[i] = franz.getHue(franz.red[i],franz.green[i],franz.blue[i]);
			
			franz.satL[i] = franz.getSatHSL(franz.red[i],franz.green[i],franz.blue[i]);
			franz.light[i] = franz.getLightHSL(franz.red[i],franz.green[i],franz.blue[i]);
		}
		
		return false
	},

	getHue: function(red, green, blue) {
		var min = Math.min(red, Math.min(green, blue)),
            max = Math.max(red, Math.max(green, blue)), 
            delta = max - min, 
            hue;
		
        if (max == min)
			return 0;
		else {
			if(red == max)
				hue = (green - blue) / delta;	//between yellow & magenta
			else if(green == max)
				hue = 2 + (blue - red) / delta;	//between cyan & yellow
			else
				hue = 4 + (red - green) / delta;	//between magenta & cyan
			
			// hue degrees
			hue = hue * 60;
			if(hue < 0) hue += 360;
		}
		
		return hue;
	},
	
    getSatHSV: function(red, green, blue) {
		var min = Math.min(red, Math.min(green, blue)), 
            max = Math.max(red, Math.max(green, blue)),
            delta = max - min, 
            sat = delta / max;
		
		return sat;
	},
	
	getValHSV: function(red, green, blue) { return Math.max(red, Math.max(green,blue)); },
	
	getSatHSL: function(red, green, blue) {
		var min = Math.min(red, Math.min(green, blue)), 
            max = Math.max(red, Math.max(green, blue)), 
		    lightness = franz.getLightHSL(),
            sat;
		
		if(min == max) return 0;
		
		if(lightness < 1/2)	sat = (max-min)/(max+min);
		else sat = (max - min) / (2 - (max + min));
		
		return sat;		
	},
	
	getLightHSL: function(red, green, blue) {
		var min = Math.min(red, Math.min(green, blue)), 
            max = Math.max(red, Math.max(green, blue));
		return 0.5 * (min + max);
	},
	
	displayColors: function(order_array) {
        var docStr = "";
		
        for(var i = 0; i < franz.alpha.length; i++) {
			docStr += '<div class="color_boxd" style="background-color: rgb(' + franz.red[order_array[i]] + ', ' + franz.green[order_array[i]] + ',' + franz.blue[order_array[i]] + ');"></div>';
        }

        document.getElementById("log_colors").innerHTML = docStr;
        if(typeof jQuery != "undefined") {
            $("#container_bottom").fadeIn("fast");
            setTimeout(function() { $("#testLayout").fadeIn("slow"); }, 500);
        }
        else document.getElementById("container_bottom").style.display = "block";
		
		return false;
	},

	resetIndex: function() {
		/* keep track of original index so we don't have to revert
		back to RGB just to display output */
		for (var i=0; i < franz.alpha.length; i++) {
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
		franz.indexSort(franz.clone(franz.hue), 0, franz.alpha.length);
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displaySat: function() {
		franz.indexSort(franz.clone(franz.satV), 0, franz.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displayVal: function() {
		franz.indexSort(franz.clone(franz.value), 0, franz.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displaySatL: function() {
		franz.indexSort(franz.clone(franz.satL), 0, franz.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},
	
    displayLight: function() {
		franz.indexSort(franz.clone(franz.light), 0, franz.alpha.length);	
		franz.displayColors(franz.origIndex);
		return false;
	},	
	
	/* calculates density of array data given interval and step size - both controlling data error
		step size should ideally be < interval. Returns array with (# of intervals) as size */
	getDensity: function(inputArray, step, interval, max) {
		var size = max/step;
		var densityArray = new Array(size);
		
		for (var i=0; i < size; i++) {
			var count = 0;
			
			for (var j=0; j < inputArray.length; j++) {
				// if entry is within current interval
				if ((inputArray[j] > i*step) && (inputArray[j] < i*step + interval)){
					count++;
				}
			}
			console.log("frequency of values between " + i*step + " and " + (i*step + interval) + " = " + count);
			densityArray[i] = count;
		}
		
		return densityArray;
	},
	
	/* bubble sort floats around and pops in your face */
	indexSort: function(inputArray, start, end) {
		franz.resetIndex();
		for (var i = start; i < end;  i++) {
			for (var j = end-1; j >= start; j--) {
				var diff = inputArray[j] - inputArray[i]
				if (diff > 0) {
					inputArray.swap(i,j+1);
					franz.origIndex.swap(i,j+1);
				}
			}
		}
	},
	
    RGBtoHex: function(rgb) {
        var hex = [];

        if(rgb[3] == 0) return 'transparent';
        
        for(var i = 0; i < 3; i++) {
            var bit = (rgb[i] - 0).toString(16);
            hex.push(bit.length == 1 ? ('0' + bit) : bit);
        }
        
        return '#' + hex.join('');
    }
}
