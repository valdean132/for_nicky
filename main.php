<!DOCTYPE html>
<html lang="pt-BR">

<head>
    
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="language" content="pt-BR">

    <title>For Nicky</title>
    <meta name="description" content="Sistema interativo para gerenciar listas de projetos, hobbies e galeria de fotos. Permite adicionar, editar e visualizar itens, baixar imagens e organizar atividades de forma prática. Inclui jogos como Jogo da Forca e Adivinhação de Número para diversão.">
    <meta name="robots" content="index">
    <meta name="author" content="Valdean Souza">
    <meta name="keywords" content="nicky, for, for nicky, FOR NICKY, For Nicky, galeria, fotos, lista, projetos, projeto, listas, hobbies, Adicionar lista, adicionar hobbies, adicionar projetos, adicionar fotos, baixar fotos, jogo da forca, jogo de adivinhação de número">

    <meta property="og:type" content="page">
    <meta property="og:url" content="<?php echo INCLUDE_PATH; ?>">
    <meta property="og:title" content="For Nicky">
    <meta property="og:image" content="<?php echo INCLUDE_PATH; ?>assets/images/img.png">
    <meta property="og:description" content="Sistema interativo para gerenciar listas de projetos, hobbies e galeria de fotos. Permite adicionar, editar e visualizar itens, baixar imagens e organizar atividades de forma prática. Inclui jogos como Jogo da Forca e Adivinhação de Número para diversão.">

    <meta property="article:author" content="Valdean Souza">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@For Nicky">
    <meta name="twitter:title" content="For Nicky">
    <meta name="twitter:creator" content="@Valdean Souza">
    <meta name="twitter:description" content="Sistema interativo para gerenciar listas de projetos, hobbies e galeria de fotos. Permite adicionar, editar e visualizar itens, baixar imagens e organizar atividades de forma prática. Inclui jogos como Jogo da Forca e Adivinhação de Número para diversão.">


    <link rel="shortcut icon" href="<?php echo INCLUDE_PATH; ?>assets/images/panda.png" type="image/x-icon">


    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="./assets/css/jquery.mCustomScrollbar.min.css">
    <link rel="stylesheet" href="./assets/css/toastr.min.css">


    <link rel="stylesheet" href="./assets/css/style.css?v=<?php echo VERSION; ?>">


</head>

