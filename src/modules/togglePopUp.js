const togglePopUp = () => {
    const popUp = document.querySelector('.popup'),
        popUpBtn = document.querySelectorAll('.popup-btn'),
        popUpContent = document.querySelector('.popup-content');
        

    const animationPopUp = () => {
        popUp.style.marginLeft = '-100%';
        if (window.innerWidth < 768) {
            popUp.style.display = popUp.style.display === 'block' ? '' : 'block';
            return;
        }

        let number = popUp.style.display === 'block' ? '2%' : '-100%';
        popUpContent.style.marginLeft = number;
        popUp.style.display = 'block';

        const idInterval = setInterval(() => {

            if (popUpContent.style.marginLeft === '0%' ||
            popUpContent.style.marginLeft === '100%') {

                //popUp.style.marginLeft = '0%';
                popUpContent.style.marginLeft = '0%';
                clearInterval(idInterval);
                return;

            }

            number = Number.parseInt(popUpContent.style.marginLeft) + 2;
            popUpContent.style.marginLeft = number + '%';
            //popUp.style.marginLeft = number + '%';

        }, 10);

    };

    popUpBtn.forEach(elem => {
        elem.addEventListener('click', animationPopUp);
    });

    // popUpClose.addEventListener('click', () => {
    // 	animationPopUp();
    // 	setTimeout(() => { popUp.style.display = ''; }, 1000);
    // });

    popUp.addEventListener('click', event => {
        let target = event.target;

        if (target.classList.contains('popup-close')) {
            target = null;
        } else {
            target = target.closest('.popup-content');
        }

        if (!target) {
            animationPopUp();
            setTimeout(() => { popUp.style.display = ''; }, 500);
        }

    });

};

export default togglePopUp;