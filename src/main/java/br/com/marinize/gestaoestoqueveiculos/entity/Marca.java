package br.com.marinize.gestaoestoqueveiculos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marca", uniqueConstraints = @UniqueConstraint(name = "uq_marca_nome", columnNames = "nome"))
public class Marca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    protected Marca() { }

    public Marca(String nome) { this.nome = nome; }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
