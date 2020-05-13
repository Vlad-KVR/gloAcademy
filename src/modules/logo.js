//лого
const logo = DATA => {
    document.querySelector('img').addEventListener('click', () => {
        pagination.refresh(DATA.data);
        cards.createNewCards(DATA.data);
    });
};
export default logo;