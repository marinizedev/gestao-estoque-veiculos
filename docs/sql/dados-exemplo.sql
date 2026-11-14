-- Dados iniciais de demonstração para Gestão de Estoque de Veículos.
-- Pré-requisito: o banco e as tabelas já devem existir (execute a aplicação uma vez antes).
-- Marcas, modelos e veículos são verificados antes da inclusão para reduzir duplicações
-- caso este arquivo seja executado novamente.

USE gestao_estoque_veiculos;

-- MARCAS
INSERT INTO marca (nome)
SELECT 'Toyota'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Toyota');

INSERT INTO marca (nome)
SELECT 'Honda'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Honda');

INSERT INTO marca (nome)
SELECT 'Hyundai'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Hyundai');

INSERT INTO marca (nome)
SELECT 'Volkswagen'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Volkswagen');

INSERT INTO marca (nome)
SELECT 'Chevrolet'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Chevrolet');

INSERT INTO marca (nome)
SELECT 'Fiat'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Fiat');

INSERT INTO marca (nome)
SELECT 'Jeep'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Jeep');

INSERT INTO marca (nome)
SELECT 'Ford'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Ford');

INSERT INTO marca (nome)
SELECT 'Yamaha'
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Yamaha');

-- MODELOS
INSERT INTO modelo (nome, marca_id)
SELECT 'Corolla', ma.id
FROM marca ma
WHERE ma.nome = 'Toyota'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Corolla' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Yaris', ma.id
FROM marca ma
WHERE ma.nome = 'Toyota'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Yaris' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Hilux', ma.id
FROM marca ma
WHERE ma.nome = 'Toyota'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Hilux' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Civic', ma.id
FROM marca ma
WHERE ma.nome = 'Honda'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Civic' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'HR-V', ma.id
FROM marca ma
WHERE ma.nome = 'Honda'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'HR-V' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'HB20', ma.id
FROM marca ma
WHERE ma.nome = 'Hyundai'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'HB20' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Creta', ma.id
FROM marca ma
WHERE ma.nome = 'Hyundai'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Creta' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Polo', ma.id
FROM marca ma
WHERE ma.nome = 'Volkswagen'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Polo' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'T-Cross', ma.id
FROM marca ma
WHERE ma.nome = 'Volkswagen'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'T-Cross' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Onix', ma.id
FROM marca ma
WHERE ma.nome = 'Chevrolet'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Onix' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'S10', ma.id
FROM marca ma
WHERE ma.nome = 'Chevrolet'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'S10' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Mobi', ma.id
FROM marca ma
WHERE ma.nome = 'Fiat'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Mobi' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Toro', ma.id
FROM marca ma
WHERE ma.nome = 'Fiat'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Toro' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Compass', ma.id
FROM marca ma
WHERE ma.nome = 'Jeep'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Compass' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'Mustang', ma.id
FROM marca ma
WHERE ma.nome = 'Ford'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Mustang' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'MT-03', ma.id
FROM marca ma
WHERE ma.nome = 'Yamaha'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'MT-03' AND mo.marca_id = ma.id
  );

-- VEÍCULOS
-- A combinação modelo + ano + cor + quilometragem identifica cada exemplo deste script.
INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SEDA', 2022, 'Prata', 125000.00, 35000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Toyota' AND mo.nome = 'Corolla'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2022
        AND v.cor = 'Prata' AND v.quilometragem = 35000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'HATCH', 2020, 'Cinza', 78500.00, 56000, 'VENDIDO'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Toyota' AND mo.nome = 'Yaris'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2020
        AND v.cor = 'Cinza' AND v.quilometragem = 56000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'PICAPE', 2023, 'Branco', 289900.00, 22000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Toyota' AND mo.nome = 'Hilux'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2023
        AND v.cor = 'Branco' AND v.quilometragem = 22000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SEDA', 2021, 'Preto', 118500.00, 42000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Honda' AND mo.nome = 'Civic'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2021
        AND v.cor = 'Preto' AND v.quilometragem = 42000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SEDA', 2024, 'Azul', 132900.00, 12000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Honda' AND mo.nome = 'Civic'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2024
        AND v.cor = 'Azul' AND v.quilometragem = 12000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SUV', 2022, 'Vermelho', 139900.00, 31000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Honda' AND mo.nome = 'HR-V'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2022
        AND v.cor = 'Vermelho' AND v.quilometragem = 31000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'HATCH', 2023, 'Branco', 84900.00, 18000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Hyundai' AND mo.nome = 'HB20'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2023
        AND v.cor = 'Branco' AND v.quilometragem = 18000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SUV', 2021, 'Cinza', 109900.00, 47000, 'VENDIDO'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Hyundai' AND mo.nome = 'Creta'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2021
        AND v.cor = 'Cinza' AND v.quilometragem = 47000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'HATCH', 2022, 'Prata', 89900.00, 29000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Volkswagen' AND mo.nome = 'Polo'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2022
        AND v.cor = 'Prata' AND v.quilometragem = 29000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SUV', 2023, 'Azul', 129900.00, 15000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Volkswagen' AND mo.nome = 'T-Cross'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2023
        AND v.cor = 'Azul' AND v.quilometragem = 15000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'HATCH', 2019, 'Preto', 62900.00, 68000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Chevrolet' AND mo.nome = 'Onix'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2019
        AND v.cor = 'Preto' AND v.quilometragem = 68000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'PICAPE', 2020, 'Branco', 178000.00, 74000, 'VENDIDO'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Chevrolet' AND mo.nome = 'S10'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2020
        AND v.cor = 'Branco' AND v.quilometragem = 74000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'HATCH', 2018, 'Vermelho', 39900.00, 81000, 'DESCONTINUADO'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Fiat' AND mo.nome = 'Mobi'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2018
        AND v.cor = 'Vermelho' AND v.quilometragem = 81000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'PICAPE', 2022, 'Cinza', 149900.00, 38000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Fiat' AND mo.nome = 'Toro'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2022
        AND v.cor = 'Cinza' AND v.quilometragem = 38000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'SUV', 2024, 'Preto', 189900.00, 9000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Jeep' AND mo.nome = 'Compass'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2024
        AND v.cor = 'Preto' AND v.quilometragem = 9000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'COUPE', 2019, 'Amarelo', 329000.00, 26000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Ford' AND mo.nome = 'Mustang'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2019
        AND v.cor = 'Amarelo' AND v.quilometragem = 26000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'COUPE', 2017, 'Cinza', 249000.00, 54000, 'DESCONTINUADO'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Ford' AND mo.nome = 'Mustang'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2017
        AND v.cor = 'Cinza' AND v.quilometragem = 54000
  );

INSERT INTO veiculo (modelo_id, tipo, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 'MOTO', 2023, 'Azul', 27900.00, 6000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Yamaha' AND mo.nome = 'MT-03'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2023
        AND v.cor = 'Azul' AND v.quilometragem = 6000
  );

-- Conferência: lista os veículos com seus modelos e marcas.
SELECT
    v.id,
    ma.nome AS marca,
    mo.nome AS modelo,
    v.tipo,
    v.ano_fabricacao,
    v.cor,
    v.preco,
    v.quilometragem,
    v.status
FROM veiculo v
JOIN modelo mo ON mo.id = v.modelo_id
JOIN marca ma ON ma.id = mo.marca_id
ORDER BY v.id;
