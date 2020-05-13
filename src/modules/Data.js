// хранит данные и запускает фильтры
class Data {
    constructor() {
        this._data = [];
        this._listFilms = [];
    }

    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }

    get listFilms() {
        return this._listFilms;
    }

    set listFilms(listFilms) {
        this._listFilms = listFilms;
    }

    filterFilm(searchFilm) { 
        //фильтруем массив по фильму
        const newData = this._data.filter(item => {
            if (!item.movies) return false;
            return [...item.movies].some(film => film.toLowerCase() === searchFilm.toLowerCase());
        });
        //если такого фильма нет, то возвращаемся
        if (newData.length === 0) return false;
        //добавляем нашу локацию к примеру "All/The Avrngers"
        myLocation.addLocation(searchFilm);
        //обновляем пагинацию и загружаем информацию в карточки
        pagination.refresh(newData);
        cards.createNewCards(newData);
        return true;
    }


    //инициализация
    init(data) {
        this._data = data;

        //заполняем list films списком фильмов
        data.forEach(item => this._listFilms = this._listFilms.concat(item.movies));
        this._listFilms = this._listFilms.filter((item, i) => 
            this._listFilms.indexOf(item) === i && item !== undefined);
        this._listFilms.sort();
    }
}
export default Data;