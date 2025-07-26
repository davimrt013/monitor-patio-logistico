// Kanban functionality for Monitor de Pátio application

class KanbanManager {
    constructor() {
        this.currentFilter = '';
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.render();
    }

    setupEventListeners() {
        // Client filter
        const clientFilter = document.getElementById('client-filter');
        if (clientFilter) {
            clientFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.render();
            });
        }

        // Export image button
        const exportImageBtn = document.getElementById('export-image-btn');
        if (exportImageBtn) {
            exportImageBtn.addEventListener('click', () => {
                this.exportKanbanImage();
            });
        }
    }

    setupDragAndDrop() {
        const columns = document.querySelectorAll('.column-content');
        
        columns.forEach(column => {
            column.addEventListener('dragover', this.handleDragOver.bind(this));
            column.addEventListener('drop', this.handleDrop.bind(this));
            column.addEventListener('dragenter', this.handleDragEnter.bind(this));
            column.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    handleDragStart(e, vehicleId) {
        this.draggedElement = vehicleId;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
        
        // Remove drag-over class from all columns
        document.querySelectorAll('.column-content').forEach(col => {
            col.classList.remove('drag-over');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        if (!e.target.contains(e.relatedTarget)) {
            e.target.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        if (!this.draggedElement) return;

        const column = e.target.closest('.kanban-column');
        if (!column) return;

        const newStatus = column.dataset.status;
        const vehicleId = this.draggedElement;
        
        try {
            const vehicle = dataManager.getVehicle(vehicleId);
            if (!vehicle) return;

            // Don't allow moving if already in the same status
            if (vehicle.status === newStatus) return;

            // Update vehicle status
            const updatedVehicle = dataManager.updateVehicleStatus(vehicleId, newStatus);

            // If moving to Finalizado, open finalization modal
            if (newStatus === 'Finalizado') {
                this.openFinalizationModal(vehicleId);
            }

            this.render();
            
        } catch (error) {
            console.error('Error updating vehicle status:', error);
            Utils.showNotification('Erro ao atualizar status do veículo');
        }
    }

    createVehicleCard(vehicle) {
        const isNoShow = vehicle.status === 'NO-SHOW';
        const operationClass = Utils.getOperationColorClass(vehicle.operacao);
        
        let timeDisplay = '';
        
        // Smart time display based on status
        if (vehicle.status === 'Pátio') {
            const agendada = vehicle.hr_agendada ? Utils.formatTimeForDisplay(vehicle.hr_agendada) : '';
            const chegada = vehicle.hr_chegada ? Utils.formatTimeForDisplay(vehicle.hr_chegada) : '';
            
            if (agendada && chegada) {
                timeDisplay = `Agendada: ${agendada}<br>Chegada: ${chegada}`;
            } else if (agendada) {
                timeDisplay = `Agendada: ${agendada}`;
            } else if (chegada) {
                timeDisplay = `Chegada: ${chegada}`;
            }
        } else if (vehicle.status === 'Doca') {
            const doca = vehicle.hr_doca ? Utils.formatTimeForDisplay(vehicle.hr_doca) : '';
            if (doca) {
                timeDisplay = `Doca: ${doca}`;
            }
        } else if (vehicle.status === 'Finalizado') {
            const tempoEmDoca = vehicle.tempo_total_em_doca || '';
            const tempoCD = vehicle.tempo_total_cd || '';
            
            if (tempoEmDoca && tempoCD) {
                timeDisplay = `Tempo em Doca: ${tempoEmDoca}<br>Tempo Total CD: ${tempoCD}`;
            } else if (tempoEmDoca) {
                timeDisplay = `Tempo em Doca: ${tempoEmDoca}`;
            } else if (tempoCD) {
                timeDisplay = `Tempo Total CD: ${tempoCD}`;
            }
        }

        return `
            <div class="vehicle-card ${isNoShow ? 'no-show' : ''}" 
                 draggable="true" 
                 data-vehicle-id="${vehicle.id}"
                 onclick="kanbanManager.openVehicleModal('${vehicle.id}')">
                <div class="card-header">
                    <div class="card-client">${Utils.escapeHtml(vehicle.cliente || 'Cliente não informado')}</div>
                    ${vehicle.operacao ? `<div class="card-operation ${operationClass}">${Utils.escapeHtml(vehicle.operacao)}</div>` : ''}
                </div>
                <div class="card-details">
                    <div class="card-detail">
                        <strong>Placa:</strong> ${Utils.escapeHtml(vehicle.placa || 'N/A')}
                    </div>
                    <div class="card-detail">
                        <strong>Tipo:</strong> ${Utils.escapeHtml(vehicle.tipo_veiculo || 'N/A')}
                    </div>
                    <div class="card-detail">
                        <strong>Motorista:</strong> ${Utils.escapeHtml(vehicle.motorista || 'N/A')}
                    </div>
                    <div class="card-detail">
                        <strong>Transportadora:</strong> ${Utils.escapeHtml(vehicle.transportadora || 'N/A')}
                    </div>
                </div>
                ${timeDisplay ? `<div class="card-times">${timeDisplay}</div>` : ''}
            </div>
        `;
    }

    render() {
        this.updateClientFilter();
        this.renderColumns();
        this.updateCounts();
        this.attachCardEventListeners();
    }

    updateClientFilter() {
        const clientFilter = document.getElementById('client-filter');
        if (!clientFilter) return;

        const currentValue = clientFilter.value;
        const clients = dataManager.getUniqueClients();
        
        clientFilter.innerHTML = '<option value="">Todos os Clientes</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client;
            option.textContent = client;
            if (client === currentValue) {
                option.selected = true;
            }
            clientFilter.appendChild(option);
        });
    }

    renderColumns() {
        const patioColumn = document.getElementById('patio-column');
        const docaColumn = document.getElementById('doca-column');
        const finalizadoColumn = document.getElementById('finalizado-column');

        if (!patioColumn || !docaColumn || !finalizadoColumn) return;

        // Get filtered vehicles
        let vehicles = this.currentFilter ? 
            dataManager.getVehiclesByClient(this.currentFilter) : 
            dataManager.getAllVehicles();

        // Separate by status and sort by arrival time
        const patioVehicles = Utils.sortVehiclesByArrival(
            vehicles.filter(v => v.status === 'Pátio' || v.status === 'NO-SHOW')
        );
        const docaVehicles = Utils.sortVehiclesByArrival(
            vehicles.filter(v => v.status === 'Doca')
        );
        const finalizadoVehicles = Utils.sortVehiclesByArrival(
            vehicles.filter(v => v.status === 'Finalizado')
        );

        // Render cards
        patioColumn.innerHTML = patioVehicles.map(v => this.createVehicleCard(v)).join('');
        docaColumn.innerHTML = docaVehicles.map(v => this.createVehicleCard(v)).join('');
        finalizadoColumn.innerHTML = finalizadoVehicles.map(v => this.createVehicleCard(v)).join('');
    }

    updateCounts() {
        const stats = dataManager.getStatistics();
        
        // Apply filter to counts if active
        let displayStats = stats;
        if (this.currentFilter) {
            const filteredVehicles = dataManager.getVehiclesByClient(this.currentFilter);
            displayStats = {
                patio: filteredVehicles.filter(v => v.status === 'Pátio' || v.status === 'NO-SHOW').length,
                doca: filteredVehicles.filter(v => v.status === 'Doca').length,
                finalizado: filteredVehicles.filter(v => v.status === 'Finalizado').length
            };
        }

        const patioCount = document.querySelector('.column-header.patio .count');
        const docaCount = document.querySelector('.column-header.doca .count');
        const finalizadoCount = document.querySelector('.column-header.finalizado .count');

        if (patioCount) patioCount.textContent = displayStats.patio;
        if (docaCount) docaCount.textContent = displayStats.doca;
        if (finalizadoCount) finalizadoCount.textContent = displayStats.finalizado;
    }

    attachCardEventListeners() {
        const cards = document.querySelectorAll('.vehicle-card');
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                const vehicleId = card.dataset.vehicleId;
                this.handleDragStart(e, vehicleId);
            });
            
            card.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
    }

    openVehicleModal(vehicleId) {
        if (window.app) {
            window.app.openVehicleModal(vehicleId);
        }
    }

    openFinalizationModal(vehicleId) {
        if (window.app) {
            window.app.openVehicleModal(vehicleId, true);
        }
    }

    async exportKanbanImage() {
        try {
            const kanbanBoard = document.querySelector('.kanban-board');
            if (!kanbanBoard) {
                Utils.showNotification('Erro: Quadro Kanban não encontrado');
                return;
            }

            // Temporarily hide scrollbars and adjust for capture
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            const canvas = await html2canvas(kanbanBoard, {
                backgroundColor: getComputedStyle(document.body).backgroundColor,
                scale: 4, // Higher resolution
                useCORS: true,
                allowTaint: true,
                height: kanbanBoard.scrollHeight,
                width: kanbanBoard.scrollWidth
            });

            // Restore original overflow
            document.body.style.overflow = originalOverflow;

            // Create download link
            const link = document.createElement('a');
            link.download = `kanban-monitor-patio-${Utils.formatDate(new Date()).replace(/\//g, '-')}.png`;
            link.href = canvas.toDataURL('image/png');
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Utils.showNotification('Imagem do Kanban exportada com sucesso!');

        } catch (error) {
            console.error('Error exporting Kanban image:', error);
            Utils.showNotification('Erro ao exportar imagem do Kanban');
        }
    }
}

// Create global instance
window.kanbanManager = new KanbanManager();

