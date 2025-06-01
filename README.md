# Projeto Lista de Compras Interativa com banco de dados

## Visão Geral

Este projeto é uma aplicação web interativa de Lista de Compras. 
Ele permite que os usuários façam login e, em seguida, criem e gerenciem suas listas de compras de forma simples e eficiente. 
A interface é projetada para ser intuitiva, facilitando a adição, visualização e remoção de itens.

## Funcionalidades

O projeto é dividido em duas seções principais:

1.  **Tela de Login:**
    * Campos para inserção de e-mail e senha.
    * Botão "Entrar" para autenticação do usuário.
    * Exibição de mensagens de erro em caso de falha no login.

2.  **Aplicativo da Lista de Compras (após o login):**
    * **Adicionar Itens:**
        * Campo para nomear o item.
        * Campo para especificar a quantidade (com valor mínimo de 1).
        * Seleção da unidade de medida (Unidade, Kg).
        * Botão "Adicionar" para incluir o item na lista.
    * **Visualização da Lista:**
        * Exibição dos itens adicionados em uma lista dinâmica.
        * (Presumivelmente, cada item da lista terá opções para edição ou remoção individual, dependendo da lógica em `js/app.js`).
    * **Ações da Lista:**
        * Botão "Limpar Tudo" para remover todos os itens da lista de uma vez.
        * Botão "Sair" para efetuar logout da aplicação e retornar à tela de login.

## Tecnologias Utilizadas

* **HTML5:** Estrutura semântica da página.
* **CSS3:** Estilização da interface do usuário (referenciado em `css/style.css`).
* **JavaScript (ES6 Modules):** Lógica da aplicação, manipulação do DOM e interatividade (localizado em `js/app.js`).
* **Bootstrap Icons:** Utilizado para os ícones na interface, melhorando a experiência visual.

## Estrutura do Projeto

O arquivo principal é `index.html`, que contém a estrutura das duas principais visualizações da aplicação: a tela de login e a interface da lista de compras.

* **`div#loginDiv`**: Contêiner para os elementos da tela de login.
* **`div#appDiv`**: Contêiner para os elementos da aplicação da lista de compras, inicialmente oculto e exibido após o login bem-sucedido.

## Como Executar (Sugestão)

1.  Clone este repositório: `git clone [(https://github.com/Falcon9749/mercado)]`
2.  Abra o projeto no seu editor de codigos de preferência.
3.  Mude os dados de acesso ao banco de dados FireBase para a sua conta no app.js
### Localise esse codigo no app.js para mudar de acordo com seu banco de dados
            const firebaseConfig = {
                apiKey: "xxxxxx",
                authDomain: "xxxxxxx",
                databaseURL: "xxxxxxx",
                projectId: "xxxxxx",
                storageBucket: "xxxxxx",
                messagingSenderId: "xxxxxxx",
                appId: "xxxxxxx"
            };

*(link do Back-end da base de dados https://console.firebase.google.com/)*

## Possíveis Melhorias Futuras (Sugestões)

* Implementação de persistência de dados (ex: LocalStorage, Firebase, ou um backend dedicado) para que a lista de compras seja salva entre as sessões.
* Funcionalidade de edição de itens já adicionados à lista.
* Validação de entrada mais robusta.
* Opção de marcar itens como "comprados".
* Categorização de itens.
* Funcionalidade de registro de novos usuários.

## Contato

Gilnei Monteiro/Falcon9749 - https://falcon.dev.br

---

Este README fornece uma boa base. Você pode personalizá-lo adicionando mais detalhes sobre a lógica específica do JavaScript (`app.js`), 
o design do `style.css`, ou quaisquer outras características únicas do seu projeto. Se você tiver o link do projeto online ou do repositório, não se esqueça de adicioná-los!
