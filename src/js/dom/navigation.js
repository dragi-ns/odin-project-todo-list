function init_navigation(navigationId) {
    const navigation = document.querySelector(`#${navigationId}`);
    const navigationToggle = document.querySelector(`[aria-controls="${navigationId}"]`);
    navigationToggle.addEventListener('click', () => {
        if (navigation.dataset.visible === 'true') {
            navigation.dataset.visible = 'false';
            navigationToggle.setAttribute('aria-expanded', false);
        } else {
            navigation.dataset.visible = 'true';
            navigationToggle.setAttribute('aria-expanded', true);
        }
    });
}

export {
    init_navigation
};
