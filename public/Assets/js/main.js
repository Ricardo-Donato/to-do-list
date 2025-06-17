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

    const updateStatus = (state, message) => {
        statusIndicator.className = '';
        statusIndicator.classList.add(`status-${state}`);
        statusIndicator.textContent = message;
    };

    const renderTask = (task) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'checkbox-wrapper-13';
        taskDiv.dataset.id = task.id;

        const isChecked = task.concluida ? 'checked' : '';

        taskDiv.innerHTML = `
            <input id="task-${task.id}" type="checkbox" ${task.concluida ? 'checked' : ''}>
            <label for="task-${task.id}">${task.tarefa}</label>
            <i class="fa-solid fa-pencil edit-btn" title="Editar tarefa"></i> 
            <i class="fa-solid fa-trash delete-btn" title="Excluir tarefa"></i>
        `;

        const checkbox = taskDiv.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            toggleTaskCompletion(task.id, checkbox.checked);
        });

        const editBtn = taskDiv.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const currentText = taskDiv.querySelector('label').textContent;
            const taskId = task.id;

            editTaskInput.value = currentText;
            editTaskIdInput.value = taskId;

            $('#edit-task-modal').modal('show');
        });

        const deleteBtn = taskDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const currentText = taskDiv.querySelector('label').textContent;
            const taskId = task.id;

            const label = document.getElementById('remove-task-label');
            if (label) {
                label.textContent = `Deseja realmente excluir a tarefa "${currentText}"?`;
            }
            deleteTaskIdInput.value = taskId;

            $('#remove-task-modal').modal('show');
        });

        listaTarefasEl.appendChild(taskDiv);
    };

    const fetchTasks = async () => {
        updateStatus('syncing', 'Carregando tarefas...');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Falha ao buscar tarefas');

            const tasks = await response.json();
            listaTarefasEl.innerHTML = '';
            tasks.forEach(renderTask);
            updateStatus('synced', 'Tarefas sincronizadas.');
        } catch (error) {
            updateStatus('error', 'Erro de conexão. Verifique se o servidor está rodando.');
            console.error(error);
        }
    };

    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tarefaTexto = taskInput.value.trim();
        if (!tarefaTexto) return;

        $('#add-task-modal').modal('hide');
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
            renderTask(newTask);
            updateStatus('synced', 'Tarefa adicionada com sucesso!');
        } catch (error) {
            updateStatus('error', 'Falha ao salvar a tarefa.');
            console.error(error);
        }
    });

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
            const checkbox = document.getElementById(`task-${id}`);
            if (checkbox) checkbox.checked = !isCompleted;
        }
    };

    const deleteTask = async (id) => {
        updateStatus('syncing', 'Excluindo tarefa...');
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Falha ao excluir');

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
                body: JSON.stringify({ tarefa: newText }),
            });

            if (!response.ok) throw new Error('Falha ao salvar');

            const updatedTask = await response.json();

            const taskLabel = document.querySelector(`[data-id='${id}'] label`);
            if (taskLabel) {
                taskLabel.textContent = updatedTask.tarefa;
            }

            updateStatus('synced', 'Tarefa atualizada!');

        } catch (error) {
            updateStatus('error', 'Não foi possível salvar a alteração.');
        }
    };

    editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newText = editTaskInput.value.trim();
        const taskId = editTaskIdInput.value;

        if (newText && taskId) {
            updateTaskText(taskId, newText);
            $('#edit-task-modal').modal('hide');
        }
    });

    deleteTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskId = deleteTaskIdInput.value;
        if (taskId) {
            deleteTask(taskId);
            $('#remove-task-modal').modal('hide');
        }
    });

    fetchTasks();
});