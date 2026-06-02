CREATE DATABASE SaveYogurt;

USE SaveYogurt;

CREATE TABLE empresa(
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    cnpj CHAR(14) NOT NULL UNIQUE,
    razao_social VARCHAR(200) NOT NULL,
    dt_criacao DATETIME NOT NULL DEFAULT NOW(),
    token CHAR(16) NOT NULL UNIQUE
);

CREATE TABLE usuario(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    dt_criacao DATETIME NOT NULL DEFAULT NOW(),
    fk_empresa INT NOT NULL,
    CONSTRAINT fk_usuario_empresa 
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE sensor(
    id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    codigo_sensor VARCHAR(45) NOT NULL UNIQUE,
    status_sensor VARCHAR(30) NOT NULL, 
    fk_empresa INT NOT NULL,
    CONSTRAINT ch_status_sensor 
        CHECK(status_sensor IN ('Disponível','Em Uso')),
    CONSTRAINT fk_sensor_empresa 
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE lote(
    id_lote INT PRIMARY KEY AUTO_INCREMENT,
    codigo_lote VARCHAR(45) NOT NULL UNIQUE,
    qtd_caixas INT,
    dt_fabricacao DATE NOT NULL,
    dt_validade DATE NOT NULL,
    fk_empresa INT,
    CONSTRAINT cfk_lote_empresa 
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE entrega (
    id_entrega INT PRIMARY KEY AUTO_INCREMENT,
    tipo_veiculo VARCHAR(45),
    veiculo_placa VARCHAR(10) NOT NULL,
    ultima_loc VARCHAR (55),
    destino VARCHAR(100) NOT NULL,
    dt_inicio DATETIME DEFAULT NOW(),
    fk_codigo_carga varchar(45), 
    CONSTRAINT fk_entrega_carga FOREIGN KEY (fk_codigo_carga) REFERENCES carga(codigo_Carga)
);

CREATE TABLE carga(
    id_carga INT PRIMARY KEY AUTO_INCREMENT,
    produto VARCHAR(45),
    qtd_caixas int,
    codigo_Carga VARCHAR(45) NOT NULL UNIQUE,
    status_carga VARCHAR(45) NOT NULL,
    fk_lote INT NOT NULL, 
    CONSTRAINT fk_carga_lote FOREIGN KEY (fk_lote) REFERENCES lote(id_lote)
);

CREATE TABLE monitoramento_sensor(
    id_monitoramento INT PRIMARY KEY AUTO_INCREMENT,
    fk_sensor INT NOT NULL,
    fk_carga INT NOT NULL,
    dt_inicio DATETIME NOT NULL DEFAULT NOW(),
    dt_fim DATETIME NULL,
    CONSTRAINT fk_monit_sensor FOREIGN KEY (fk_sensor) REFERENCES sensor(id_sensor),
    CONSTRAINT fk_monit_carga FOREIGN KEY (fk_carga) REFERENCES carga(id_carga)
);

CREATE TABLE registro(
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    dt_registro DATETIME DEFAULT NOW() NOT NULL,
    temperatura DECIMAL(5,2) NOT NULL,
    fk_sensor INT NOT NULL,
    CONSTRAINT fk_registro_sensor 
        FOREIGN KEY (fk_sensor) REFERENCES sensor(id_sensor)
);

CREATE TABLE alerta (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100), 
    dt_alerta DATETIME DEFAULT NOW(),
    fk_registro INT, 
    fk_carga INT,  
    CONSTRAINT fk_alerta_registro FOREIGN KEY (fk_registro) REFERENCES registro(id_registro),
    CONSTRAINT fk_alerta_carga FOREIGN KEY (fk_carga) REFERENCES carga(id_carga)
);


INSERT INTO empresa (cnpj, razao_social, token) VALUES 
('12345678000100', 'Danone', '321123'),
('98765432000199', 'Vigor', '432234'),
('91923847564563', 'Nestlé', '567893');

INSERT INTO usuario (nome, cpf, email, senha, fk_empresa) VALUES
('Suporte Danone', '11111111111', 'suporte.danone@gmail.com', '@Suporte.danone', 1),
('Suporte Vigor', '22222222222', 'suporte.vigor@gmail.com', '@Suporte.vigor', 2),
('Suporte Nestlé','33333333333', 'suporte.nestlé@gmail.com','@Suporte.nestlé', 3);

INSERT INTO sensor (codigo_sensor, status_sensor, fk_empresa) VALUES
('SEN001', 'Disponível', 1),
('SEN002', 'Em Uso', 1),
('SEN003', 'Disponível', 2),
('SEN004', 'Em Uso', 2),
('SEN005', 'Disponível', 3),
('SEN006', 'Disponível', 3);

INSERT INTO lote
(codigo_lote, dt_fabricacao, dt_validade, fk_empresa)
VALUES
('DANLOTE001', '2026-04-01', '2026-05-01', 1),
('DANLOTE002', '2026-04-05', '2026-05-05', 1),
('VIGLOTE001', '2026-04-02', '2026-05-02', 2),
('VIGLOTE002', '2026-04-06', '2026-05-06', 2),
('NESTLOTE001', '2026-04-03', '2026-05-03', 3),
('NESTLOTE002', '2026-04-07', '2026-05-07', 3);

INSERT INTO carga
(produto, qtd_caixas, codigo_carga, status_carga, fk_lote)
VALUES
('Activia', 120, 'C001', 'Armazenada', 1),
('YoPRO Chocolate', 90, 'C002', 'Armazenada', 2),
('Vigor Grego', 150, 'C003', 'Transporte', 3),
('Vigor Natural', 110, 'C004', 'Armazenada', 4),
('Chamyto', 130, 'C005', 'Transporte', 5),
('Ninho Fases', 100, 'C006', 'Armazenada', 6);

INSERT INTO entrega 
(tipo_veiculo, veiculo_placa, ultima_loc, destino, fk_codigo_carga) 
VALUES 
('Caminhão', 'ABC1D23', 'São Paulo - SP', 'Rio de Janeiro - RJ', 'C001'),
('Van refrigerada', 'XYZ9G87', 'Curitiba - PR', 'Porto Alegre - RS', 'C002'),
('Avião', 'A33F', 'Guarulhos - SP', 'Florianópolis - SC', 'C003');



CREATE VIEW listarCargasSemEntrega
AS 
	SELECT 
    c.id_carga, 
    c.codigo_Carga, 
    c.qtd_caixas
FROM carga c
LEFT JOIN entrega e ON c.codigo_Carga = e.fk_codigo_carga
WHERE e.id_entrega IS NULL;


CREATE VIEW listarLotes
AS
	SELECT id_lote, codigo_lote FROM lote;



CREATE VIEW listarSensoresDisponiveis
AS
	SELECT id_sensor, codigo_sensor FROM sensor WHERE status_sensor = 'Disponível';



CREATE VIEW cargasAlerta
AS
	SELECT 
    COUNT(DISTINCT c.id_carga) AS qtd_cargas_criticas, 
    GROUP_CONCAT(DISTINCT c.codigo_Carga ORDER BY c.codigo_Carga SEPARATOR ', ') AS identificadores_cargas 
FROM alerta a 
JOIN carga c ON a.fk_carga = c.id_carga 
JOIN lote l ON c.fk_lote = l.id_lote 
WHERE a.descricao = 'Critico' 
  AND l.fk_empresa = 1;
  
  
CREATE VIEW maiorTemperatura
AS 
	SELECT 
    MAX(registro.temperatura) AS maiortemp,
    carga.codigo_carga
FROM registro
JOIN sensor ON registro.fk_sensor = sensor.id_sensor
JOIN monitoramento_sensor ms ON sensor.id_sensor = ms.fk_sensor
JOIN carga ON ms.fk_carga = carga.id_carga
JOIN lote ON carga.fk_lote = lote.id_lote 
WHERE sensor.fk_empresa = 1
  AND lote.fk_empresa = 1
GROUP BY carga.codigo_carga
ORDER BY maiortemp DESC
LIMIT 1;


CREATE VIEW menorTemperatura
AS
	SELECT 
    MIN(registro.temperatura) AS menortemp,
    carga.codigo_carga
FROM registro
JOIN sensor ON registro.fk_sensor = sensor.id_sensor
JOIN monitoramento_sensor ms ON sensor.id_sensor = ms.fk_sensor
JOIN carga ON ms.fk_carga = carga.id_carga
JOIN lote ON carga.fk_lote = lote.id_lote 
WHERE sensor.fk_empresa = 1
  AND lote.fk_empresa = 1
GROUP BY carga.codigo_carga
ORDER BY menortemp DESC
LIMIT 1;


CREATE VIEW tabela
AS
	SELECT l.codigo_lote,
		e.veiculo_placa,
        e.tipo_veiculo,
        c.status_carga,
        count(id_alerta) AS total_alertas,
        c.codigo_Carga,
        e.destino,
        e.ultima_loc
        FROM lote l
        JOIN carga c ON l.id_lote = c.fk_lote
        JOIN entrega e ON e.fk_codigo_carga = c.id_carga
        JOIN monitoramento_sensor ms ON c.id_carga = ms.fk_carga
        JOIN sensor s ON ms.fk_sensor = s.id_sensor
        JOIN registro r ON s.id_sensor = r.fk_sensor
        JOIN alerta a ON r.id_registro = a.fk_registro
        WHERE l.fk_empresa = 1
        GROUP BY l.codigo_lote, 
         e.veiculo_placa, 
         e.tipo_veiculo, 
         c.status_carga, 
         c.codigo_Carga, 
         e.destino, 
         e.ultima_loc; 
         
         
CREATE VIEW pesquisar
AS
	SELECT 
    l.codigo_lote, 
    e.veiculo_placa, 
    e.tipo_veiculo, 
    c.status_carga, 
    COUNT(a.id_alerta) AS total_alertas, 
    c.codigo_Carga, 
    e.destino, 
    e.ultima_loc 
FROM lote l 
JOIN carga c ON l.id_lote = c.fk_lote 
JOIN entrega e ON e.fk_codigo_carga = c.id_carga 
JOIN monitoramento_sensor ms ON c.id_carga = ms.fk_carga 
JOIN sensor s ON ms.fk_sensor = s.id_sensor 
JOIN registro r ON s.id_sensor = r.fk_sensor 
JOIN alerta a ON r.id_registro = a.fk_registro 
WHERE l.fk_empresa = 1 
  AND (l.codigo_lote LIKE '%LOTE001'
       OR c.codigo_Carga LIKE '%C001') 
GROUP BY 
    l.codigo_lote, 
    e.veiculo_placa, 
    e.tipo_veiculo, 
    c.status_carga, 
    c.codigo_Carga, 
    e.destino, 
    e.ultima_loc;


CREATE VIEW obterKpis
AS
	SELECT 
		c.codigo_Carga,
		l.codigo_lote,
		s.codigo_sensor,
		DATE_FORMAT(ms.dt_inicio, '%d/%m/%Y') AS dt_inicio_formatada,
		(SELECT r.temperatura FROM registro r 
			WHERE r.fk_sensor = s.id_sensor 
			ORDER BY r.dt_registro DESC LIMIT 1) AS ultima_temperatura
        FROM carga c
        JOIN lote l ON c.fk_lote = l.id_lote
        LEFT JOIN monitoramento_sensor ms ON ms.fk_carga = c.id_carga AND ms.dt_fim IS NULL
        LEFT JOIN sensor s ON ms.fk_sensor = s.id_sensor
        WHERE c.id_carga = 'C001';
        


CREATE VIEW obterDadosGrafico
AS
	SELECT 
		DATE_FORMAT(r.dt_registro, '%H:%i') AS horario,
		r.temperatura
	FROM registro r
	JOIN monitoramento_sensor ms ON r.fk_sensor = ms.fk_sensor
	WHERE ms.fk_carga = 1
		AND r.dt_registro >= ms.dt_inicio
		AND (ms.dt_fim IS NULL OR r.dt_registro <= ms.dt_fim)
	ORDER BY r.dt_registro DESC
	LIMIT 12;
    


CREATE VIEW obterTabelaDesvios
AS
	SELECT 
		DATE_FORMAT(a.dt_alerta, '%d/%m %H:%i') AS data_formatada,
		r.temperatura,
		a.descricao
	FROM alerta a
	JOIN registro r ON a.fk_registro = r.id_registro
	WHERE a.fk_carga = 1
	ORDER BY a.dt_alerta DESC;
    
    
CREATE VIEW obterDadoTempoReal
AS
	SELECT 
		r.temperatura, 
		DATE_FORMAT(r.dt_registro, '%H:%i:%s') AS horario 
	FROM registro r
	JOIN monitoramento_sensor ms ON r.fk_sensor = ms.fk_sensor
	WHERE ms.fk_carga = 1
	ORDER BY r.dt_registro DESC 
	LIMIT 1;