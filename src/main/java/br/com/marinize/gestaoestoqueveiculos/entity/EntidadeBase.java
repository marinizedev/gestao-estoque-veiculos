package br.com.marinize.gestaoestoqueveiculos.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

/**
 * Superclasse comum das entidades persistidas, responsável pelo identificador gerado.
 * O mapeamento é incorporado nas tabelas concretas sem criar uma tabela própria.
 */
@MappedSuperclass
public abstract class EntidadeBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    protected EntidadeBase() {
    }

    public Long getId() {
        return id;
    }
}
