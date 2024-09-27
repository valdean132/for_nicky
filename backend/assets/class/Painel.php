<?php

    class Painel{

        // Gerador de UUID
        public static function generateUUID() {
            return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), // 8 primeiros caracteres
                mt_rand(0, 0xffff), // 4 caracteres
                mt_rand(0, 0x0fff) | 0x4000, // 4 caracteres com versão 4 (UUID versão 4)
                mt_rand(0, 0x3fff) | 0x8000, // 4 caracteres com variante
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff) // 12 caracteres finais
            );
        }

        // Inserindo depoimento no banco de dados
        public static function insert($arr){
            $certo = true;
            $first = false;
            $nome_tabela = $arr['nome_tabela-not'];
            $query = "INSERT INTO `$nome_tabela` (";
            
            foreach($arr as $key => $value){
                $nome = $key;

                if(substr($nome, -4, 4) == '-not' || substr($nome, -3, 3) == '-no')
                    continue;

                if($first == false){
                    $first = true;
                    $query.="`$nome`";
                }else{
                    $query.=",`$nome`";
                }
                
            }
            $first = false;
            $query.= ") VALUES (";

            foreach($arr as $key => $value){
                $nome = $key;

                if(substr($nome, -4, 4) == '-not' || substr($nome, -3, 3) == '-no')
                    continue;

                if($first == false){
                    $first = true;
                    $query.="?";
                }else{
                    $query.=",?";
                }
                $parametros[] = $value;
                
            }
            $query.=")";

            if($certo == true){
                $sql = MySql::conectar()->prepare($query);
                $sql->execute($parametros);

            }

            return $certo;
        }

        // Atualizando dinamicamente no banco de dados
        public static function update($arr, $condition = false, $single = false){
            $certo = true;
            $first = false;
            $nome_tabela = $arr['nome_tabela-not'];
            $query = "UPDATE `$nome_tabela` SET ";

            foreach($arr as $key => $value){
                $nome = $key;

                if(substr($nome, -4, 4) == '-not' || $nome == $condition)
                    continue;

                if($first == false){
                    $first = true;
                    $query.="`$nome`=?";
                }else{
                    $query.=",`$nome`=?";
                }
                $parametros[] = $value;
                
            }

            if($certo == true){
                if($single == false){
                    $parametros[] = $arr[$condition.'-not'];
                    $sql = MySql::conectar()->prepare("$query WHERE `$condition`=?");
                    $sql->execute($parametros);
                }else{
                    $sql = MySql::conectar()->prepare($query);
                    $sql->execute($parametros);
                }
            }
        }
        
        // Puxando do banco de dados
        public static function selectAll($tabela, $where = ''){
            $sql = MySql::conectar()->prepare("SELECT * FROM `$tabela` $where");
            
            $sql->execute();

            return $sql->fetchAll();
        }

        // Verificar se usuário já existe
        public static function userExists($user, $table, $column, $idUser = NULL){
            if($idUser == NULL){
                $sql = MySql::conectar()->prepare("SELECT $column FROM `$table` WHERE `$column` = ?");
                $sql->execute(array($user));
            }else{
                $sql = MySql::conectar()->prepare("SELECT `id` FROM `$table` WHERE `$column` = ? AND id_user != ?");
                $sql->execute(array($user, $idUser));
            }
            if($sql->rowCount() > 0)
                return $sql->fetch();
            else
                return false;
        }

        // Deletar cadastros
        public static function deletar($tabela, $column = false, $value = false){
            if($value == false){
                $sql = MySql::conectar()->prepare("DELETE FROM `$tabela`");
            }else{
                $sql = MySql::conectar()->prepare("DELETE FROM `$tabela` WHERE `$column` = '$value'");
            }
            $sql->execute();
        }

        // Verificar valor já está no banco de dados
        public static function noRepeat($value, $table, $column, $id){
            $sql = MySql::conectar()->prepare("SELECT `code_uniq` FROM `$table` WHERE `$column` = ? AND `code_uniq` = ?");
            $sql->execute(array($value, $id));

            if($sql->rowCount() == 1)
                return true;
            else
                return false;
        }

    }

?>