package br.com.marinize.gestaoestoqueveiculos.repository;

import br.com.marinize.gestaoestoqueveiculos.entity.StatusVeiculo;
import br.com.marinize.gestaoestoqueveiculos.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    @Query("""
        SELECT v FROM Veiculo v
        JOIN v.modelo m
        JOIN m.marca ma
        WHERE (:marca IS NULL OR LOWER(ma.nome) LIKE LOWER(CONCAT('%', :marca, '%')))
          AND (:modelo IS NULL OR LOWER(m.nome) LIKE LOWER(CONCAT('%', :modelo, '%')))
          AND (:ano IS NULL OR v.anoFabricacao = :ano)
          AND (:precoMin IS NULL OR v.preco >= :precoMin)
          AND (:precoMax IS NULL OR v.preco <= :precoMax)
          AND (:status IS NULL OR v.status = :status)
        ORDER BY v.id
        """)
    List<Veiculo> buscarComFiltros(
            @Param("marca") String marca,
            @Param("modelo") String modelo,
            @Param("ano") Integer ano,
            @Param("precoMin") BigDecimal precoMin,
            @Param("precoMax") BigDecimal precoMax,
            @Param("status") StatusVeiculo status);
}
