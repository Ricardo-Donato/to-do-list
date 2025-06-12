const express = require('express');
const cors = require('cors');
const fs = require('fs/promises'); // Usamos a versão de 'promises' do fs
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(express.static(path.join(__dirname, '../public'))); //serve arquivos estáticos do diretório 'public'

// Define o caminho para o arquivo de tarefas
const TASKS_PATH = path.join(__dirname, 'tarefas.json');

// --- Funções Auxiliares ---
const readTasks = async () => {
    try {
        const data = await fs.readFile(TASKS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir, retorna um array vazio
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeTasks = async (tasks) => {
    await fs.writeFile(TASKS_PATH, JSON.stringify(tasks, null, 2));
};


// --- Rotas da API ---

// GET /api/tasks -> Retorna todas as tarefas
app.get('/api/tasks', async (req, res) => {
    const tasks = await readTasks();
    res.json(tasks);
});

// POST /api/tasks -> Adiciona uma nova tarefa
app.post('/api/tasks', async (req, res) => {
    const { tarefa } = req.body;
    if (!tarefa) {
        return res.status(400).json({ message: 'O texto da tarefa é obrigatório.' });
    }

    // Simulando atraso de rede para ver o status "Sincronizando"
    await new Promise(resolve => setTimeout(resolve, 1000));

    const tasks = await readTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id || 0)) + 1 : 1;
    const newTask = { id: newId, tarefa: tarefa, concluida: false };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
});

// PUT /api/tasks/:id -> Atualiza uma tarefa (ex: marcar como concluída)
app.put('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { tarefa, concluida } = req.body; // Pegamos tanto 'tarefa' quanto 'concluida' do corpo da requisição

    // Simulando um pequeno atraso para vermos o status de "sincronizando"
    await new Promise(resolve => setTimeout(resolve, 500));

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    // Atualiza o texto da tarefa APENAS se ele foi enviado na requisição
    if (tarefa !== undefined) {
        tasks[taskIndex].tarefa = tarefa;
    }

    // Atualiza o status de conclusão APENAS se ele foi enviado
    if (concluida !== undefined) {
        tasks[taskIndex].concluida = concluida;
    }

    await writeTasks(tasks);

    // Retorna a tarefa completamente atualizada
    res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id -> Remove uma tarefa
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    let tasks = await readTasks();
    const updatedTasks = tasks.filter(t => t.id !== taskId);

    if (tasks.length === updatedTasks.length) {
        return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    await writeTasks(updatedTasks);
    res.status(204).send(); // 204 No Content -> Sucesso, sem corpo de resposta
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servindo o arquivo de tarefas: ${TASKS_PATH}`);
});