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
class Cards {
    constructor(wrapperImage, nameHero, back, container, front) {
        this.DATA = {};
        this._wrapperImage = document.querySelectorAll(wrapperImage);
        this._nameHero = document.querySelectorAll(nameHero);
        this._back = document.querySelectorAll(back);
        this._container = document.querySelectorAll(container);
        this._front = document.querySelectorAll(front);
    }
    //add
    addCards(data) {
        //идем циклом по всем карточкам
        for (let i = 0; i < this._container.length; i++) {
            //забываем стили загрузки
            this._container[i].classList.remove('loader-card');
            //добавляем информацию на фронтальную часть карты
            this.addFront(this._wrapperImage[i], this._nameHero[i], data[i], this._front[i]);
            //добавляем информацию на заднюю часть карты
            this.addBack(this._back[i], data[i]);
        }
        
    }

    addFront(img, name, dataItem, front) {
            //если информации нет добавляем класс и все
            if (!dataItem) {
                front.classList.add('none-card');
                return;
            }
            //создаем картинку
            const newImg = document.createElement('img');
            //присваиваем ссылку
            newImg.src = "dbHeroes-master/" + dataItem.photo;
            img.append(newImg);
            //вписываем имя и добавляем класс
            name.textContent = dataItem.name;
            name.parentNode.classList.add('name-active');
    
    }

    addBack(back, dataItem) {
        //если информации нет, то возвращаемся
        if (!dataItem) return;
            //добавляем див с информацией
            back.append(this.createDivForBack(dataItem));
            //добавляем возможность поворота карточек
            back.parentNode.classList.add('flipper-active');
    }

    createDivForBack(dataItem) {
        //создаем блок
        const div = document.createElement('div');
            //циклом проходтм по объекту dataItem
            for (let key in dataItem) {
                //если ключ не фото и не кино, то добавляем информацию "ключ: значение"
                //если ключ кино, то добавляеи информацию "ключ: значение, значение ..."
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
            //возвращаем готовый блок
            return div;
    }

    //remove
    removeCards() {
        //делаем блоки с картинками пустыми
        this._wrapperImage.forEach(item => item.textContent = '');
        //делаем блоки с именами пустыми и забываем класс
        this._nameHero.forEach(item => {
            item.textContent = '';
            item.parentNode.classList.remove('name-active');
        });
        //делаем заднюю часть пустой и забываем класс для поворота
        this._back.forEach(item => {
            item.textContent = '';
            item.parentNode.classList.remove('flipper-active');
        });
        //добавляем класс загрузки
        this._container.forEach(item => {
            item.classList.add('loader-card');
        });
        //фильтруем по none-card после чего забываем этот клас
        [...this._front].filter(item => item.classList.contains('none-card'))
                    .forEach(item => item.classList.remove('none-card'));
        
    }

    createNewCards(newData) {
        //если длина новых карточек равна длине всех карточек, то забываем путь (All/Something)
        if (newData.length === DATA.data.length) {
            myLocation.removeLocation();
        }
        //забываем старые карточки и добавляем новые
        this.removeCards();
        this.addCards(newData);
    }

    eventListener() {
        //слушатель для возможности фильтра по фильму 
        //в разделе Movies на задней стороне карточки
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
    //инициализация объекта
    init(DATA) {
        this.DATA = DATA;
        this.addCards(DATA.data);
        this.eventListener();
    }
}
const cards = new Cards('.wrapper__image',
                        '.name-hero > h1',
                        '.back',
                        '.flip-container',
                        '.front');



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
        //проверяем существует ли "страница" и делаем по умолчанию 3
		for (let i = 0; i < 3; i++) {
			if (!this._pageNumbers[i]) {
				const copy = this._pageNumbers[0].cloneNode(true);
				copy.classList.remove('page-active');
				copy.textContent = i + 1;
				this._pagination.append(copy);
			}
        }
        //обновляем массив со страницами
		this._pageNumbers = document.querySelectorAll('.page-number');
	}

	togglePageActive() {
        //если текущая страница по типу номер, то возвращаемся
        if ((typeof this._currentPage) === 'number') return;
        //иначе добавляем класс
        this._currentPage.classList.toggle('page-active');
	}
	
	startPage() {
        //забываем активную страницу
        this.togglePageActive();

        //делаем текст для страниц "1" "2" "3"
        this._pageNumbers.forEach((item, i) => item.textContent = i + 1);
        //забываем начальную страницу что бы не было "1... 1 2 3"
        this.removeStartPage();
        //забываем последнюю страницу
        this.removeLastPage();
        //текущая страница сменяется и добавляется соответствующий класс
        this._currentPage = this._pageNumbers[0];
        this.togglePageActive();

        
        if (this._countPage > 3) {

            this.addLastPage();
    
        } else if (this._countPage < 3) {
			
            if (this._pageNumbers[2]) this._pageNumbers[2].remove();
            if (this._countPage < 2) this._pageNumbers[1].remove();
    
        }
        //обновляем массив со страницами
        this._pageNumbers = document.querySelectorAll('.page-number');
	}
	
