//моя локация
class MyLocation {
    constructor(location) {
        
        this._all = 'All';
        this._movie = '';
        this._location = document.querySelector(location);
        this.eventListener();
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
            const target = event.target;
            if (target.classList.contains(this._all)) {
                console.log(1);
                target.preventDefault();
                pagination.refresh(DATA.data);
                cards.createNewCards(DATA.data);
            }
        });
    }
}
export default MyLocation;