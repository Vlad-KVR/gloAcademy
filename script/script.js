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

// const flipper = document.querySelectorAll('.flipper'),
// 	wrapperImage = document.querySelectorAll('.wrapper__image'),
// 	back = document.querySelectorAll('.back'),
// 	nameHero = document.querySelectorAll('.name-hero > h1');


//получение данных
const getData = () => fetch("./../dbHeroes-master/dbHeroes.json");



//добавляем и удаляем информацию со страницы
//Используем только addCards(data) и removeCards()
class Cards {
    constructor(wrapperImage, nameHero, back, container) {
        this.DATA = {};
        this._wrapperImage = wrapperImage;
        this._nameHero = nameHero;
        this._back = back;
        this._container = container;
    }
    //add
    addCards(data) {
    
        for (let i = 0; i < this._wrapperImage.length; i++) {
            this._container[i].classList.remove('loader-card');
            this.addFront(this._wrapperImage[i], this._nameHero[i], data[i]);
            this.addBack(this._back[i], data[i]);
        }
        
    }

    addFront(img, name, dataItem) {

            if (!dataItem) return;
            const newImg = document.createElement('img');
            newImg.src = "dbHeroes-master/" + dataItem.photo;
            img.append(newImg);
            name.textContent = dataItem.name;
            name.parentNode.classList.add('name-active');
    
    }

    addBack(back, dataItem) {
        if (!dataItem) return;

            back.append(this.createDivForBack(dataItem));
            back.parentNode.classList.add('flipper-active');
    }

    createDivForBack(dataItem) {
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
                        a.classList.add('film');
                        return a;
                    });
                    const p = document.createElement('p');
                    p.textContent = 'Movies: ';
                    arrLinks.forEach(elem => p.append(elem));
                    div.append(p);
    
                }
            }

            return div;
    }

    //remove
    removeCards() {

        this._wrapperImage.forEach(item => item.textContent = '');
    
        this._nameHero.forEach(item => {
            item.textContent = '';
            item.parentNode.classList.remove('name-active');
        });
    
        this._back.forEach(item => {
            item.textContent = '';
            item.parentNode.classList.remove('flipper-active');
        });
        this._container.forEach(item => {
            item.classList.add('loader-card');
        });
    }

    createNewCards(newData) {
        if (newData.length === DATA.data.length) {
            myLocation.removeLocation();
        }
        this.removeCards();
        this.addCards(newData);
    }

    eventListener() {
        this._back.forEach(item => {
            item.addEventListener('click', event => {
                event.preventDefault();
                const target = event.target;
                if (target.classList.contains('film')) {
                    const film = target.textContent.replace(/,/, '');
                    DATA.filterFilm(film.trim());
                }
            });
        });
    }

    init(DATA) {
        this.DATA = DATA;
        this.addCards(DATA.data);
        this.eventListener();
    }
}
const cards = new Cards(document.querySelectorAll('.wrapper__image'),
                        document.querySelectorAll('.name-hero > h1'),
                        document.querySelectorAll('.back'),
                        document.querySelectorAll('.flip-container'));



//пагинация
//используем только init() и refresh(newData), ну и set data
class Pagination {
	constructor(cards) {
        this._cards = cards;
		this._data = [];
		this._pagination = document.querySelector('.pagination');
		this._pageNumbers = document.querySelectorAll('.page-number');
		this._countPage = 0;
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
        this._cards.createNewCards(newData);
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

	init(data) {
        this.data = data;		
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

const pagination = new Pagination(cards);


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
        const newData = this._data.filter(item => {
            if (!item.movies) return false;
            return [...item.movies].some(film => film.toLowerCase() === searchFilm.toLowerCase());
        });
        if (newData.length === 0) return; 
        myLocation.addLocation(searchFilm);
        pagination.refresh(newData);
        cards.createNewCards(newData);
    }



    init(data) {
        this._data = data;

        //заполняем list films списком фильмов
        data.forEach(item => this._listFilms = this._listFilms.concat(item.movies));
        this._listFilms = this._listFilms.filter((item, i) => 
            this._listFilms.indexOf(item) === i && item !== undefined);
        this._listFilms.sort();
    }
}

const DATA = new Data();


//поиск по фильмам
const searchFilm = DATA => {
	//данные
    const input = document.getElementById('search'),
        dropdown = document.querySelector('.dropdown'),
        formSearch = document.getElementById('form-search');




	//показываем фильмы в выпадающем списке
    const showFilms = () => {
        dropdown.textContent = '';

        if (input.value === '') return;

        const createNewFilmsList = DATA.listFilms.filter(item => {
            const fixItem = item.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        });

        createNewFilmsList.forEach(item => {
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


    //обработчики событий
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

        DATA.filterFilm(input.value);
        input.value = '';      
    });
};


const menu = DATA => {
    const btnMenu = document.querySelector('.menu'),
    menu = document.querySelector('menu'),
    ul = document.querySelector('menu > ul');

    const createMenu = () => {
        const arrLi = [];
        DATA.listFilms.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = item;
            li.append(a);
            li.classList.add('film');
            ul.append(li);
        });
    }; 

    const toggleMenu = () => {

        const handlerMenu = () => {
            menu.classList.toggle('active-menu');
            menu.scrollTop = 0;
            document.body.classList.toggle('scroll-hidden');
        };

    
        btnMenu.addEventListener('click', handlerMenu);
        menu.addEventListener('click', () => {
            event.preventDefault();
            let target = event.target;
    
            if (!target.classList.contains('close-btn')) {
                target = target.closest('li');
            }
    
            if (target) handlerMenu();

            if (target.classList.contains('film')) {
                DATA.filterFilm(target.firstChild.textContent);
            }
            
        });
    };
    
    createMenu();
    toggleMenu();
};


const logo = DATA => {
    document.querySelector('img').addEventListener('click', () => {
        pagination.refresh(DATA.data);
        cards.createNewCards(DATA.data);
    });
};

class MyLocation {
    constructor(location) {
        
        this._all = 'All';
        this._movie = '';
        this._location = document.querySelector(location);
        this.eventListener();
    }


    addLocation(movie) {
        this._location.textContent = '';
        this._location.insertAdjacentHTML('beforeend', 
            `<a href="#" class="${this._all}">${this._all}</a>
            <span>/</span>
            <a href="#" class="${movie}">${movie}</a>`);
    }

    removeLocation() {
        this._location.textContent = '';
    }

    eventListener() {
        this._location.addEventListener('click', () => {
            const target = event.target;
            if (target.classList.contains(this._all)) {
                pagination.refresh(DATA.data);
                cards.createNewCards(DATA.data);
            }
        });
    }
}

const myLocation = new MyLocation('.my-location');

getData()
    .then(response => {
        if (response.status !== 200) throw new Error(response.status);
        return response.json();
    })
    .then(heroes => {
        setTimeout(() => {
            DATA.init(heroes);
            pagination.init(DATA.data);
            cards.init(DATA);
            searchFilm(DATA);
            menu(DATA);
            logo(DATA);
        }, 2000);
    })
    .catch(error => {
        console.error(error);
        document.querySelector('.wrapper__cards').style.opacity = 0;
        document.querySelector('section').insertAdjacentHTML('afterbegin', `<div class="modal-message">
                <h1>Oops was ${error}, please comeback later :(</h1></div>`);
    });

