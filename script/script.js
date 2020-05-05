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
let currentPage = 1;
let listFilms = [];


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

        const newImg = document.createElement('img');
        newImg.src = "dbHeroes-master/" + dataItem.photo;
        img.append(newImg);
        name.textContent = dataItem.name;
        name.parentNode.classList.add('name-active');

    };

    const addBack = (back, name, dataItem) => {

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
const pagination = (data, pageNumber) => {
    const pagination = document.querySelector('.pagination');

    let pageNumbers = document.querySelectorAll('.page-number');
    for (let i = 0; i < 3; i++) {
        if (!pageNumbers[i]) {
            const copy = pageNumbers[0].cloneNode(true);
            copy.classList.remove('page-active');
            copy.textContent = i + 1;
            pagination.append(copy);
        }
    }
    pageNumbers = document.querySelectorAll('.page-number');

    const countPage = Math.ceil(data.length / 10);

    console.log(countPage);
    

    const togglePageActive = () => {
        if ((typeof currentPage) === 'number') return;
        currentPage.classList.toggle('page-active');
    };

    const startPage = target => {
        togglePageActive();

        pageNumbers.forEach((item, i) => item.textContent = i + 1);
        removeStartPage();
        removeLastPage();

        currentPage = pageNumbers[0];
        togglePageActive();

        if (countPage > 3) {

            addLastPage();
    
        } else if (countPage < 3) {
    
            pageNumbers[2].remove();
            if (countPage < 2) pageNumbers[1].remove();
    
        }
        pageNumbers = document.querySelectorAll('.page-number');

    };

    const lastPage = target => {

        togglePageActive();
        removeLastPage();

        const targetNumber = +target.textContent;
        let j = pageNumbers.length > 2 ? -2 : -1;
        pageNumbers.forEach(item => {
            item.textContent = targetNumber + j;
            j++;
        });
        currentPage = pageNumbers[2];
        togglePageActive();

        if (countPage > 3) addStartPage();
    };

    const switchPage = target => {

        if (target.textContent === '1') {
            startPage(target);
            return;
        } else if (target.textContent === countPage.toString()) {
            lastPage(target);
            return;
        }

        togglePageActive();
        
        const targetNumber = +target.textContent;
        let j = -1;
        for (let i = 0; i < 3; i++) {
            pageNumbers[i].textContent = targetNumber + j;
            j++;
        }

        currentPage = pageNumbers[1];
        togglePageActive();
        editPagination();
    };
    
    const addLastPage = () => {
        if (document.getElementById('sp2')) return;
        pagination.insertAdjacentHTML('beforeend', `<span id="sp2">...</span>
                <a href="#" id="last-page" class="trigger">${countPage}</a>`);
    };

    const removeLastPage = () => {
        if (!document.getElementById('sp2')) return;
        document.getElementById('sp2').remove();
        document.getElementById('last-page').remove();
    };

    const addStartPage = () => {
        if (document.getElementById('sp1')) return;
        pagination.insertAdjacentHTML('afterbegin', `<a href="#" id="start-page" class="trigger">1</a>
                <span id="sp1">...</span>`);
    };

    const removeStartPage = () => {
        if (!document.getElementById('sp1')) return;
        document.getElementById('sp1').remove();
        document.getElementById('start-page').remove();
    };

    const editPagination = () => {
        if (+pageNumbers[2].textContent === countPage) {
            removeLastPage();
        } else {
            addLastPage();
        }

        if (+pageNumbers[0].textContent === 1) {
            removeStartPage();
        } else {
            addStartPage();
        }
    };

    const addNewCards = data => {
        const topBound = +currentPage.textContent * 10,
            bottomBound = +currentPage.textContent * 10 - 10;
        console.log(data);
        const newData = data.filter((item, i) => i >= bottomBound && i < topBound);
        removeCards();
        addCards(newData);
    };

    const eventPagination = event => {
        event.preventDefault();
        if (!event.target.classList.contains("page-active") &&
        (event.target.classList.contains('page-number') || event.target.classList.contains('trigger'))) {
            switchPage(event.target);
            addNewCards(data);
        }
    };

    startPage();
    
    
    pagination.removeEventListener('click', eventPagination);
    pagination.addEventListener('click', eventPagination);

};


//фильтер по фильмам
const filterFilms = (data, searchFilm) => {
    return data.filter(item => {
        if (!item.movies) return false;
        return [...item.movies].some(film => film.toLowerCase() === searchFilm.toLowerCase());
    });
};

//поиск по фильмам
const searchFilm = data => {
    const input = document.getElementById('search'),
        dropdown = document.querySelector('.dropdown'),
        formSearch = document.getElementById('form-search');

    data.forEach(item => listFilms = listFilms.concat(item.movies));
    listFilms = listFilms.filter((item, i) => listFilms.indexOf(item) === i && item !== undefined);

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

    const handlerFilm = event => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'li') {
            input.value = target.textContent;
            dropdown.textContent = '';
        }
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
        pagination(newData);
        removeCards();
        addCards(newData);
    });
};





getData(data => {
    pagination(data);
    addCards(data);
    searchFilm(data);
});

