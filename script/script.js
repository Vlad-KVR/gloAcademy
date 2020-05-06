/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/**
 * by: Vladislasv Kovalyov
 * email: max2433186@gmail.com
 * 
 * Простите пожалуйста, я старался)
 */
'use strict';


const flipper = document.querySelectorAll('.flipper'),
	wrapperImage = document.querySelectorAll('.wrapper__image'),
	back = document.querySelectorAll('.back'),
	nameHero = document.querySelectorAll('.name-hero > h1');
let listFilms = [],
	listHero = [];

//получение данных
const getData = callback => {

	const request = new XMLHttpRequest();
	request.open("GET", "./../dbHeroes-master/dbHeroes.json");

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        
        if (request.status === 200) {
            callback(JSON.parse(request.response));
        } else {
            throw new Error(request.status + " " + request.statusText);
        }
    });

    setTimeout(() => request.send(), 1000);
};



//добавление информации в карточки
const addCards = data => {

    console.log(data);

    const addFront = (img, name, dataItem) => {
		if (!dataItem) return;
        const newImg = document.createElement('img');
        newImg.src = "dbHeroes-master/" + dataItem.photo;
        img.append(newImg);
        name.textContent = dataItem.name;
        name.parentNode.classList.add('name-active');

    };

    const addBack = (back, name, dataItem) => {
		if (!dataItem) return;
        const div = document.createElement('div');

        for (let key in dataItem) {

            if (key !== 'photo' && key !== 'movies') {

                div.insertAdjacentHTML("beforeend", 
                `<p>${key[0].toUpperCase() + key.slice(1)}: ${dataItem[key]}</p>`);

            } else if (key === 'movies') {

                const arrLinks = dataItem[key].map((item, i, arr) => {
                    const a = document.createElement('a');
                    a.href = '#';
                    a.textContent = i !== arr.length - 1 ? item + ", " : item;
                    return a;
                });
                const p = document.createElement('p');
                p.textContent = 'Movies: ';
                arrLinks.forEach(elem => p.append(elem));
                div.append(p);

            }
        }

        back.append(div);
        back.parentNode.classList.add('flipper-active');
    };

    for (let i = 0; i < wrapperImage.length; i++) {
        addFront(wrapperImage[i], nameHero[i], data[i]);
        addBack(back[i], nameHero[i], data[i]);
    }

};



//удаление информации с карточек
const removeCards = () => {

    wrapperImage.forEach(item => item.textContent = '');

    nameHero.forEach(item => {
        item.textContent = '';
        item.parentNode.classList.remove('name-active');
    });

    back.forEach(item => {
        item.textContent = '';
        item.parentNode.classList.remove('flipper-active');
    });
};


