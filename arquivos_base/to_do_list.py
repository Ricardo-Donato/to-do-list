import json

def carregar_tarefas():
    try:
        with open('tarefas.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def salvar_tarefas(tarefas):
    with open('tarefas.json', 'w') as file:
        json.dump(tarefas, file)

def adicionar_tarefa(tarefas):
    tarefa = input("Digite a nova tarefa: ")
    tarefas.append({"tarefa": tarefa, "concluida": False})
    salvar_tarefas(tarefas)

def exibir_tarefas(tarefas):
    for i, tarefa in enumerate(tarefas):
        status = "Concluída" if tarefa["concluida"] else "Pendente"
        print(f"{i + 1}. {tarefa['tarefa']} [{status}]")

def marcar_concluida(tarefas):
    exibir_tarefas(tarefas)
    numero = int(input("Digite o número da tarefa que deseja marcar como concluída: ")) - 1
    if 0 <= numero < len(tarefas):
        tarefas[numero]["concluida"] = True
        salvar_tarefas(tarefas)
    else:
        print("Número inválido.")

def remover_tarefa(tarefas):
    exibir_tarefas(tarefas)
    numero = int(input("Digite o número da tarefa que deseja remover: ")) - 1
    if 0 <= numero < len(tarefas):
        tarefas.pop(numero)
        salvar_tarefas(tarefas)
    else:
        print("Número inválido.")

def main():
    tarefas = carregar_tarefas()
    
    while True:
        print("\nGerenciador de Lista de Tarefas")
        print("1. Adicionar Tarefa")
        print("2. Exibir Tarefas")
        print("3. Marcar Tarefa como Concluída")
        print("4. Remover Tarefa")
        print("5. Sair")

        escolha = input("Escolha uma opção: ")
        
        if escolha == '1':
            adicionar_tarefa(tarefas)
        elif escolha == '2':
            exibir_tarefas(tarefas)
        elif escolha == '3':
            marcar_concluida(tarefas)
        elif escolha == '4':
            remover_tarefa(tarefas)
        elif escolha == '5':
            break
        else:
            print("Opção inválida, por favor escolha novamente.")

if __name__ == "__main__":
    main()
