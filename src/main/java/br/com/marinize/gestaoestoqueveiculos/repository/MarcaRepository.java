package br.com.marinize.gestaoestoqueveiculos.repository;

import br.com.marinize.gestaoestoqueveiculos.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarcaRepository extends JpaRepository<Marca, Long> { }
