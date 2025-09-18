# Gerador de Tarefas Azure com IA

Este projeto foi desenvolvido como parte de um hackathon com o objetivo de otimizar o processo de criação de itens de trabalho no Azure DevOps.

## Objetivos do Hackathon

Nossa meta era construir uma aplicação que servisse como uma ferramenta de assistência para Business Analysts (BAs) e outros membros do time na criação de cards no Azure DevOps. O plano inicial abrangia as seguintes funcionalidades:

-   **Criação de Tarefas com IA:** Permitir que a IA gere uma tarefa estruturada a partir de uma descrição em linguagem natural.
-   **Edição da Tarefa:** Dar ao usuário a capacidade de editar os campos da tarefa gerada pela IA antes de enviá-la.
-   **Envio para o Azure:** Integrar com a API do Azure DevOps para enviar a tarefa diretamente para o board.
-   **Seleção de Tipo:** Permitir que o usuário especifique o tipo do item de trabalho (Task, Bug, User Story, etc.).
-   **Atribuição e Datas (Planejado):** Incluir campos para atribuir a tarefa a um membro do time e definir uma data de entrega (`Target Date`).
-   **Criação de Sub-tarefas (Planejado):** Habilitar a criação de sub-tarefas vinculadas a itens de trabalho pais, como User Stories ou Epics.

---

## Funcionalidades Implementadas

Conseguimos implementar o núcleo da nossa visão, criando uma ferramenta funcional e robusta que agiliza significativamente o fluxo de trabalho. As seguintes funcionalidades foram concluídas:

✅ **Geração de Tarefas via IA (Google Gemini)**
   - O usuário pode fornecer um **Modelo de Tarefa** (instruções para a IA), o **Tipo de Item de Trabalho** e os **Detalhes do Card**.
   - A IA utiliza essas informações para gerar um ou mais cards estruturados em formato JSON, contendo título, descrição (em markdown), tipo e tags.

✅ **Configuração Persistente**
   - As configurações do Azure DevOps (Organização, Projeto e PAT) e o "Modelo da Tarefa" para a IA são salvos localmente no navegador, evitando a necessidade de inseri-los repetidamente.

✅ **Edição Completa na Interface**
   - Após a geração pela IA, cada card pode ser editado diretamente na interface. O usuário pode ajustar o título, a descrição, o tipo e as tags antes do envio.

✅ **Integração Direta com Azure DevOps**
   - A aplicação se conecta à API REST do Azure DevOps para criar o item de trabalho.
   - O botão "Enviar para o Azure" gerencia os estados da requisição (enviando, sucesso, erro), fornecendo feedback claro ao usuário.

✅ **Link de Retorno Imediato**
   - Após a criação bem-sucedida, a interface exibe um link direto ("Ver no Azure") para o item de trabalho recém-criado, fechando o ciclo do fluxo de trabalho.

✅ **Interface Intuitiva e Responsiva**
   - O layout de duas colunas permite visualizar a entrada de dados e os resultados simultaneamente em telas maiores.
   - A descrição das tarefas renderiza o formato markdown, melhorando a legibilidade de listas e parágrafos.

---

## Diagrama da Arquitetura

O diagrama abaixo ilustra o fluxo de dados e a interação entre os componentes da aplicação:

```mermaid
graph TD
    A["Usuário na Interface<br>(React)"] --> B{"Insere Detalhes<br>Modelo, Tipo, Descrição"};
    B --> C{"Clica em 'Gerar Tarefa'"};
    C --> D["Serviço Gemini<br>(chama a API do Google AI)"];
    D --> E{"Retorna Tarefa<br>estruturada"};
    E --> A;
    A --> F{"Exibe e Permite<br>Edição da Tarefa"};
    F --> G{"Clica em 'Enviar para o Azure'"};
    G --> H["Serviço Azure<br>(chama a API REST do Azure DevOps)"];
    H --> I["Azure DevOps<br>Cria o Item de Trabalho"];
    I --> H;
    H --> A;
    A --> J{"Exibe Link para a<br>Tarefa Criada"};
```

---

## Vulnerabilidades de Segurança e Pontos de Melhoria

Como um protótipo desenvolvido em um hackathon, a aplicação possui algumas simplificações arquiteturais que introduzem vulnerabilidades de segurança. É crucial que estes pontos sejam corrigidos antes de considerar o uso em um ambiente de produção.

### 1. (Crítico) Armazenamento do Token de Acesso Pessoal (PAT) no `localStorage`

-   **O Problema:** O token PAT do Azure DevOps, que funciona como uma senha, é armazenado no `localStorage` do navegador. Esta é uma área de armazenamento acessível por qualquer script JavaScript em execução na página.
-   **O Risco:** Um ataque de Cross-Site Scripting (XSS) poderia facilmente injetar um script malicioso para ler o `localStorage`, roubar o token PAT e ganhar acesso total aos projetos do usuário no Azure DevOps.
-   **Solução Recomendada:** Tokens e chaves de API sensíveis **nunca** devem ser manipulados ou armazenados no frontend. A arquitetura correta envolve a criação de um **backend (servidor) que atua como um proxy**. O frontend se comunica apenas com este backend, que por sua vez armazena o PAT de forma segura e realiza as chamadas para a API do Azure DevOps, garantindo que o token nunca seja exposto ao navegador.

### 2. (Alto) Vulnerabilidade de Cross-Site Scripting (XSS) na Renderização da Descrição

-   **O Problema:** A descrição da tarefa, que pode ser editada pelo usuário, era anteriormente renderizada usando `dangerouslySetInnerHTML`. Esta função insere HTML diretamente no DOM sem sanitização.
-   **O Risco:** Um usuário poderia inserir código JavaScript malicioso (ex: `<script>alert('XSS')</script>`) no campo de descrição. Este script seria executado no navegador de qualquer pessoa que visualizasse o card, permitindo o roubo do PAT ou outras ações maliciosas.
-   **Correção Aplicada:** O uso de `dangerouslySetInnerHTML` foi **removido**. A aplicação agora utiliza um componente React que interpreta o markdown de forma segura, convertendo parágrafos e listas em elementos React, o que previne a injeção de scripts.

### 3. Exposição de Chaves de API no Cliente

-   **O Problema:** Por ser uma aplicação puramente frontend, a chave da API do Google Gemini precisa estar disponível no lado do cliente para funcionar, o que a torna visível para qualquer pessoa que inspecione o código-fonte da página.
-   **O Risco:** A exposição de chaves de API pode levar ao seu uso indevido e a custos inesperados na plataforma do Google Cloud.
-   **Solução Recomendada:** Assim como no caso do PAT, a solução ideal é centralizar todas as chamadas a APIs externas em um **backend proxy**.

---

## Integrantes do Grupo

-   Arthur Kotovas Ortiz
-   Matheus Henrique Della de Oliveira
-   Yuri Pires Alves
