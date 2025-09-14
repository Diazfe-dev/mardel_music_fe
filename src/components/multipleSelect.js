
export default class MultipleSelect {
    constructor(containerId, optionsList = [], placeholder = 'Selecciona opciones') {
        this.container = document.getElementById(containerId);
        this.optionsList = optionsList;
        this.selectedOptions = [];
        this.input = null;
        this.suggestions = null;
        this.selectedContainer = null;
        this.placeholder = placeholder;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <label>Opciones</label>
            <div style="position:relative;">
                <input type="text" id="multiple-select-input" placeholder="${this.placeholder}"
                    class="bg-darker p-2 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-light transition-all" />
                <div class="hidden mt-1 text-gray-400 text-sm" id="multiple-select-suggestions" style="position:absolute;left:0;right:0;z-index:50;background:#23272a;border-radius:0.5rem;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:1px solid #444;min-width:200px;max-height:220px;overflow-y:auto;"></div>
            </div>
            <div class="options-container">
                <div class="flex flex-row flex-wrap gap-2 mt-2" id="selected-options"></div>
            </div>
        `;
        this.input = this.container.querySelector('#multiple-select-input');
        this.suggestions = this.container.querySelector('#multiple-select-suggestions');
        this.selectedContainer = this.container.querySelector('#selected-options');
        this.input.addEventListener('focus', () => this.showSuggestions());
        this.input.addEventListener('input', (e) => this.filterSuggestions(e.target.value));
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Escape') this.hideSuggestions();
        });
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
        this.renderSelectedOptions();
    }

    getSelectedOptions() {
        return this.selectedOptions;
    }

    showSuggestions() {
        this.suggestions.classList.remove('hidden');
        this.renderSuggestions(this.input.value);
    }

    hideSuggestions() {
        this.suggestions.classList.add('hidden');
    }

    filterSuggestions(query) {
        this.renderSuggestions(query);
    }

    renderSuggestions(query = '') {
        const filtered = this.optionsList.filter(opt =>
            opt.toLowerCase().includes(query.toLowerCase()) && !this.selectedOptions.includes(opt)
        );
        this.suggestions.innerHTML = filtered.length
            ? filtered.map(opt => `<div class="suggestion-item cursor-pointer p-2 hover:bg-gray-700" data-option="${opt}">${opt}</div>`).join('')
            : '<div class="p-2 text-gray-500">Sin coincidencias</div>';
        Array.from(this.suggestions.querySelectorAll('.suggestion-item')).forEach(item => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.addOption(item.dataset.option);
            });
        });
    }

    addOption(option) {
        if (!this.selectedOptions.includes(option)) {
            this.selectedOptions.push(option);
            this.renderSelectedOptions();
            this.input.value = '';
            this.showSuggestions(); // Mantener abierto y buscar tras seleccionar
            this.input.focus();
        }
    }

    removeOption(option) {
        this.selectedOptions = this.selectedOptions.filter(opt => opt !== option);
        this.renderSelectedOptions();
        this.showSuggestions(); // Volver a mostrar sugerencias tras quitar
        this.input.focus();
    }

    renderSelectedOptions() {
        this.selectedContainer.innerHTML = this.selectedOptions.map(opt =>
            `<div class="chip">${opt} <button type="button" class="remove-option" data-option="${opt}">×</button></div>`
        ).join('');
        Array.from(this.selectedContainer.querySelectorAll('.remove-option')).forEach(btn => {
            btn.addEventListener('click', () => this.removeOption(btn.dataset.option));
        });
    }
}
