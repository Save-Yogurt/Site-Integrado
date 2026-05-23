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


CREATE TABLE carga(
    id_carga INT PRIMARY KEY AUTO_INCREMENT,
    produto VARCHAR(45),
    qtd_caixas int,
    codigo_Carga VARCHAR(45) NOT NULL UNIQUE,
    status_carga VARCHAR(45) NOT NULL,
    fk_lote INT NOT NULL, 
    CONSTRAINT fk_carga_lote FOREIGN KEY (fk_lote) REFERENCES lote(id_lote)
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

INSERT INTO empresa 
(cnpj, razao_social, dt_criacao, token) 
VALUES
('11111111000101', 'Danone', '2026-04-10', '321123'),
('22222222000102', 'Vigor', '2026-04-10', '432234'),
('33333333000103', 'Batavo', '2026-04-10', '255772');


INSERT INTO sensor
(codigo_sensor, status_sensor, fk_empresa)
VALUES
('SEN001', 'Disponível', 1),
('SEN002', 'Em Uso', 1),
('SEN003', 'Disponível', 2),
('SEN004', 'Em Uso', 2),
('SEN005', 'Disponível', 3),
('SEN006', 'Disponível', 3);

INSERT INTO lote
(codigo_lote, dt_fabricacao, dt_validade, fk_empresa)
VALUES
('LOTEDAN001', '2026-04-01', '2026-05-01', 1),
('LOTEDAN002', '2026-04-05', '2026-05-05', 1),
('LOTEVIG001', '2026-04-02', '2026-05-02', 2),
('LOTEVIG002', '2026-04-06', '2026-05-06', 2),
('LOTEBAT001', '2026-04-03', '2026-05-03', 3),
('LOTEBAT002', '2026-04-07', '2026-05-07', 3);

INSERT INTO carga
(produto, qtd_caixas, codigo_carga, status_carga, fk_lote)
VALUES
('Iogurte Tradicional', 120, 'CARGA001', 'Armazenada', 1),
('Iogurte Grego', 90, 'CARGA002', 'Armazenada', 2),
('YoPRO Morango', 150, 'CARGA003', 'Transporte', 3),
('YoPRO Banana', 110, 'CARGA004', 'Armazenada', 4),
('Danette Chocolate', 130, 'CARGA005', 'Transporte', 5),
('Danette Creme', 100, 'CARGA006', 'Armazenada', 6);

INSERT INTO entrega 
(tipo_veiculo, veiculo_placa, ultima_loc, destino, fk_codigo_carga) 
VALUES 
('Caminhão baú', 'ABC1D23', 'São Paulo - SP', 'Rio de Janeiro - RJ', 'CARGA001'),
('Van refrigerada', 'XYZ9G87', 'Curitiba - PR', 'Porto Alegre - RS', 'CARGA002');

INSERT INTO monitoramento_sensor 
(fk_sensor, fk_carga, dt_inicio, dt_fim) 
VALUES
(1, 1, '2026-04-10 08:00:00', NULL),
(2, 2, '2026-05-10 08:00:00', NULL),
(3, 3, '2026-01-10 08:00:00', NULL),
(4, 4, '2026-02-10 08:00:00', NULL),
(5, 5, '2026-03-10 08:00:00', NULL),
(6, 6, '2026-01-10 08:00:00', NULL);