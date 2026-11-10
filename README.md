# AutoStock — Sistema Automotivo de Gestão de Estoque de Veículos

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot 4.1.2](https://img.shields.io/badge/Spring%20Boot-4.1.2-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-enabled-6DB33F?logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![MySQL 8](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-build-C71A36?logo=apachemaven&logoColor=white)](https://maven.apache.org/)
[![Testes automatizados](https://img.shields.io/badge/testes-13%20automatizados-1572B6)](#testes-automatizados)
[![Repositório no GitHub](https://img.shields.io/badge/GitHub-AutoStock-181717?logo=github&logoColor=white)](https://github.com/marinizedev/gestao-estoque-veiculos)

Aplicação acadêmica para organizar o estoque de uma concessionária. O AutoStock combina uma interface web, uma API REST em Java com Spring Boot e persistência em MySQL. O escopo inclui cadastro e manutenção de marcas, modelos e veículos, filtros de consulta e acesso protegido por uma conta administrativa configurada localmente.

> **Execução local:** o endereço `http://localhost:8080` funciona na máquina em que a aplicação está executando. Clonar o repositório não publica o sistema na internet.

## Índice

- [Visão geral](#visao-geral)

- [Funcionalidades](#funcionalidades)

- [Regras de negócio e validações](#regras-de-negocio-e-validacoes)

- [Programação orientada a objetos](#programacao-orientada-a-objetos)

- [Tecnologias](#tecnologias)

- [Testes automatizados](#testes-automatizados)

- [Como executar localmente](#como-executar-localmente)

- [API e segurança](#api-e-seguranca)

- [Estrutura do projeto](#estrutura-do-projeto)

- [Solução de problemas](#solucao-de-problemas)

- [Escopo atual](#escopo-atual)

- [Autora](#autora)

<a id="visao-geral"></a>

## Visão geral

O sistema foi desenvolvido como projeto acadêmico de **Programação Orientada a Objetos**. A aplicação separa a interface web, os controladores REST, os serviços de negócio, os repositórios de persistência e as entidades do domínio. O banco relacional utilizado na execução da aplicação é o MySQL; os testes de persistência usam H2 para serem executados sem depender de uma instalação local do MySQL.

<a id="funcionalidades"></a>

## Funcionalidades

- Autenticação por formulário e sessão, com um perfil `ADMIN` configurado por variáveis de ambiente.

- Cadastro, consulta, edição e remoção de marcas e modelos.

- Cadastro, consulta, edição e remoção de veículos.

- Associação de cada modelo a uma marca e de cada veículo a um modelo.

- Filtros combináveis de veículos por marca, modelo, ano, preço mínimo, preço máximo e status.

- Painel com indicadores do estoque, vitrine ilustrativa, exportação CSV e impressão do relatório.

- Validação de dados de entrada e respostas HTTP apropriadas na API.

<a id="regras-de-negocio-e-validacoes"></a>

## Regras de negócio e validações

As validações de entrada são declaradas nos DTOs e executadas pelos controladores. As regras de relacionamento e consulta ficam nos serviços e repositórios; as restrições relacionais também são aplicadas pelo banco.

### Marcas

- O nome é obrigatório, não pode conter somente espaços e aceita até 100 caracteres.

- O serviço remove espaços externos antes de salvar ou atualizar o nome.

- O banco possui restrição de unicidade para o nome da marca.

### Modelos

- O nome é obrigatório, não pode conter somente espaços e aceita até 100 caracteres.

- O `marcaId` é obrigatório, deve ser positivo e precisa corresponder a uma marca existente.

- O serviço remove espaços externos do nome antes de salvar ou atualizar o modelo.

- O par **marca + nome do modelo** é único; o mesmo nome pode existir associado a marcas diferentes.

### Veículos

- O `modeloId` é obrigatório, deve ser positivo e precisa corresponder a um modelo existente.

- O ano de fabricação é obrigatório e deve estar entre 1886 e 2100.

- A cor é obrigatória e aceita até 50 caracteres; espaços externos são removidos antes de salvar.

- O preço é obrigatório, não pode ser negativo e aceita até 10 dígitos inteiros e 2 casas decimais.

- A quilometragem é obrigatória e não pode ser negativa.

- O status é obrigatório e deve ser um dos valores `DISPONIVEL`, `VENDIDO` ou `DESCONTINUADO`.

### Filtros

- Marca e modelo aceitam correspondência parcial sem diferenciar maiúsculas de minúsculas.

- Ano é comparado pelo valor exato.

- Preço mínimo e máximo são inclusivos e podem ser usados separadamente ou juntos.

- Os critérios informados podem ser combinados. A consulta é rejeitada quando o preço mínimo é maior que o preço máximo.

<a id="programacao-orientada-a-objetos"></a>

## Programação orientada a objetos

- **Classes e objetos:** `Marca`, `Modelo` e `Veiculo` representam elementos do domínio; os serviços encapsulam operações e regras de negócio.

- **Encapsulamento:** os atributos das entidades são privados e acessados por métodos; os DTOs delimitam os dados recebidos e enviados pela API.

- **Associações:** `Modelo` referencia `Marca`, e `Veiculo` referencia `Modelo`, formando a cadeia de relacionamento do estoque.

- **Herança e abstração:** as três entidades estendem a classe abstrata `EntidadeBase`. Anotada com `@MappedSuperclass`, ela centraliza o identificador gerado e o método `getId()`; o campo é mapeado nas tabelas concretas, sem criar uma tabela adicional.

A herança foi usada para compartilhar uma característica que as entidades realmente têm em comum. O sistema não cria subclasses artificiais como `Carro` e `Moto`, pois o modelo atual não define essas categorias como tipos distintos.

<a id="tecnologias"></a>

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| Java 17 | Linguagem e plataforma da aplicação |
| Spring Boot 4.1.2 | Configuração e inicialização do sistema |
| Spring Web MVC | Controladores e API REST |
| Spring Data JPA e Hibernate | Repositórios, mapeamento objeto-relacional e geração/atualização das tabelas |
| Spring Security | Autenticação, sessão, autorização e proteção CSRF |
| MySQL 8 | Banco relacional da execução local |
| H2 | Banco em memória usado nos testes JPA |
| Maven | Gerenciamento de dependências, compilação e testes |
| HTML, CSS e JavaScript | Interface web integrada ao Spring Boot |

<a id="testes-automatizados"></a>

## Testes automatizados

Execute todos os testes na raiz do projeto:

```
mvn clean test
```

O conjunto atual possui **13 testes automatizados**. A suíte termina com `BUILD SUCCESS` quando todos passam.

| Classe de teste | Tipo e quantidade | O que verifica e por que é importante |
| --- | --- | --- |
| `SecurityConfigTest` | Teste MVC com `@WebMvcTest` — 6 casos | Verifica que consultas e cadastros são negados sem login; que um administrador sem token CSRF não pode alterar dados; que o administrador autenticado pode consultar e cadastrar; e que o login real cria uma sessão reutilizável. Ajuda a evitar exposição da API ou operações de escrita sem proteção. |
| `VeiculoRepositoryFilterTest` | Teste JPA com `@DataJpaTest` e H2 — 7 casos | Verifica geração dos IDs herdados nas três entidades; busca parcial de marca/modelo sem diferenciar caixa; combinação de ano e status; faixa inclusiva de preços; limites mínimo e máximo isolados; e listagem sem filtros. Ajuda a validar as consultas e o mapeamento JPA de forma reproduzível. |

Os testes JPA usam H2 e não precisam de MySQL local. Os testes MVC isolam a camada web e simulam o serviço; portanto, a suíte automatizada não substitui a execução manual da aplicação com MySQL nem a demonstração da interface.

Para rodar somente uma classe:

```
mvn -Dtest=SecurityConfigTest test
mvn -Dtest=VeiculoRepositoryFilterTest test
```

<a id="como-executar-localmente"></a>

## Como executar localmente

### Requisitos

- JDK 17 instalado.

- MySQL 8 instalado e em execução.

- Maven instalado e disponível no terminal como `mvn`.

- Git para clonar o repositório.

Confira Java e Maven:

```
java -version
mvn -version
```

### 1. Clonar o repositório

```
git clone https://github.com/marinizedev/gestao-estoque-veiculos.git
cd gestao-estoque-veiculos
```

### 2. Criar o banco

No MySQL Workbench, execute `docs/sql/criar-banco.sql`. Esse script cria o banco `gestao_estoque_veiculos` com codificação `utf8mb4`; ele **não cria as tabelas**.

As tabelas são criadas ou atualizadas pelo Hibernate quando a aplicação inicia, usando a configuração JPA do projeto (`ddl-auto=update`).

### 3. Criar e preencher o `.env`

Na raiz do projeto, copie o arquivo de exemplo:

```
Copy-Item .env.example .env
```

Edite `.env` com credenciais válidas para a sua instalação local:

| Variável | Finalidade |
| --- | --- |
| `DB_URL` | URL JDBC do MySQL; por padrão aponta para o banco local criado no passo anterior |
| `DB_USERNAME` | Usuário local do MySQL |
| `DB_PASSWORD` | Senha local do MySQL |
| `APP_ADMIN_USERNAME` | Usuário que será utilizado no login do AutoStock |
| `APP_ADMIN_PASSWORD` | Senha administrativa local |

A senha administrativa deve ter **pelo menos 14 caracteres e no máximo 72 bytes em UTF-8**. Para evitar diferenças entre quantidade de caracteres e bytes, prefira uma senha com letras, números e símbolos ASCII. O valor `TROQUE_ISTO` do `.env.example` é um marcador inválido: substitua-o antes de iniciar a aplicação.

As credenciais do banco e as credenciais do AutoStock são distintas. O `.env` é ignorado pelo Git: não compartilhe nem versione esse arquivo, e nunca coloque senhas reais no README ou em commits.

### 4. Executar os testes

```
mvn clean test
```

Os testes usam H2 para persistência e não dependem das credenciais do MySQL da sua máquina.

### 5. Iniciar a aplicação

```
mvn spring-boot:run
```

Na primeira inicialização, aguarde o Hibernate criar ou atualizar as tabelas. Depois abra `http://localhost:8080` no navegador e entre com `APP_ADMIN_USERNAME` e `APP_ADMIN_PASSWORD` definidos no `.env`.

### 6. Carregar os dados de exemplo

Após a criação das tabelas, execute `docs/sql/dados-exemplo.sql` no MySQL Workbench. O script insere marcas, modelos e veículos demonstrativos e usa verificações `NOT EXISTS` para evitar reinserir os mesmos registros de exemplo.

### 7. Encerrar

No terminal que está executando a aplicação, pressione `Ctrl + C`. Se alterar o `.env`, reinicie a aplicação para que os novos valores sejam carregados.

<a id="api-e-seguranca"></a>

## API e segurança

A aplicação possui um perfil `ADMIN` configurado por variáveis de ambiente. Não há cadastro público de usuários nem perfil de vendedor. A conta é mantida em memória durante a execução e a senha é armazenada no contexto de autenticação usando BCrypt; o banco MySQL guarda os dados do estoque, não essa conta administrativa.

O acesso utiliza autenticação por formulário e sessão. A sessão expira após 30 minutos; o cookie é configurado como `HttpOnly` e `SameSite=Lax`. A proteção CSRF permanece habilitada, portanto operações que criam, alteram ou removem registros precisam de sessão autenticada e token CSRF válido. Chamadas à API sem autenticação recebem `401 Unauthorized`.

| Recurso | Endpoint base |
| --- | --- |
| Marcas | `/api/marcas` |
| Modelos | `/api/modelos` |
| Veículos e filtros | `/api/veiculos` |
| Token CSRF | `/api/csrf` |

Exemplos de consulta de veículos:

```
GET /api/veiculos?marca=Toyota&ano=2022&status=DISPONIVEL
GET /api/veiculos?modelo=Corolla
GET /api/veiculos?precoMin=50000&precoMax=150000
```

O arquivo `docs/requisicoes.http` contém exemplos adicionais. Chamadas manuais de escrita devem utilizar uma sessão autenticada e enviar o token CSRF.

<a id="estrutura-do-projeto"></a>

## Estrutura do projeto

```
gestao-estoque-veiculos/
├── docs/
│   ├── requisicoes.http
│   └── sql/
│       ├── criar-banco.sql
│       └── dados-exemplo.sql
├── src/
│   ├── main/
│   │   ├── java/br/com/marinize/gestaoestoqueveiculos/
│   │   │   ├── controller/   # Endpoints REST
│   │   │   ├── dto/          # Contratos de entrada e saída
│   │   │   ├── entity/       # Entidades JPA e EntidadeBase
│   │   │   ├── exception/    # Exceções e tratamento de erros
│   │   │   ├── repository/   # Persistência e consultas
│   │   │   ├── security/     # Login, sessão e regras de acesso
│   │   │   └── service/      # Regras de negócio
│   │   └── resources/
│   │       ├── static/       # HTML, CSS, JavaScript e imagens
│   │       └── application.properties
│   └── test/
│       └── java/             # Testes MVC e JPA
├── .env.example
├── .gitignore
├── pom.xml
└── README.md
```

<a id="solucao-de-problemas"></a>

## Solução de problemas

### `mvn` não é reconhecido

Instale o Maven e configure a pasta `bin` no `PATH` do Windows. Feche e reabra o terminal ou o VS Code após alterar o `PATH`. Como alternativa, execute o `mvn.cmd` pelo caminho em que o Maven foi instalado.

### Falha ao conectar ao MySQL

Confirme que o serviço MySQL está em execução, que o banco `gestao_estoque_veiculos` foi criado e que `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` no `.env` correspondem à instalação local. Reinicie a aplicação depois de alterar o arquivo.

### Erro nas variáveis administrativas

Confirme que `APP_ADMIN_USERNAME` e `APP_ADMIN_PASSWORD` estão preenchidas. Verifique também o limite de 14 caracteres mínimos e 72 bytes UTF-8 máximos da senha.

### Os testes terminam, mas aparece aviso do Surefire ao encerrar a JVM

Confira o resultado final do Maven. Se aparecer `BUILD SUCCESS` e `Tests run: 13, Failures: 0, Errors: 0`, os testes foram aprovados; um aviso de encerramento da JVM do Surefire não altera esse resultado. Se persistir, rode as classes separadamente conforme a seção [Testes automatizados](#testes-automatizados) para localizar qual processo demora a encerrar.

<a id="escopo-atual"></a>

## Escopo atual

- O projeto foi preparado para execução e avaliação local; este repositório não publica automaticamente uma instância na internet.

- Há uma conta administrativa configurável, sem cadastro público ou múltiplos perfis de usuário.

- A interface filtra por marca, modelo, ano, faixa de preço e status. O modelo atual não possui um campo independente de categoria comercial como SUV, sedã ou hatch.

- As imagens da vitrine são ilustrativas e não constituem dados reais dos veículos cadastrados.

<a id="autora"></a>

## Autora

**Marinize Santana** — estudante de Análise e Desenvolvimento de Sistemas (ADS) e **Engenheira de Dados em formação**.

[![LinkedIn — Marinize Santana](https://img.shields.io/badge/LinkedIn-Marinize%20Santana-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/marinize-santana-47bb2b372)
[![Portfólio — Marinize Santana](https://img.shields.io/badge/Portf%C3%B3lio-marinizesantana.com.br-5B4B8A?logo=googlechrome&logoColor=white)](https://marinizesantana.com.br)
