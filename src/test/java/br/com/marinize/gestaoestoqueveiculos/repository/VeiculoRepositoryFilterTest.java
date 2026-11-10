package br.com.marinize.gestaoestoqueveiculos.repository;

import br.com.marinize.gestaoestoqueveiculos.entity.Marca;
import br.com.marinize.gestaoestoqueveiculos.entity.Modelo;
import br.com.marinize.gestaoestoqueveiculos.entity.StatusVeiculo;
import br.com.marinize.gestaoestoqueveiculos.entity.Veiculo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(showSql = false)
class VeiculoRepositoryFilterTest {

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private ModeloRepository modeloRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @BeforeEach
    void prepararDados() {
        Marca toyota = marcaRepository.save(new Marca("Toyota"));
        Marca honda = marcaRepository.save(new Marca("Honda"));

        Modelo corolla = modeloRepository.save(new Modelo("Corolla", toyota));
        Modelo yaris = modeloRepository.save(new Modelo("Yaris", toyota));
        Modelo civic = modeloRepository.save(new Modelo("Civic", honda));

        veiculoRepository.saveAll(List.of(
            new Veiculo(
                corolla,
                2022,
                "Prata",
                new BigDecimal("125000.00"),
                35000,
                StatusVeiculo.DISPONIVEL
            ),
            new Veiculo(
                yaris,
                2020,
                "Cinza",
                new BigDecimal("78500.00"),
                56000,
                StatusVeiculo.VENDIDO
            ),
            new Veiculo(
                civic,
                2024,
                "Azul",
                new BigDecimal("132000.00"),
                18000,
                StatusVeiculo.DISPONIVEL
            )
        ));

        veiculoRepository.flush();
    }

    @Test
    void deveGerarIdentificadorHerdadoNasEntidades() {
        assertThat(marcaRepository.findAll())
            .extracting(Marca::getId)
            .doesNotContainNull();

        assertThat(modeloRepository.findAll())
            .extracting(Modelo::getId)
            .doesNotContainNull();

        assertThat(veiculoRepository.findAll())
            .extracting(Veiculo::getId)
            .doesNotContainNull();
    }

    @Test
    void deveFiltrarPorMarcaEModeloParciaisSemDiferenciarMaiusculas() {
        List<Veiculo> encontrados = veiculoRepository.buscarComFiltros(
            "toy",
            "cor",
            null,
            null,
            null,
            null
        );

        assertThat(encontrados)
            .extracting(veiculo -> veiculo.getModelo().getNome())
            .containsExactly("Corolla");
    }

    @Test
    void deveCombinarAnoESituacao() {
        List<Veiculo> encontrados = veiculoRepository.buscarComFiltros(
            null,
            null,
            2020,
            null,
            null,
            StatusVeiculo.VENDIDO
        );

        assertThat(encontrados)
            .extracting(veiculo -> veiculo.getModelo().getNome())
            .containsExactly("Yaris");
    }

    @Test
    void deveFiltrarPorFaixaDePrecoIncluindoOsLimites() {
        List<Veiculo> encontrados = veiculoRepository.buscarComFiltros(
            null,
            null,
            null,
            new BigDecimal("125000.00"),
            new BigDecimal("132000.00"),
            null
        );

        assertThat(encontrados)
            .extracting(veiculo -> veiculo.getModelo().getNome())
            .containsExactly("Corolla", "Civic");
    }

    @Test
    void deveFiltrarSomentePorPrecoMinimo() {
        List<Veiculo> encontrados = veiculoRepository.buscarComFiltros(
            null,
            null,
            null,
            new BigDecimal("100000.00"),
            null,
            null
        );

        assertThat(encontrados)
            .extracting(veiculo -> veiculo.getModelo().getNome())
            .containsExactly("Corolla", "Civic");
    }

    @Test
    void deveFiltrarSomentePorPrecoMaximo() {
        List<Veiculo> encontrados = veiculoRepository.buscarComFiltros(
            null,
            null,
            null,
            null,
            new BigDecimal("80000.00"),
            null
        );

        assertThat(encontrados)
            .extracting(veiculo -> veiculo.getModelo().getNome())
            .containsExactly("Yaris");
    }

    @Test
    void deveListarTodosQuandoNaoHaFiltros() {
        List<Veiculo> encontrados = veiculoRepository.buscarComFiltros(
            null,
            null,
            null,
            null,
            null,
            null
        );

        assertThat(encontrados).hasSize(3);
    }
}
