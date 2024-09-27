<?php

    session_start();
    date_default_timezone_set('America/Manaus');

    $autoload = function($class){
        include('assets/class/'.$class.'.php'); 
    };

    spl_autoload_register($autoload);

    define('INCLUDE_PATH', 'http://localhost/for_nicky/');

    // Conexão com o banco de dados Local
    define('HOST', 'localhost');
    define('USER', 'root');
    define('USERNAME','');
    define('DATABASE', 'for_nicky');
?>