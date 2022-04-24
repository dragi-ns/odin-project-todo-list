import { createElement, createEvent, render } from './utils';
import { createProject, createNewProjectModal } from './project';
import TodoList from '../models/todo.js';

function createNavigation(options, sections) {
    if (!options.hasOwnProperty('children')) {
        // TODO: This changes options object, maybe I should make a new object?
        Object.assign(options, {
            children: Object.keys(sections).map((sectionName) => {
                return createNavigationSection(sectionName, sections[sectionName])
            })
        });
    }
    const navigationContainer = createElement(options);
    initialize_navigation_toggle(navigationContainer);
    return navigationContainer;
}

function createNavigationSection(sectionName, section) {
    const attributes = {
        class: 'navigation-section'
    };
    const userProjects = sectionName === 'userProjects';
    if (userProjects) {
        attributes.id = 'user-projects';
    }
    return createElement({
        attributes,
        children: [
            createSectionHeader(section.title, userProjects),
            createSectionItems(section.items)
        ]
    });
}

function createSectionHeader(title, action = false) {
    const children = [
        createSectionHeaderTitle(title)
    ];
    if (action) {
        children.push(createSectionHeaderAction());
    }
    return createElement({
        tagName: 'header',
        attributes: {
            class: 'navigation-section-header'
        },
        children
    });
}

function createSectionHeaderTitle(title) {
    return createElement({
        tagName: 'p',
        attributes: {
            class: 'navigation-section-title uppercase'
        },
        content: title
    });
}

function createSectionHeaderAction() {
    return createElement({
        attributes: {
            class: 'navigation-section-actions'
        },
        children: [
            createElement({
                tagName: 'button',
                attributes: {
                    class: 'btn btn--square btn--medium new-project-modal-open'
                },
                children: [
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'sr-only'
                        },
                        content: 'New Project'
                    }),
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'mdi mdi-plus-box-outline'
                        }
                    })
                ],
                events: [
                    createEvent('click', () => {
                        render(createNewProjectModal(), document.body);
                    })
                ]
            })
        ]
    });
}

function createSectionItems(items) {
    const children = [];
    if (items.length === 0) {
        children.push(createElement({
            tagName: 'p',
            content: 'There are no projects!'
        }));
    } else {
        children.push(...items.map((item) => createSectionItem(item)));
    }
    return createElement({
        attributes: {
            class: 'navigation-section-items'
        },
        children
    });
}

function createSectionItem(item) {
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'navigation-section-item btn' + (item.active ? ' active' : ''),
            'data-project-id': item.id
        },
        content: item.name,
        events: [
            createEvent('click', (event) => {
                const projectId = event.currentTarget.dataset.projectId;
                const project = TodoList.getProject(projectId) ?? TodoList.getDefaultProject();
                document.querySelector(`#project-navigation [data-project-id="${TodoList.getActiveProject().id}"]`).classList.remove('active');
                TodoList.getActiveProject().active = false;
                project.active = true;
                document.querySelector(`#project-navigation [data-project-id="${project.id}"]`).classList.add('active');
                render(
                    createProject({
                        tagName: 'section',
                        attributes: {
                            id: 'project',
                            class: 'project',
                            'data-project-id': project.id
                        }
                    }, project), 
                    document.querySelector('#main'),
                    true
                );
            })
        ]
    });
}

function initialize_navigation_toggle(navigation) {
    const navigationToggle = document.querySelector(`[aria-controls="${navigation.getAttribute('id')}"]`);
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
    createNavigation,
    createSectionItem
};
