function render(child, parentElement, replace = false) {
    if (replace) {
        parentElement.replaceChild(child, parentElement.lastElementChild);
        return child;
    }
    return parentElement.appendChild(child);
}

function createElement({
    tagName = 'div',
    attributes = {},
    content = null,
    useInnerHTML = false,
    children = [],
    events = []
}) {
    const element = document.createElement(tagName);

    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }

    if (content) {
        if (useInnerHTML) {
            element.innerHTML = content;
        } else {
            element.textContent = content;
        }
    }

    for (const child of children) {
        render(child, element);
    }

    for (const event of events) {
        element.addEventListener(event.name, event.handler);     
    }

    return element;
}

function createEvent(name, handler) {
    return { name, handler };
}

export {
    render,
    createElement,
    createEvent
};