//пагинация
//используем только init() и refresh(newData), ну и set data
class Pagination {
	constructor(data) {
		this._data = data;
		this._pagination = document.querySelector('.pagination');
		this._pageNumbers = document.querySelectorAll('.page-number');
		this._countPage = Math.ceil(data.length / 10);
		this._currentPage = 1;
	}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = newData;
		this._countPage = Math.ceil(newData.length / 10);
	}
	
	pageNumbersRefresh() {
		for (let i = 0; i < 3; i++) {
			if (!this._pageNumbers[i]) {
				const copy = this._pageNumbers[0].cloneNode(true);
				copy.classList.remove('page-active');
				copy.textContent = i + 1;
				this._pagination.append(copy);
			}
		}
		this._pageNumbers = document.querySelectorAll('.page-number');
	}

	togglePageActive() {
		if ((typeof this._currentPage) === 'number') return;
		console.log(this._pageNumbers);
		console.log(this._currentPage);
        this._currentPage.classList.toggle('page-active');
	}
	
	startPage() {
        this.togglePageActive();

        this._pageNumbers.forEach((item, i) => item.textContent = i + 1);
        this.removeStartPage();
        this.removeLastPage();

        this._currentPage = this._pageNumbers[0];
        this.togglePageActive();

        if (this._countPage > 3) {

            this.addLastPage();
    
        } else if (this._countPage < 3) {
			
            if (this._pageNumbers[2]) this._pageNumbers[2].remove();
            if (this._countPage < 2) this._pageNumbers[1].remove();
    
        }
        this._pageNumbers = document.querySelectorAll('.page-number');
	}
	
	lastPage(target) {

        this.togglePageActive();
        this.removeLastPage();

        const targetNumber = +target.textContent;
        let j = this._pageNumbers.length > 2 ? -2 : -1;
        this._pageNumbers.forEach(item => {
            item.textContent = targetNumber + j;
            j++;
        });
		this._currentPage = this._pageNumbers[2] ? this._pageNumbers[2] : this._pageNumbers[1];
        this.togglePageActive();

        if (this._countPage > 3) this.addStartPage();
	}
	
	switchPage(target) {

        if (target.textContent === '1') {
            this.startPage(target);
            return;
        } else if (target.textContent === this._countPage.toString()) {
            this.lastPage(target);
            return;
        }

        this.togglePageActive();
        
        const targetNumber = +target.textContent;
        let j = -1;
        for (let i = 0; i < 3; i++) {
            this._pageNumbers[i].textContent = targetNumber + j;
            j++;
        }
		this._pageNumbers = document.querySelectorAll('.page-number');
		
		this._currentPage = this._pageNumbers[1];
		this.togglePageActive();
        this.editPagination();
    }
    
    addLastPage() {
        if (document.getElementById('sp2')) return;
        this._pagination.insertAdjacentHTML('beforeend', `<span id="sp2">...</span>
                <a href="#" id="last-page" class="trigger">${this._countPage}</a>`);
    }

    removeLastPage() {
        if (!document.getElementById('sp2')) return;
        document.getElementById('sp2').remove();
        document.getElementById('last-page').remove();
    }

    addStartPage() {
        if (document.getElementById('sp1')) return;
        this._pagination.insertAdjacentHTML('afterbegin', `<a href="#" id="start-page" class="trigger">1</a>
                <span id="sp1">...</span>`);
    }

    removeStartPage() {
        if (!document.getElementById('sp1')) return;
        document.getElementById('sp1').remove();
        document.getElementById('start-page').remove();
    }

    editPagination() {
        if (+this._pageNumbers[2].textContent === this._countPage) {
            this.removeLastPage();
        } else {
            this.addLastPage();
        }

        if (+this._pageNumbers[0].textContent === 1) {
            this.removeStartPage();
        } else {
            this.addStartPage();
        }
    }

    addNewCards(data) {
        const topBound = +this._currentPage.textContent * 10,
			bottomBound = +this._currentPage.textContent * 10 - 10;
			
        const newData = data.filter((item, i) => i >= bottomBound && i < topBound);
        removeCards();
        addCards(newData);
	}
	
	eventPagination(event) {
        event.preventDefault();
        if (!event.target.classList.contains("page-active") &&
        (event.target.classList.contains('page-number') || event.target.classList.contains('trigger'))) {
            this.switchPage(event.target);
            this.addNewCards(this._data);
        }
	}
	
	startEvent() {
		this._pagination.addEventListener('click', this.eventPagination.bind(this), false);
	}

	//remove по каким-то причинам не срабатывал и было два слушателя,
	// пришлось отказаться от removeEvent() 
	removeEvent() {
		this._pagination.removeEventListener('click', this.eventPagination.bind(this), false);
	}

	init() {		
		this.pageNumbersRefresh();
		this.startPage();
		this.startEvent();
	}

	refresh(newData) {
		this.data = newData;
		this.pageNumbersRefresh();
		this.startPage();
	}
}

const pagination = new Pagination(listHero);


//фильтер по фильмам
const filterFilms = (data, searchFilm) => data.filter(item => {
        if (!item.movies) return false;
        return [...item.movies].some(film => film.toLowerCase() === searchFilm.toLowerCase());
    });

//поиск по фильмам
const searchFilm = data => {
	//данные
    const input = document.getElementById('search'),
        dropdown = document.querySelector('.dropdown'),
        formSearch = document.getElementById('form-search');

	//заполняем list films списком фильмов
    data.forEach(item => listFilms = listFilms.concat(item.movies));
    listFilms = listFilms.filter((item, i) => listFilms.indexOf(item) === i && item !== undefined);

	//показываем фильмы в выпадающем списке
    const showFilms = () => {
        dropdown.textContent = '';

        if (input.value === '') return;

        const filterFilms = listFilms.filter(item => {
            const fixItem = item.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        });

        filterFilms.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            dropdown.append(li);
        });
    };

	//вставляем выбранный фильм в инпут
    const handlerFilm = event => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'li') {
            input.value = target.textContent;
            dropdown.textContent = '';
		}
		formSearch.dispatchEvent(new Event("submit"));
    };


    input.addEventListener('input', showFilms);
    dropdown.addEventListener('click', event => {
        handlerFilm(event);
	});
	
    formSearch.addEventListener('submit', event => {
        event.preventDefault();

        if (input.value === '') {
            alert('Enter movie name');
            return;
        }

        const newData = filterFilms(data, input.value);
        console.log(newData);
        pagination.refresh(newData);
        removeCards();
        addCards(newData);
    });
};

getData(data => {
	listHero = data;
	pagination.data = listHero;
	pagination.init();
	addCards(listHero);
	searchFilm(listHero);
});

