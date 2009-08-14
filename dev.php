<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Franz - client side color palettes from logos</title>
	<link rel="stylesheet" type="text/css" media="screen" href="css/example.css">
	<script type="text/javascript" src="js/dev.js"></script>
</head>
<body>

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
        <form method="post" action="#" id="franz_form" onsubmit="lol(); return false;">
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
	
	<!-- might log colors later on
	<ul id="logHSV">
		<li><p id="logHue">Hue: </p></li>
		<li><p id="logSat">Sat: </p></li>
		<li><p id="logVal">Val: </p></li>
	</ul> -->
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
    two of the most awesome people you'll ever hear about. 
</p>




    <script type="text/javascript">
        var img_input;

        /* Oh god a global function wrrrryyyy */
        function lol() {
            franz.loadImg(img_input.value);
			document.getElementById("options").style.display = "block";
			return false;
        }

            franz.init("lol");

            img_input = document.getElementById("img_input");
            				
            <?php /* This hack sucks, but it's worth it for right now. -- Ryan */
                if($_REQUEST["image"])
                    echo 'img_input.value = "awesome/' . $_REQUEST["image"] . '"; lol();';
            ?>

			document.getElementById("sort_hue").onclick = function() {
				franz.displayHue();
				return false;
			}; 
			
			document.getElementById("sort_sat").onclick = function() {
				franz.displaySat();
				return false;
			}; 
			
			document.getElementById("sort_val").onclick = function() {
				franz.displayVal();
				return false;
			};
            
            document.getElementById("sort_light").onclick = function() {
				franz.displayLight();
				return false;
			};
			
            document.getElementById("sort_satL").onclick = function() {
				franz.displaySatL();
				return false;
			};
    </script>


</body>
</html>
