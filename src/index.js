'use strict';

import Cards from './modules/Cards';
import Data from './modules/Data';
import MyLocation from './modules/MyLocation';
import Pagination from './modules/Pagination';
import logo from './modules/logo';
import menu from './modules/menu';
import searchFilm from './modules/searchFilm';



const cards = new Cards('.wrapper__image',
                        '.name-hero > h1',
                        '.back',
                        '.flip-container',
                        '.front');

const pagination = new Pagination(cards);

const DATA = new Data();

const myLocation = new MyLocation('.my-location');

fetch("./../dbHeroes-master/dbHeroes.json")
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