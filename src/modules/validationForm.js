const validationForm = () => {
    const formPhones = document.querySelectorAll('.form-phone'),
        formName = document.querySelectorAll('.form-name'),
        mess = document.querySelector('.mess');


    formPhones.forEach(item => {
        item.addEventListener('input', () => { 
            item.value = item.value.replace(/[^0-9+]/g, ''); 
        });
    });
    [...formName, mess].forEach(item => {
        item.addEventListener('input', () => {
            item.value = item.value.replace(/[^А-Яа-я.,!?()"';:\- ]/g, '');
        });
    });
};

export default validationForm;