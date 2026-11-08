package br.com.marinize.gestaoestoqueveiculos.repository;

import br.com.marinize.gestaoestoqueveiculos.entity.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModeloRepository extends JpaRepository<Modelo, Long> { }
