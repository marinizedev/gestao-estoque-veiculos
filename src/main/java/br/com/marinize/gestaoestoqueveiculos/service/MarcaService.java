package br.com.marinize.gestaoestoqueveiculos.service;

import br.com.marinize.gestaoestoqueveiculos.dto.MarcaRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.MarcaResponse;
import br.com.marinize.gestaoestoqueveiculos.entity.Marca;
import br.com.marinize.gestaoestoqueveiculos.exception.RecursoNaoEncontradoException;
import br.com.marinize.gestaoestoqueveiculos.repository.MarcaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MarcaService {
    private final MarcaRepository repository;
    public MarcaService(MarcaRepository repository) { this.repository = repository; }

    public List<MarcaResponse> listar() {
        return repository.findAll().stream().map(this::paraResposta).toList();
    }
    public MarcaResponse buscar(Long id) { return paraResposta(obterEntidade(id)); }
    public MarcaResponse criar(MarcaRequest request) { return paraResposta(repository.save(new Marca(request.nome().trim()))); }
    public MarcaResponse atualizar(Long id, MarcaRequest request) {
        Marca marca = obterEntidade(id);
        marca.setNome(request.nome().trim());
        return paraResposta(repository.save(marca));
    }
    public void excluir(Long id) { repository.delete(obterEntidade(id)); }
    private Marca obterEntidade(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Marca não encontrada: " + id));
    }
    private MarcaResponse paraResposta(Marca marca) { return new MarcaResponse(marca.getId(), marca.getNome()); }
}
