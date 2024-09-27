<?php

    if(!isset($_SESSION['login'])){
        if(isset($_COOKIE['remember_me'])){
            $cookie_token = $_COOKIE['remember_me'];

            $stmt = MySql::conectar()->prepare("SELECT * FROM user WHERE session_token = ?");
            $stmt->execute(array($cookie_token));

            if($stmt->rowCount() == 1){
                $info = $stmt->fetch();

                $_SESSION['login'] = $info['user'];
                $_SESSION['password'] = $info['password'];
                $_SESSION['user_id'] = $info['id'];
                $_SESSION['nome'] = $info['nome'];
                $_SESSION['created_at'] = $info['created_at'];
                $_SESSION['url_img'] = $info['url_img'];
                $_SESSION['nome_tabela'] = 'user';

                setcookie('remember_me', $cookie_token, time() + (86400 * 5), '/'); // 5 dias de validade

                header('Location: '.INCLUDE_PATH);
                die();
                
            }
        }
    }