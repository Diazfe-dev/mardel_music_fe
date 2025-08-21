class DashboardHandler {
    constructor() {
        this.searchInput = null;

        this.init();
    }

    init(){
        this.searchInput = document.getElementById('search-input');

        if(this.searchInput){
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    }

    handleSearch(event) {
        const query = event.target.value.trim().toLowerCase();
        console.log('Searching for:', query);
    }
}

export default DashboardHandler;