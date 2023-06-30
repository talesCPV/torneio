<?php

$query_db = array(
    "0"  => 'SELECT * FROM tb_jogadores ORDER BY nivel DESC;',
    "1"  => 'INSERT INTO tb_jogadores (id,nome,nivel) VALUES ("x00","x01","x02")
        ON DUPLICATE KEY UPDATE nome="x01", nivel="x02" ;',
    "2"  => 'DELETE FROM tb_jogadores WHERE id="x00";',
    "3"  => 'DELETE FROM tb_grupos WHERE 1=1;',
    "4"  => 'INSERT INTO tb_grupos (grupo,id_jogador) VALUES ("x00","x01");',
    "5"  => 'SELECT J.*, G.grupo FROM tb_jogadores AS J
            INNER JOIN tb_grupos AS G
            ON J.id = G.id_jogador
                        
            ORDER BY J.nivel DESC;',
    "6"  => 'SELECT J.* FROM tb_jogadores AS J
            INNER JOIN tb_grupos AS G
            ON J.id != G.id_jogador
            ORDER BY J.nivel DESC;',
    "7"  => 'DELETE FROM tb_sets WHERE id_jogo IN (SELECT id FROM tb_jogos WHERE grupo="x01");',
    "8"  => 'DELETE FROM tb_jogos WHERE grupo="x01";',
    "9"  => 'INSERT INTO tb_jogos (id,grupo,id_jogador_A,id_jogador_B,dia,hora) VALUES ("x00","x01","x02","x03","x04","x08")
            ON DUPLICATE KEY UPDATE dia="x01", sets_1A="x02", sets_1B="x03", sets_2A="x04", sets_2B="x05", sets_3A="x06", sets_3B="x07", hora="x08";',
    "10"  => 'SELECT J.*, G.grupo,

        SUM(IF((JG.sets_1A > 0 OR JG.sets_1B > 0)AND(J.id = JG.id_jogador_A OR J.id = JG.id_jogador_B),1,0)) AS JOGOS,	
        SUM( IF ( 
                    (J.id = JG.id_jogador_A AND( (JG.sets_1A > JG.sets_1B)+(JG.sets_2A > JG.sets_2B)+(JG.sets_3A > JG.sets_3B) > 1)) OR
                    (J.id = JG.id_jogador_B AND( (JG.sets_1B > JG.sets_1A)+(JG.sets_2B > JG.sets_2A)+(JG.sets_3B > JG.sets_3A) > 1)) ,1,0)) AS VITORIA,		            
        SUM( IF ( 
                    (J.id = JG.id_jogador_A AND( (JG.sets_1A < JG.sets_1B)+(JG.sets_2A < JG.sets_2B)+(JG.sets_3A < JG.sets_3B) > 1)) OR
                    (J.id = JG.id_jogador_B AND( (JG.sets_1B < JG.sets_1A)+(JG.sets_2B < JG.sets_2A)+(JG.sets_3B < JG.sets_3A) > 1)) ,1,0)) AS DERROTA,

        SUM( IF( 
					J.id = JG.id_jogador_A,(JG.sets_1A+JG.sets_2A),IF(
                    J.id = JG.id_jogador_B,(JG.sets_1B+JG.sets_2B),0))) AS G_PRO,
        SUM( IF( 
                    J.id = JG.id_jogador_A,(JG.sets_1B+JG.sets_2B),IF(
                    J.id = JG.id_jogador_B,(JG.sets_1A+JG.sets_2A),0))) AS G_CONTRA,

        SUM( IF( 
					J.id = JG.id_jogador_A,((JG.sets_1A > JG.sets_1B)+(JG.sets_2A>JG.sets_2B)+(JG.sets_3A>JG.sets_3B)),IF(
                    J.id = JG.id_jogador_B,((JG.sets_1A < JG.sets_1B)+(JG.sets_2A<JG.sets_2B)+(JG.sets_3A<JG.sets_3B)),0))) AS S_PRO,
		SUM( IF( 
					J.id = JG.id_jogador_A,((JG.sets_1A < JG.sets_1B)+(JG.sets_2A<JG.sets_2B)+(JG.sets_3A<JG.sets_3B)),IF(
                    J.id = JG.id_jogador_B,((JG.sets_1A > JG.sets_1B)+(JG.sets_2A>JG.sets_2B)+(JG.sets_3A>JG.sets_3B)),0))) AS S_CONTRA

        FROM tb_jogadores AS J
        INNER JOIN tb_grupos AS G
        INNER JOIN tb_jogos AS JG
        ON J.id = G.id_jogador
        AND (J.id = JG.id_jogador_A OR J.id = JG.id_jogador_B)
        AND G.grupo = "x00"      
        GROUP BY J.id
        ORDER BY VITORIA DESC, S_PRO DESC, S_CONTRA ASC, G_PRO DESC, G_CONTRA ASC, JOGOS DESC; ',
    "11"  => 'SELECT J.* ,((J.sets_1A > J.sets_1B)+(J.sets_2A>J.sets_2B)+(J.sets_3A>J.sets_3B)) AS PLACAR_A,((J.sets_1A < J.sets_1B)+(J.sets_2A<J.sets_2B)+(J.sets_3A<J.sets_3B)) AS PLACAR_B,  P1.nome AS jogador_A, P2.nome AS jogador_B
            FROM tb_jogos AS J
            INNER JOIN tb_jogadores AS P1
            INNER JOIN tb_jogadores AS P2
            ON  J.id_jogador_A = P1.id
            AND J.id_jogador_B = P2.id
            AND J.grupo = "x00"
            ORDER BY J.dia DESC; ',
    "12"  => 'SELECT J.* ,((J.sets_1A > J.sets_1B)+(J.sets_2A>J.sets_2B)+(J.sets_3A>J.sets_3B)) AS PLACAR_A,((J.sets_1A < J.sets_1B)+(J.sets_2A<J.sets_2B)+(J.sets_3A<J.sets_3B)) AS PLACAR_B,  P1.nome AS jogador_A, P2.nome AS jogador_B
        FROM tb_jogos AS J
        INNER JOIN tb_jogadores AS P1
        INNER JOIN tb_jogadores AS P2
        ON  J.id_jogador_A = P1.id
        AND J.id_jogador_B = P2.id        
        AND (P1.id = "x00" OR P2.id="x00")
        ORDER BY J.dia DESC; ',

    "13"  => 'SELECT * FROM tb_jogadores WHERE id_user IS NULL ORDER BY nivel DESC;',
    "14"  => 'INSERT INTO tb_usuario (id,email,hash) VALUES ("x00","x01","x02")
        ON DUPLICATE KEY UPDATE email="x01", hash="x02" ;',
    "15" => 'UPDATE tb_jogadores SET id_user=(select MAX(id) AS new_id from tb_usuario) WHERE id="x03" ;',
    "16" => 'SELECT USR.*, ATL.id AS id_atleta, ATL.nome AS atleta
        FROM tb_usuario AS USR
        INNER JOIN tb_jogadores AS ATL
        ON USR.id = ATL.id_user
        AND USR.email="x00"
        AND USR.hash="x01";',
    "17"  => 'DELETE FROM tb_jogos WHERE id="x00";',
    "18" => 'SELECT J.id, J.nome,        
	(
		((SUM( IF ( 
                    (J.id = JG.id_jogador_A AND( (JG.sets_1A > JG.sets_1B)+(JG.sets_2A > JG.sets_2B)+(JG.sets_3A > JG.sets_3B) > 1)) OR
                    (J.id = JG.id_jogador_B AND( (JG.sets_1B > JG.sets_1A)+(JG.sets_2B > JG.sets_2A)+(JG.sets_3B > JG.sets_3A) > 1)) ,1,0))        
		/        
        SUM(IF((JG.sets_1A > 0 OR JG.sets_1B > 0)AND(J.id = JG.id_jogador_A OR J.id = JG.id_jogador_B),1,0))) * 50)
        +
        (	(SUM( IF( 
				J.id = JG.id_jogador_A,((JG.sets_1A > JG.sets_1B)+(JG.sets_2A>JG.sets_2B)+(JG.sets_3A>JG.sets_3B)),IF(
				J.id = JG.id_jogador_B,((JG.sets_1A < JG.sets_1B)+(JG.sets_2A<JG.sets_2B)+(JG.sets_3A<JG.sets_3B)),0)))
			/			
			SUM((JG.sets_1A > JG.sets_1B)+(JG.sets_2A>JG.sets_2B)+(JG.sets_3A>JG.sets_3B)+(JG.sets_1A < JG.sets_1B)+(JG.sets_2A<JG.sets_2B)+(JG.sets_3A<JG.sets_3B))
			
			) * 30
        
        )
        +
        (	(SUM( IF( 
				J.id = JG.id_jogador_A,(JG.sets_1A+JG.sets_2A),IF(
				J.id = JG.id_jogador_B,(JG.sets_1B+JG.sets_2B),0)))
            /            
            SUM( JG.sets_1A+JG.sets_2A+JG.sets_1B+JG.sets_2B)) * 20                
        )        
	) AS RANKING,
    (
		(((SUM( IF ( 
                    (J.id = JG.id_jogador_A AND( (JG.sets_1A > JG.sets_1B)+(JG.sets_2A > JG.sets_2B)+(JG.sets_3A > JG.sets_3B) > 1)) OR
                    (J.id = JG.id_jogador_B AND( (JG.sets_1B > JG.sets_1A)+(JG.sets_2B > JG.sets_2A)+(JG.sets_3B > JG.sets_3A) > 1)) ,1,0))        
		/        
        SUM(IF((JG.sets_1A > 0 OR JG.sets_1B > 0)AND(J.id = JG.id_jogador_A OR J.id = JG.id_jogador_B),1,0))) * 50)
        +
        (	(SUM( IF( 
				J.id = JG.id_jogador_A,((JG.sets_1A > JG.sets_1B)+(JG.sets_2A>JG.sets_2B)+(JG.sets_3A>JG.sets_3B)),IF(
				J.id = JG.id_jogador_B,((JG.sets_1A < JG.sets_1B)+(JG.sets_2A<JG.sets_2B)+(JG.sets_3A<JG.sets_3B)),0)))
			/			
			SUM((JG.sets_1A > JG.sets_1B)+(JG.sets_2A>JG.sets_2B)+(JG.sets_3A>JG.sets_3B)+(JG.sets_1A < JG.sets_1B)+(JG.sets_2A<JG.sets_2B)+(JG.sets_3A<JG.sets_3B))
			
			) * 30
        
        )
        +
        (	(SUM( IF( 
				J.id = JG.id_jogador_A,(JG.sets_1A+JG.sets_2A),IF(
				J.id = JG.id_jogador_B,(JG.sets_1B+JG.sets_2B),0)))
            /            
            SUM( JG.sets_1A+JG.sets_2A+JG.sets_1B+JG.sets_2B)) * 20                
        )        
	) / 100) * 6 AS STARS
                    
	FROM tb_jogadores AS J
	INNER JOIN tb_grupos AS G
	INNER JOIN tb_jogos AS JG
	ON J.id = G.id_jogador
	AND (J.id = JG.id_jogador_A OR J.id = JG.id_jogador_B)
	GROUP BY J.id
	ORDER BY RANKING DESC;',



    );

?>