/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
'use strict';


const flipper = document.querySelectorAll('.flipper'),
wrapperImage = document.querySelectorAll('.wrapper__image'),
back = document.querySelectorAll('.back'),
nameHero = document.querySelectorAll('.name-hero > h1');
let currentPage = 1;


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

//добавление карточек
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

    const countPage = Math.floor(data.length / 10);

    
    

    const togglePageActive = () => {
        if ((typeof currentPage) === 'number') return;
        currentPage.classList.toggle('page-active');
    };

    const startPage = target => {
        togglePageActive();
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
        let j = -2;
        pageNumbers.forEach(item => {
            item.textContent = targetNumber + j;
            j++;
        });
        currentPage = pageNumbers[2];
        togglePageActive();
    };
    
    const addLastPage = () => {
        console.log(pageNumbers);
        if (pageNumbers[3]) return;
        pagination.insertAdjacentHTML('beforeend', `<span>...</span>
                <a href="#" class="page-number">${countPage}</a>`);
        pageNumbers = document.querySelectorAll('.page-number');
    };

    const removeLastPage = () => {
        if (!pageNumbers[3]) return;
        document.querySelector('.pagination > span').remove();
        pageNumbers[3].remove();
        pageNumbers = document.querySelectorAll('.page-number'); 
    };

    const editPagination = () => {
        if (+pageNumbers[2].textContent === countPage) {
            removeLastPage();
        } else {
            addLastPage();
        }
    };

    const switchPage = target => {

        if (target.textContent === '1') {
            startPage(target);
            return;
        }
        if (target.textContent === countPage.toString()) {
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

    const addNewCards = () => {
        const topBound = +currentPage.textContent * 10,
            bottomBound = +currentPage.textContent * 10 - 10;
        console.log(topBound, bottomBound);
        const newData = data.filter((item, i) => i >= bottomBound && i < topBound);
        console.log(newData);
        removeCards();
        addCards(newData);
    };

    

    startPage();
    

    pagination.addEventListener('click', event => {
        event.preventDefault();
        if (!event.target.classList.contains("page-active") &&
        event.target.classList.contains('page-number')) {
            switchPage(event.target);
            addNewCards();
        }
    });

};








getData(data => {
    pagination(data);
    addCards(data);
});

