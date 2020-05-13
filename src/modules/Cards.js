//добавляем и удаляем информацию со страницы
class Cards {
    constructor(wrapperImage, nameHero, back, container, front) {
        this.DATA = {};
        this.myLocation = {};
        this._wrapperImage = document.querySelectorAll(wrapperImage);
        this._nameHero = document.querySelectorAll(nameHero);
        this._back = document.querySelectorAll(back);
        this._container = document.querySelectorAll(container);
        this._front = document.querySelectorAll(front);
    }
    //add
    addCards(data) {
        //идем циклом по всем карточкам
        for (let i = 0; i < this._container.length; i++) {
            //забываем стили загрузки
            this._container[i].classList.remove('loader-card');
            //добавляем информацию на фронтальную часть карты
            this.addFront(this._wrapperImage[i], this._nameHero[i], data[i], this._front[i]);
            //добавляем информацию на заднюю часть карты
            this.addBack(this._back[i], data[i]);
        }
        
    }

    addFront(img, name, dataItem, front) {
            //если информации нет добавляем класс и все
            if (!dataItem) {
                front.classList.add('none-card');
                return;
            }
            //создаем картинку
            const newImg = document.createElement('img');
            //присваиваем ссылку
            newImg.src = "dbHeroes-master/" + dataItem.photo;
            img.append(newImg);
            //вписываем имя и добавляем класс
            name.textContent = dataItem.name;
            name.parentNode.classList.add('name-active');
    
    }

    addBack(back, dataItem) {
        //если информации нет, то возвращаемся
        if (!dataItem) return;
            //добавляем див с информацией
            back.append(this.createDivForBack(dataItem));
            //добавляем возможность поворота карточек
            back.parentNode.classList.add('flipper-active');
    }

    createDivForBack(dataItem) {
        //создаем блок
        const div = document.createElement('div');
            //циклом проходтм по объекту dataItem
            for (let key in dataItem) {
                //если ключ не фото и не кино, то добавляем информацию "ключ: значение"
                //если ключ кино, то добавляеи информацию "ключ: значение, значение ..."
                if (key !== 'photo' && key !== 'movies') {
    
                    div.insertAdjacentHTML("beforeend", 
                    `<p>${key[0].toUpperCase() + key.slice(1)}: ${dataItem[key]}</p>`);
    
                } else if (key === 'movies') {
    
                    const arrLinks = dataItem[key].map((item, i, arr) => {
                        const a = document.createElement('a');
                        a.href = '#';
                        a.textContent = i !== arr.length - 1 ? item + ", " : item;
                        a.classList.add('film');
                        return a;
                    });
                    const p = document.createElement('p');
                    p.textContent = 'Movies: ';
                    arrLinks.forEach(elem => p.append(elem));
                    div.append(p);
    
                }
            }
            //возвращаем готовый блок
            return div;
    }

    //remove
    removeCards() {
        //делаем блоки с картинками пустыми
        this._wrapperImage.forEach(item => item.textContent = '');
        //делаем блоки с именами пустыми и забываем класс
        this._nameHero.forEach(item => {
            item.textContent = '';
            item.parentNode.classList.remove('name-active');
        });
        //делаем заднюю часть пустой и забываем класс для поворота
        this._back.forEach(item => {
            item.textContent = '';
            item.parentNode.classList.remove('flipper-active');
        });
        //добавляем класс загрузки
        this._container.forEach(item => {
            item.classList.add('loader-card');
        });
        //фильтруем по none-card после чего забываем этот клас
        [...this._front].filter(item => item.classList.contains('none-card'))
                    .forEach(item => item.classList.remove('none-card'));
        
    }

    createNewCards(newData) {
        //если длина новых карточек равна длине всех карточек, то забываем путь (All/Something)
        
        if (newData.length === this.DATA.data.length) {
            this.myLocation.removeLocation();
        }
        //забываем старые карточки и добавляем новые
        this.removeCards();
        this.addCards(newData);
    }

    eventListener() {
        //слушатель для возможности фильтра по фильму 
        //в разделе Movies на задней стороне карточки
        this._back.forEach(item => {
            item.addEventListener('click', event => {
                event.preventDefault();
                const target = event.target;
                if (target.classList.contains('film')) {
                    const film = target.textContent.replace(/,/, '');
                    this.DATA.filterFilm(film.trim());
                }
            });
        });
    }
    //инициализация объекта
    init(DATA, myLocation) {
        this.myLocation = myLocation;
        this.DATA = DATA;
        this.addCards(DATA.data);
        this.eventListener();
    }
}
export default Cards;