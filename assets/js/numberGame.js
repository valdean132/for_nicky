$(document).ready(function(){
    // -------------------------
    //* Variáveis Globais
    // -------------------------

    let randomNumber; // Número aleatório para o jogo de adivinhação
    let attempts = 0; // Tentativas feitas no jogo de adivinhação
    let EndGame = false; // Verifiacndo se o jogo acabou

    // Mensagens de feedback para o jogo de adivinhação de número
    const hotMessages = ["Você está quente!", "Quase lá!", "Apenas um pouco mais!"];
    const coldMessages = ["Muito frio!", "Está longe!", "Não é nem perto!"];
    const successMessages = ["Parabéns! Você adivinhou em ", "Ótimo trabalho! Você acertou em "];

    // -------------------------
    //* Funções do Jogo de Adivinhação de Número
    // -------------------------

    // Função que inicia o jogo de adivinhação, gerando um novo número aleatório e resetando as tentativas
    function startNumberGame() {
        randomNumber = Math.floor(Math.random() * 100) + 1; // Gera número aleatório entre 1 e 100
        attempts = 0; // Reseta tentativas
        $('.popup.show').removeClass('success-animation');
        $('#numberMessage').text("Adivinhe um número!"); // Exibe mensagem inicial
        $('#numberGuess').val(''); // Limpa o campo de input
    }

    // Função que verifica o palpite do usuário no jogo de adivinhação
    function checkGuess() {
        const userGuess = Number($('#numberGuess').val()); // Converte o input para número
        attempts++; // Incrementa o número de tentativas
        const messageEl = $('#numberMessage'); // Elemento para exibir mensagens

        // Verifica se o palpite está correto
        if (userGuess === randomNumber) {
            const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
            messageEl.text(`${randomMessage}${attempts} tentativas.`); // Exibe mensagem de sucesso
            EndGame = true; // Indicando fim do jogo
            $('.popup.show').addClass('success-animation'); // Adiciona uma animação de sucesso (se houver)
        } 
        // Verifica se o palpite está próximo (diferença de 10 ou menos)
        else if (Math.abs(userGuess - randomNumber) <= 5) {
            const randomHotMessage = hotMessages[Math.floor(Math.random() * hotMessages.length)];
            messageEl.text(randomHotMessage); // Exibe mensagem "quente"
        } 
        // Caso contrário, exibe uma mensagem "fria"
        else {
            const randomColdMessage = coldMessages[Math.floor(Math.random() * coldMessages.length)];
            messageEl.text(randomColdMessage); // Exibe mensagem "fria"
        }
    }

    
    // -------------------------
    //* Eventos da Interface
    // -------------------------

    // Evento para abrir o popup do jogo de adivinhação
    $('#openNumberGame').on('click', function() {
        startNumberGame(); // Inicia o jogo de adivinhação
        $('#numberGamePopup').css('display', 'flex');
        setTimeout(() => {
            $('#numberGamePopup').addClass('show'); // Exibe o popup
        }, 500);
    });

    // Evento para processar o palpite no jogo de adivinhação
    $('#numberGameForm').on('submit', function(event) {
        event.preventDefault(); // Previne o envio do formulário
        if(EndGame){
            startNumberGame(); // Reiniciando o Jogo
            EndGame = false;
            return;
        }

        checkGuess(); // Verifica o palpite
    });

    // Evento para reiniciar o jogo de adivinhação
    $('#restartNumberGame').on('click', startNumberGame);

    // Evento para fechar o popup do jogo de adivinhação
    $('#closeNumberGame').on('click', function() {
        $('#numberGamePopup').removeClass('show');
        setTimeout(() => {
            $('#numberGamePopup').css('display', 'none');
        }, 500);
    });
})