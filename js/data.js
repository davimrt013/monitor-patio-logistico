// Data management for Monitor de Pátio application

class DataManager {
    constructor() {
        this.vehicles = [];
        this.settings = {
            theme: 'light',
            companyLogo: null
        };
        this.loadData();
    }

    // Load data from localStorage
    loadData() {
        try {
            const savedVehicles = localStorage.getItem('monitor-patio-vehicles');
            if (savedVehicles) {
                this.vehicles = JSON.parse(savedVehicles);
            }

            const savedSettings = localStorage.getItem('monitor-patio-settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            Utils.showNotification('Erro ao carregar dados salvos. Iniciando com dados vazios.');
        }
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('monitor-patio-vehicles', JSON.stringify(this.vehicles));
            localStorage.setItem('monitor-patio-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            Utils.showNotification('Erro ao salvar dados. Verifique o espaço disponível no navegador.');
        }
    }

    // Vehicle CRUD operations
    addVehicle(vehicleData) {
        const vehicle = {
            id: Utils.generateId(),
            data: vehicleData.data || Utils.getCurrentDate(),
            placa: vehicleData.placa ? vehicleData.placa.toUpperCase() : '',
            motorista: vehicleData.motorista || '',
            transportadora: vehicleData.transportadora || '',
            cliente: vehicleData.cliente || '',
            nf_dt_senha: vehicleData.nf_dt_senha || '',
            observacoes: vehicleData.observacoes || '',
            tipo_veiculo: vehicleData.tipo_veiculo || '',
            operacao: vehicleData.operacao || '',
            tipo: vehicleData.tipo || '',
            status: vehicleData.status || 'Pátio',
            hr_agendada: vehicleData.hr_agendada || '',
            hr_chegada: vehicleData.hr_chegada || '',
            hr_doca: vehicleData.hr_doca || '',
            hr_saida_doca: vehicleData.hr_saida_doca || '',
            hr_saida_cd: vehicleData.hr_saida_cd || '',
            tempo_total_em_doca: '',
            tempo_total_cd: ''
        };

        // Calculate total times
        const totalTimes = Utils.calculateTotalTimes(vehicle);
        vehicle.tempo_total_em_doca = totalTimes.tempo_total_em_doca;
        vehicle.tempo_total_cd = totalTimes.tempo_total_cd;

        this.vehicles.push(vehicle);
        this.saveData();
        return vehicle;
    }

    updateVehicle(id, vehicleData) {
        const index = this.vehicles.findIndex(v => v.id === id);
        if (index === -1) {
            throw new Error('Veículo não encontrado');
        }

        const vehicle = {
            ...this.vehicles[index],
            data: vehicleData.data || this.vehicles[index].data,
            placa: vehicleData.placa ? vehicleData.placa.toUpperCase() : this.vehicles[index].placa,
            motorista: vehicleData.motorista !== undefined ? vehicleData.motorista : this.vehicles[index].motorista,
            transportadora: vehicleData.transportadora !== undefined ? vehicleData.transportadora : this.vehicles[index].transportadora,
            cliente: vehicleData.cliente !== undefined ? vehicleData.cliente : this.vehicles[index].cliente,
            nf_dt_senha: vehicleData.nf_dt_senha !== undefined ? vehicleData.nf_dt_senha : this.vehicles[index].nf_dt_senha,
            observacoes: vehicleData.observacoes !== undefined ? vehicleData.observacoes : this.vehicles[index].observacoes,
            tipo_veiculo: vehicleData.tipo_veiculo !== undefined ? vehicleData.tipo_veiculo : this.vehicles[index].tipo_veiculo,
            operacao: vehicleData.operacao !== undefined ? vehicleData.operacao : this.vehicles[index].operacao,
            tipo: vehicleData.tipo !== undefined ? vehicleData.tipo : this.vehicles[index].tipo,
            status: vehicleData.status !== undefined ? vehicleData.status : this.vehicles[index].status,
            hr_agendada: vehicleData.hr_agendada !== undefined ? vehicleData.hr_agendada : this.vehicles[index].hr_agendada,
            hr_chegada: vehicleData.hr_chegada !== undefined ? vehicleData.hr_chegada : this.vehicles[index].hr_chegada,
            hr_doca: vehicleData.hr_doca !== undefined ? vehicleData.hr_doca : this.vehicles[index].hr_doca,
            hr_saida_doca: vehicleData.hr_saida_doca !== undefined ? vehicleData.hr_saida_doca : this.vehicles[index].hr_saida_doca,
            hr_saida_cd: vehicleData.hr_saida_cd !== undefined ? vehicleData.hr_saida_cd : this.vehicles[index].hr_saida_cd
        };

        // Calculate total times
        const totalTimes = Utils.calculateTotalTimes(vehicle);
        vehicle.tempo_total_em_doca = totalTimes.tempo_total_em_doca;
        vehicle.tempo_total_cd = totalTimes.tempo_total_cd;

        this.vehicles[index] = vehicle;
        this.saveData();
        return vehicle;
    }

    deleteVehicle(id) {
        const index = this.vehicles.findIndex(v => v.id === id);
        if (index === -1) {
            throw new Error('Veículo não encontrado');
        }

        this.vehicles.splice(index, 1);
        this.saveData();
    }

    getVehicle(id) {
        return this.vehicles.find(v => v.id === id);
    }

    getAllVehicles() {
        return [...this.vehicles];
    }

    getVehiclesByStatus(status) {
        return this.vehicles.filter(v => v.status === status);
    }

    getVehiclesByClient(client) {
        if (!client) return this.vehicles;
        return this.vehicles.filter(v => 
            v.cliente.toLowerCase().includes(client.toLowerCase())
        );
    }

    // Get unique clients for filter dropdown
    getUniqueClients() {
        const clients = this.vehicles
            .map(v => v.cliente)
            .filter(client => client && client.trim() !== '')
            .map(client => client.trim());
        
        return [...new Set(clients)].sort();
    }

    // Update vehicle status and related timestamps
    updateVehicleStatus(id, newStatus) {
        const vehicle = this.getVehicle(id);
        if (!vehicle) {
            throw new Error('Veículo não encontrado');
        }

        const updateData = { status: newStatus };

        // Auto-fill timestamps based on status change
        if (newStatus === 'Doca' && !vehicle.hr_doca) {
            updateData.hr_doca = Utils.getCurrentDateTime();
        } else if (newStatus === 'Finalizado' && !vehicle.hr_saida_doca) {
            updateData.hr_saida_doca = Utils.getCurrentDateTime();
        }

        return this.updateVehicle(id, updateData);
    }

    // Settings management
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveData();
    }

