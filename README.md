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
- Spring Boot
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

As credenciais do MySQL e as credenciais de login do AutoStock são diferentes. Use valores locais e seguros; não reutilize senhas pessoais.

O arquivo `.env` é ignorado pelo Git e **não deve ser enviado ao GitHub**. O repositório contém apenas `.env.example`, que serve como modelo. Não coloque senhas reais em `application.properties`, no README ou em commits.

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

## API REST

Os endpoints da API são protegidos por autenticação. A interface web usa esses endpoints para operar o sistema.

- `/api/marcas` — marcas.
- `/api/modelos` — modelos.
- `/api/veiculos` — veículos e filtros.
- `/api/csrf` — token CSRF utilizado pela aplicação web.

Exemplo de consulta autenticada:

```text
GET /api/veiculos
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
