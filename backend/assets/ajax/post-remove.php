<?php

    if($_POST['action-img'] == 'remove'){
        $id = $_POST['id'];
        $tabela = 'uploads';

        if(!Painel::deletar($tabela, 'id', $id)){
            @unlink(dirname(dirname(dirname(dirname(__FILE__)))).'/assets/uploads/'.$_POST['nome']);
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