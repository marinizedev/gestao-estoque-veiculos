package br.com.marinize.gestaoestoqueveiculos.service;

import br.com.marinize.gestaoestoqueveiculos.dto.ModeloRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.ModeloResponse;
import br.com.marinize.gestaoestoqueveiculos.entity.Marca;
import br.com.marinize.gestaoestoqueveiculos.entity.Modelo;
import br.com.marinize.gestaoestoqueveiculos.exception.RecursoNaoEncontradoException;
import br.com.marinize.gestaoestoqueveiculos.repository.MarcaRepository;
import br.com.marinize.gestaoestoqueveiculos.repository.ModeloRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ModeloService {
    private final ModeloRepository modeloRepository;
    private final MarcaRepository marcaRepository;
    public ModeloService(ModeloRepository modeloRepository, MarcaRepository marcaRepository) {
        this.modeloRepository = modeloRepository;
        this.marcaRepository = marcaRepository;
    }
    public List<ModeloResponse> listar() { return modeloRepository.findAll().stream().map(this::paraResposta).toList(); }
    public ModeloResponse buscar(Long id) { return paraResposta(obterModelo(id)); }
    public ModeloResponse criar(ModeloRequest request) {
        Marca marca = obterMarca(request.marcaId());
        return paraResposta(modeloRepository.save(new Modelo(request.nome().trim(), marca)));
    }
    public ModeloResponse atualizar(Long id, ModeloRequest request) {
        Modelo modelo = obterModelo(id);
        modelo.setNome(request.nome().trim());
        modelo.setMarca(obterMarca(request.marcaId()));
        return paraResposta(modeloRepository.save(modelo));
    }
    public void excluir(Long id) { modeloRepository.delete(obterModelo(id)); }
    private Modelo obterModelo(Long id) {
        return modeloRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Modelo não encontrado: " + id));
    }
    private Marca obterMarca(Long id) {
        return marcaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Marca não encontrada: " + id));
    }
    private ModeloResponse paraResposta(Modelo modelo) {
        return new ModeloResponse(modelo.getId(), modelo.getNome(), modelo.getMarca().getId(), modelo.getMarca().getNome());
    }
}
