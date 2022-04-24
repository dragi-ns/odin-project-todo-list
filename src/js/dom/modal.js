import { createElement, createButton, createEvent } from './utils';

function createModal(options) {
    return createElement(
        Object.assign(
            options, 
            { 
                children: [
                createModalCard(options) 
                ],
                events: [
                    createEvent('click', (event) => {
                        const target = event.target;
                        if (target.classList.contains('modal')) {
                            closeModal(target);
                        }
                    }),
                    createEvent('keydown', (event) => {
                        if (event.key === 'Escape') {
                            closeModal(event.currentTarget);
                        }
                    }),
                    createEvent('animationend', (event) => {
                        const modal = event.currentTarget;
                        if (modal.classList.contains('inactive')) {
                            modal.remove();
                        }
                    })
                ]
            }
        )
    );
}

function createModalCard({
    title = 'Modal',
    cardBodyChildren = [],
    cardFooterChildren = [] 
}) {
    const children = [
        createModalCloseButton(),
        createModalCardHeader(title)
    ];

    if (Array.isArray(cardBodyChildren) && cardBodyChildren.length !== 0) {
        children.push(createModalCardBody(cardBodyChildren));
    }

    if (Array.isArray(cardFooterChildren) && cardFooterChildren.length !== 0) {
        children.push(createModalCardFooter(cardFooterChildren));
    }

    return createElement({
        tagName: 'article',
        attributes: {
            class: 'modal-card'
        },
        children
    });
}

function createModalCloseButton() {
    return createButton({
        btnText: 'Close modal',
        btnAttributes: {
            class: 'btn btn--square btn--medium btn--borderless modal-close-button'
        },
        iconAttributes: {
            class: 'mdi mdi-close'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', (event) => {
                closeModal(event.currentTarget.closest('.modal'));
            })
        ]
    });
}

function createModalCardHeader(title) {
    return createElement({
        tagName: 'header',
        attributes: {
            class: 'modal-card-header'
        },
        content: title
    });
}

function createModalCardBody(children) {
    return createElement({
        attributes: {
            class: 'modal-card-body'
        },
        children
    });
}

function createModalCardFooter(children) {
    return createElement({
        tagName: 'footer',
        attributes: {
            class: 'modal-card-footer'
        },
        children
    });
}

function openModal(modal) {
    document.documentElement.classList.add('clipped');
    modal.classList.remove('inactive');
    modal.classList.add('active');

    const modalForm = modal.querySelector('form');
    if (modalForm) {
        modalForm.elements[0].focus();
    }
}

function closeModal(modal) {
    document.documentElement.classList.remove('clipped');
    modal.classList.remove('active');
    modal.classList.add('inactive');
}

export {
    createModal,
    openModal,
    closeModal
};
