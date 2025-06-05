document.addEventListener('DOMContentLoaded', () => {
    const btnAdicionarTarefa = document.getElementById('btn-adicionar-tarefa');
    let listaTarefas = document.getElementById('tarefas-lista');

    btnAdicionarTarefa.addEventListener('click', () => {
        const tarefaTexto = prompt('Digite a nova tarefa:');
        if (tarefaTexto) {
            adicionarNovaTarefa(tarefaTexto);
        }
    })

    //fun��o apenas para exemplificar
    function adicionarNovaTarefa(tarefa) {
        listaTarefas.innerHTML += `
            <div class="checkbox-wrapper-13">
                <input id="${tarefa}" type="checkbox">
                <label for="${tarefa}">${tarefa}</label>
            </div>`;

        alert(`A tarefa ${tarefa} foi adicionada com sucesso!`);
    }

    function mostrarMensagem(mensagem, type) {
        let elementoMensagem = document.getElementById('message-container');

        if (!elementoMensagem) {
            elementoMensagem = document.createElement('div');
            elementoMensagem.id = 'message-container';
            document.body.appendChild(elementoMensagem);
        }
        elementoMensagem.innerHTML = mensagem;
        elementoMensagem.className = `message ${type}`;
        elementoMensagem.style.display = 'block';

        setTimeout(() => {
            elementoMensagem.style.display = 'none';
        }, 5000);

    }
})