    getSettings() {
        return { ...this.settings };
    }

    setTheme(theme) {
        this.settings.theme = theme;
        this.saveData();
    }

    setCompanyLogo(logoBase64) {
        this.settings.companyLogo = logoBase64;
        this.saveData();
    }

    removeCompanyLogo() {
        this.settings.companyLogo = null;
        this.saveData();
    }

    // Backup and restore
    exportBackup() {
        const backupData = {
            vehicles: this.vehicles,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const filename = `monitor-patio-backup-${Utils.formatDate(new Date()).replace(/\//g, '-')}.json`;
        Utils.downloadJSON(backupData, filename);
    }

    async importBackup(file) {
        try {
            const backupData = await Utils.readJSONFile(file);
            
            // Validate backup data structure
            if (!backupData.vehicles || !Array.isArray(backupData.vehicles)) {
                throw new Error('Arquivo de backup inválido: dados de veículos não encontrados');
            }

            // Validate vehicle data structure
            for (const vehicle of backupData.vehicles) {
                if (!vehicle.id) {
                    throw new Error('Arquivo de backup inválido: veículo sem ID encontrado');
                }
            }

            // Confirm import
            const confirmImport = Utils.confirmAction(
                `Importar backup criado em ${Utils.formatDateTime(backupData.exportDate)}?\n\n` +
                `Isso substituirá todos os dados atuais:\n` +
                `- ${this.vehicles.length} veículos atuais serão substituídos por ${backupData.vehicles.length} veículos do backup\n` +
                `- Configurações atuais serão substituídas\n\n` +
                `Esta ação não pode ser desfeita.`
            );

            if (!confirmImport) {
                return false;
            }

            // Import data
            this.vehicles = backupData.vehicles;
            if (backupData.settings) {
                this.settings = { ...this.settings, ...backupData.settings };
            }

            this.saveData();
            Utils.showNotification('Backup importado com sucesso!');
            return true;

        } catch (error) {
            console.error('Error importing backup:', error);
            Utils.showNotification(`Erro ao importar backup: ${error.message}`);
            return false;
        }
    }

    // Search and filter
    searchVehicles(query) {
        if (!query || query.trim() === '') {
            return this.vehicles;
        }

        const searchTerm = query.toLowerCase().trim();
        return this.vehicles.filter(vehicle => {
            return Object.values(vehicle).some(value => {
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchTerm);
                }
                return false;
            });
        });
    }

    filterVehicles(filters) {
        let filtered = [...this.vehicles];

        if (filters.cliente) {
            filtered = filtered.filter(v => 
                v.cliente.toLowerCase().includes(filters.cliente.toLowerCase())
            );
        }

        if (filters.status) {
            filtered = filtered.filter(v => v.status === filters.status);
        }

        if (filters.transportadora) {
            filtered = filtered.filter(v => 
                v.transportadora.toLowerCase().includes(filters.transportadora.toLowerCase())
            );
        }

        if (filters.data) {
            filtered = filtered.filter(v => v.data === filters.data);
        }

        return filtered;
    }

    // Statistics
    getStatistics() {
        const total = this.vehicles.length;
        const patio = this.vehicles.filter(v => v.status === 'Pátio').length;
        const doca = this.vehicles.filter(v => v.status === 'Doca').length;
        const finalizado = this.vehicles.filter(v => v.status === 'Finalizado').length;
        const noShow = this.vehicles.filter(v => v.status === 'NO-SHOW').length;

        return {
            total,
            patio,
            doca,
            finalizado,
            noShow
        };
    }
}

// Create global instance
window.dataManager = new DataManager();

