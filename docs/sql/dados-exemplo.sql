-- Dados iniciais de demonstração para Gestão de Estoque de Veículos.
-- Pré-requisito: o banco e as tabelas já devem existir.
-- As marcas, modelos e veículos são verificados antes da inclusão para reduzir duplicações
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
SELECT 'Civic', ma.id
FROM marca ma
WHERE ma.nome = 'Honda'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'Civic' AND mo.marca_id = ma.id
  );

INSERT INTO modelo (nome, marca_id)
SELECT 'HB20', ma.id
FROM marca ma
WHERE ma.nome = 'Hyundai'
  AND NOT EXISTS (
      SELECT 1 FROM modelo mo
      WHERE mo.nome = 'HB20' AND mo.marca_id = ma.id
  );

-- VEÍCULOS
-- A combinação modelo + ano + cor + quilometragem identifica cada exemplo deste script.
INSERT INTO veiculo (modelo_id, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 2022, 'Prata', 125000.00, 35000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Toyota' AND mo.nome = 'Corolla'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2022
        AND v.cor = 'Prata' AND v.quilometragem = 35000
  );

INSERT INTO veiculo (modelo_id, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 2020, 'Cinza', 78500.00, 56000, 'VENDIDO'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Toyota' AND mo.nome = 'Yaris'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2020
        AND v.cor = 'Cinza' AND v.quilometragem = 56000
  );

INSERT INTO veiculo (modelo_id, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 2021, 'Preto', 118500.00, 42000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Honda' AND mo.nome = 'Civic'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2021
        AND v.cor = 'Preto' AND v.quilometragem = 42000
  );

INSERT INTO veiculo (modelo_id, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 2023, 'Branco', 84900.00, 18000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Hyundai' AND mo.nome = 'HB20'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2023
        AND v.cor = 'Branco' AND v.quilometragem = 18000
  );

INSERT INTO veiculo (modelo_id, ano_fabricacao, cor, preco, quilometragem, status)
SELECT mo.id, 2024, 'Azul', 132900.00, 12000, 'DISPONIVEL'
FROM modelo mo JOIN marca ma ON ma.id = mo.marca_id
WHERE ma.nome = 'Honda' AND mo.nome = 'Civic'
  AND NOT EXISTS (
      SELECT 1 FROM veiculo v
      WHERE v.modelo_id = mo.id AND v.ano_fabricacao = 2024
        AND v.cor = 'Azul' AND v.quilometragem = 12000
  );

-- Conferência: lista os veículos com seus modelos e marcas.
SELECT
    v.id,
    ma.nome AS marca,
    mo.nome AS modelo,
    v.ano_fabricacao,
    v.cor,
    v.preco,
    v.quilometragem,
    v.status
FROM veiculo v
JOIN modelo mo ON mo.id = v.modelo_id
JOIN marca ma ON ma.id = mo.marca_id
ORDER BY v.id;
