$(document).ready(function() {
    // -------------------------
    //* Eventos da Interface
    // -------------------------

    // Função para preferencia de tema
    (function theme(){
        
        // Verifica se há uma preferência salva e aplica o tema
        if (localStorage.getItem('theme') === 'dark') {
            $('body').addClass('dark-theme');
        } else {
            $('body').removeClass('dark-theme');
        }
        
        // Verifica a preferência do sistema ao carregar a página
        if (localStorage.getItem('theme') != '') {
            $('body').addClass('dark-theme');
        }

        // Alterna o tema ao clicar no botão
        $('#toggleTheme').on('click', function () {
            $('body').toggleClass('dark-theme');

            // Salva a preferência no localStorage
            if ($('body').hasClass('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', '');
            }
        });
    }());

    // Função para selecionar um Option no Select
    (function customSelect(){
        $('.custom-select').each(function() {
            var $select = $(this);
            var $selected = $select.find('.selected');
            var $optionsContainer = $select.find('.options-container');
            var $options = $select.find('.option:not(.disabled)');
    
            // Abre e fecha o dropdown
            $selected.on('click', function() {
                $select.toggleClass('open');
            });
    
            // Seleciona uma opção
            $(document).on('click', '.option:not(.disabled)', function() {
                var $option = $(this);
                $selected.text($option.text());
                $selected.attr('data-selected', $option.attr('data-value'));
                $select.removeClass('open');
                $('.option:not(.disabled)').removeClass('active');
                $option.addClass('active');
            });
        });
    
        // Fechar o dropdown ao clicar fora
        $(document).on('click', function(e) {
            var $openDropdown = $('.custom-select.open');
            if ($openDropdown.length && !$openDropdown.is(e.target) && $openDropdown.has(e.target).length === 0) {
                $openDropdown.removeClass('open');
            }
        });
    }());

    (function scrollBar(){
        $("body").mCustomScrollbar({
            theme: "minimal-dark",
            scrollInertia: 300,
            autoHideScrollbar: true
        });

        // Caso o layout ou conteúdo mude, você pode recarregar o plugin
        // por exemplo, após um evento de scroll ou resize
        $(window).on('resize scroll', function() {
            $("body").mCustomScrollbar("update"); // Atualiza o plugin
        });
    }());

    // Chamando função para as notificações
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
    }
});

// Função para alternar a visibilidade da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleButton = event.currentTarget; // Captura o botão que foi clicado
    if (input.type === 'password') {
        input.type = 'text';
        toggleButton.innerHTML = '<i class="fa-regular fa-eye-slash"></i>'; // Ícone de olho fechado
    } else {
        input.type = 'password';
        toggleButton.innerHTML = '<i class="fa-regular fa-eye"></i>'; // Ícone de olho aberto
    }
}