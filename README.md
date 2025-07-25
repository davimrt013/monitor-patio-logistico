# Monitor de Pátio Logístico

Uma aplicação web client-side para monitoramento e gerenciamento do fluxo de veículos no pátio de um centro de distribuição.

## 📋 Características Principais

- **Interface Kanban**: Visualização intuitiva com três colunas (Pátio, Doca, Finalizados)
- **Visualização em Planilha**: Tabela completa com todos os dados dos veículos
- **Persistência Local**: Todos os dados são armazenados no localStorage do navegador
- **Backup/Restauração**: Exportação e importação de dados em formato JSON
- **Temas**: Alternância entre tema claro e escuro
- **Responsivo**: Otimizado para TV 4K e notebooks
- **Exportações**: Imagem PNG do Kanban e planilha Excel

## 🚀 Funcionalidades

### Aba Kanban
- **Drag and Drop**: Mova veículos entre as colunas para atualizar status
- **Cards Informativos**: Exibem cliente, placa, motorista, transportadora e horários
- **Filtro por Cliente**: Filtre a visualização por cliente específico
- **Exportar Imagem**: Gere uma imagem PNG do quadro Kanban
- **Contadores**: Visualize a quantidade de veículos em cada status

### Aba Planilha
- **Visualização Completa**: Tabela com todas as colunas de dados
- **CRUD Completo**: Criar, editar e excluir registros
- **Filtros**: Busca por texto e filtro por status
- **Exportar Excel**: Gere arquivo .xlsx com todos os dados

### Configurações
- **Upload de Logo**: Personalize com o logo da empresa
- **Backup de Dados**: Exporte/importe dados em formato JSON
- **Alternância de Tema**: Tema claro ou escuro

## 📊 Estrutura de Dados

Cada veículo possui os seguintes campos:

- **Data**: Data do registro (DD/MM/AAAA)
- **Placa**: Placa do veículo (convertida para maiúsculas)
- **Motorista**: Nome do motorista
- **Transportadora**: Nome da transportadora
- **Cliente**: Nome do cliente
- **NF/DT/SENHA**: Número da nota fiscal, documento ou senha
- **Observações**: Observações gerais
- **Tipo de Veículo**: Truck, Toco, Carreta, Sider, Aberto, Bitrem
- **Operação**: Recebimento, Devolução, Cross Docking, Expedição
- **Tipo**: Estivado, Paletizado, Misto
- **Status**: Pátio, Doca, Finalizado, NO-SHOW
- **HR Agendada**: Horário agendado (DD/MM/AAAA HH:MM)
- **HR Chegada**: Horário de chegada (DD/MM/AAAA HH:MM)
- **HR Doca**: Horário de entrada na doca (DD/MM/AAAA HH:MM)
- **HR Saída de Doca**: Horário de saída da doca (DD/MM/AAAA HH:MM)
- **HR Saída do CD**: Horário de saída do centro de distribuição (DD/MM/AAAA HH:MM)
- **Tempo Total Em Doca**: Calculado automaticamente
- **Tempo Total CD**: Calculado automaticamente

## 🎨 Design e Interface

### Cores por Status
- **Pátio**: Vermelho (#dc3545)
- **Doca**: Laranja (#fd7e14)
- **Finalizado**: Verde (#28a745)
- **NO-SHOW**: Rosa (#e83e8c)

### Cores por Operação
- **Recebimento**: Azul (#007bff)
- **Expedição**: Amarelo (#ffc107)
- **Cross Docking**: Roxo (#6f42c1)
- **Devolução**: Ciano (#17a2b8)

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização e responsividade
- **JavaScript (ES6+)**: Lógica da aplicação
- **Font Awesome**: Ícones
- **html2canvas**: Exportação de imagem do Kanban
- **SheetJS (xlsx)**: Exportação para Excel
- **localStorage**: Persistência de dados

## 📱 Responsividade

A aplicação é otimizada para:
- **TV 4K** (3840x2160): Visualização principal
- **Notebooks**: Funcionamento completo
- **Tablets e Smartphones**: Layout adaptativo

## 🔄 Fluxo de Trabalho

1. **Cadastro**: Registre novos veículos com informações básicas
2. **Pátio**: Veículos aguardando na coluna Pátio
3. **Doca**: Arraste para a coluna Doca quando iniciar operação
4. **Finalização**: Arraste para Finalizados e complete as informações
5. **Relatórios**: Exporte dados em imagem ou Excel

## 💾 Backup e Segurança

- **Backup Automático**: Dados salvos automaticamente no localStorage
- **Exportação Manual**: Gere arquivos JSON para backup externo
- **Importação**: Restaure dados de arquivos de backup
- **Validação**: Verificação de integridade dos dados importados

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Cadastre veículos usando o botão "Cadastrar Veículo"
3. Use drag and drop no Kanban para atualizar status
4. Configure logo e faça backups nas Configurações
5. Exporte relatórios conforme necessário

## 📋 Requisitos do Sistema

- **Navegador**: Chrome, Firefox, Safari ou Edge (versões recentes)
- **JavaScript**: Habilitado
- **localStorage**: Suporte necessário para persistência
- **Resolução**: Mínima 1024x768, otimizada para 4K

## 🔧 Estrutura de Arquivos

```
monitor-patio/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos da aplicação
├── js/
│   ├── app.js          # Controlador principal
│   ├── data.js         # Gerenciamento de dados
│   ├── kanban.js       # Funcionalidades do Kanban
│   ├── spreadsheet.js  # Funcionalidades da Planilha
│   └── utils.js        # Funções utilitárias
├── assets/             # Recursos (imagens, etc.)
└── README.md           # Esta documentação
```

## 🎯 Funcionalidades Avançadas

### Cálculos Automáticos
- **Tempo em Doca**: Calculado entre HR Doca e HR Saída de Doca
- **Tempo Total CD**: Calculado entre HR Chegada e HR Saída do CD
- **Formatação Inteligente**: Exibe apenas horas para o dia atual

### Validações
- **Campos Obrigatórios**: Cliente obrigatório para status NO-SHOW
- **Conversões**: Placas automaticamente em maiúsculas
- **Timestamps**: Preenchimento automático de horários ao mover cards

### Filtros e Buscas
- **Kanban**: Filtro por cliente
- **Planilha**: Busca textual e filtro por status
- **Ordenação**: Veículos ordenados por horário de chegada

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- **Desenvolvedor**: Davi Martins
- **LinkedIn**: [linkedin.com/in/davi-martins-log](https://www.linkedin.com/in/davi-martins-log)

## 📄 Licença

Este projeto foi desenvolvido especificamente para o monitoramento de pátio logístico e está disponível para uso conforme acordado.

---

**Monitor de Pátio Logístico** - Desenvolvido por Davi Martins

