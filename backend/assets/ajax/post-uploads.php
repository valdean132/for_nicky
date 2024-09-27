<?php


    // Verifica se arquivos foram enviados
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['images'])) {
        // $userId = $_POST['user_id'];  // ID do usuário (assumindo que você tenha esse dado vindo de um formulário)
        $uploadsDirectory = dirname(dirname(dirname(dirname(__FILE__)))).'/assets/uploads/';  // Diretório onde as imagens serão salvas

        // Criar diretório, se não existir
        if (!is_dir($uploadsDirectory)) {
            mkdir($uploadsDirectory, 0777, true);
        }

        $images = $_FILES['images'];

        foreach ($images['tmp_name'] as $key => $tmpName) {
            $originalName = basename($images['name'][$key]); // Nome original do arquivo
            $filePath = $uploadsDirectory . $originalName;

            // Verifica se o arquivo já existe
            if (file_exists($filePath)) {
                $fileInfo = pathinfo($originalName);
                $fileBase = $fileInfo['filename'];
                $fileExt = $fileInfo['extension'];

                // Gerar um nome único adicionando timestamp para evitar duplicação
                $newFileName = $fileBase . '_' . time() . '.' . $fileExt;
                $filePath = $uploadsDirectory . $newFileName;
            } else {
                $newFileName = $originalName;
            }

            $_POST['image_name'] = $newFileName;
            $_POST['image_url'] = INCLUDE_PATH.'assets/uploads/' . $newFileName;
            $_POST['id'] = Painel::generateUUID();
            $_POST['user_id'] = $_SESSION['user_id'];
            $_POST['nome_tabela-not'] = 'uploads';
            // $_POST['data_create'] = date('Y-m-d H:i:s');

            // Move o arquivo para a pasta de upload
            if (move_uploaded_file($tmpName, $filePath)) {
                // Inserir no banco de dados a URL e o nome da imagem
                Painel::insert($_POST);

                $return[] = [
                    'type' => 'success',
                    'nome' => $_POST['image_name']
                ];
            } else {
                $return[] = [
                    'type' => 'error',
                    'msg' => [
                        'header' => 'Erro inesperado...',
                        'body' => 'Imagem não pode ser salva'
                    ],
                ];
            }
        }

        $return[] = [
            'type' => 'success',
            'msg' => 'Upload Finalizado'
        ];

        echo json_encode($return);
        die();

    } else {
        $return = [
            'type' => 'error',
            'msg' => [
                'header' => 'Erro inesperado...',
                'body' => 'Falha no upload'
            ],
        ];
        echo json_encode($return);
    }
