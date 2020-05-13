//моя локация
class MyLocation {
    constructor(location) {
        
        this._all = 'All';
        this._movie = '';
        this._location = document.querySelector(location);
        this.pagination = {};
        this.cards = {};
        this.DATA = {};
    }

    //добавляем локацию
    addLocation(movie) {
        this._location.textContent = '';
        this._location.insertAdjacentHTML('beforeend', 
            `<a href="#" class="${this._all}">${this._all}</a>
            <span>/</span>
            <a href="#" class="${movie}">${movie}</a>`);
    }
    //забываем локацию
    removeLocation() {
        this._location.textContent = '';
    }
    //слушатель
    eventListener() {
        this._location.addEventListener('click', () => {
            event.preventDefault();
            const target = event.target;
            if (target.classList.contains(this._all)) {
                console.log(1);
                this.pagination.refresh(this.DATA.data);
                this.cards.createNewCards(this.DATA.data);
            }
        });
    }

    init(pagination, cards, DATA) {
        this.pagination = pagination;
        this.cards = cards;
        this.DATA = DATA;
        this.eventListener();
    }
}
export default MyLocation;