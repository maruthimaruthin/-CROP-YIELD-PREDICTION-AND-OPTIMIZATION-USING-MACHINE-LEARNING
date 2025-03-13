// Constants for API endpoints
const API_ENDPOINTS = {
    predict: '/api/predict'
};

// Function to show loading indicator
function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingIndicator) loadingIndicator.style.display = show ? 'flex' : 'none';
    if (loadingSpinner) loadingSpinner.style.display = show ? 'block' : 'none';
}

// Function to show toast notifications
function showToast(message, type = 'error') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found!');
        alert(message);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, {
        animation: true,
        autohide: true,
        delay: 5000
    });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Function to validate numeric input
function validateNumericInput(value, min, max, fieldName) {
    if (!value) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        throw new Error(`${fieldName} must be a valid number`);
    }
    if (numValue < min || numValue > max) {
        throw new Error(`${fieldName} must be between ${min} and ${max}`);
    }
    return numValue;
}

// Function to format optimal condition
function formatOptimalCondition(condition) {
    if (typeof condition === 'object' && condition !== null) {
        if (condition.min !== undefined && condition.max !== undefined) {
            return `${condition.min} - ${condition.max}`;
        }
    }
    return condition;
}

// Function to get condition unit
function getConditionUnit(key) {
    const units = {
        'temperature': '°C',
        'humidity': '%',
        'rainfall': ' mm',
        'ph': '',
        'water': ' mm/day'
    };
    return units[key.toLowerCase()] || '';
}

// Function to display prediction results
function displayPredictionResults(data) {
    const predictionResult = document.getElementById('prediction-result');
    
    if (!predictionResult) {
        console.error('Prediction result element not found');
        return;
    }
    
    try {
        // Format the predicted yield with 2 decimal places and ensure it's positive
        const yieldValue = Math.max(0.1, data.predicted_yield).toFixed(2);
        
        // Create the result HTML
        let resultHtml = `
            <div class="alert alert-success mb-4">
                <h4 class="alert-heading mb-2">Prediction Results</h4>
                <p class="display-4 mb-0 text-success">${yieldValue} tonnes/acre</p>
            </div>
        `;

        // Add crop information if available
        if (data.crop_info && data.crop_info.name) {
            resultHtml += `
                <div class="card mb-4">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="fas fa-seedling me-2"></i>Crop Information</h5>
                    </div>
                    <div class="card-body">
                        <h5>Crop: ${data.crop_info.name}</h5>
                        ${data.crop_info.description ? `<p class="mt-3">${data.crop_info.description}</p>` : ''}
                        ${data.crop_info.optimal_conditions ? `
                            <h6 class="mt-4 mb-3">Optimal Growing Conditions:</h6>
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Parameter</th>
                                            <th>Optimal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Object.entries(data.crop_info.optimal_conditions).map(([key, value]) => {
                                            const formattedValue = formatOptimalCondition(value);
                                            const unit = getConditionUnit(key);
                                            return `
                                                <tr>
                                                    <td class="text-capitalize">${key.replace(/_/g, ' ')}</td>
                                                    <td>${formattedValue}${unit}</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Update the prediction result
        predictionResult.innerHTML = resultHtml;
        predictionResult.style.display = 'block';
        
        // Scroll to the results
        predictionResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('Error displaying prediction results:', error);
        showToast('Error displaying prediction results', 'error');
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing form...');
    
    const form = document.getElementById('yieldPredictionForm');
    if (form) {
        console.log('Form found, adding submit listener...');
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Prediction form not found!');
    }
});

// Function to handle prediction form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    // Validate input fields
    const inputData = {
        state: document.getElementById('state').value,
        season: document.getElementById('season').value,
        crop: document.getElementById('crop').value,
        area: parseFloat(document.getElementById('area').value),
        fertilizer: parseFloat(document.getElementById('fertilizer').value),
        pesticide: parseFloat(document.getElementById('pesticide').value),
    };
    // Show loading indicator
    showLoadingIndicator(true);
    try {
        const response = await fetch(API_ENDPOINTS.predict, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(inputData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Prediction failed');
        displayPredictionResults(data);
    } catch (error) {
        console.error('Error during prediction:', error);
        showToast('Error during prediction: ' + error.message);
    } finally {
        showLoadingIndicator(false);
    }
}

function displayPredictionResult(data) {
    const resultDiv = document.getElementById('prediction-result');
    if (!resultDiv) {
        console.error('Result container not found!');
        return;
    }
    
    resultDiv.innerHTML = `
        <div class="card">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0"><i class="fas fa-chart-line me-2"></i>Prediction Results</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12 mb-4">
                        <h4 class="text-center">Predicted Yield</h4>
                        <h2 class="text-center text-success">${data.predicted_yield} tonnes/hectare</h2>
                    </div>
                </div>
                ${data.crop_info ? `
                    <div class="row">
                        <div class="col-md-12">
                            <h5><i class="fas fa-info-circle me-2"></i>Crop Information</h5>
                            <ul class="list-group">
                                ${Object.entries(data.crop_info).map(([key, value]) => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        ${key.replace(/_/g, ' ')}
                                        <span class="badge bg-primary rounded-pill">${value}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
                ${data.weather ? `
                    <div class="row mt-4">
                        <div class="col-md-12">
                            <h5><i class="fas fa-cloud me-2"></i>Weather Information</h5>
                            <ul class="list-group">
                                ${Object.entries(data.weather).map(([key, value]) => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        ${key.replace(/_/g, ' ')}
                                        <span class="badge bg-info rounded-pill">${value}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showToast(type, message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found!');
        alert(message);
        return;
    }
    
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="toast-header ${type === 'error' ? 'bg-danger' : 'bg-success'} text-white">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2"></i>
            <strong class="me-auto">${type === 'error' ? 'Error' : 'Success'}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastContainer.removeChild(toastElement);
    });
}