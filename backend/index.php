<?php
    include('./config.php');

    if(isset($_GET['type'])){
        include('./assets/ajax/get-types.php');
    }

    if(isset($_GET['uploads'])){
        include('./assets/ajax/get-uploads.php');
    }

    if(isset($_POST['action-not'])){
        include('./assets/ajax/post-types.php');
    }
    if(isset($_POST['action-img'])){
        include('./assets/ajax/post-remove.php');
    }

    if(isset($_FILES)){
        include('./assets/ajax/post-uploads.php');
    }
