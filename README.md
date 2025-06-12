# ToDoList - Aplicação Full Stack

 <!-- SUBSTITUA PELO SEU SCREENSHOT/GIF -->

Uma aplicação web de lista de tarefas (To-Do List) simples e funcional, construída com uma stack **Node.js/Express** no backend e **HTML/CSS/JavaScript com Bootstrap** no frontend. Este projeto foi desenvolvido como um estudo prático de desenvolvimento Full Stack, focando na criação de uma API RESTful e na manipulação dinâmica do DOM.

---

## ✨ Funcionalidades

- **CRUD Completo de Tarefas:** Crie, Leia, Atualize e Exclua tarefas.
- **Interface Otimista:** A interface do usuário é atualizada instantaneamente para uma experiência mais rápida e fluida, antes mesmo da confirmação do servidor.
- **Indicador de Status em Tempo Real:** Um indicador no rodapé mostra o status da sincronização com o servidor (Sincronizando..., Sincronizado, Erro).
- **Persistência de Dados:** As tarefas são salvas em um arquivo `tarefas.json` no backend, funcionando como um banco de dados simples.
- **Design Responsivo:** Interface limpa e adaptável a diferentes tamanhos de tela, utilizando Bootstrap 4.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:**
  - [Node.js](https://nodejs.org/en/)
  - [Express.js](https://expressjs.com/pt-br/)
  - [CORS](https://www.npmjs.com/package/cors)

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - [Bootstrap 4](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
  - [Font Awesome](https://fontawesome.com/) (para ícones)

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd seu-repositorio
    ```

3.  **Instale as dependências do backend:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor backend:**
    ```bash
    node backend/server.js
    ```
    O servidor estará rodando em `http://localhost:3000`.

5.  **Abra o frontend:**
    -   Navegue até a pasta `public/`.
    -   Abra o arquivo `index.html` em seu navegador de preferência.

---

## 📂 Estrutura do Projeto

O projeto é organizado com uma clara separação entre o código do backend e os arquivos do frontend.

```
seu-repositorio/
├── 📂 backend/
│   ├── server.js         # Lógica do servidor e da API
│   └── tarefas.json      # Arquivo de persistência de dados
│
├── 📂 public/
│   ├── index.html        # Estrutura principal da página
│   ├── sobre.html
│   └── 📂 Assets/
│       ├── 📂 css/
│       ├── 📂 js/
│       └── 📂 Images/
│
├── .gitignore
├── package.json
└── README.md
```

---

## 📝 Endpoints da API

A API RESTful segue os seguintes endpoints:

| Método | URL                  | Descrição                                 |
| :----- | :------------------- | :---------------------------------------- |
| `GET`  | `/api/tasks`         | Retorna a lista de todas as tarefas.      |
| `POST` | `/api/tasks`         | Cria uma nova tarefa.                     |
| `PUT`  | `/api/tasks/:id`     | Atualiza uma tarefa (texto e/ou status).  |
| `DELETE`| `/api/tasks/:id`    | Exclui uma tarefa específica.             |

---

## 🔮 Próximos Passos

- [ ] Implementar um sistema de autenticação de usuários (JWT).
- [ ] Substituir o `tarefas.json` por um banco de dados real (MongoDB ou PostgreSQL).
- [ ] Adicionar testes unitários e de integração (Jest, Supertest).
- [ ] Realizar o deploy da aplicação em uma plataforma como Heroku ou Vercel.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

## 👨‍💻 Autor

Feito com ❤️ por **[Pedro Donato]**

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/donatosilva/)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ricardo-Donato/)
