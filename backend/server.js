const express = require('express');
const cors = require('cors');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(express.static(path.join(__dirname, '../public'))); //serve arquivos estáticos do diretório 'public'

// Define o caminho para o arquivo de tarefas
const TASKS_PATH = path.join(__dirname, 'tarefas.json');

// Caminho para o arquivo de mensagens de contato
const MESSAGES_PATH = path.join(__dirname, 'mensagens.json');

// --- Funções Auxiliares ---
const readTasks = async () => {
    try {
        const data = await readFile(TASKS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir, retorna um array vazio
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeTasks = async (tasks) => {
    await writeFile(TASKS_PATH, JSON.stringify(tasks, null, 2));
};

const readMessages = async () => {
    try {
        const data = await readFile(MESSAGES_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeMessages = async (messages) => {
    await writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2));
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

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
    }
    try {
        const messages = await readMessages();
        const newMessage = {
            id: messages.length > 0 ? Math.max(...messages.map(m => m.id || 0)) + 1 : 1,
            name,
            email,
            message,
            date: new Date().toISOString()
        };
        messages.push(newMessage);
        await writeMessages(messages);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao salvar mensagem.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servindo o arquivo de tarefas: ${TASKS_PATH}`);
});