<?php

    if(isset($_GET['loggout'])){
        $user_id = $_SESSION['user_id'];

        // Limpar o token de sessão no banco de dados
        $update = MySql::conectar()->prepare("UPDATE user SET session_token = NULL WHERE id = ?");
        $update->execute(array($_SESSION['user_id']));

        // Sair da Sessão
        session_unset();
        session_destroy();
        setcookie('remember_me', '', time()-3600, '/');
        
        header('Location: '.INCLUDE_PATH);
        exit();
    }
