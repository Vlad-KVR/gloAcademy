/* eslint-disable prefer-const */
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
    const flipper = document.querySelectorAll('.flipper'),
        wrapperImage = document.querySelectorAll('.wrapper__image'),
        back = document.querySelectorAll('.back'),
        nameHero = document.querySelectorAll('.name-hero > h1');


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
            if (key !== 'photo') {
                div.insertAdjacentHTML("beforeend", 
                `<p>${key}: ${dataItem[key]}</p>`);
            }
        }
        back.append(div);
    };

    for (let i = 0; i < wrapperImage.length; i++) {
        addFront(wrapperImage[i], nameHero[i], data[i]);
        addBack(back[i], nameHero[i], data[i]);
    }

    // front.forEach(item => {
    //     addFront(item);
    // });
};











getData(data => addCards(data));

