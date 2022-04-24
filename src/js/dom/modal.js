import { createElement, createEvent } from './utils';

function createModal(options) {
    return createElement(
        Object.assign(options, { children: [ createModalCard(options) ] })
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
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'btn btn--square btn--medium btn--borderless modal-close-button'
        },
        children: [
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'sr-only'
                },
                content: 'Close modal'
            }),
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'mdi mdi-close'
                }
            })
        ],
        events: [
            createEvent('click', (event) => {
                const modal = event.currentTarget.closest('.modal');
                modal.remove();
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

export {
    createModal
};