<body>
    <base base="<?php echo INCLUDE_PATH?>">

    <script>
        // Verifica a preferência do usuário e aplica o tema
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    </script>

    <?php if(isset($_SESSION['login'])){ ?>
        <a href="<?php echo INCLUDE_PATH; ?>?loggout" class="loggout"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
    <?php } ?>

    <header>
        <div class="container">
            <h1>For Nicky</h1>
            <button id="toggleTheme">Mudar Tema</button>
        </div>
    </header>


    <div class="container container-main">
        <div class="game">
            <div class="title-container">
                <h2>Jogos</h2>
            </div>
            <button id="openNumberGame">Jogo de Adivinhação</button>
            <button id="openHangmanGame">Jogo da Forca</button>
        </div>

        <?php

            if(!isset($_SESSION['login'])){
                include('./backend/login.php'); // Configuração de login
        ?>
            <div class="login">
                <div class="login-box">
                    <h2>Login</h2>
                    
                    <?php echo $msgError; ?>
                    <form method="POST">
                        <div class="input-group">
                            <label for="email">User</label>
                            <input type="text" id="email" value="<?php echo $user; ?>" name="user" placeholder="Digite seu login">
                        </div>
                        <div class="input-group">
                            <label for="password">Senha</label>
                            <input type="password" class="password" id="password" value="<?php echo $password; ?>" name="password" placeholder="Digite sua senha">
                            <div type="button" class="toggle-password" onclick="togglePassword('password')"><i class="fa-regular fa-eye"></i></div>
                        </div>
                        <button type="submit" name="login" class="login-btn">Entrar</button>
                        <div class="login-link">
                            Não possui uma conta? <a href="<?php echo INCLUDE_PATH; ?>register">Registre-se</a>
                        </div>
                    </form>
                </div>
            </div>
        <?php
            }else{
        ?>
            <div class="gallery">
                <div class="title-container">
                    <h2>Galeria de Imagens</h2> 
                    <button class="apenUploadModal"><i class="fas fa-plus"></i>&nbsp;&nbsp;Adicionar</button>
                </div>
                <div class="gallery-contain">
                    <div class="gallery-grid">
                        <div class="single-img skeleton"></div>
                        <div class="single-img skeleton"></div>
                        <div class="single-img skeleton"></div>
                        <div class="single-img skeleton"></div>
                    </div>
                </div>
            </div>

            <div class="projects">
                <div class="title-container">
                    <h2>Projetos e Hobbies</h2>
                    <button class="openAddPHIModal"><i class="fas fa-plus"></i>&nbsp;&nbsp;Adicionar</button>
                </div>

                <div class="projects-section">
                    <h3>Projetos</h3>
                    <ul id="project">
                        <li class="skeleton-loading">
                            <span class="skeleton skeleton-span"></span>
                            <div class="item-single skeleton skeleton-item"></div>
                            <div class="data-single skeleton skeleton-data"></div>
                            <div class="item-button">
                                <button class="edit skeleton skeleton-button" disabled></button>
                                <button class="remove skeleton skeleton-button" disabled></button>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="hobbies-section">
                    <h3>Hobbies</h3>
                    <ul id="hobby">
                    <li class="skeleton-loading">
                        <span class="skeleton skeleton-span"></span>
                        <div class="item-single skeleton skeleton-item"></div>
                        <div class="data-single skeleton skeleton-data"></div>
                        <div class="item-button skeleton-button">
                            <button class="edit skeleton skeleton-button"></button>
                            <button class="remove skeleton skeleton-button"></button>
                        </div>
                    </li>
                    </ul>
                </div>
            </div>

            <div class="wishlist">
                <div class="title-container">
                    <h2>Lista de Desejos</h2>
                    <button class="openAddPHIModal" data-type="wishlist"><i
                            class="fas fa-plus"></i>&nbsp;&nbsp;Adicionar</button>
                </div>
                <ul id="wishlist">
                    <li class="skeleton-loading">
                        <span class="skeleton skeleton-span"></span>
                        <div class="item-single skeleton skeleton-item"></div>
                        <div class="data-single skeleton skeleton-data"></div>
                        <div class="item-button skeleton-button">
                            <button class="edit skeleton skeleton-button"></button>
                            <button class="remove skeleton skeleton-button"></button>
                        </div>
                    </li>
                </ul>
            </div>
        <?php
            }
        ?>
    </div>


    <!-- Popup para o jogo de adivinhação de números -->
    <div class="popup" id="numberGamePopup">
        <div class="popup-content">
            <h3>Adivinhe um Número!</h3>
            <p>Adivinhe um número entre 1 e 100!</p>
            <form id="numberGameForm">
                <input type="text" autocomplete="off" id="numberGuess" inputmode="numeric"
                    placeholder="Digite seu palpite" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" required>
                <input type="submit" value="Adivinhar">
            </form>
            <p id="numberMessage"></p>
            <button id="restartNumberGame" type="submit">Reiniciar Jogo</button>
            <button class="close-btn" id="closeNumberGame">Fechar</button>
        </div>
    </div>

    <!-- Popup para o jogo da forca -->
    <div class="popup" id="hangmanPopup">
        <div class="popup-content">
            <h3>Jogo da Forca!</h3>
            <div id="loading" style="display: none;">Carregando...</div>
            <form id="checkLetter">
                <p id="hangmanWord"></p>
                <p>Tentativas restantes: <span id="remainingAttempts"></span></p>
                <input type="text" autocomplete="off" id="letterGuess" maxlength="1" placeholder="Digite uma letra"
                    required>
                <input type="submit" value="Adivinhar">
            </form>
            <p id="hangmanMessage"></p>
            <button id="restartHangman" type="submit">Reiniciar Jogo</button>
            <button class="close-btn" id="closeHangmanPopup">Fechar</button>
        </div>
    </div>

    <?php

        if(isset($_SESSION['login'])){
    ?>

        <!-- Modal para adicionar Adicionar Projetos e Hobbies -->
        <div id="addPHIModal" class="popup">
            <div class="popup-content">
                <form action="" id="addUpdateItem" form-action="">
                    <h2>Adicionar Novo Item</h2>
                    <div class="inputs-phi">
                        <label for="phiType">Tipo:</label>
                        <div id="phiType" class="custom-select-container">
                            <div class="custom-select">
                                <span class="selected" data-selected>Selecione uma opção</span>
                            </div>
                        </div>
                        <span class="errorInput" id="errorPHIType">Selecione um tipo</span>
                        
                        <label for="phiInput">Adicione um novo {}</label>
                        <textarea id="phiInput" placeholder="Escreva alguma coisa..."></textarea>
                        <span class="errorInput" id="errorPHIInput">Escreva alguma coisa...</span>
                    </div>
                    <input type="hidden" id="itemId" value="">
                    <input type="submit" id="submitAddPHI" value="Adicionar">
                    <button type="button" class="close-btn" id="closeAddPHIModal">Cancelar</button>
                </form>
            </div>
        </div>

        <!-- Modal pra adicionar Imagens -->
        <div id="addUploadModal" class="popup">
            <div class="popup-content">
                <form action="" id="addUpdateImage" enctype="multipart/form-data">
                    <h2>Adicionar Imagens</h2>
                    <div class="inputs-upload">
                        <label for="imageUpload" class="custom-upload">
                            <input type="file" id="imageUpload" name="imageUpload" accept="image/*" multiple>
                            <span><i class="fa-solid fa-cloud-arrow-up"></i>&nbsp;&nbsp; Selecione as imagens</span>
                        </label>
                        <div id="previewContainer" class="preview-container"></div>
                        <span class="errorInput" id="errorUploadInput">Selecione pelo menos uma imagem...</span>
                    </div>
                    <input type="submit" id="submitUpload" style="margin-top: 15px;" value="Adicionar Imagens">
                    <button type="button" class="close-btn" id="closeUploadModal">Cancelar</button>
                </form>
            </div>
        </div>

        <!-- Lightbox para Exibir Imagens -->
        <div id="lightbox" class="lightbox">
            <button class="btn-delete"><i class="fa-solid fa-trash"></i></button>
            <button class="btn-download" id="imageToDownload"><i class="fa-solid fa-cloud-arrow-down"></i></button>
            <div class="info-img">
                <p></p>
                <span></span>
            </div>
            <span class="close-lightbox"><i class="fa-solid fa-xmark"></i></span>
            <img class="lightbox-image" src="" alt="Imagem Ampliada">
            <div class="lightbox-nav">
                <span class="prev"><i class="fa-solid fa-chevron-left"></i></span>
                <span class="next"><i class="fa-solid fa-chevron-right"></i></span>
            </div>
            <div class="thumbnail-nav-container">
                <div class="thumbnail-nav">
                    <!-- As miniaturas das imagens serão carregadas aqui -->
                </div>
            </div>
        </div>
    <?php } ?>


    <script src="./assets/js/jquery-3.6.0.min.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script src="./assets/js/toastr.min.js"></script>

    <script src="./assets/js/checkConnection.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/script.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/numberGame.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/hangmanGame.js?v=<?php echo VERSION; ?>"></script>
    <script src="./assets/js/events.js?v=<?php echo VERSION; ?>"></script>

    <?php if(isset($_SESSION['login'])){ ?>
        <script src="./assets/js/gallery-img.js?v=<?php echo VERSION; ?>"></script>
        <script src="./assets/js/addPHI.js?v=<?php echo VERSION; ?>"></script>
    <?php } ?>
</body>

</html>