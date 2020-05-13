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
export default menu;