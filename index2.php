<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Franz - client side color palettes from logos</title>
	<link rel="stylesheet" type="text/css" media="screen" href="css/example.css">
    <script type="text/javascript" src="http://images.webs.com/static/global/js/jquery/jquery-1.3.2.min.js"></script>
	<script type="text/javascript" src="js/franz.js"></script>
    <script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
    <script type="text/javascript">
        var img_input,
            layoutMods = $("#layoutMods");

        /* Oh god a global function wrrrryyyy */
        function lol() {
            franz.loadImg(img_input.value);
			$("#options").fadeIn("fast");
			return false;
        }

        $(document).ready(function() {
            franz.init("lol");

            img_input = document.getElementById("img_input");
		    $("#franz_form").submit(lol);
	
            $("#upload_button").click(function() {
                var f_form = $("#franz_form"),
                    uploader = $("#uploader");

                if(f_form[0].style.display == "none") {
                    uploader.hide();
                    f_form.fadeIn("slow");
                    $(this).html("Upload an image");
                } else {
                    f_form.hide();
                    uploader.fadeIn("slow");
                    $(this).html("Use an existing image?");
                }
                
                return false;
            });		
			
            $("#try_these a").click(function() {
				img_input.value = "awesome/" + $(this)[0].innerHTML;
				return false;
			}); 
		
            <?php /* This hack sucks, but it's worth it for right now. -- Ryan */
                if($_REQUEST["image"])
                    echo 'img_input.value = "awesome/' . $_REQUEST["image"] . '"; lol();';
            ?>

			$("#sort_hue").click(function() {
				franz.displayHue();
				return false;
			}); 
			
			$("#sort_sat").click(function() {
				franz.displaySat();
				return false;
			}); 
			
			$("#sort_val").click(function() {
				franz.displayVal();
				return false;
			});
            
            $("#sort_light").click(function() {
				franz.displayLight();
				return false;
			});
			
            $("#sort_satL").click(function() {
				franz.displaySatL();
				return false;
			});

            $(".color_boxd").live("mousedown", function(e) {
                var coords = {x: e.pageX, y: e.pageY};
                layoutMods.fadeIn("slow");
                //layoutMods.css({"top": coords.x + "px", "left": coords.y + "px"});
                /*
                // It's 4AM, and I'm tired. I'm not building a damned regular expression, so yeah, we'll multiple .replace() ;P
                alert("This hex color: " + franz.RGBtoHex($(this)[0].style.backgroundColor.replace(")", "").replace("rgb(", "").replace(" ", "").split(",")));
                */
            });
        
        });
    </script>
</head>
<body>

<div id="layoutMods">
    <a href="#" title="Set as background color">Main Background</a>
    <a href="#" title="Set as Header BG">Header Background</a>
    <a href="#" title="Set as Content BG">Content Background</a>
</div>

<div id="testLayout">
    <div id="testBanner">
        This is an example layout
    </div>
    <div id="testContent">
        <p>
            This is an example layout to test colors with.
        </p>
        <p>
            Click on a color to set it for one of these layout sections!
        </p>
    </div>
</div>

<h1>Franz - client side color swatches</h1>

<div id="container_top">
    <a href="#" title="Upload an image" id="upload_button">Upload an image</a>
    <div id="lol_container">
	    <canvas id="lol" width="100" height="100"></canvas>
        <canvas id="lol_hidden" width="33" height="33"></canvas>
    </div>

	<div id="interface">
		<form id="uploader" name="uploader" method="post" action="upload.php" enctype="multipart/form-data">
            <input id="file" type="file" name="dragonfruit">
            <input type="submit" class="img_submit" value="Upload and be awesome">
        </form>
        <form method="post" action="#" id="franz_form">
			<input type="text" id="img_input" value="awesome/lol.png">
			<input type="submit" class="img_submit" value="Go for it!">
		</form>
	    <p id="try_these"><strong>Try out:</strong>
            <a href="#" title="awesome/lol.png">lol.png</a>, 
            <a href="#" title="awesome/testjubs.jpg">testjubs.jpg</a>, 
            <a href="#" title="awesome/stars.jpg">stars.jpg</a>, 
            <a href="#" title="awesome/1600.jpg">1600.jpg</a>, 
            <a href="#" title="awesome/fallout.jpg">fallout.jpg</a>
        </p>
		
    </div>
	
</div>

<div id="options">
	<p id="hsv">
        <a href="#" id="sort_hue" title="Sort by Hue">Sort by Hue</a> 
        <a href="#" id="sort_sat" title="Sort by Saturation HSV">Saturation (HSV)</a>  
        <a href="#" id="sort_satL" title="Sort by Saturation HSL">Saturation (HSL)</a> 
        <a href="#" id="sort_val" title="Sort by Value">Value (HSV)</a> 
        <a href="#" id="sort_light" title="Sort by Lightness">Lightness (HSL)</a> 
    </p>
</div>

<div id="container_bottom">
    <div id="log_colors">

    </div>
</div>

<p id="footer">
    This experiment was brought to you in Technicolor (get it?) by <a href="http://twitter.com/ryanmcgrath" title="Ryan McGrath">Ryan McGrath</a> & <a href="http://twitter.com/enotionz" title="Dominick Pham">Dominick Pham</a>,
    two of the most awesome people you'll ever hear about. If you're interested in helping out,
    hit up Franz on <a href="http://github.com/ryanmcgrath/franz/tree/master" title="Franz on GitHub">GitHub</a>!

    <br><br>
    Brought to you (in part) by <a href="http://webs.com/" title="Webs.com - get a free website!">Webs.com</a>, the company that employs Ryan and Dominick, and graciously
    lets them experiment like this at work.
</p>

<script type="text/javascript">
    try { var pageTracker = _gat._getTracker("UA-9252411-2"); pageTracker._trackPageview(); } catch(err) {}
</script>

</body>
</html>
