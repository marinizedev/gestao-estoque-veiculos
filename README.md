# Gestão de Estoque de Veículos

Sistema acadêmico para cadastro e gerenciamento do estoque de veículos de uma concessionária. Desenvolvido com Java, Spring Boot, MySQL e uma interface web integrada à API REST.

## Funcionalidades

- Autenticação para acesso ao sistema com perfil de administrador.
- Cadastro e consulta de marcas e modelos.
- Cadastro, consulta, edição e remoção de veículos.
- Filtros de veículos por marca, modelo, ano, faixa de preço e situação.
- Controle de situação do veículo: disponível, vendido ou descontinuado.
- Painel com indicadores e recursos de relatório.

> Este projeto acadêmico possui um perfil ADMIN configurado por variáveis de ambiente. Não há cadastro público de usuários nem perfil de vendedor.

## Tecnologias

- Java 17
- Spring Boot 4.1.2
- Spring Security
- Spring Data JPA / Hibernate
- MySQL 8
- Maven
- HTML, CSS e JavaScript

## Requisitos para execução local

- Java 17 instalado.
- MySQL 8 instalado e em execução.
- Maven instalado e disponível no terminal como `mvn`.
- Git, para clonar o repositório.

Confira as instalações com:

```powershell
java -version
mvn -version
```

## Como executar localmente

### 1. Clonar o repositório

Clone o repositório e abra o terminal na pasta do projeto, onde está o arquivo `pom.xml`:

```powershell
git clone https://github.com/marinizedev/gestao-estoque-veiculos
cd gestao-estoque-veiculos
```

### 2. Criar o banco de dados

No MySQL Workbench, abra e execute:

```text
docs/sql/criar-banco.sql
```

Esse script cria o banco `gestao_estoque_veiculos`. As credenciais usadas para conectar ao MySQL são locais de cada instalação.

### 3. Criar o arquivo de configuração local

Na raiz do projeto, copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env` e informe:

- `DB_URL`: URL do banco MySQL local.
- `DB_USERNAME`: usuário do MySQL.
- `DB_PASSWORD`: senha do usuário do MySQL.
- `APP_ADMIN_USERNAME`: nome de usuário para entrar no sistema.
- `APP_ADMIN_PASSWORD`: senha para entrar no sistema.

`APP_ADMIN_PASSWORD` deve ter no mínimo 14 caracteres e não pode ultrapassar 72 bytes em UTF-8. O valor de exemplo do `.env.example` é apenas um marcador e precisa ser substituído por uma senha local forte antes de iniciar a aplicação. Não compartilhe nem versione o arquivo `.env`.

As credenciais do MySQL e as credenciais de login do AutoStock são diferentes. Use valores locais e seguros; não reutilize senhas pessoais.

O arquivo `.env` é ignorado pelo Git e **não deve ser enviado ao GitHub**. O repositório contém apenas `.env.example`, que serve como modelo. Não coloque senhas reais em `application.properties`, no README ou em commits.

> APP_ADMIN_PASSWORD deve ter pelo menos 14 caracteres e não pode exceder 72 bytes em UTF-8. O
> valor TROQUE_ISTO em .env.example é um marcador intencionalmente inválido: substitua-o por uma
> senha local forte antes de iniciar a aplicação. Se ele permanecer, a aplicação será
> interrompida pela validação de configuração.

### 4. Testar o projeto

Na raiz do projeto, execute:

```powershell
mvn clean test
```

A execução termina corretamente quando o Maven informa `BUILD SUCCESS`.

### 5. Iniciar a aplicação

Ainda na raiz do projeto, execute:

```powershell
mvn spring-boot:run
```

Quando a inicialização terminar, abra no navegador:

```text
http://localhost:8080
```

Esse endereço é local: funciona na máquina onde a aplicação está executando. Clonar o repositório não publica o sistema na internet nem permite que o tutor acesse automaticamente a sua máquina. Para avaliar localmente, é necessário executar o projeto e configurar um banco MySQL e um arquivo `.env` nessa máquina.

A aplicação encaminhará o acesso à página de login. Entre usando `APP_ADMIN_USERNAME` e `APP_ADMIN_PASSWORD`, definidos no seu arquivo `.env`.

Se alterar qualquer valor no `.env`, pare e reinicie a aplicação para carregar as novas configurações.

### 6. Carregar os dados de demonstração

Na primeira inicialização, o Hibernate cria ou atualiza as tabelas do banco conforme a configuração JPA do projeto.

Depois que as tabelas existirem, abra e execute no MySQL Workbench:

```text
docs/sql/dados-exemplo.sql
```

Esse script inclui registros demonstrativos de marcas, modelos e veículos. Ele verifica a existência dos registros antes de inseri-los para reduzir duplicações quando executado mais de uma vez.

### 7. Encerrar a aplicação

No terminal em que a aplicação está rodando, pressione:

```text
Ctrl + C
```

## API REST e autenticação

A API é protegida por autenticação baseada em sessão. Sem estar autenticado, uma requisição a um endpoint protegido, como `/api/veiculos`, deve receber HTTP `401 Unauthorized`.

Para demonstrar o sistema, a forma recomendada é iniciar a aplicação, abrir `http://localhost:8080`, entrar com o usuário e a senha definidos em `APP_ADMIN_USERNAME` e `APP_ADMIN_PASSWORD` no `.env` local e usar a interface do AutoStock. O painel chama a API mantendo a sessão autenticada.

