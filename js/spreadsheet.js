// Spreadsheet functionality for Monitor de Pátio application

class SpreadsheetManager {
    constructor() {
        this.currentFilters = {
            search: '',
            status: '',
            cliente: '',
            transportadora: '',
            data: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.render();
            }, 300));
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.render();
            });
        }

        // Export Excel button
        const exportExcelBtn = document.getElementById('export-excel-btn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => {
                this.exportToExcel();
            });
        }
    }

    render() {
        this.renderTable();
    }

    renderTable() {
        const tbody = document.getElementById('vehicles-tbody');
        if (!tbody) return;

        // Get filtered vehicles
        let vehicles = this.getFilteredVehicles();

        if (vehicles.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="19" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum veículo encontrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = vehicles.map(vehicle => this.createTableRow(vehicle)).join('');
        this.attachRowEventListeners();
    }

    createTableRow(vehicle) {
        return `
            <tr data-vehicle-id="${vehicle.id}">
                <td>${Utils.escapeHtml(vehicle.data || '')}</td>
                <td>${Utils.escapeHtml(vehicle.placa || '')}</td>
                <td>${Utils.escapeHtml(vehicle.motorista || '')}</td>
                <td>${Utils.escapeHtml(vehicle.transportadora || '')}</td>
                <td>${Utils.escapeHtml(vehicle.cliente || '')}</td>
                <td>${Utils.escapeHtml(vehicle.nf_dt_senha || '')}</td>
                <td>${Utils.escapeHtml(vehicle.observacoes || '')}</td>
                <td>${Utils.escapeHtml(vehicle.tipo_veiculo || '')}</td>
                <td>${Utils.escapeHtml(vehicle.operacao || '')}</td>
                <td>${Utils.escapeHtml(vehicle.tipo || '')}</td>
                <td>
                    <span class="status-badge status-${vehicle.status ? vehicle.status.toLowerCase().replace(/[^a-z0-9]/g, '-') : ''}">
                        ${Utils.escapeHtml(vehicle.status || '')}
                    </span>
                </td>
                <td>${vehicle.hr_agendada ? Utils.formatDateTime(vehicle.hr_agendada) : ''}</td>
                <td>${vehicle.hr_chegada ? Utils.formatDateTime(vehicle.hr_chegada) : ''}</td>
                <td>${vehicle.hr_doca ? Utils.formatDateTime(vehicle.hr_doca) : ''}</td>
                <td>${vehicle.hr_saida_doca ? Utils.formatDateTime(vehicle.hr_saida_doca) : ''}</td>
                <td>${vehicle.hr_saida_cd ? Utils.formatDateTime(vehicle.hr_saida_cd) : ''}</td>
                <td>${Utils.escapeHtml(vehicle.tempo_total_em_doca || '')}</td>
                <td>${Utils.escapeHtml(vehicle.tempo_total_cd || '')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="spreadsheetManager.editVehicle('${vehicle.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="spreadsheetManager.deleteVehicle('${vehicle.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    attachRowEventListeners() {
        // Event listeners are handled via onclick attributes in the HTML for simplicity
        // This could be refactored to use proper event delegation if needed
    }

    getFilteredVehicles() {
        let vehicles = dataManager.getAllVehicles();

        // Apply search filter
        if (this.currentFilters.search) {
            vehicles = dataManager.searchVehicles(this.currentFilters.search);
        }

        // Apply status filter
        if (this.currentFilters.status) {
            vehicles = vehicles.filter(v => v.status === this.currentFilters.status);
        }

        // Apply other filters
        if (this.currentFilters.cliente) {
            vehicles = vehicles.filter(v => 
                v.cliente.toLowerCase().includes(this.currentFilters.cliente.toLowerCase())
            );
        }

        if (this.currentFilters.transportadora) {
            vehicles = vehicles.filter(v => 
                v.transportadora.toLowerCase().includes(this.currentFilters.transportadora.toLowerCase())
            );
        }

        if (this.currentFilters.data) {
            vehicles = vehicles.filter(v => v.data === this.currentFilters.data);
        }

        return vehicles;
    }

    editVehicle(vehicleId) {
        if (window.app) {
            window.app.openVehicleModal(vehicleId);
        }
    }

    deleteVehicle(vehicleId) {
        const vehicle = dataManager.getVehicle(vehicleId);
        if (!vehicle) {
            Utils.showNotification('Veículo não encontrado');
            return;
        }

        const confirmDelete = Utils.confirmAction(
            `Tem certeza que deseja excluir o veículo?\n\n` +
            `Cliente: ${vehicle.cliente || 'N/A'}\n` +
            `Placa: ${vehicle.placa || 'N/A'}\n` +
            `Motorista: ${vehicle.motorista || 'N/A'}\n\n` +
            `Esta ação não pode ser desfeita.`
        );

        if (confirmDelete) {
            try {
                dataManager.deleteVehicle(vehicleId);
                this.render();
                
                // Update Kanban if it exists
                if (window.kanbanManager) {
                    window.kanbanManager.render();
                }
                
                Utils.showNotification('Veículo excluído com sucesso!');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                Utils.showNotification('Erro ao excluir veículo');
            }
        }
    }

    exportToExcel() {
        try {
            // Get all vehicles (without filters for export)
            const vehicles = dataManager.getAllVehicles();

            if (vehicles.length === 0) {
                Utils.showNotification('Não há dados para exportar');
                return;
            }

            // Prepare data for Excel export
            const excelData = vehicles.map(vehicle => ({
                'Data': vehicle.data || '',
                'Placa': vehicle.placa || '',
                'Motorista': vehicle.motorista || '',
                'Transportadora': vehicle.transportadora || '',
                'Cliente': vehicle.cliente || '',
                'NF/DT/SENHA': vehicle.nf_dt_senha || '',
                'Observações': vehicle.observacoes || '',
                'Tipo de Veículo': vehicle.tipo_veiculo || '',
                'Operação': vehicle.operacao || '',
                'Tipo': vehicle.tipo || '',
                'Status': vehicle.status || '',
                'HR Agendada': vehicle.hr_agendada ? Utils.formatDateTime(vehicle.hr_agendada) : '',
                'HR Chegada': vehicle.hr_chegada ? Utils.formatDateTime(vehicle.hr_chegada) : '',
                'HR Doca': vehicle.hr_doca ? Utils.formatDateTime(vehicle.hr_doca) : '',
                'HR Saída de Doca': vehicle.hr_saida_doca ? Utils.formatDateTime(vehicle.hr_saida_doca) : '',
                'HR Saída do CD': vehicle.hr_saida_cd ? Utils.formatDateTime(vehicle.hr_saida_cd) : '',
                'Tempo Total Em Doca': vehicle.tempo_total_em_doca || '',
                'Tempo Total CD': vehicle.tempo_total_cd || ''
            }));

            // Create workbook
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const colWidths = [
                { wch: 12 }, // Data
                { wch: 10 }, // Placa
                { wch: 20 }, // Motorista
                { wch: 20 }, // Transportadora
                { wch: 20 }, // Cliente
                { wch: 15 }, // NF/DT/SENHA
                { wch: 30 }, // Observações
                { wch: 15 }, // Tipo de Veículo
                { wch: 15 }, // Operação
                { wch: 12 }, // Tipo
                { wch: 12 }, // Status
                { wch: 18 }, // HR Agendada
                { wch: 18 }, // HR Chegada
                { wch: 18 }, // HR Doca
                { wch: 18 }, // HR Saída de Doca
                { wch: 18 }, // HR Saída do CD
                { wch: 18 }, // Tempo Total Em Doca
                { wch: 18 }  // Tempo Total CD
            ];
            ws['!cols'] = colWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Monitor de Pátio');

            // Generate filename
            const filename = `monitor-patio-${Utils.formatDate(new Date()).replace(/\//g, '-')}.xlsx`;

            // Save file
            XLSX.writeFile(wb, filename);

            Utils.showNotification('Planilha exportada com sucesso!');

        } catch (error) {
            console.error('Error exporting to Excel:', error);
            Utils.showNotification('Erro ao exportar planilha. Verifique se o navegador suporta downloads.');
        }
    }

    // Method to refresh the table when data changes
    refresh() {
        this.render();
    }
}

// Add CSS for status badges
const statusBadgeStyles = `
<style>
.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    text-transform: uppercase;
}

.status-patio {
    background-color: #dc3545;
}

.status-doca {
    background-color: #fd7e14;
}

.status-finalizado {
    background-color: #28a745;
}

.status-no-show {
    background-color: #e83e8c;
}
</style>
`;

// Inject styles
if (!document.getElementById('status-badge-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'status-badge-styles';
    styleElement.innerHTML = statusBadgeStyles;
    document.head.appendChild(styleElement);
}

// Create global instance
window.spreadsheetManager = new SpreadsheetManager();

