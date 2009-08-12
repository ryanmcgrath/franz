<?php

// Current working directory, relative to root...
$directory_self = str_replace(basename($_SERVER['PHP_SELF']), '', $_SERVER['PHP_SELF']);

// Directory getting the uploaded file...
$uploadsDirectory = $_SERVER['DOCUMENT_ROOT'] . $directory_self . 'awesome/';

// Referring upload form. Could probably do this based on the request, but I'm lazy and can't recall how. STFU. >_>
$uploadForm = 'http://' . $_SERVER['HTTP_HOST'] . $directory_self . 'index.html';

// Self explanatory, I would think.
$fieldname = 'dragonfruit';

// Possible upload errors, have some fun here.
$errors = array(1 => 'WTF were you thinking? php.ini max file size was exceeded. Get with the program.',
                2 => 'You have *got* to be kidding me - you exceeded the maximum html form file size!',
                3 => 'Come on now, that file upload was only partial. (Try again)',
                4 => 'Uhh... hello? No file was attached.');

// Check with PHP's built-in uploading errors
($_FILES[$fieldname]['error'] == 0) or error($errors[$_FILES[$fieldname]['error']]);
    
// Make sure this was really an HTTP upload
@is_uploaded_file($_FILES[$fieldname]['tmp_name']) or error('Not an HTTP upload... (Go back and try again?)');
    
// Validation hack - just run it through getimagesize() ;)  
@getimagesize($_FILES[$fieldname]['tmp_name']) or error('Only image uploads are allowed. (Go back and try again)');
    
// We need a unique filename. Judge it off the date and such, should prevent 99% of the same-name errors.
$now = time();
while(file_exists($uploadFilename = $uploadsDirectory.$now.'-'.$_FILES[$fieldname]['name'])) {
    $now++;
}

// Move to the final location and actually rename.
@move_uploaded_file($_FILES[$fieldname]['tmp_name'], $uploadFilename) or error('We have received insufficient permissions. Locked on and ready to fire! (Go back and try again)');
    
// Redirect to a success page. If we posted this through JS/Iframe or Flash, you'd wanna just return the string filename.
header('Location: index.php?image=' . $now . '-' . $_FILES[$fieldname]['name']);

// Generic error handler. Fuck PHP.
function error($error) {
    echo $error;
    exit;
}

?>
