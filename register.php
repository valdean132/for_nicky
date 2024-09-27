<?php include('./backend/register.php') ?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="language" content="pt-BR">
    
    <title>For Nicky | Registrar</title>
    <meta name="description" content="Sistema interativo para gerenciar listas de projetos, hobbies e galeria de fotos. Permite adicionar, editar e visualizar itens, baixar imagens e organizar atividades de forma prática. Inclui jogos como Jogo da Forca e Adivinhação de Número para diversão.">
    <meta name="robots" content="index">
    <meta name="author" content="Valdean Souza">
    <meta name="keywords" content="nicky, for, for nicky, FOR NICKY, For Nicky, galeria, fotos, lista, projetos, projeto, listas, hobbies, Adicionar lista, adicionar hobbies, adicionar projetos, adicionar fotos, baixar fotos, jogo da forca, jogo de adivinhação de número">

    <meta property="og:type" content="page">
    <meta property="og:url" content="<?php echo INCLUDE_PATH; ?>">
    <meta property="og:title" content="For Nicky | Registrar">
    <meta property="og:image" content="<?php echo INCLUDE_PATH; ?>assets/images/img.png">
    <meta property="og:description" content="Sistema interativo para gerenciar listas de projetos, hobbies e galeria de fotos. Permite adicionar, editar e visualizar itens, baixar imagens e organizar atividades de forma prática. Inclui jogos como Jogo da Forca e Adivinhação de Número para diversão.">

    <meta property="article:author" content="Valdean Souza">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="For Nicky | Registrar">
    <meta name="twitter:description" content="Sistema interativo para gerenciar listas de projetos, hobbies e galeria de fotos. Permite adicionar, editar e visualizar itens, baixar imagens e organizar atividades de forma prática. Inclui jogos como Jogo da Forca e Adivinhação de Número para diversão.">

    <link rel="shortcut icon" href="<?php echo INCLUDE_PATH; ?>assets/images/panda.png" type="image/x-icon">

    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="./assets/css/jquery.mCustomScrollbar.min.css">
    <link rel="stylesheet" href="./assets/css/toastr.min.css">

    <link rel="stylesheet" href="./assets/css/register.css"> <!-- Inclua o seu arquivo de estilo CSS -->
    <style>
    </style>
</head>
<body> <!-- Você pode mudar para "dark-mode" para o modo escuro -->
    <script>
        // Verifica a preferência do usuário e aplica o tema
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    </script>

    <?php if($redirect){ ?>
        <script>
            setTimeout(function() {
                window.location.href = "<?php echo INCLUDE_PATH ?>";
            }, 3000); // 5000 milissegundos = 5 segundos
        </script>
    <?php } ?>


    <button id="toggleTheme">Mudar Tema</button>

    <div class="register-container">
        <div class="register-box">
            <h2>Criar Conta</h2>
            <?php echo $msgError; ?>
            <form id="register-form" method="POST" class="<?php echo $error_input ?>">
                <div class="input-group">
                    <label for="username">Nome de usuário</label>
                    <input type="text" id="username" name="nome" value="<?php echo $nome; ?>" placeholder="Digite seu nome de usuário">
                </div>
                <div class="input-group">
                    <label for="login">Login</label>
                    <input type="text" id="login" name="login" value="<?php echo $login; ?>" placeholder="Digite seu login">
                </div>
                <div class="input-group">
                    <label for="password">Senha</label>
                    <input type="password" class="password" id="password" value="<?php echo $password; ?>" name="password" placeholder="Digite sua senha">
                    <div class="toggle-password" onclick="togglePassword('password')"><i class="fa-regular fa-eye"></i></div>
                </div>
                <div class="input-group">
                    <label for="confirm-password">Confirme a senha</label>
                    <input type="password" class="password" id="confirm-password" value="<?php echo $conf_password; ?>" name="confirm-password" placeholder="Confirme sua senha">
                    <div class="toggle-password" onclick="togglePassword('confirm-password')"><i class="fa-regular fa-eye"></i></div>
                </div>
                <button type="submit" class="register-btn" name="register">Registrar</button>
                <div class="login-link">
                    Já tem uma conta? <a href="<?php echo INCLUDE_PATH; ?>">Faça login</a>
                </div>
            </form>
        </div>
    </div>

    <script src="./assets/js/jquery-3.6.0.min.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script src="./assets/js/toastr.min.js"></script>
    <script src="./assets/js/checkConnection.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/script.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/events.js?v=<?php echo VERSION; ?>"></script>
</body>
</html>
