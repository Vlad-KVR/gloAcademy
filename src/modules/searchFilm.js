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
            message.style.display = 'flex';
            setTimeout(() => message.style.display = 'none', 2000);
            return;
        }

        if (!DATA.filterFilm(input.value)) {
            const message = document.querySelector('.modal-message');
            message.childNodes[1].textContent = "We don’t have such a movie";
            message.style.display = 'flex';
            setTimeout(() => message.style.display = 'none', 2000);
        }
        input.value = '';
        showFilms();
    });
};
export default searchFilm;