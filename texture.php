<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Franz - client side color palettes from logos</title>
	<link rel="stylesheet" type="text/css" media="screen" href="css/example.css">
	<script type="text/javascript" src="js/texture.js"></script>
</head>
<body>

<h1>Franz - client side color swatches (Texture testing)</h1>

<div id="container_top">
	    <canvas id="lol" width="50" height="50" style="-moz-border-radius: 0px;"></canvas>

        <!-- Horrible 2AM testing below, shutup -->
        <a href="#" title="Draw Texture" onclick="texture.draw('lol', 'img/test1.png', ['#333333', '#c9c9c9']); return false;" style="display: block; padding: 5px 5px 2px; position: absolute; top: 47%; right: 10%; background-color: #13905d; -moz-border-radius: 4px; color: #fff;">Draw Texture</a>
</div>

<p id="footer">
    This experiment was brought to you in Technicolor (get it?) by <a href="http://twitter.com/ryanmcgrath" title="Ryan McGrath">Ryan McGrath</a> & <a href="http://twitter.com/enotionz" title="Dominick Pham">Dominick Pham</a>,
    two of the most awesome people you'll ever hear about. If you're interested in helping out,
    hit up Franz on <a href="http://github.com/ryanmcgrath/franz/tree/master" title="Franz on GitHub">GitHub</a>!

    <br><br>
    Brought to you (in part) by <a href="http://webs.com/" title="Webs.com - get a free website!">Webs.com</a>, the company that employs Ryan and Dominick, and graciously
    lets them experiment like this at work.
</p>

</body>
</html>
