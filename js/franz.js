/*  Franz.js - Client side color swatches (awesomeness)
 *  
 *  @Author Ryan McGrath (http://twitter.com/ryanmcgrath)
 *  @Author Dominick Pham (http://twitter.com/enotionz)
 */

if(!Array.prototype.swap) {
    Array.prototype.swap = function(a, b) {
	    var tmp = this[a];
	    this[a] = this[b];
	    this[b] = tmp;
        return true; /* For the sake of being complete */
    }
}

var franz = function(franzProps) {
	/* 	new franz({
			canvas: "canvas_id",
			src: "image_src",
			callback: fn() { ... }
		});
		
		Stores a reference to our canvas and the canvas context for future use. Accepts
		an optional callback function to tie this into further methods.
		
		Note: Since there's no way to get the type of <canvas> support we need in Internet Explorer,
		we actually branch the codepath here - IE gets a small flash applet that handles pulling color data out. We additionally serve
		this if, for some reason, <canvas> support is lacking or broken in newer browser (or Firefox 2, etc).
		
		The data is still parsed via JS by using externalInterface() callbacks into the Flash applet, so it's safe to
		assume that anything occuring after getColors() is back in global-browser-use land.
	*/
	this.canvas_id = franzProps.canvas;
	if(typeof document.getElementById(franzProps.canvas).getContext === "function") {
		/* Canvas is natively supported, go down the normal path... */
		this.canvas = document.getElementById(franzProps.canvas);
		this.ctx = this.canvas.getContext('2d');
		if(typeof franzProps.callback !== "undefined" && typeof franzProps.callback === "function") franzProps.callback();
	} else {
		/* 	We're dealing with something that belongs in an old folks home; throw in the life support. (Embed Flash junk) :(
			Inject SWFObject so we can deal with Flash embedding in a sane manner...
		*/
		if(typeof swfobject === "undefined") {
			var newScript = document.createElement("script");
			newScript.type = "text/javascript";
			newScript.src = "/js/swfobject.js";
			document.body.appendChild(newScript);

			if(typeof franzProps.callback !== "undefined" && typeof franzProps.callback === "function") {
				// Catch the callback function for IE...
				newScript.onreadystatechange = function() {
					if(newScript.readyState == "loaded" || newScript.readyState == "complete") franzProps.callback();
					return false;
				}

				// Catch all other misguided browsers, just in case (Really old versions of Safari that don't have good <canvas> support will fail totally, but that's far too much to care about)
				newScript.onload = function() {
					franzProps.callback();
					return false;
				}
			}
			return false;
		}
		// If swfobject was already appended once, just catch the callback and run
		if(typeof franzProps.callback !== "undefined" && typeof franzProps.callback === "function") franzProps.callback();
	}
}

franz.prototype = {	
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
	
	loadImg: function(img_src) {
		/* If you're looking for the non-<canvas> portion of this, check the associated Flash files. */
		var working = this;
        working.img = new Image();
		working.img.onload = function() {
            working.ctx.drawImage(working.img, 0, 0, 100, 100);
			setTimeout(function() { working.getColors(); }, 100);
		}
		working.img.src = img_src;
	},

	getColors: function() {
		/* If you're looking for the non-<canvas> portion of this, check the associated Flash files. */
        var hidden_canvas = document.getElementById("lol_hidden"),
            extra_ctx = hidden_canvas.getContext('2d');
        
        extra_ctx.drawImage(this.img, 0, 0, 33, 33);
		var imageData = extra_ctx.getImageData(1, 1, 32, 32).data;

        for(var i = 0; i*4 < imageData.length; i++) {
            this.red[i] = imageData[i*4];
            this.green[i] = imageData[i*4 + 1];
            this.blue[i] = imageData[i*4 + 2];
			this.alpha[i] = imageData[i*4 + 3];
        }

		/* get hue sat val array */
		this.RGBtoHSVHL();

		/* show original image */
		this.displayImg();
		
		return false;
	},
	
	/* Converts RGB to the Hue/Saturation/Value, Saturation/Lightness model */
	RGBtoHSVHL: function() {
		var min, max;
		
		for(var i = 0; i < this.alpha.length; i++) {
			this.value[i] = this.getValHSV(this.red[i], this.green[i], this.blue[i]);
			this.satV[i] = this.getSatHSV(this.red[i], this.green[i], this.blue[i]);
			this.hue[i] = this.getHue(this.red[i], this.green[i], this.blue[i]);
			
			this.satL[i] = this.getSatHSL(this.red[i], this.green[i], this.blue[i]);
			this.light[i] = this.getLightHSL(this.red[i], this.green[i], this.blue[i]);
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
		    lightness = this.getLightHSL(),
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
		console.log("displaying colors");
        var docStr = "";
		
        for(var i = 0; i < this.alpha.length; i++) {
			docStr += '<div class="color_boxd" style="background-color: rgb(' + this.red[order_array[i]] + ', ' + this.green[order_array[i]] + ',' + this.blue[order_array[i]] + ');"></div>';
        }

        document.getElementById("log_colors").innerHTML = docStr;
        if(typeof jQuery !== "undefined") {
            $("#container_bottom").fadeIn("fast");
            setTimeout(function() { $("#testLayout").fadeIn("slow"); }, 500);
        }
        else document.getElementById("container_bottom").style.display = "block";
		
		return false;
	},

	displayImg: function() {
		this.resetIndex();
		this.displayColors(this.origIndex);
		return false;
	},
	
    displayHue: function() {
		this.indexSort(franz.util.clone(this.hue), 0, this.alpha.length);
		this.displayColors(this.origIndex);
		return false;
	},
	
    displaySat: function() {
		this.indexSort(franz.util.clone(this.satV), 0, this.alpha.length);	
		this.displayColors(this.origIndex);
		return false;
	},
	
    displayVal: function() {
		this.indexSort(franz.util.clone(this.value), 0, this.alpha.length);	
		this.displayColors(this.origIndex);
		return false;
	},
	
    displaySatL: function() {
		this.indexSort(franz.util.clone(this.satL), 0, this.alpha.length);	
		this.displayColors(this.origIndex);
		return false;
	},
	
    displayLight: function() {
		this.indexSort(franz.util.clone(this.light), 0, this.alpha.length);	
		this.displayColors(this.origIndex);
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
			densityArray[i] = count;
		}
		
		return densityArray;
	},
	
	/* bubble sort floats around and pops in your face */
	indexSort: function(inputArray, start, end) {
		this.resetIndex();
		for (var i = start; i < end;  i++) {
			for (var j = end-1; j >= start; j--) {
				var diff = inputArray[j] - inputArray[i]
				if (diff > 0) {
					inputArray.swap(i,j+1);
					this.origIndex.swap(i,j+1);
				}
			}
		}
	},
	
	resetIndex: function() {
		/* keep track of original index so we don't have to revert back to RGB just to display output */
		for(var i = 0; i < this.alpha.length; i++) {
            this.origIndex[i] = i;
		}
		return false;
	}
}

franz.util = {
	clone: function(obj) {
		/* Utility function for deep cloning */
		if(typeof obj !== "undefined") {
            var returnObj = (obj instanceof Array) ? [] : {};
    
            for(i in obj) {
                if(obj[i] != null && typeof obj[i] == "object") {
                    returnObj[i] = franz.util.clone(obj[i]);
                } else {
                    returnObj[i] = obj[i];
                }
            }

            return returnObj;
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
