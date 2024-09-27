<?php

    $error_input = '';
    $msgError = '';
    $nome = '';
    $login = '';
    $password = '';
    $conf_password = '';
    $redirect = false;

    if(isset($_POST['register'])){
        $nome = $_POST['nome'];
        $login = $_POST['login'];
        $password = $_POST['password'];
        $conf_password = $_POST['confirm-password'];

        if($nome === '' || $login === '' || $password === ''){
            $msgError = "<div class='msg-error'><p>Todos os campos devem ser preenchidos.</p></div>";

            $error_input = 'error-nome error-login error-password';
        }else{
            if($password !== $conf_password){
                $msgError = "<div class='msg-error'><p>As senhas não conferem. <br/>Por favor, verifique.</p></div>";
                $error_input = 'error-password';
            }else{
                $error_input = '';

                if(Painel::userExists($login, 'user', 'login')){
                    $alternatives = [];

                    for ($i = 1; $i <= 3; $i++) {
                        $alternatives[] = $login . rand(100, 999); // Sugestões: login123
                    }
                    $msgError = "<div class='msg-error'><p>Login escolhido já existe. <br/>Tente: ". implode(', ', $alternatives) ." ...</p></div>";
                    $error_input = 'error-login';

                }else{
                    $id = Painel::generateUUID();
                    $error_input = '';

                    $insert = Mysql::conectar()->prepare("INSERT INTO user (id, name, login, password) VALUES (?, ?, ?, ?)");
                    
                    if($insert->execute(array($id, $nome, $login, md5($password)))){
                        $msgError = "<div class='msg-success'><p>Bem Vindo, $nome!!! <br />Você será redirecionado em 3 segundos...</p></div>";


                        $nome = '';
                        $login = '';
                        $password = '';
                        $conf_password = '';

                        $redirect = true;
                    }
                }
            }
        }




    }