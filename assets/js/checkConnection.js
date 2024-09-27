$(document).ready(function() {
    // Função para verificar o status da conexão
    function checkConnection() {
        if (!navigator.onLine) {
            $('button, input[type="submit"], a').prop('disabled', true); // Desabilita todos os botões
            toastr.warning('Parece que você está sem conexão com a internet', 'Ops...');
        } else {
            $('button, input[type="submit"], a').prop('disabled', false); // Habilita todos os botões
        }
    }

    // Checa a conexão ao carregar a página
    checkConnection();

    // Detecta quando o status da conexão mudar para offline
    window.addEventListener('offline', function() {
        $('button, input[type="submit"], a').prop('disabled', true);
        toastr.warning('Parece que você está sem conexão com a internet', 'Ops...');
    });

    // Detecta quando o status da conexão mudar para online
    window.addEventListener('online', function() {
        $('button, input[type="submit"], a').prop('disabled', false);

        toastr.success('Conexão restaurada');
    });
});
