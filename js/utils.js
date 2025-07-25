// Utility functions for the Monitor de Pátio application

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date to DD/MM/YYYY
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Format datetime to DD/MM/YYYY HH:MM
function formatDateTime(datetime) {
    if (!datetime) return '';
    const d = new Date(datetime);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Format time for display (smart display)
function formatTimeForDisplay(datetime) {
    if (!datetime) return '';
    const d = new Date(datetime);
    if (isNaN(d.getTime())) return '';
    
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    if (isToday) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } else {
        return formatDateTime(datetime);
    }
}

// Convert datetime-local input value to Date
function parseDateTime(datetimeLocal) {
    if (!datetimeLocal) return null;
    return new Date(datetimeLocal);
}

// Convert Date to datetime-local input value
function toDateTimeLocal(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Calculate time difference in hours and minutes
function calculateTimeDifference(startTime, endTime) {
    if (!startTime || !endTime) return '';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return '';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) {
        return `${diffMinutes}min`;
    } else if (diffMinutes === 0) {
        return `${diffHours}h`;
    } else {
        return `${diffHours}h ${diffMinutes}min`;
    }
}

// Calculate total times for a vehicle
function calculateTotalTimes(vehicle) {
    const tempoTotalEmDoca = calculateTimeDifference(vehicle.hr_doca, vehicle.hr_saida_doca);
    const tempoTotalCD = calculateTimeDifference(vehicle.hr_chegada, vehicle.hr_saida_cd);
    
    return {
        tempo_total_em_doca: tempoTotalEmDoca,
        tempo_total_cd: tempoTotalCD
    };
}

// Convert image file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Download data as JSON file
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Read JSON file
function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Show notification (simple alert for now)
function showNotification(message, type = 'info') {
    // For now, use alert. Could be enhanced with a toast system
    alert(message);
}

// Confirm action
function confirmAction(message) {
    return confirm(message);
}

// Get current date in YYYY-MM-DD format for date input
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get current datetime in datetime-local format
function getCurrentDateTime() {
    const now = new Date();
    return toDateTimeLocal(now);
}

// Sanitize string for use as filename
function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sort vehicles by arrival time
function sortVehiclesByArrival(vehicles) {
    return vehicles.sort((a, b) => {
        const timeA = a.hr_chegada ? new Date(a.hr_chegada).getTime() : 0;
        const timeB = b.hr_chegada ? new Date(b.hr_chegada).getTime() : 0;
        return timeA - timeB;
    });
}

// Get operation color class
function getOperationColorClass(operacao) {
    const operacaoLower = operacao ? operacao.toLowerCase() : '';
    switch (operacaoLower) {
        case 'recebimento':
            return 'operation-recebimento';
        case 'expedição':
        case 'expedicao':
            return 'operation-expedicao';
        case 'cross docking':
            return 'operation-cross-docking';
        case 'devolução':
        case 'devolucao':
            return 'operation-devolucao';
        default:
            return 'operation-recebimento';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, (m) => map[m]) : '';
}

// Check if string is empty or whitespace
function isEmpty(str) {
    return !str || str.trim().length === 0;
}

// Capitalize first letter
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}

// Export functions for use in other modules
window.Utils = {
    generateId,
    formatDate,
    formatDateTime,
    formatTimeForDisplay,
    parseDateTime,
    toDateTimeLocal,
    calculateTimeDifference,
    calculateTotalTimes,
    fileToBase64,
    downloadJSON,
    readJSONFile,
    showNotification,
    confirmAction,
    getCurrentDate,
    getCurrentDateTime,
    sanitizeFilename,
    debounce,
    sortVehiclesByArrival,
    getOperationColorClass,
    escapeHtml,
    isEmpty,
    capitalize
};

