$(document).ready(function() {
    let currentImageIndex = 0;
    let images = [];

    // Inicializando o mCustomScrollbar na galeria
    $(".gallery-contain").mCustomScrollbar({
        theme: "minimal-dark",
        axis: "y",
        scrollInertia: 200,
        autoHideScrollbar: true
    });

    // Carregar imagens na galeria
    function loadGalleryImages(load = false) {
        $('.gallery-grid').empty();

        $.ajax({
            url: include_path+'backend/index.php',
            type: 'GET',
            data: {uploads: 'images'},
            dataType: 'json',
            async: true,
            beforeSend: function(){
                if(!load){
                    $(`.gallery-grid`).prepend(`
                        <div class="single-img skeleton"></div>
                        <div class="single-img skeleton"></div>
                        <div class="single-img skeleton"></div>
                        <div class="single-img skeleton"></div>   
                    `);
                }
            },
            success: async function (data) {
                $(`.gallery-grid`).empty();        

                if (data.result.length === 0) {
                    $(`.gallery-grid`).append(`
                        <li>
                            <div class="item-single">
                                <button class="apenUploadModal"><i class="fas fa-plus"></i>&nbsp;&nbsp;Adicionar</button>
                            </div>
                        </li>    
                    `);
                }else{
                    images = [...data.result];

                    images.map(async (img, index) => {
                        await $('.gallery-grid').append(`
                            <div class="single-img" data-id="${img.id}">
                                <img src="${img.image_url}" data-index="${index}" alt="Galeria de imagens: ${img.image_name}">
                            </div>
                        `);
                    });

                    setTimeout(() => {
                        resizeGridItems();
                    }, 500)
                }
            },
            error: function(data){
                console.error(data.responseText)
                toastr.error('Ocorreu um erro inesperado', 'Erro Inesperado')

            }
        });
    }
    
    // Adiciona imagens inicialmente
    loadGalleryImages();

    // Função para ajustar a altura das imagens para criar o efeito Masonry
    function resizeGridItems() {
        if(images.length > 0){
            $('.gallery-grid .single-img').each(async function(index) {
                var img = $(this).find('img');
                var singleImg = $(this);
                var heightImg = img[0].getBoundingClientRect().height;
    
                var rowHeight = 10; // O mesmo valor de 'grid-auto-rows'
                var rowSpan = Math.ceil(heightImg / rowHeight);
                singleImg.css('grid-row-end', 'span ' + rowSpan)
                singleImg.css('height', heightImg);
                
            });
        }

    }

    $(window).on('load', resizeGridItems);
    $(window).resize(resizeGridItems); // Ajuste ao redimensionar a janela

    // Ao clicar em uma imagem, abrir o lightbox
    $(document).on('click', '.gallery-grid img', function() {
        currentImageIndex = $(this).data('index');
        openLightbox(images[currentImageIndex]);
    });

    // Abrir lightbox com a imagem selecionada
    function openLightbox(src) {
        $('#lightbox').fadeIn().addClass('show').css('display', 'flex');
        $('.lightbox-image').attr('src', src.image_url);
        loadThumbnails(); // Carregar miniaturas
        setActiveThumbnail(currentImageIndex); // Definir a miniatura ativa
    }

    // Função para carregar as miniaturas
    function loadThumbnails(updateIndex = false) {
        $('.thumbnail-nav').empty(); // Limpa miniaturas anteriores
        images.forEach((image, index) => {
            $('.thumbnail-nav').append(`
                <div class="single-miniatura" data-index="${index}">
                    <img src="${image.image_url}" class="thumbnail" alt="Miniatura">
                </div>
            `);

            if(updateIndex){
                $(`.single-img[data-id="${image.id}"] img`).attr("data-index", index);
            }
        });

        // Inicializa a barra de rolagem mCustomScrollbar
        $('.thumbnail-nav-container').mCustomScrollbar({
            axis: "x",
            theme: "minimal-dark",
            scrollInertia: 300,
            autoHideScrollbar: true,
        });
    }

    // Função para definir a miniatura ativa
    function setActiveThumbnail(index) {
        $('.single-miniatura').removeClass('active');
        $(`.single-miniatura[data-index="${index}"]`).addClass('active');

        $('.btn-delete').attr("data-index", index);
        $('.btn-delete').attr("data-id", images[index].id);
        $('.btn-delete').attr("data-nome", images[index].image_name);
        $('.btn-delete').attr("title", `Remover: ${images[index].image_name}`);
        
        $('#imageToDownload').attr("title", `Baixar: ${images[index].image_name}`);
        $('#imageToDownload').attr("data-src", images[index].image_url);

        $('.info-img p').text(images[index].image_name);
        $('.info-img span').text(formatarDataHora(images[index].data_create));
    }

    // Navegar para a próxima imagem
    $('.next').click(function() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        $('.lightbox-image').attr('src', images[currentImageIndex].image_url);
        setActiveThumbnail(currentImageIndex);
    });

    // Navegar para a imagem anterior
    $('.prev').click(function() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        $('.lightbox-image').attr('src', images[currentImageIndex].image_url);
        setActiveThumbnail(currentImageIndex);
    });

    // Navegar pela miniatura clicada
    $(document).on('click', '.single-miniatura', function() {
        currentImageIndex = $(this).data('index');
        $('.lightbox-image').attr('src', images[currentImageIndex].image_url);
        setActiveThumbnail(currentImageIndex);
    });

    // Fechar o lightbox
    $('.close-lightbox').click(function() {
        $('#lightbox').fadeOut().removeClass('show');
    });

    // Fechar ao clicar fora da imagem
    $('#lightbox').click(function(e) {
        if ($(e.target).is('.close-lightbox, .lightbox'))
            $('#lightbox').fadeOut().removeClass('show');
    });

    // Excluir imagem da galeria
    $(document).on('click', '.btn-delete', function() {

        let imgId = $(this).attr('data-id');
        let imgName = $(this).attr('data-nome');
        let index = $(this).attr('data-index');

        $.ajax({
            url: include_path+'backend/index.php',
            method: 'POST',
            data: {
                'action-img': 'remove',
                id: imgId,
                nome: imgName
            },
            dataType: 'json',
            async: true,
            success: function (data) {
                
                if(data.type == 'success'){
                    toastr.success(`Imagem deletada com sucesso...`);

                    $(`.single-img[data-id='${imgId}']`).remove(); 
                    images.splice(index, 1); // Remove a imagem do array

                    if(images.length >= 1){
                        loadThumbnails(true);
                        $('.lightbox-image').attr('src', images[0].image_url);
                        setActiveThumbnail(0);
                        resizeGridItems();
                    }else{
                        $('#lightbox').fadeOut().removeClass('show');
                        loadGalleryImages();
                    }
                }else{
                    toastr.error('Falha ao deletar imagem', 'Erro Inesperado');
                }


            },
            error: function(){
                console.error(data.responseText);
                toastr.error('Ocorreu um erro inesperado', 'Erro Inesperado');
            }
        });
    });

    // Baixar imagem
    $(document).on('click', '#imageToDownload', function() {
        const imageUrl = $(this).attr('data-src'); // Obtém a URL da imagem
        const imageName = imageUrl.split('/').pop(); // Obtém o nome da imagem
    
        // Cria um elemento <a> temporário para o download
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageName; // Define o nome do arquivo de download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove o link após o clique
    });





    
    

    // Adicionando modal pra Upload de Imagens
    $(document).on('click', '.apenUploadModal', function(){
        $('#addUploadModal').css('display', 'flex');
        setTimeout(() => {
            $('#addUploadModal').addClass('show'); // Exibe o popup
        }, 500);
    });


    let selectedFiles = [];

    // Função para mostrar pré-visualizações de miniaturas de imagens
    function previewImages(file) {
        const previewContainer = $('#previewContainer');
        const reader = new FileReader();
        reader.onload = function(e) {
            // Verifica se a imagem já foi selecionada
            previewContainer.append(`
                <div class="thumbnail-container" data-name="${file.name}">
                    <img src="${e.target.result}" alt="Pré-visualização" class="thumbnail-img">
                    <span class="remove-image" data-name="${file.name}"><i class="fa-solid fa-trash"></i></span>
                </div>
            `);
        };
        reader.readAsDataURL(file);
    }

    /// Carregar imagens no upload e manter as imagens já selecionadas
    $('#imageUpload').on('change', function () {
        let newFiles = Array.from(this.files);

        if(!newFiles.filter(file => file.type.startsWith('image/')).length){
            toastr.warning('Arquivo não suportado');
        }

        // Filtra apenas arquivos de imagem
        let validFiles = newFiles.filter(file => file.type.startsWith('image/'));
        
        // Adiciona as novas imagens à lista de arquivos sem duplicatas
        validFiles.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name)) {
                selectedFiles.push(file);

                // Atualiza a pré-visualização com todas as imagens selecionada
                previewImages(file);
            }else{
                toastr.info('Imagem já foi selecionada...');
            }
        });

        // Limpa o input para permitir nova seleção sem resetar o formulário
        this.value = '';

        $('#errorUploadInput').hide(); // Esconde a mensagem de erro

    });

    // Remover imagem da pré-visualização
    $('#previewContainer').on('click', '.remove-image', function() {
        $(this).parent().remove(); // Remove a imagem e o botão

        const fileName = $(this).data('name');

        // Remove a imagem da lista de arquivos selecionados
        selectedFiles = selectedFiles.filter(file => file.name !== fileName);
    });

    // Função para permitir arrastar e soltar arquivos
    $('#addUploadModal .popup-content').on('dragover', function (e) {
        e.preventDefault(); // Evita o comportamento padrão
        $(this).addClass('dragging'); // Adiciona uma classe para efeito visual
    });

    $('#addUploadModal .popup-content').on('dragleave', function () {
        $(this).removeClass('dragging'); // Remove a classe de arraste
    });

    $('#addUploadModal .popup-content').on('drop', function (e) {
        e.preventDefault(); // Evita o comportamento padrão
        const files = e.originalEvent.dataTransfer.files; // Obtém os arquivos arrastados

        let newFiles = Array.from(files);

        if(!newFiles.filter(file => file.type.startsWith('image/')).length){
            toastr.warning('Arquivo não suportado');
        }

        // Filtra apenas arquivos de imagem
        let validFiles = newFiles.filter(file => file.type.startsWith('image/'));


        // Adiciona as novas imagens à lista de arquivos sem duplicatas
        validFiles.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name)) {
                selectedFiles.push(file);

                // Atualiza a pré-visualização com todas as imagens selecionada
                previewImages(file);
            }else{
                toastr.info('Imagem já foi selecionada...');
            }
        });

        $('#addUploadModal .popup-content').removeClass('dragging'); // Remove a classe de arraste
        $('#errorUploadInput').hide(); // Esconde a mensagem de erro
        
        // Limpa o input para permitir nova seleção sem resetar o formulário
        this.value = '';
    });

    // Enviar imagens via AJAX
    $(document).on('submit', '#addUpdateImage', function(e) {
        e.preventDefault(); // Impede o comportamento padrão do formulário

        if(!selectedFiles.length){
            $("#errorUploadInput").show();

            return false;
        }

        const formData = new FormData();
        
        // Adicionar todos os arquivos ao FormData
        selectedFiles.forEach(file => {
            formData.append('images[]', file);
        });

        
        $.ajax({
            url: include_path+'backend/index.php', // Substitua pelo seu endpoint de upload
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            async: true,
            beforeSend: function(){
                toastr.info('Fazendo Uploads...')

                $('#submitUpload').prop('disabled', true);
                $('#imageUpload').prop('disabled', true);
            },
            success: function(response) {
                // Assumindo que o servidor retorne as URLs das imagens carregadas
                // images.push(...response.imageUrls);
                // loadGalleryImages(); // Recarregar a galeria com as novas imagens
                $('#submitUpload').prop('disabled', false);
                $('#imageUpload').prop('disabled', false);
                
                selectedFiles = [];
                
                
                // // Fechando Modal
                $('#addUploadModal').removeClass('show'); // Exibe o popup
                setTimeout(() => {
                    $('#addUploadModal').css('display', 'none');
                    $('#previewContainer').empty();
                }, 500);

                response.forEach(function(res){
                    if(res.type == 'success'){
                        if(('msg' in res)){
                            toastr.success(res.msg);
                        }else if(('nome' in res)){
                            toastr.success(`Imagem: ${res.nome}`, 'Upload de Imagem...');
    
                        }                        
                    }else{
                        toastr.error(res.msg.body, res.msg.header);
                    }
                });

                loadGalleryImages();

            },
            error: function(error) {
                console.error(error.responseText)
                $('#submitUpload').prop('disabled', false);
                $('#imageUpload').prop('disabled', false);

                toastr.error('Erro ao fazer upload das imagens', 'Erro Inesperado');
            }
        });
    });


    // Fechar modal
    $('#closeUploadModal').on('click', function () {
        $('#addUploadModal').removeClass('show'); // Exibe o popup
        setTimeout(() => {
            $('#addUploadModal').css('display', 'none');
        }, 500);
    });
});
