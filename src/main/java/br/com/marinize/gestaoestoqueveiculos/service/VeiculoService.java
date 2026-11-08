package br.com.marinize.gestaoestoqueveiculos.service;

import br.com.marinize.gestaoestoqueveiculos.dto.VeiculoRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.VeiculoResponse;
import br.com.marinize.gestaoestoqueveiculos.entity.Modelo;
import br.com.marinize.gestaoestoqueveiculos.entity.StatusVeiculo;
import br.com.marinize.gestaoestoqueveiculos.entity.Veiculo;
import br.com.marinize.gestaoestoqueveiculos.exception.RecursoNaoEncontradoException;
import br.com.marinize.gestaoestoqueveiculos.repository.ModeloRepository;
import br.com.marinize.gestaoestoqueveiculos.repository.VeiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class VeiculoService {
    private final VeiculoRepository veiculoRepository;
    private final ModeloRepository modeloRepository;
    public VeiculoService(VeiculoRepository veiculoRepository, ModeloRepository modeloRepository) {
        this.veiculoRepository = veiculoRepository;
        this.modeloRepository = modeloRepository;
    }
    @Transactional(readOnly = true)
    public List<VeiculoResponse> listar(String marca, String modelo, Integer ano, BigDecimal precoMin,
                                        BigDecimal precoMax, StatusVeiculo status) {
        if (precoMin != null && precoMax != null && precoMin.compareTo(precoMax) > 0) {
            throw new IllegalArgumentException("O preço mínimo não pode ser maior que o preço máximo.");
        }
        return veiculoRepository.buscarComFiltros(marca, modelo, ano, precoMin, precoMax, status)
                .stream().map(this::paraResposta).toList();
    }
    @Transactional(readOnly = true)
    public VeiculoResponse buscar(Long id) { return paraResposta(obterVeiculo(id)); }
    public VeiculoResponse criar(VeiculoRequest request) {
        Modelo modelo = obterModelo(request.modeloId());
        Veiculo veiculo = new Veiculo(modelo, request.anoFabricacao(), request.cor().trim(),
                request.preco(), request.quilometragem(), request.status());
        return paraResposta(veiculoRepository.save(veiculo));
    }
    public VeiculoResponse atualizar(Long id, VeiculoRequest request) {
        Veiculo veiculo = obterVeiculo(id);
        veiculo.setModelo(obterModelo(request.modeloId()));
        veiculo.setAnoFabricacao(request.anoFabricacao());
        veiculo.setCor(request.cor().trim());
        veiculo.setPreco(request.preco());
        veiculo.setQuilometragem(request.quilometragem());
        veiculo.setStatus(request.status());
        return paraResposta(veiculoRepository.save(veiculo));
    }
    public void excluir(Long id) { veiculoRepository.delete(obterVeiculo(id)); }
    private Veiculo obterVeiculo(Long id) {
        return veiculoRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Veículo não encontrado: " + id));
    }
    private Modelo obterModelo(Long id) {
        return modeloRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Modelo não encontrado: " + id));
    }
    private VeiculoResponse paraResposta(Veiculo v) {
        return new VeiculoResponse(v.getId(), v.getModelo().getId(), v.getModelo().getNome(),
                v.getModelo().getMarca().getId(), v.getModelo().getMarca().getNome(),
                v.getAnoFabricacao(), v.getCor(), v.getPreco(), v.getQuilometragem(), v.getStatus());
    }
}