Os endpoints principais são:

- `/api/marcas` — consulta e gerenciamento de marcas.
- `/api/modelos` — consulta e gerenciamento de modelos.
- `/api/veiculos` — consulta, gerenciamento e filtros de veículos.
- `/api/csrf` — fornece o token CSRF utilizado para proteger operações que alteram dados.

As operações de criação, edição e exclusão exigem, além da sessão autenticada, um token CSRF válido. Por isso, exemplos de requisições não devem ser enviados como se fossem endpoints públicos. O arquivo `docs/requisicoes.http` reúne exemplos de chamadas e filtros; ao testá-los manualmente, use uma sessão autenticada e envie o token CSRF nas requisições que alteram dados.

A API permite filtrar veículos por marca, modelo, ano, preço mínimo, preço máximo e situação. Exemplos:

```http
GET /api/veiculos?marca=Toyota&ano=2022&status=DISPONIVEL
GET /api/veiculos?modelo=Corolla
GET /api/veiculos?precoMin=50000&precoMax=150000
```

## Estrutura principal do projeto

```text
gestao-estoque-veiculos/
├── docs/
│   ├── requisicoes.http
│   └── sql/
│       ├── criar-banco.sql
│       └── dados-exemplo.sql
├── src/
│   ├── main/
│   │   ├── java/br/com/marinize/gestaoestoqueveiculos/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
│   │   └── resources/
│   │       ├── static/       # Interface web, scripts, estilos e imagens
│   │       └── application.properties
│   └── test/                 # Testes automatizados
├── .env.example
├── .gitignore
├── pom.xml
└── README.md
```

## Solução de problemas

### `mvn` não é reconhecido

Instale o Maven e configure sua pasta `bin` no `PATH` do Windows. Feche e reabra o terminal ou o VS Code depois de alterar o `PATH`. Como alternativa, execute o `mvn.cmd` usando o caminho em que o Maven foi instalado.

### Erro de conexão com o MySQL

Confirme que:

- O serviço MySQL está em execução.
- O banco `gestao_estoque_veiculos` foi criado.
- `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` no `.env` correspondem à instalação local do MySQL.
- A aplicação foi reiniciada após mudanças no `.env`.

### Erro relacionado às variáveis do administrador

Confirme que `APP_ADMIN_USERNAME` e `APP_ADMIN_PASSWORD` estão definidos no `.env` e reinicie a aplicação. A senha administrativa deve seguir a validação implementada no projeto.

## Observação sobre o escopo

Este é um projeto acadêmico preparado para execução local. As credenciais são configuradas individualmente por quem executa o projeto. Não publique arquivos `.env`, senhas ou outros segredos no repositório.
