<?php
    $msgError = '';
    $user = '';
    $password = '';

    if(isset($_POST['login'])){
        $user = $_POST['user'];
        $password = $_POST['password'];
        if($user === '' || $password === ''){
            $msgError = "<div class='msg-error'><p>Informe login e senha</p></div>";
        }else{
            $sql = MySql::conectar()->prepare("SELECT * FROM `user` WHERE login = ? AND password = ?");
            $sql->execute(array($user, md5($password)));
            if($sql->rowCount() == 1){
                $info = $sql->fetch();

                $_SESSION['login'] = $user;
                $_SESSION['password'] = md5($password);
                $_SESSION['user_id'] = $info['id'];
                $_SESSION['nome'] = $info['nome'];
                $_SESSION['created_at'] = $info['created_at'];
                $_SESSION['url_img'] = $info['url_img'];
                $_SESSION['nome_tabela'] = 'user';


                $session_token = bin2hex(random_bytes(16)); // Gerando token de sessão
                setcookie('remember_me', $session_token, time() + (86400 * 5), '/'); // 5 dias de validade

                $update = MySql::conectar()->prepare("UPDATE user SET session_token = ? WHERE id = ?");
                $update->execute(array($session_token, $info['id']));

                header('Location: '.INCLUDE_PATH);
                die();
                
            }else{
                $msgError = "<div class='msg-error'><p>Login ou senha incorreto</p></div>";
                $password = '';
            }
        }
    }