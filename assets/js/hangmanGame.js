$(document).ready(function(){

    // -------------------------
    //* Variáveis Globais
    // -------------------------
    let currentWord; // Palavra atual no jogo da forca
    let guessedLetters = []; // Letras já adivinhadas no jogo da forca
    let remainingAttempts = 6; // Tentativas restantes no jogo da forca
    let endGame = false; // Verifiacndo se o jogo acabou


    // -------------------------
    //* Funções do Jogo da Forca
    // -------------------------

    // Função que busca uma palavra aleatória da API e a traduz para o português
    async function fetchRandomWord() {
        $('#loading').show(); // Exibe o indicador de carregamento
        $('#hangmanWord').hide(); // Esconde display de palavras
        $('#letterGuess').prop('disabled', true);// Desabilita o input
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        const englishWord = data[0]; // Recebe a palavra em inglês

        // Traduz a palavra para português
        const translationResponse = await fetch(`https://api.mymemory.translated.net/get?q=${englishWord}&langpair=en|pt`);
        const translationData = await translationResponse.json();
        currentWord = translationData.responseData.translatedText.toLowerCase(); // Define a palavra traduzida como a palavra atual
        
        $('#loading').hide(); // Esconde o indicador de carregamento
        $('#hangmanWord').show(); // Exibe o display de palavras
        $('#letterGuess').prop('disabled', false);// Habilita o input
        updateHangmanDisplay(); // Atualiza a exibição da palavra no jogo da forca
    }

    // Função que atualiza o display do jogo da forca com as letras corretas e verificações de fim de jogo
    function updateHangmanDisplay() {        
        // Mostra a palavra com as letras já adivinhadas e "_" para as letras não reveladas
        const displayWord = currentWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
        $('#hangmanWord').text(displayWord); // Atualiza o display da palavra
        $('#remainingAttempts').text(remainingAttempts); // Atualiza o número de tentativas restantes
        // $('#hangmanMessage').text('Próxima letra...'); // Exibindo mensagem para próxima letra

        // Verifica se o jogador perdeu (tentativas acabaram)
        if (remainingAttempts == 0) {
            $('#hangmanMessage').text(`Game Over! A palavra era: ${currentWord}`); // Exibe mensagem de derrota
            $('#hangmanWord').hide(); // Esconde display de palavras
            $('#letterGuess').prop('disabled', true);// Desabilita o input
            endGame = true;
        } 
        // Verifica se o jogador ganhou (todas as letras foram adivinhadas)
        else if (currentWord.split('').every(letter => guessedLetters.includes(letter))) {
            $('#hangmanMessage').text('Parabéns! Você acertou a palavra!'); // Exibe mensagem de vitória
            endGame = true;
        }
    }

    // Função que revela uma letra como dica quando o jogador erra
    function revealHintLetter() {
        const unrevealedLetters = currentWord.split('').filter(letter => !guessedLetters.includes(letter));
    
        // Verifica se ainda há mais de 2 letras a serem adivinhadas
        if (unrevealedLetters.length > 2) {
            const randomLetterToReveal = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
            guessedLetters.push(randomLetterToReveal); // Adiciona a letra revelada às letras adivinhadas
            $('#hangmanMessage').text(`Dica: a letra '${randomLetterToReveal}' foi revelada!`); // Exibe a dica
        } else {
            // Caso restem 2 ou menos letras, exibe uma mensagem informando que não haverá mais dicas
            $('#hangmanMessage').text(`Vamos lá, restam apenas ${unrevealedLetters.length} letras!`);
        }

    }

    // Função para iniciar o jogo da Forca gerando uma nova palavra a cada rodada
    function openHangmanPopup(){
        $('#loading').show(); // Exibe o indicador de carregamento
        $('#hangmanWord').hide(); // Esconde display de palavras
        $('#letterGuess').prop('disabled', true);// Desabilita o input
        fetchRandomWord(); // Busca e exibe uma palavra aleatória
        guessedLetters = []; // Reseta as letras adivinhadas
        remainingAttempts = 6; // Reseta as tentativas restantes
        $('#hangmanMessage').text(''); // Limpa as mensagens
        $('#hangmanPopup').css('display', 'flex');
        setTimeout(() => {
            $('#hangmanPopup').addClass('show'); // Exibe o popup
        }, 500);
    }


    // -------------------------
    //* Eventos da Interface
    // -------------------------

    // Evento para abrir o popup do jogo da forca
    $('#openHangmanGame').on('click', function() {
        openHangmanPopup()
    });

    // Evento para processar a adivinhação de letra no jogo da forca
    $('#checkLetter').on('submit', function(event) {
        event.preventDefault(); // Previne o envio do formulário
        if(endGame){
            openHangmanPopup(); // Reiniciando Jogo da Forca
            endGame = false;
            return;
        }

        const letter = $('#letterGuess').val().toLowerCase(); // Obtém a letra digitada
        $('#letterGuess').val(''); // Limpa o campo de input

        // Verifica se a letra já foi adivinhada
        if (guessedLetters.includes(letter)) {
            $('#hangmanMessage').text('Você já adivinhou essa letra!'); // Exibe mensagem de repetição
            return;
        }

        guessedLetters.push(letter); // Adiciona a letra adivinhada

        // Verifica se a letra faz parte da palavra
        if (currentWord.includes(letter)) {
            updateHangmanDisplay(); // Atualiza o display se a letra estiver correta
        } else {
            remainingAttempts--; // Decrementa as tentativas
            revealHintLetter(); // Dá uma dica revelando uma letra
            updateHangmanDisplay(); // Atualiza o display
        }
    });

    // Evento para reiniciar o jogo da forca
    $('#restartHangman').on('click', function() {
        openHangmanPopup(); // Reinicia o jogo da forca
    });

    // Evento para fechar o popup do jogo da forca
    $('#closeHangmanPopup').on('click', function() {
        $('#hangmanPopup').removeClass('show');
        setTimeout(() => {
            $('#hangmanPopup').css('display', 'none');
        }, 500);
    });
})