	lastPage(target) {
        //забываем активную страницу и последнюю что бы не было "3 4 5 ...5"
        this.togglePageActive();
        this.removeLastPage();

        //номер нажатой страницы
        const targetNumber = +target.textContent;
        //если страниц больше 2 то отнимать будет 2, иначе 1
        let j = this._pageNumbers.length > 2 ? -2 : -1;
        //отнимаем j и прибавляем к ней 1
        this._pageNumbers.forEach(item => item.textContent = targetNumber + j++);
        //меняем текущую страницу и добавляем ей клас
		this._currentPage = this._pageNumbers[2] ? this._pageNumbers[2] : this._pageNumbers[1];
        this.togglePageActive();
        //если страниц больше трех, то добавляем начальную (1...)
        if (this._countPage > 3) this.addStartPage();
	}
	
	switchPage(target) {
        //если нажали 1 то запускаем startPage(target),
        // а если последнюю, то lastPage(target)
        if (target.textContent === '1') {
            this.startPage(target);
            return;
        } else if (target.textContent === this._countPage.toString()) {
            this.lastPage(target);
            return;
        }

        //забываем активную страницу
        this.togglePageActive();
        
        //номер нажатой страницы
        const targetNumber = +target.textContent;
        //сколько отнимаем
        let j = -1;
        //отнимаем) и прибавляем в конце 1 к j
        for (let i = 0; i < 3; i++) {
            this._pageNumbers[i].textContent = targetNumber + j++;
        }
		//меняем текущую страницу и делаем ее активной
		this._currentPage = this._pageNumbers[1];
        this.togglePageActive();
        //запускаем редактирование страниц 
        //(это для добавления/удаления "1..." и "...5")
        this.editPagination();
    }
    //добавление "...(последняя страница)"
    addLastPage() {
        if (document.getElementById('sp2')) return;
        this._pagination.insertAdjacentHTML('beforeend', `<span id="sp2">...</span>
                <a href="#" id="last-page" class="trigger">${this._countPage}</a>`);
    }
    //забывание последней страницы
    removeLastPage() {
        if (!document.getElementById('sp2')) return;
        document.getElementById('sp2').remove();
        document.getElementById('last-page').remove();
    }
    //добавление начальной страницы
    addStartPage() {
        if (document.getElementById('sp1')) return;
        this._pagination.insertAdjacentHTML('afterbegin', `<a href="#" id="start-page" class="trigger">1</a>
                <span id="sp1">...</span>`);
    }
    //забывание начальной страницы
    removeStartPage() {
        if (!document.getElementById('sp1')) return;
        document.getElementById('sp1').remove();
        document.getElementById('start-page').remove();
    }
    //редактирование начальной и последней страницы
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
    //добавление новых карточек
    addNewCards(data) {
        const topBound = +this._currentPage.textContent * 10,
			bottomBound = +this._currentPage.textContent * 10 - 10;
			
        const newData = data.filter((item, i) => i >= bottomBound && i < topBound);
        this._cards.createNewCards(newData);
	}
	//слушатель
	eventPagination(event) {
        event.preventDefault();
        if (!event.target.classList.contains("page-active") &&
        (event.target.classList.contains('page-number') || event.target.classList.contains('trigger'))) {
            this.switchPage(event.target);
            this.addNewCards(this._data);
        }
	}
	//начинаем слушать
	startEvent() {
		this._pagination.addEventListener('click', this.eventPagination.bind(this), false);
	}

	//remove по каким-то причинам не срабатывал и было два слушателя,
	// пришлось отказаться от removeEvent() 
	removeEvent() {
		this._pagination.removeEventListener('click', this.eventPagination.bind(this), false);
	}
    //инициализачия
	init(data) {
        this.data = data;		
		this.pageNumbersRefresh();
		this.startPage();
		this.startEvent();
	}
    //перезагрузка страниц
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
            const message = document.querySelector('.modal-message');
            message.childNodes[1].textContent = "Enter movie name";
            message.style.opacity = 1;
            setTimeout(() => message.style.opacity = 0, 2000);
            return;
        }

        if (!DATA.filterFilm(input.value)) {
            const message = document.querySelector('.modal-message');
            message.childNodes[1].textContent = "We don’t have such a movie";
            message.style.opacity = 1;
            setTimeout(() => message.style.opacity = 0, 2000);
        }
        input.value = '';      
    });
};

//меню
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
                target = target.closest('a');
            }
    
            if (target) handlerMenu();

            if (target.parentNode.classList.contains('film')) {
                DATA.filterFilm(target.textContent);
            }
            
        });
    };
    
    createMenu();
    toggleMenu();
};

//лого
const logo = DATA => {
    document.querySelector('img').addEventListener('click', () => {
        pagination.refresh(DATA.data);
        cards.createNewCards(DATA.data);
    });
};

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
        document.querySelector('section').insertAdjacentHTML('afterbegin', `<div class="error">
                <h1>Oops was ${error}, please comeback later :(</h1></div>`);
    });

