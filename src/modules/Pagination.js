class Pagination {
	constructor(cards) {
        this._cards = cards;
		this._data = [];
		this._pagination = document.querySelector('.pagination');
		this._pageNumbers = document.querySelectorAll('.page-number');
		this._countPage = 0;
		this._currentPage = 1;
	}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = newData;
		this._countPage = Math.ceil(newData.length / 10);
	}
	
	pageNumbersRefresh() {
        //проверяем существует ли "страница" и делаем по умолчанию 3
		for (let i = 0; i < 3; i++) {
			if (!this._pageNumbers[i]) {
				const copy = this._pageNumbers[0].cloneNode(true);
				copy.classList.remove('page-active');
				copy.textContent = i + 1;
				this._pagination.append(copy);
			}
        }
        //обновляем массив со страницами
		this._pageNumbers = document.querySelectorAll('.page-number');
	}

	togglePageActive() {
        //если текущая страница по типу номер, то возвращаемся
        if ((typeof this._currentPage) === 'number') return;
        //иначе добавляем класс
        this._currentPage.classList.toggle('page-active');
	}
	
	startPage() {
        //забываем активную страницу
        this.togglePageActive();

        //делаем текст для страниц "1" "2" "3"
        this._pageNumbers.forEach((item, i) => item.textContent = i + 1);
        //забываем начальную страницу что бы не было "1... 1 2 3"
        this.removeStartPage();
        //забываем последнюю страницу
        this.removeLastPage();
        //текущая страница сменяется и добавляется соответствующий класс
        this._currentPage = this._pageNumbers[0];
        this.togglePageActive();

        
        if (this._countPage > 3) {

            this.addLastPage();
    
        } else if (this._countPage < 3) {
			
            if (this._pageNumbers[2]) this._pageNumbers[2].remove();
            if (this._countPage < 2) this._pageNumbers[1].remove();
    
        }
        //обновляем массив со страницами
        this._pageNumbers = document.querySelectorAll('.page-number');
	}
	
	lastPage(target) {
        //забываем активную страницу и последнюю что бы не было "3 4 5 ...5"
        this.togglePageActive();
        this.removeLastPage();

        //номер нажатой страницы
        const targetNumber = +target.textContent;
        //если страниц больше 2 то отнимать будет 2, иначе 1
        let j = this._pageNumbers.length > 2 ? -2 : -1;
        //отнимаем j и прибавляем к ней 1
        this._pageNumbers.forEach(item => item.textContent = targetNumber + j++);
        //меняем текущую страницу и добавляем ей клас
		this._currentPage = this._pageNumbers[2] ? this._pageNumbers[2] : this._pageNumbers[1];
        this.togglePageActive();
        //если страниц больше трех, то добавляем начальную (1...)
        if (this._countPage > 3) this.addStartPage();
	}
	
	switchPage(target) {
        //если нажали 1 то запускаем startPage(target),
        // а если последнюю, то lastPage(target)
        if (target.textContent === '1') {
            this.startPage(target);
            return;
        } else if (target.textContent === this._countPage.toString()) {
            this.lastPage(target);
            return;
        }

        //забываем активную страницу
        this.togglePageActive();
        
        //номер нажатой страницы
        const targetNumber = +target.textContent;
        //сколько отнимаем
        let j = -1;
        //отнимаем) и прибавляем в конце 1 к j
        for (let i = 0; i < 3; i++) {
            this._pageNumbers[i].textContent = targetNumber + j++;
        }
		//меняем текущую страницу и делаем ее активной
		this._currentPage = this._pageNumbers[1];
        this.togglePageActive();
        //запускаем редактирование страниц 
        //(это для добавления/удаления "1..." и "...5")
        this.editPagination();
    }
    //добавление "...(последняя страница)"
    addLastPage() {
        if (document.getElementById('sp2')) return;
        this._pagination.insertAdjacentHTML('beforeend', `<span id="sp2">...</span>
                <a href="#" id="last-page" class="trigger">${this._countPage}</a>`);
    }
    //забывание последней страницы
    removeLastPage() {
        if (!document.getElementById('sp2')) return;
        document.getElementById('sp2').remove();
        document.getElementById('last-page').remove();
    }
    //добавление начальной страницы
    addStartPage() {
        if (document.getElementById('sp1')) return;
        this._pagination.insertAdjacentHTML('afterbegin', `<a href="#" id="start-page" class="trigger">1</a>
                <span id="sp1">...</span>`);
    }
    //забывание начальной страницы
    removeStartPage() {
        if (!document.getElementById('sp1')) return;
        document.getElementById('sp1').remove();
        document.getElementById('start-page').remove();
    }
    //редактирование начальной и последней страницы
    editPagination() {
        if (+this._pageNumbers[2].textContent === this._countPage) {
            this.removeLastPage();
        } else {
            this.addLastPage();
        }

        if (+this._pageNumbers[0].textContent === 1) {
            this.removeStartPage();
        } else {
            this.addStartPage();
        }
    }
    //добавление новых карточек
    addNewCards(data) {
        const topBound = +this._currentPage.textContent * 10,
			bottomBound = +this._currentPage.textContent * 10 - 10;
			
        const newData = data.filter((item, i) => i >= bottomBound && i < topBound);
        this._cards.createNewCards(newData);
	}
	//слушатель
	eventPagination(event) {
        event.preventDefault();
        if (!event.target.classList.contains("page-active") &&
        (event.target.classList.contains('page-number') || event.target.classList.contains('trigger'))) {
            this.switchPage(event.target);
            this.addNewCards(this._data);
        }
	}
	//начинаем слушать
	startEvent() {
		this._pagination.addEventListener('click', this.eventPagination.bind(this), false);
	}

	//remove по каким-то причинам не срабатывал и было два слушателя,
	// пришлось отказаться от removeEvent() 
	removeEvent() {
		this._pagination.removeEventListener('click', this.eventPagination.bind(this), false);
	}
    //инициализачия
	init(data) {
        this.data = data;		
		this.pageNumbersRefresh();
		this.startPage();
		this.startEvent();
	}
    //перезагрузка страниц
	refresh(newData) {
		this.data = newData;
		this.pageNumbersRefresh();
		this.startPage();
	}
}
export default Pagination;