<?php

    $table = 'uploads';

    // Puxando do banco de dados
    $sql = MySql::conectar()->prepare("SELECT id, image_name, image_url, data_create FROM `$table` WHERE user_id = ? ORDER BY `data_create` DESC");

    $sql->execute(array($_SESSION['user_id']));

    $_GET['result'] = $sql->fetchAll();


    echo json_encode($_GET);
    die();
