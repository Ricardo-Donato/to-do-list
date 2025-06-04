document.addEventListener('DOMContentLoaded', () => {
    const btnAdicionarTarefa = document.getElementById('btn-adicionar-tarefa');
    let listaTarefas = document.getElementById('tarefas-lista');

    btnAdicionarTarefa.addEventListener('click', () => {
        const tarefaTexto = prompt('Digite a nova tarefa:');
        if (tarefaTexto) {
            adicionarNovaTarefa(tarefaTexto);
        }
    })

    //função apenas para exemplificar
    function adicionarNovaTarefa(tarefa) {
        listaTarefas.innerHTML += `<span>${tarefa}</span><br>`;
        alert(`A tarefa ${tarefa} foi adicionada com sucesso!`);
    }
})