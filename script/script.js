/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
'use strict';

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

    request.send();
};


const addCards = data => {
    console.log(data);
    const flipper = document.querySelectorAll('.flipper');
    const front = document.querySelectorAll('.wrapper__image');
    const nameHero = document.querySelectorAll('.name-hero > h1');

    const addFront = (img, name, dataItem) => {
        const newImg = document.createElement('img');
        newImg.src = "dbHeroes-master/" + dataItem.photo;
        img.append(newImg);
        name.textContent = dataItem.name;
    };

    const addBack = () => {
        
    };

    for (let i = 0; i < front.length; i++) {
        addFront(front[i], nameHero[i], data[i]);
    }

    // front.forEach(item => {
    //     addFront(item);
    // });
};











getData(data => addCards(data));

