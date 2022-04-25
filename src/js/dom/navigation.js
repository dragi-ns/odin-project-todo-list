import { isEqual, isAfter } from 'date-fns';
import { createButton, createElement, createEvent, render } from './utils';
import { createProject, createNewProjectModal } from './project';
import { openModal } from './modal';
import TodoList from '../models/todo.js';

function createNavigation(sections) {
    const navigationContainer = createElement({
        tagName: 'nav',
        attributes: {
            id: 'project-navigation',
            class: 'project-navigation',
            'data-visible': false 
        },
        children: Object.keys(sections).map((sectionName) => {
            return createNavigationSection(sectionName, sections[sectionName])
        })
    });
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
            createButton({
                btnText: 'New Project',
                btnAttributes: {
                    class: 'btn btn--square btn--medium new-project-modal-open'
                },
                iconAttributes: {
                    class: 'mdi mdi-plus-box-outline'
                },
                showOnlyIcon: true,
                events: [
                    createEvent('click', () => {
                        const modal = createNewProjectModal();
                        render(modal, document.body);
                        openModal(modal);
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
                const currentActiveProject = TodoList.getActiveProject();

                if (projectId === currentActiveProject.id) {
                    return;
                }

                document.querySelector(`#project-navigation [data-project-id="${currentActiveProject.id}"]`).classList.remove('active');
                currentActiveProject.active = false;

                const nextActiveProject = TodoList.getProjectById(projectId) ?? TodoList.getDefaultProject();
                nextActiveProject.active = true;
                document.querySelector(`#project-navigation [data-project-id="${nextActiveProject.id}"]`).classList.add('active');

                if (nextActiveProject.dummy) {
                    if (nextActiveProject.name === 'Today') {
                        let tasks = TodoList.getTasks();
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        tasks = tasks.filter((task) => isEqual(task.dueDate, today));
                        nextActiveProject.addTasks(tasks, false);
                    } else if (nextActiveProject.name === 'Upcoming') {
                        let tasks = TodoList.getTasks();
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        tasks = tasks.filter((task) => isEqual(task.dueDate, today) || isAfter(task.dueDate, today));
                        nextActiveProject.addTasks(tasks, false);
                    }
                }

                render(
                    createProject(nextActiveProject), 
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
