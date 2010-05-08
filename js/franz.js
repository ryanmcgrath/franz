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
	if(typeof document.createElement("canvas").getContext === "function") {
		/* Canvas is natively supported, go down the normal path... append a new canvas off the viewport and draw our image onto it */
		this.src = franzProps.src;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 100;
        this.canvas.height = 100;
        this.canvas.style.visibility = "hidden";
        this.canvas.style.position = "absolute";
        this.canvas.style.top = 0 + "px";
        this.canvas.style.left = "-" + 1000 + "px";
		this.ctx = this.canvas.getContext('2d');

        var that = this;
        franz.util.loadEvent(function() {
            document.body.appendChild(that.canvas);
            typeof that.canvas_id !== 'undefined' ? that.draw(that.canvas_id) : that.draw();
            if(typeof franzProps.callback !== "undefined" && typeof franzProps.callback === "function") franzProps.callback();
        });
	} else {
		/* 	We're dealing with something that belongs in an old folks home; throw in the life support. (Embed Flash junk) :(
			Inject SWFObject so we can deal with Flash embedding in a sane manner...
		*/
		if(typeof swfobject === "undefined") {
			var newScript = document.createElement("script");
			newScript.type = "text/javascript";
			newScript.src = "/js/swfobject.js";
			document.getElementsByTagName("head")[0].appendChild(newScript);

			if(typeof franzProps.callback !== "undefined" && typeof franzProps.callback === "function") {
				// Catch the callback function for IE...
				newScript.onreadystatechange = function() {
					if(newScript.readyState == "loaded" || newScript.readyState == "complete") franzProps.callback();
					return false;
				};

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
    rgba: [],
    hsb: [],
    hsl: [],
    
    extra_canvas: null,
    extra_ctx: null,
	
	draw: function(different_canvas) {
		/* If you're looking for the non-<canvas> portion of this, check the associated Flash files. */
		if(typeof different_canvas !== "undefined" && typeof different_canvas === "string") {
            this.extra_canvas = document.getElementById(different_canvas);
            this.extra_ctx = this.extra_canvas.getContext('2d');
        }

        var working = this;
        working.img = new Image();
		working.img.onload = function() {
            (working.extra_ctx === null ? working.ctx : working.extra_ctx).drawImage(working.img, 0, 0, 100, 100);
			setTimeout(function() { working.getColors(); }, 100);
		};
		working.img.src = this.src;
	},

	getColors: function() {
		/* If you're looking for the non-<canvas> portion of this, check the associated Flash files. */
        var hidden_canvas = document.getElementById("lol_hidden"),
            extra_ctx = hidden_canvas.getContext('2d');

        extra_ctx.drawImage(this.img, 0, 0, 33, 33);
		var imageData = extra_ctx.getImageData(1, 1, 32, 32).data;

        for(var i = 0; i*4 < imageData.length; i++) {
            this.rgba[i] = new Array(4);
            this.rgba[i][0] = imageData[i*4];            
            this.rgba[i][1] = imageData[i*4 + 1];
            this.rgba[i][2] = imageData[i*4 + 2];
			this.rgba[i][3] = imageData[i*4 + 3];
        }

		/* get hue sat val array */
		this.getHSB();

		/* show original image */
		this.displayImg();
		
		return false;
	},
	
	/* Converts RGB to the Hue/Saturation/Brightness*/
	getHSB: function() {
        if ( this.rgba.length > 0 ){
            for(var i = 0; i < this.rgba.length; i++) {
                this.hsb[i] = franz.util.RGBtoHSB(this.rgba[i]);
                this.hsb[i][3] = i;     /* this is to keep the original index reference to the rgb domain */
            }
            return true;
        } else { return false; }
	},

	displayColors: function(order_array) {
        var docStr = "";
        if (typeof order_array === 'undefined'){
            for(var i = 0; i < this.rgba.length; i++) {
                docStr += '<div class="color_boxd" style="background-color: rgb(' + this.rgba[i][0] + ', ' + this.rgba[i][1] + ',' + this.rgba[i][2] + ');"></div>';
            }
        } else {
            for(var i = 0; i < this.rgba.length; i++) {
                docStr += '<div class="color_boxd" style="background-color: rgb(' + this.rgba[order_array[i]][0] + ', ' + this.rgba[order_array[i]][1] + ',' + this.rgba[order_array[i]][2] + ');"></div>';
            }
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
		this.displayColors();
		return false;
	},

    displayHue: function() { this.sortArray(this.hsb,0); this.displayOut(this.hsb); },
    displaySat: function() { this.sortArray(this.hsb,1); this.displayOut(this.hsb);},
    displayBright: function() { this.sortArray(this.hsb,2); this.displayOut(this.hsb);},
    displayOut: function(array) {
        var index = [];
        for(var i=0;i<array.length;i++){index[i] = array[i][3];}    /* rebuilding index */
		this.displayColors(index);
		return false;
    },

    /* array should be a (rgba.length)x4 2d array where position 0,1, or 2
        eg: pass in hsb ==>  hsb[] = [h,s,b,index][]
        position = 0   --->  sort by hue
        position = 1   --->  sort by saturation
        position = 2   --->  sort by brightness
     */
    sortArray: function(array,position) {
        array.sort(function(a,b){ return a[position] - b[position]; });
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
	}
}

franz.util = {

    RGBtoHSB: function(rgb) {
        var hsb = new Array(3);
        var min = Math.min(rgb[0], Math.min(rgb[1], rgb[2])),
            max = Math.max(rgb[0], Math.max(rgb[1], rgb[2])),
            delta = max - min;

        hsb[0] = this.getHue(rgb,min,max,delta); /* hue */
        hsb[1] = delta/max; /* saturation */
        hsb[2] = max;   /* brightness */
        return hsb;
    },

    RGBtoHSL: function(rgb) {
        var min = Math.min(rgb[0], Math.min(rgb[1], rgb[2])),
            max = Math.max(rgb[0], Math.max(rgb[1], rgb[2])),
            delta = max-min;
        var hsl = new Array(3), sat, lightness = 0.5*(min + max);

		if(min == max) sat = 0;
		if(lightness < 1/2)	sat = (max-min)/(max+min);
		else sat = (max - min) / (2 - (max + min));

        hsl[0] = this.getHue(rgb,min,max,delta); /* hue */
        hsl[1] = sat; /* saturation */
        hsl[2] = lightness;   /* lightness */
        return hsl;
    },

    /* hue is shared for both hsl and hsv */
    getHue: function(rgb,min,max,delta) {
        var hue; 
        if (max === min) { return 0; } else {
			if(rgb[0] === max)
				hue = (rgb[1] - rgb[2]) / delta;	//between yellow & magenta
			else if(rgb[1] === max)
				hue = 2 + (rgb[2] - rgb[0]) / delta;	//between cyan & yellow
			else
				hue = 4 + (rgb[0] - rgb[1]) / delta;	//between magenta & cyan

			// hue degrees
			hue = parseInt(hue * 60);
			if(hue < 0) hue += 360;
		}
        return hue;
    },

    RGBtoHex: function(rgb) {
        var hex = [];

        if(rgb[3] == 0) return 'transparent';
        
        for(var i = 0; i < 3; i++) {
            var bit = (rgb[i] - 0).toString(16);
            hex.push(bit.length == 1 ? ('0' + bit) : bit);
        }
        
        return '#' + hex.join('');
    },

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
    
    loadEvent: function(func) {
		if(typeof jQuery != "undefined") jQuery(document).ready(function() { func(); });
		else franz.util.fallback_loadEvent(function() { func(); });
	},

	fallback_loadEvent: (function() {
        var load_events = [], load_timer, script, done, exec, old_onload,
			
	    init = function () {
            done = true;
		    clearInterval(load_timer);
            for(i = 0; i < load_events.length; i++) {
		        exec = load_events.shift(); 
                exec();
		    }
            if(script) script.onreadystatechange = '';
	    };
		
	    return function(func) {
	        if(done) return func();
		
            if(!load_events[0]) {
		        if(document.addEventListener) document.addEventListener("DOMContentLoaded", init, false);
		
				/*@cc_on @*/ /*@if (@_win32) // Fairly obvious who this is for...
				    document.write("<script id=__ie_onload defer src=//0><\/scr"+"ipt>");
					script = document.getElementById("__ie_onload");
					script.onreadystatechange = function() {
					    if (this.readyState == "complete") init(); // call the onload handler
					};
				/*@end @*/
		
				if(/WebKit/i.test(navigator.userAgent)) {
				    load_timer = setInterval(function() {
					    if (/loaded|complete/.test(document.readyState)) init(); 
					}, 10);
				}
		
				old_onload = window.onload;
				window.onload = function() {
				    init();
					if (old_onload) old_onload();
				};
			}
			load_events.push(func);
		}
	})()
}
