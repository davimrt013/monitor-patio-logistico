// Main application controller for Monitor de Pátio

class App {
    constructor() {
        this.currentView = 'kanban';
        this.currentVehicleId = null;
        this.isFinalizationMode = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.showView('kanban');
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettingsModal();
            });
        }

        // Navigation tabs
        const kanbanTab = document.getElementById('kanban-tab');
        const planilhaTab = document.getElementById('planilha-tab');

        if (kanbanTab) {
            kanbanTab.addEventListener('click', () => {
                this.showView('kanban');
            });
        }

        if (planilhaTab) {
            planilhaTab.addEventListener('click', () => {
                this.showView('planilha');
            });
        }

        // Add vehicle buttons
        const addVehicleBtn = document.getElementById('add-vehicle-btn');
        const addVehiclePlanilhaBtn = document.getElementById('add-vehicle-planilha-btn');

        if (addVehicleBtn) {
            addVehicleBtn.addEventListener('click', () => {
                this.openVehicleModal();
            });
        }

        if (addVehiclePlanilhaBtn) {
            addVehiclePlanilhaBtn.addEventListener('click', () => {
                this.openVehicleModal();
            });
        }

        // Modal event listeners
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Settings modal
        this.setupSettingsModalListeners();
        
        // Vehicle modal
        this.setupVehicleModalListeners();

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupSettingsModalListeners() {
        // Close button
        const settingsModal = document.getElementById('settings-modal');
        const closeBtn = settingsModal?.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal('settings-modal');
            });
        }

        // Logo upload
        const logoUpload = document.getElementById('logo-upload');
        if (logoUpload) {
            logoUpload.addEventListener('change', (e) => {
                this.handleLogoUpload(e);
            });
        }

        // Remove logo
        const removeLogoBtn = document.getElementById('remove-logo-btn');
        if (removeLogoBtn) {
            removeLogoBtn.addEventListener('click', () => {
                this.removeLogo();
            });
        }

        // Export backup
        const exportBackupBtn = document.getElementById('export-backup-btn');
        if (exportBackupBtn) {
            exportBackupBtn.addEventListener('click', () => {
                dataManager.exportBackup();
            });
        }

        // Import backup
        const importBackupBtn = document.getElementById('import-backup-btn');
        const importBackupInput = document.getElementById('import-backup');
        
        if (importBackupBtn && importBackupInput) {
            importBackupBtn.addEventListener('click', () => {
                importBackupInput.click();
            });

            importBackupInput.addEventListener('change', (e) => {
                this.handleBackupImport(e);
            });
        }
    }

    setupVehicleModalListeners() {
        // Close button
        const vehicleModal = document.getElementById('vehicle-modal');
        const closeBtn = vehicleModal?.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal('vehicle-modal');
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal('vehicle-modal');
            });
        }

        // Form submission
        const vehicleForm = document.getElementById('vehicle-form');
        if (vehicleForm) {
            vehicleForm.addEventListener('submit', (e) => {
                this.handleVehicleFormSubmit(e);
            });
        }

        // Auto-fill current date
        const dataInput = document.getElementById('data');
        if (dataInput && !dataInput.value) {
            dataInput.value = Utils.getCurrentDate();
        }
    }

    loadSettings() {
        const settings = dataManager.getSettings();
        
        // Apply theme
        this.setTheme(settings.theme);
        
        // Apply logo
        if (settings.companyLogo) {
            this.setLogo(settings.companyLogo);
        }
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        dataManager.setTheme(newTheme);
    }

    setTheme(theme) {
        document.body.className = `theme-${theme}`;
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    showView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`${viewName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const activeView = document.getElementById(`${viewName}-view`);
        if (activeView) {
            activeView.classList.add('active');
        }

        this.currentView = viewName;

        // Refresh the active view
        if (viewName === 'kanban' && window.kanbanManager) {
            window.kanbanManager.render();
        } else if (viewName === 'planilha' && window.spreadsheetManager) {
            window.spreadsheetManager.render();
        }
    }

    openSettingsModal() {
        this.showModal('settings-modal');
    }

    openVehicleModal(vehicleId = null, isFinalization = false) {
        this.currentVehicleId = vehicleId;
        this.isFinalizationMode = isFinalization;

        const modal = document.getElementById('vehicle-modal');
        const title = document.getElementById('vehicle-modal-title');
        const form = document.getElementById('vehicle-form');

        if (!modal || !title || !form) return;

        // Set modal title
        if (vehicleId) {
            title.textContent = isFinalization ? 'Finalizar Operação' : 'Editar Veículo';
        } else {
            title.textContent = 'Cadastrar Veículo';
        }

        // Reset form
        form.reset();

        // Fill form if editing
        if (vehicleId) {
            this.fillVehicleForm(vehicleId);
        } else {
            // Set default date for new vehicles
            const dataInput = document.getElementById('data');
            if (dataInput) {
                dataInput.value = Utils.getCurrentDate();
            }
        }

        this.showModal('vehicle-modal');
    }

    fillVehicleForm(vehicleId) {
        const vehicle = dataManager.getVehicle(vehicleId);
        if (!vehicle) return;

        // Fill all form fields
        const fields = [
            'data', 'placa', 'motorista', 'transportadora', 'cliente',
            'nf_dt_senha', 'observacoes', 'tipo_veiculo', 'operacao',
            'tipo', 'status'
        ];

        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && vehicle[field] !== undefined) {
                input.value = vehicle[field];
            }
        });

        // Fill datetime fields
        const datetimeFields = [
            'hr_agendada', 'hr_chegada', 'hr_doca', 'hr_saida_doca', 'hr_saida_cd'
        ];

        datetimeFields.forEach(field => {
            const input = document.getElementById(field);
            if (input && vehicle[field]) {
                input.value = Utils.toDateTimeLocal(vehicle[field]);
            }
        });
    }

    handleVehicleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const vehicleData = {};

        // Get all form data
        for (let [key, value] of formData.entries()) {
            vehicleData[key] = value.trim();
        }

        // Convert datetime fields
        const datetimeFields = [
            'hr_agendada', 'hr_chegada', 'hr_doca', 'hr_saida_doca', 'hr_saida_cd'
        ];

        datetimeFields.forEach(field => {
            if (vehicleData[field]) {
                vehicleData[field] = Utils.parseDateTime(vehicleData[field]);
            }
        });

        try {
            if (this.currentVehicleId) {
                // Update existing vehicle
                dataManager.updateVehicle(this.currentVehicleId, vehicleData);
                Utils.showNotification('Veículo atualizado com sucesso!');
            } else {
                // Create new vehicle
                dataManager.addVehicle(vehicleData);
                Utils.showNotification('Veículo cadastrado com sucesso!');
            }

            this.closeModal('vehicle-modal');
            this.refreshViews();

        } catch (error) {
            console.error('Error saving vehicle:', error);
            Utils.showNotification('Erro ao salvar veículo');
        }
    }

    async handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Utils.showNotification('Por favor, selecione um arquivo de imagem válido');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            Utils.showNotification('A imagem deve ter no máximo 2MB');
            return;
        }

        try {
            const base64 = await Utils.fileToBase64(file);
            dataManager.setCompanyLogo(base64);
            this.setLogo(base64);
            Utils.showNotification('Logo atualizado com sucesso!');
        } catch (error) {
            console.error('Error uploading logo:', error);
            Utils.showNotification('Erro ao fazer upload do logo');
        }
    }

    setLogo(logoBase64) {
        const logoImg = document.getElementById('company-logo');
        const logoPlaceholder = document.querySelector('.logo-placeholder');

        if (logoImg && logoPlaceholder) {
            if (logoBase64) {
                logoImg.src = logoBase64;
                logoImg.style.display = 'block';
                logoPlaceholder.style.display = 'none';
            } else {
                logoImg.style.display = 'none';
                logoPlaceholder.style.display = 'block';
            }
        }
    }

    removeLogo() {
        if (Utils.confirmAction('Tem certeza que deseja remover o logo?')) {
            dataManager.removeCompanyLogo();
            this.setLogo(null);
            Utils.showNotification('Logo removido com sucesso!');
        }
    }

    async handleBackupImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const success = await dataManager.importBackup(file);
            if (success) {
                // Reload settings and refresh views
                this.loadSettings();
                this.refreshViews();
                this.closeModal('settings-modal');
            }
        } catch (error) {
            console.error('Error importing backup:', error);
        }

        // Clear the file input
        e.target.value = '';
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Reset vehicle modal state
        if (modalId === 'vehicle-modal') {
            this.currentVehicleId = null;
            this.isFinalizationMode = false;
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
        
        // Reset vehicle modal state
        this.currentVehicleId = null;
        this.isFinalizationMode = false;
    }

    refreshViews() {
        // Refresh both views
        if (window.kanbanManager) {
            window.kanbanManager.render();
        }
        if (window.spreadsheetManager) {
            window.spreadsheetManager.refresh();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Export for global access
window.App = App;

