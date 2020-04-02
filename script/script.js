'use strict';

const game = function() {

    const guessedNumber = Math.floor(Math.random()*100);
    let number = +prompt("Угадайте число от 1 до 100");

    const start = function() {
        
        if(number<guessedNumber||number>guessedNumber){

            let moreOrLess = number<guessedNumber ? "Загаданное число больше" :
            "Загаданное число меньше";
            if(!confirm(moreOrLess)) return;
            number = +prompt("Попробуйте еще раз или нажмите 'Отмена'");
            start();

        } else {
            alert("Вы угадали!");
        }

    };
    return start();
};

game();