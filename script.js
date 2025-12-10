class BeautifulJSONFormatter {
    constructor() {
        // DOM Elements
        this.jsonInput = document.getElementById('jsonInput');
        this.resultContainer = document.getElementById('resultContainer');
        this.messageContainer = document.getElementById('messageContainer');
        this.formatBtn = document.getElementById('formatBtn');
        this.validateBtn = document.getElementById('validateBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.fixBtn = document.getElementById('fixBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.indentSelect = document.getElementById('indentSelect');
        this.autoFormatToggle = document.getElementById('autoFormatToggle');
        this.loader = document.getElementById('loader');
        
        // Stats Elements
        this.charCount = document.getElementById('charCount');
        this.lineCount = document.getElementById('lineCount');
        this.sizeCount = document.getElementById('sizeCount');
        this.depthCount = document.getElementById('depthCount');
        this.objectCount = document.getElementById('objectCount');
        this.arrayCount = document.getElementById('arrayCount');
        
        // Configuration
        this.config = {
            indentSize: 2,
            isDarkMode: false,
            autoFormat: false,
            theme: 'light'
        };
        
        this.samples = [
            // Sample 1: Basic Example
            {
                name: "Basic Example",
                data: {
                    "name": "John Doe",
                    "age": 30,
                    "isEmployed": true,
                    "address": {
                        "street": "123 Main St",
                        "city": "New York",
                        "country": "USA"
                    },
                    "hobbies": ["reading", "gaming", "hiking"],
                    "projects": null
                }
            },
            // Sample 2: API Response
            {
                name: "API Response",
                data: {
                    "status": "success",
                    "code": 200,
                    "message": "Data retrieved successfully",
                    "data": {
                        "users": [
                            {
                                "id": 1,
                                "name": "Alice Johnson",
                                "email": "alice@example.com",
                                "role": "admin"
                            },
                            {
                                "id": 2,
                                "name": "Bob Smith",
                                "email": "bob@example.com",
                                "role": "user"
                            }
                        ],
                        "pagination": {
                            "total": 2,
                            "page": 1,
                            "per_page": 10,
                            "total_pages": 1
                        }
                    },
                    "timestamp": "2024-01-15T10:30:00Z"
                }
            },
            // Sample 3: Configuration File
            {
                name: "Configuration",
                data: {
                    "app": {
                        "name": "MyApplication",
                        "version": "1.0.0",
                        "debug": false,
                        "port": 3000
                    },
                    "database": {
                        "host": "localhost",
                        "port": 5432,
                        "name": "mydb",
                        "username": "admin",
                        "password": "secret",
                        "pool": {
                            "max": 10,
                            "min": 2,
                            "idle": 10000
                        }
                    },
                    "features": {
                        "enableLogging": true,
                        "enableCache": true,
                        "maxUploadSize": 5242880
                    }
                }
            }
        ];
        
        this.currentSampleIndex = 0;
        
        this.init();
    }
    
    init() {
        // Load saved settings
        this.loadSettings();
        
        // Event Listeners
        this.formatBtn.addEventListener('click', () => this.formatJSON());
        this.validateBtn.addEventListener('click', () => this.validateJSON());
        this.minifyBtn.addEventListener('click', () => this.minifyJSON());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.fixBtn.addEventListener('click', () => this.fixJSON());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.indentSelect.addEventListener('change', (e) => this.updateIndent(e));
        this.autoFormatToggle.addEventListener('change', (e) => this.toggleAutoFormat(e));
        
        // Real-time events
        this.jsonInput.addEventListener('input', () => {
            this.updateStats();
            if (this.config.autoFormat) {
                setTimeout(() => this.formatJSON(), 500);
            }
        });
        
        // Keyboard shortcuts
        this.jsonInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.formatJSON();
            }
            if (e.ctrlKey && e.key === ' ') {
                e.preventDefault();
                this.loadSample();
            }
        });
        
        // Initialize
        this.updateStats();
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        this.showMessage('Welcome to Beautiful JSON Formatter! Start by pasting your JSON or loading a sample.', 'success');
    }
    
    formatJSON() {
        const input = this.jsonInput.value.trim();
        if (!input) {
            this.showError('Please enter some JSON data');
            return;
        }
        
        this.showLoader();
        
        setTimeout(() => {
            try {
                const parsed = JSON.parse(input);
                const indentChar = this.indentSelect.value === 'tab' ? '\t' : ' ';
                const indentSize = this.indentSelect.value === 'tab' ? 1 : parseInt(this.indentSelect.value);
                const formatted = JSON.stringify(parsed, null, indentChar.repeat(indentSize));
                const highlighted = this.syntaxHighlight(formatted);
                
                this.resultContainer.innerHTML = highlighted;
                this.resultContainer.className = 'result-container valid';
                this.showMessage('JSON formatted successfully!', 'success');
                this.updateStats();
                this.hideLoader();
            } catch (error) {
                this.hideLoader();
                this.showError(this.getErrorMessage(error, input));
            }
        }, 300);
    }
    
    validateJSON() {
        const input = this.jsonInput.value.trim();
        if (!input) {
            this.showError('Please enter some JSON data');
            return;
        }
        
        this.showLoader();
        
        setTimeout(() => {
            try {
                JSON.parse(input);
                this.resultContainer.textContent = '✅ JSON is perfectly valid!';
                this.resultContainer.className = 'result-container valid';
                this.showMessage('JSON is valid! All syntax checks passed.', 'success');
                this.updateStats();
                this.hideLoader();
            } catch (error) {
                this.hideLoader();
                this.showError(this.getErrorMessage(error, input));
            }
        }, 300);
    }
    
    minifyJSON() {
        const input = this.jsonInput.value.trim();
        if (!input) {
            this.showError('Please enter some JSON data');
            return;
        }
        
        this.showLoader();
        
        setTimeout(() => {
            try {
                const parsed = JSON.parse(input);
                const minified = JSON.stringify(parsed);
                const highlighted = this.syntaxHighlight(minified);
                
                this.resultContainer.innerHTML = highlighted;
                this.resultContainer.className = 'result-container valid';
                this.showMessage(`JSON minified successfully! Reduced from ${input.length} to ${minified.length} characters.`, 'success');
                this.updateStats();
                this.hideLoader();
            } catch (error) {
                this.hideLoader();
                this.showError(this.getErrorMessage(error, input));
            }
        }, 300);
    }
    
    fixJSON() {
        const input = this.jsonInput.value.trim();
        if (!input) {
            this.showError('Please enter some JSON data');
            return;
        }
        
        this.showLoader();
        
        setTimeout(() => {
            try {
                // Try to fix common JSON errors
                let fixed = input;
                
                // Remove trailing commas
                fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
                
                // Fix missing quotes around keys
                fixed = fixed.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
                
                // Try to parse the fixed JSON
                const parsed = JSON.parse(fixed);
                const formatted = JSON.stringify(parsed, null, this.config.indentSize);
                const highlighted = this.syntaxHighlight(formatted);
                
                this.resultContainer.innerHTML = highlighted;
                this.resultContainer.className = 'result-container valid';
                this.jsonInput.value = formatted;
                this.showMessage('JSON fixed successfully! Common errors were corrected.', 'success');
                this.updateStats();
                this.hideLoader();
            } catch (error) {
                this.hideLoader();
                this.showError('Unable to automatically fix the JSON. Please check the error details.');
            }
        }, 300);
    }
    
    syntaxHighlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, this.config.indentSize);
        }
        
        // Escape HTML
        json = json.replace(/[<>&]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                default: return c;
            }
        });
        
        // Apply syntax highlighting
        return json.replace(/"(\\.|[^"\\])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, (match) => {
            let cls = 'json-number';
            
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                    match = match.replace(/:$/, '') + '<span class="json-punctuation">:</span>';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            
            return `<span class="${cls}">${match}</span>`;
        })
        .replace(/[{}\[\],]/g, '<span class="json-punctuation">$&</span>')
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp;');
    }
    
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = type === 'error' ? 'error-message' : 'success-message';
        messageEl.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
        
        this.messageContainer.innerHTML = '';
        this.messageContainer.appendChild(messageEl);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (this.messageContainer.contains(messageEl)) {
                    messageEl.style.opacity = '0';
                    messageEl.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        if (this.messageContainer.contains(messageEl)) {
                            this.messageContainer.removeChild(messageEl);
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
    
    showError(message) {
        this.resultContainer.textContent = '❌ Invalid JSON';
        this.resultContainer.className = 'result-container invalid';
        this.showMessage(message, 'error');
    }
    
    getErrorMessage(error, input) {
        let message = error.message;
        
        if (error.message.includes('Unexpected token')) {
            const match = error.message.match(/Unexpected token (.) in JSON at position (\d+)/);
            if (match) {
                const token = match[1];
                const position = parseInt(match[2]);
                const before = Math.max(0, position - 20);
                const after = Math.min(input.length, position + 20);
                const context = input.substring(before, after);
                const line = input.substring(0, position).split('\n').length;
                const column = position - input.substring(0, position).lastIndexOf('\n');
                
                message = `
                    <strong>Unexpected character '${token}' at position ${position}</strong><br><br>
                    <strong>Location:</strong> Line ${line}, Column ${column}<br>
                    <strong>Context:</strong> ...${context}...<br><br>
                    <strong>Possible fixes:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Check for missing quotes</li>
                        <li>Remove trailing commas</li>
                        <li>Verify brackets are properly closed</li>
                    </ul>
                `;
            }
        }
        
        return message;
    }
    
    copyToClipboard() {
        const text = this.resultContainer.textContent;
        if (!text || text.includes('Your beautifully')) {
            this.showError('Nothing to copy');
            return;
        }
        
        this.showLoader();
        
        setTimeout(() => {
            const success = this.fallbackCopyText(text);
            if (success) {
                this.showCopySuccess();
            } else {
                this.showError('Failed to copy. Please copy manually.');
            }
            this.hideLoader();
        }, 300);
    }
    
    fallbackCopyText(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '-1000px';
            textArea.style.left = '-1000px';
            textArea.style.opacity = '0';
            
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            return successful;
        } catch (err) {
            console.error('Copy failed:', err);
            return false;
        }
    }
    
    showCopySuccess() {
        const originalText = this.copyBtn.innerHTML;
        const originalClass = this.copyBtn.className;
        
        this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        this.copyBtn.className = 'btn btn-success';
        
        this.showMessage('Copied to clipboard!', 'success');
        
        setTimeout(() => {
            this.copyBtn.innerHTML = originalText;
            this.copyBtn.className = originalClass;
        }, 2000);
    }
    
    loadSample() {
        const sample = this.samples[this.currentSampleIndex];
        this.jsonInput.value = JSON.stringify(sample.data, null, 2);
        this.formatJSON();
        this.showMessage(`Loaded sample: ${sample.name}`, 'success');
        
        // Cycle through samples
        this.currentSampleIndex = (this.currentSampleIndex + 1) % this.samples.length;
    }
    
    clearInput() {
        this.jsonInput.value = '';
        this.resultContainer.textContent = 'Your beautifully formatted JSON will appear here...';
        this.resultContainer.className = 'result-container';
        this.messageContainer.innerHTML = '';
        this.updateStats();
        this.showMessage('Input cleared!', 'success');
    }
    
    toggleTheme() {
        this.config.isDarkMode = !this.config.isDarkMode;
        document.body.classList.toggle('dark-mode', this.config.isDarkMode);
        
        const icon = this.themeToggle.querySelector('i');
        if (this.config.isDarkMode) {
            icon.className = 'fas fa-sun';
            icon.style.color = '#fbbf24';
            this.config.theme = 'dark';
        } else {
            icon.className = 'fas fa-moon';
            icon.style.color = 'white';
            this.config.theme = 'light';
        }
        
        this.saveSettings();
    }
    
    updateIndent(e) {
        this.config.indentSize = e.target.value === 'tab' ? 1 : parseInt(e.target.value);
        this.saveSettings();
        if (this.jsonInput.value.trim()) {
            this.formatJSON();
        }
    }
    
    toggleAutoFormat(e) {
        this.config.autoFormat = e.target.checked;
        this.saveSettings();
        this.showMessage(`Auto-format ${this.config.autoFormat ? 'enabled' : 'disabled'}`, 'success');
    }
    
    showLoader() {
        this.loader.style.display = 'block';
    }
    
    hideLoader() {
        this.loader.style.display = 'none';
    }
    
    updateStats() {
        const text = this.jsonInput.value;
        
        // Character count
        const chars = text.length;
        this.charCount.textContent = chars.toLocaleString();
        
        // Line count
        const lines = text.split('\n').length;
        this.lineCount.textContent = lines.toLocaleString();
        
        // Size in bytes
        const size = new Blob([text]).size;
        this.sizeCount.textContent = this.formatBytes(size);
        
        // Calculate object/array counts and depth
        let depth = 0;
        let maxDepth = 0;
        let objectCount = 0;
        let arrayCount = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') {
                    depth++;
                    maxDepth = Math.max(maxDepth, depth);
                    objectCount++;
                } else if (char === '}') {
                    depth--;
                } else if (char === '[') {
                    depth++;
                    maxDepth = Math.max(maxDepth, depth);
                    arrayCount++;
                } else if (char === ']') {
                    depth--;
                }
            }
        }
        
        this.depthCount.textContent = maxDepth;
        this.objectCount.textContent = objectCount;
        this.arrayCount.textContent = arrayCount;
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    saveSettings() {
        localStorage.setItem('jsonFormatterSettings', JSON.stringify(this.config));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('jsonFormatterSettings');
        if (saved) {
            this.config = JSON.parse(saved);
            
            // Apply settings
            if (this.config.isDarkMode) {
                document.body.classList.add('dark-mode');
                const icon = this.themeToggle.querySelector('i');
                icon.className = 'fas fa-sun';
                icon.style.color = '#fbbf24';
            }
            
            if (this.config.indentSize) {
                this.indentSelect.value = this.config.indentSize;
            }
            
            if (this.config.autoFormat) {
                this.autoFormatToggle.checked = true;
            }
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BeautifulJSONFormatter();
});