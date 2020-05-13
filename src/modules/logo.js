//лого
const logo = (DATA, pagination, cards) => {
    document.querySelector('img').addEventListener('click', () => {
        pagination.refresh(DATA.data);
        cards.createNewCards(DATA.data);
    });
};
export default logo;