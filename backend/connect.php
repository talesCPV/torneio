<?php

    $usuario = 'd2soft98_tales';
    $senha= '#Sucata65';
    $servidor = '50.116.87.200';
    $banco = 'd2soft98_voley';

    $conexao = new mysqli($servidor, $usuario, $senha, $banco);

    if (!$conexao){
        die ("Erro de conexão com localhost, o seguinte erro ocorreu -> ".mysql_error());
    }    

?>