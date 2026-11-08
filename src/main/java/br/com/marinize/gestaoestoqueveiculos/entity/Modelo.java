package br.com.marinize.gestaoestoqueveiculos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "modelo", uniqueConstraints = @UniqueConstraint(name = "uq_modelo_marca", columnNames = {"marca_id", "nome"}))
public class Modelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "marca_id", nullable = false, foreignKey = @ForeignKey(name = "fk_modelo_marca"))
    private Marca marca;

    protected Modelo() { }

    public Modelo(String nome, Marca marca) {
        this.nome = nome;
        this.marca = marca;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Marca getMarca() { return marca; }
    public void setMarca(Marca marca) { this.marca = marca; }
}
