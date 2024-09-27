<?php


    if($_POST['action-not'] == 'add'){
        $_POST['nome_tabela-not'] = $_POST['type'];
        $_POST['id'] = Painel::generateUUID();
        $_POST['user_id'] = $_SESSION['user_id'];

        if(Painel::insert($_POST)){
            $return = [
                'type' => 'success',
                'id' => $_POST['id']
            ];
        }else{
            $return = [
                'type' => 'error',
                'msg' => [
                    'header' => 'Erro inesperado...',
                    'body' => 'Falha ao cadastrar ITEM'
                ],
            ];
        }

        echo json_encode($return);
        die();
    }

    if($_POST['action-not'] == 'remove'){
        $id = $_POST['id'];
        $tabela = $_POST['type'];

        if(!Painel::deletar($tabela, 'id', $id)){
            $return = [
                'type' => 'success'
            ];
        }else{
            $return = [
                'type' => 'error'
            ];
        }

        echo json_encode($return);
        die();
    }

    if($_POST['action-not'] == 'update'){
        $update = [
            'nome_tabela-not' => $_POST['type'],
            'id-not' => $_POST['id'],
            'item' => $_POST['item']
        ];

        if(!Painel::update($update, 'id')){
            $return = [
                'type' => 'success',
                'id' => $_POST['id']
            ];
        }else{
            $return = [
                'type' => 'error',
                'msg' => [
                    'header' => 'Erro inesperado...',
                    'body' => 'Falha ao atualizar ITEM'
                ],
            ];
        }

        echo json_encode($return);
        die();
    }