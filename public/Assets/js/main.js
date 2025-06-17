document.addEventListener('DOMContentLoaded', () => {
    const listaTarefasEl = document.getElementById('tarefas-lista');
    const addTaskForm = document.getElementById('add-task-form');
    const taskInput = document.getElementById('task-input');
    const statusIndicator = document.getElementById('status-indicator');
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskInput = document.getElementById('edit-task-input');
    const editTaskIdInput = document.getElementById('edit-task-id');
    const deleteTaskForm = document.getElementById('remove-task-form');
    const deleteTaskIdInput = document.getElementById('remove-task-id');

    const API_URL = 'http://localhost:3000/api/tasks';

    // Função para atualizar o status no rodapé
    const updateStatus = (state, message) => {
        statusIndicator.className = '';
        statusIndicator.classList.add(`status-${state}`);
        statusIndicator.textContent = message;
    };

    // Função para renderizar UMA tarefa na tela
    const renderTask = (task) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'checkbox-wrapper-13';
        taskDiv.dataset.id = task.id; // Importante para identificar a tarefa

        const isChecked = task.concluida ? 'checked' : '';

        taskDiv.innerHTML = `
            <input id="task-${task.id}" type="checkbox" ${task.concluida ? 'checked' : ''}>
            <label for="task-${task.id}">${task.tarefa}</label>
            <i class="fa-solid fa-pencil edit-btn" title="Editar tarefa"></i> 
            <i class="fa-solid fa-trash delete-btn" title="Excluir tarefa"></i>
        `;

        // Adiciona evento para marcar como concluída
        const checkbox = taskDiv.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(task.id, checkbox.checked);
        });

        const editBtn = taskDiv.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            // Pega os dados da tarefa atual
            const currentText = taskDiv.querySelector('label').textContent;
            const taskId = task.id;

            // Preenche o modal de edição com os dados
            editTaskInput.value = currentText;
            editTaskIdInput.value = taskId;

            // Abre o modal de edição
            $('#edit-task-modal').modal('show');
        });

        const deleteBtn = taskDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const currentText = taskDiv.querySelector('label').textContent;
            const taskId = task.id;

            // Mostra mensagem de confirmação no modal
            const label = document.getElementById('remove-task-label');
            if (label) {
                label.textContent = `Deseja realmente excluir a tarefa "${currentText}"?`;
            }
            // Passa o id da tarefa para o campo hidden
            deleteTaskIdInput.value = taskId;

            $('#remove-task-modal').modal('show');
        });

        listaTarefasEl.appendChild(taskDiv);
    };

    // 1. Carregar todas as tarefas ao iniciar
    const fetchTasks = async () => {
        updateStatus('syncing', 'Carregando tarefas...');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Falha ao buscar tarefas');

            const tasks = await response.json();
            listaTarefasEl.innerHTML = ''; // Limpa a lista
            tasks.forEach(renderTask);
            updateStatus('synced', 'Tarefas sincronizadas.');
        } catch (error) {
            updateStatus('error', 'Erro de conexão. Verifique se o servidor está rodando.');
            console.error(error);
        }
    };

    // 2. Adicionar uma nova tarefa
    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tarefaTexto = taskInput.value.trim();
        if (!tarefaTexto) return;

        $('#add-task-modal').modal('hide'); // Fecha o modal com jQuery (já que Bootstrap o usa)
        taskInput.value = '';

        updateStatus('syncing', 'Adicionando tarefa...');
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tarefa: tarefaTexto }),
            });
            if (!response.ok) throw new Error('Falha ao adicionar tarefa');

            const newTask = await response.json();
            renderTask(newTask); // Adiciona a nova tarefa na lista
            updateStatus('synced', 'Tarefa adicionada com sucesso!');
        } catch (error) {
            updateStatus('error', 'Falha ao salvar a tarefa.');
            console.error(error);
        }
    });

    // 3. Marcar/desmarcar tarefa como concluída
    const toggleTaskCompletion = async (id, isCompleted) => {
        updateStatus('syncing', 'Atualizando status...');
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ concluida: isCompleted }),
            });
            if (!response.ok) throw new Error('Falha ao atualizar');
            updateStatus('synced', 'Status atualizado!');
        } catch (error) {
            updateStatus('error', 'Falha ao atualizar o status.');
            // Desfaz a alteração visual se der erro
            const checkbox = document.getElementById(`task-${id}`);
            if (checkbox) checkbox.checked = !isCompleted;
        }
    };

    // 4. Deletar uma tarefa
    const deleteTask = async (id) => {
        updateStatus('syncing', 'Excluindo tarefa...');
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Falha ao excluir');

            // Remove o elemento da tela
            const taskEl = document.querySelector(`[data-id='${id}']`);
            if (taskEl) taskEl.remove();

            updateStatus('synced', 'Tarefa excluída!');
        } catch (error) {
            updateStatus('error', 'Falha ao excluir a tarefa.');
        }
    };

    const updateTaskText = async (id, newText) => {
        updateStatus('syncing', 'Salvando alterações...');
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tarefa: newText }), // Enviamos apenas o campo 'tarefa'
            });

            if (!response.ok) throw new Error('Falha ao salvar');

            const updatedTask = await response.json();

            // Atualiza o texto na tela
            const taskLabel = document.querySelector(`[data-id='${id}'] label`);
            if (taskLabel) {
                taskLabel.textContent = updatedTask.tarefa;
            }

            updateStatus('synced', 'Tarefa atualizada!');

        } catch (error) {
            updateStatus('error', 'Não foi possível salvar a alteração.');
        }
    };

    // ---> NOVO: Listener para o formulário de edição <---
    editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newText = editTaskInput.value.trim();
        const taskId = editTaskIdInput.value;

        if (newText && taskId) {
            updateTaskText(taskId, newText);
            $('#edit-task-modal').modal('hide'); // Fecha o modal
        }
    });

    // Listener para o formulário de remoção
    deleteTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskId = deleteTaskIdInput.value;
        if (taskId) {
            deleteTask(taskId);
            $('#remove-task-modal').modal('hide');
        }
    });

    // Inicia tudo
    fetchTasks();
});