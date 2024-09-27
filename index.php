<?php 

    include('./version.php'); // Versionamento
    include('./backend/config.php'); // Configurações PHP
    include('./backend/loggout.php'); // Configuração de Loggout
    include('./backend/remember_me.php'); // Verificação de Cookies para login


    if(!isset($_SESSION['login'])){
        if(isset($_GET['url'])){
    
            // Pegando valor da URL
            $url = explode('/', $_GET['url']);
    
            if(file_exists($url[0].'.php')){
                // Se A página existir
                include($url[0].'.php');
            }else{
                // Se a Página não existir
                include('main.php');
            }
        }else{
            // Caso não exista nada na URL
            include('main.php');
        }
    }else{
        include('main.php');
    }

?>