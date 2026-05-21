create database SaveYogurt;

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
    temp_min DECIMAL(5,2) NOT NULL, 
    temp_max DECIMAL(5,2) NOT NULL,
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
('12345678000100', 'Logística Rápida S.A.', '321123'),
('98765432000199', 'Frio Extremo Transportes Ltda', '432234');

INSERT INTO usuario (nome, cpf, email, senha, fk_empresa) VALUES 
('Carlos Silva', '11122233344', 'carlos@lograpida.com', '12345678', 1),
('Ana Souza', '55566677788', 'ana@frioextremo.com', '12345678', 2);

INSERT INTO sensor (codigo_sensor, status_sensor, fk_empresa) VALUES 
('SNS-1001', 'Em Uso', 1),
('SNS-2002', 'Em Uso', 2);

INSERT INTO lote (codigo_lote, dt_fabricacao, dt_validade, fk_empresa) VALUES 
('LOT-2026-A', '2026-01-10', '2026-12-31', 1),
('LOT-2026-B', '2026-02-15', '2027-02-15', 2);

INSERT INTO carga 
(produto, qtd_caixas, codigo_Carga, status_carga, temp_min, temp_max, fk_lote) 
VALUES 
('Vacinas', 150, 'C001', 'Em trânsito', 2.00, 8.00, 1),
('Peixes congelados', 500, 'C002', 'Em trânsito', -22.00, -18.00, 2);

INSERT INTO entrega 
(tipo_veiculo, veiculo_placa, ultima_loc, destino, fk_codigo_carga) 
VALUES 
('Caminhão baú', 'ABC1D23', 'São Paulo - SP', 'Rio de Janeiro - RJ', 'C001'),
('Van refrigerada', 'XYZ9G87', 'Curitiba - PR', 'Porto Alegre - RS', 'C002');

INSERT INTO monitoramento_sensor (fk_sensor, fk_carga) VALUES 
(1, 1),
(2, 2);

-- Registros para o sensor 1: Vacinas, limite ideal entre 2°C e 8°C
INSERT INTO registro (temperatura, fk_sensor) VALUES 
(4.20, 1),
(3.80, 1),
(1.50, 1),
(9.10, 1);

-- Registros para o sensor 2: Peixes congelados, limite ideal entre -22°C e -18°C
INSERT INTO registro (temperatura, fk_sensor) VALUES 
(-19.50, 2),
(-20.10, 2),
(-12.30, 2),
(-24.00, 2);

-- Alertas para a carga 1: Vacinas
INSERT INTO alerta (descricao, fk_registro, fk_carga) VALUES 
('Temperatura normal', 1, 1),
('Temperatura normal', 2, 1),
('Crítico: temperatura abaixo do limite mínimo', 3, 1),
('Crítico: temperatura acima do limite máximo', 4, 1);

-- Alertas para a carga 2: Peixes congelados
INSERT INTO alerta (descricao, fk_registro, fk_carga) VALUES 
('Temperatura normal', 5, 2),
('Temperatura normal', 6, 2),
('Crítico: temperatura acima do limite máximo', 7, 2),
('Crítico: temperatura abaixo do limite mínimo', 8, 2);