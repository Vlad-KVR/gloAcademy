'use strict';

//delete adv
document.querySelector(".adv").remove();


//sort books
let containerBooks = document.querySelector(".books");

let books = document.querySelectorAll(".book");

containerBooks.prepend(books[2]);
containerBooks.prepend(books[5]);
containerBooks.prepend(books[3]);
containerBooks.prepend(books[4]);
containerBooks.prepend(books[0]);
containerBooks.prepend(books[1]);

//replace backImage
document.body.style.backgroundImage = "url(./image/you-dont-know-js.jpg)";

//correction book3
books[4].querySelector("h2>a").textContent = "Книга 3. this и Прототипы Объектов";

//Book2 sort ul
let liBook2 = books[0].querySelectorAll("ul>li");

liBook2[liBook2.length-1].before(liBook2[2]);
liBook2[3].after(liBook2[6]);
liBook2[6].after(liBook2[8]);

//Book5 sort ul
let liBook5 = books[5].querySelectorAll("ul>li");

liBook5[liBook5.length-3].before(liBook5[5]);
liBook5[3].before(liBook5[liBook5.length-2]);
liBook5[6].before(liBook5[2]);

//add chapter to book6
let li = document.createElement("li");
li.textContent = "Глава 8: За пределами ES6";

books[2].querySelectorAll("ul>li")[8].after(li);

