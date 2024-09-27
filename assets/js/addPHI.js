$(document).ready(function () {

    // Carregar lista de desejos
    function loadWishlist(type, load = false) {
        $.ajax({
            url: include_path+'backend/index.php',
            type: 'GET',
            data: {type: type},
            dataType: 'json',
            async: true,
            beforeSend: function(){
                if(!load){
                    $(`#${type}`).prepend(`
                        <li class="skeleton-loading">
                            <span class="skeleton skeleton-span"></span>
                            <div class="item-single skeleton skeleton-item"></div>
                            <div class="data-single skeleton skeleton-data"></div>
                            <div class="item-button">
                                <button class="edit skeleton skeleton-button" disabled></button>
                                <button class="remove skeleton skeleton-button" disabled></button>
                            </div>
                        </li>    
                    `);
                }
            },
            success: function (data) {
                $(`#${data.type}`).empty();
                if(data.type == 'project')
                    var typeName = 'Projeto';
                else if(data.type == 'hobby')
                    var typeName = 'Hobbie';
                else if(data.type == 'wishlist')
                    var typeName = 'Desejo';
        

                if (data.result.length === 0) {
                    $(`#${data.type}`).append(`
                        <li>
                            <div class="item-single">
                                <button class="openAddPHIModal" data-type="${data.type}">Adicione um ${typeName}</button>
                            </div>
                        </li>    
                    `);
                }else{
                    let result = data.result;

                    result.map((item, index) => {
                        $(`#${item.type}`).append(`
                            <li id="item-${item.id}">
                                 <span>${(index+1) < 10 ? '0' + (index+1) : (index+1)}</span>
                                 <div class="item-single"><p>${item.item}</p></div>
                                 <div class="data-single"><p>${formatarDataHora(item.data_create)}</p></div>
                                 <div class="item-button">
                                     <button class="edit" title="Editar: ${item.id}" data-type="${item.type}" data-id="${item.id}" data-item="${item.item}"><i class="fa-solid fa-pen-to-square"></i></button>
                                     <button class="remove" title="Remover: ${item.id}" data-type="${item.type}" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                                 </div>
                             </li>
                        `);
                    });

                    $(`#${type}`).mCustomScrollbar({
                        theme: "dark",
                        axis: "x",
                        scrollInertia: 300,
                        autoHideScrollbar: true
                    });
            
                    // Caso o layout ou conteúdo mude, você pode recarregar o plugin
                    // por exemplo, após um evento de scroll ou resize
                    $(window).on('resize scroll', function() {
                        $(`#${type}`).mCustomScrollbar("update"); // Atualiza o plugin
                    });
                }
            },
            error: function(data){
                console.error(data.responseText)
                toastr.error('Ocorreu um erro inesperado', 'Erro Inesperado')

            }
        });
    }

    // Adicionar novo item
    $(document).on('submit', '#addUpdateItem[form-action="add"]', function (event) {
        event.preventDefault();
        const phiType = $('#phiType .selected').attr('data-selected');
        const phiInput = $('#phiInput').val();

        if(phiType == ''){ // Informando erro campo esteja vazio
            $('#errorPHIType').addClass('show');
        }else{
            $('#errorPHIType').removeClass('show');
        }
        if(phiInput == ''){ // Informando erro campo esteja vazio
            $('#errorPHIInput').addClass('show');
        }else{
            $('#errorPHIInput').removeClass('show');
        }
        
        if (phiInput !== '' && phiType !== '') {
            $.ajax({
                url: include_path+'backend/index.php',
                method: 'POST',
                data: {
                    'action-not': 'add',
                    'type': phiType,
                    item: phiInput,
                },
                dataType: 'json',
                async: true,
                beforeSend: function(data){
                    toastr.info('Cadastrando Item...')

                    $('#submitAddPHI').prop('disabled', true);
                    $('#phiInput').prop('disabled', true);
                },
                success: function (data) {
                    $('#submitAddPHI').prop('disabled', false);
                    $('#phiInput').prop('disabled', false);

                    if(data.type == 'success'){
                        toastr.success(`Item cadastrado: ${data.id}`, 'Cadastro concluído...');

                        // Fechando Modal
                        $('#addPHIModal').removeClass('show'); // Exibe o popup
                        setTimeout(() => {
                            $('#addPHIModal').css('display', 'none');
                            $('#phiInput').val(''); // Limpa o input
                            loadWishlist(phiType);
                        }, 500);

                    }else{
                        toastr.error(data.msg.body, data.msg.header);
                    }
                },
                error: function(data){
                    console.error(data.responseText);
                    toastr.error('Ocorreu um erro inesperado', 'Erro Inesperado');


                    $('#submitAddPHI').prop('disabled', false);
                    $('#phiInput').prop('disabled', false);
                }
            });
        }


    });

    // Remover item
    $(document).on('click', '.remove', function () {
        const itemId = $(this).data('id');
        const type = $(this).data('type');

        console.debug(itemId, type)

        if(type == '' || type == undefined || type == null){
            toastr.error('Tipo não definido', 'Erro Inesperado');

            return false;
        }
        if(itemId == '' || itemId == undefined || itemId == null){
            toastr.error('Identificação não definido', 'Erro Inesperado');

            return false;
        }

        $.ajax({
            url: include_path+'backend/index.php',
            method: 'POST',
            data: {
                'action-not': 'remove',
                type: type,
                id: itemId
            },
            dataType: 'json',
            async: true,
            success: function (data) {
                
                if(data.type == 'success'){
                    toastr.success(`Item removido com sucesso...`);
                    
                    $(`#item-${itemId}`).remove(); // Removendo Item selecionado

                    // Caso não haja mais lista
                    if($(`#${type} li`).length <= 0){
                        if(type == 'project')
                            var typeName = 'Projeto';
                        else if(type == 'hobby')
                            var typeName = 'Hobbie';
                        else if(type == 'wishlist')
                            var typeName = 'Desejo';
                        $(`#${type}`).append(`
                            <li>
                                <div class="item-single">
                                    <button class="openAddPHIModal" data-type="${type}">Adicione um ${typeName}</button>
                                </div>
                            </li>    
                        `);
                    }
                }else{
                    toastr.error('Falha ao remover Item da lista', 'Erro Inesperado');
                }


            },
            error: function(){
                console.error(data.responseText);
                toastr.error('Ocorreu um erro inesperado', 'Erro Inesperado');
            }
        });
    });

    // Atualizar item
    $(document).on('submit', '#addUpdateItem[form-action="update"]', function(e) {
        e.preventDefault();

        const itemId = $('#itemId').val();
        const itemType = $('#phiType .selected').attr('data-selected');
        const itemValue = $('#phiInput').val();

        // Validações simples
        if(itemType == ''){ // Informando erro campo esteja vazio
            $('#errorPHIType').addClass('show');
            return;
        }else{
            $('#errorPHIType').removeClass('show');
        }
        if(itemValue == ''){ // Informando erro campo esteja vazio
            $('#errorPHIInput').addClass('show');
            return;
        }else{
            $('#errorPHIInput').removeClass('show');
        }

        // AJAX para enviar os dados ao backend
        $.ajax({
            url: include_path+'backend/index.php', // O arquivo PHP para tratar a atualização
            method: 'POST',
            data: {
                'action-not': 'update',
                type: itemType,
                id: itemId,
                item: itemValue
            },
            dataType: 'json',
            beforeSend: function(data){
                toastr.info('Atualizando Item...');

                $('#submitAddPHI').prop('disabled', true);
                $('#phiInput').prop('disabled', true);
            },
            success: function(response) {
                if (response.type === 'success') {
                    toastr.success(`Item atualizado: ${response.id}`, 'Atualização concluído...');

                    // Atualiza o item no DOM
                    $(`#item-${itemId} .item-single p`).text(itemValue);
                    $(`#item-${itemId} .edit`).attr('data-item', itemValue);

                    // Fechar o modal e limpar os dados
                    $('#addPHIModal').removeClass('show'); // Removendo o popup
                    setTimeout(() => {
                        $('#addPHIModal').css('display', 'none');

                        $("#addPHIModal .options-container").remove();
                        $('#phiType .selected').attr('data-selected', '');
                        $('#phiInput').val('');
                        $('#itemId').val('');
                    }, 500);
                } else {
                    toastr.error(response.msg?.body, response.msg?.header);

                }
                $('#submitAddPHI').prop('disabled', false);
                $('#phiInput').prop('disabled', false);
            },
            error: function(err) {
                console.error(err.responseText);
                toastr.error('Erro ao atualizar o item');

                $('#submitAddPHI').prop('disabled', false);
                $('#phiInput').prop('disabled', false);
            }
        });
    });


    // Carregar a lista de desejos ao iniciar
    loadWishlist('project');
    loadWishlist('hobby');
    loadWishlist('wishlist');

    // Abrir modal
    $(document).on('click', '.openAddPHIModal', function () {

        // Uma gambiarra "Provisoria pro meu Select"
        if($(this).attr('data-type')){
            $("#addPHIModal [data-selected]").attr('data-selected', $(this).attr('data-type'));
            
            if($(this).attr('data-type') == 'wishlist'){
                $("#addPHIModal h2").text('Adicionar novo Desejo');
                $("#addPHIModal .options-container").remove();
                $("#addPHIModal [data-selected]").text('Lista de desejos');
                $("#addPHIModal [for='phiInput']").text('Adicione um novo desejo:');
            }else if($(this).attr('data-type') == 'project'){
                $("#addPHIModal h2").text('Adicionar novo projeto');
                $("#addPHIModal .options-container").remove();
                $("#addPHIModal [data-selected]").text('Projeto');
                $("#addPHIModal [for='phiInput']").text('Adicione um novo projeto:');
            }else if($(this).attr('data-type') == 'hobby'){
                $("#addPHIModal h2").text('Adicionar novo Hobbie');
                $("#addPHIModal .options-container").remove();
                $("#addPHIModal [data-selected]").text('Hobbie');
                $("#addPHIModal [for='phiInput']").text('Adicione um novo hobbie:');
            }
        }else{
            $("#addPHIModal [data-selected]").attr('data-selected', '');
            $("#addPHIModal h2").text('Adicionar um Projeto ou Hobbie');
            $("#addPHIModal .custom-select").append(`
                    <div class="options-container">
                        <div class="option disabled" data-value="" disabled>Selecione uma opção</div>
                        <div class="option" data-value="project">Projeto</div>
                        <div class="option" data-value="hobby">Hobby</div>
                    </div>
                `);
            $("#addPHIModal [data-selected]").text('Selecione uma opção');
            $("#addPHIModal [for='phiInput']").text('Adicione um novo projeto ou hobby:');
        }

        $('#addUpdateItem').attr('form-action', 'add');

        $('#addPHIModal').css('display', 'flex');
        setTimeout(() => {
            $('#addPHIModal').addClass('show'); // Exibe o popup
        }, 500);
    });

    // Função para abrir o modal e preencher com dados
    $(document).on('click', '.edit', function() {
        const itemId = $(this).data('id');
        const itemType = $(this).data('type');
        const itemValue = $(this).attr('data-item');

        if(itemType == 'wishlist'){
            $("#addPHIModal h2").text('Atualizar Desejo');
            $("#addPHIModal [data-selected]").text('Lista de desejos');
            $("#addPHIModal [for='phiInput']").text('Atualizar desejo:');
        }else if(itemType == 'project'){
            $("#addPHIModal h2").text('Atualizar projeto');
            $("#addPHIModal [data-selected]").text('Projeto');
            $("#addPHIModal [for='phiInput']").text('Atualizar projeto:');
        }else if(itemType == 'hobby'){
            $("#addPHIModal h2").text('Atualizar Hobbie');
            $("#addPHIModal [data-selected]").text('Hobbie');
            $("#addPHIModal [for='phiInput']").text('Atualizar hobbie:');
        }


        // Armazenar os dados no modal
        $('#addUpdateItem').attr('form-action', 'update');
        $('#phiType .selected').attr('data-selected', itemType);
        $('#phiInput').val(itemValue);
        $('#itemId').val(itemId);


        $('#addPHIModal').css('display', 'flex');
        setTimeout(() => {
            $('#addPHIModal').addClass('show'); // Exibe o popup
        }, 500);

        // Marcar como item em edição
        // editingItem = itemId;
    });

    // Fechar modal
    $('#closeAddPHIModal').on('click', function () {
        $('#addPHIModal').removeClass('show'); // Exibe o popup
        setTimeout(() => {
            $('#addPHIModal').css('display', 'none');

            $('#addUpdateItem').attr('form-action', '');
            $("#addPHIModal .options-container").remove();
            $('#phiType .selected').attr('data-selected', '');
            $('#phiInput').val('');
            $('#itemId').val('');
        }, 500);
    });
});
