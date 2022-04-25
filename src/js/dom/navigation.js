import { isEqual, isAfter } from 'date-fns';
import { createButton, createElement, createEvent, render } from './utils';
import { createProject, createProjectModal } from './project';
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
                        const modal = createProjectModal();
                        render(modal, document.body);
                        openModal(modal);
                    })
                ]
            })
        ]
    });
}

function createSectionItems(projectModels) {
    const children = [];
    if (projectModels.length === 0) {
        children.push(createElement({
            tagName: 'p',
            content: 'There are no projects!'
        }));
    } else {
        children.push(...projectModels.map((projectModel) => createSectionItem(projectModel)));
    }
    return createElement({
        attributes: {
            class: 'navigation-section-items'
        },
        children
    });
}

function createSectionItem(projectModel) {
    return createElement({
        tagName: 'baddTaskutton',
        attributes: {
            class: 'navigation-section-item btn' + (projectModel.active ? ' active' : ''),
            'data-project-id': projectModel.id
        },
        content: projectModel.name,
        events: [
            createEvent('click', () => {
                if (projectModel.dummy) {
                    if (projectModel.name === 'Today') {
                        projectModel.addTasks(TodoList.getTodaysTasks(), false);
                    } else if (projectModel.name === 'Upcoming') {
                        projectModel.addTasks(TodoList.getUpcomingTasks(), false);
                    }
                }
                changeActiveProject(projectModel);
            })
        ]
    });
}

function changeActiveProject(projectModel) {
    const currentActiveProjectModel = TodoList.getActiveProject();
    if (projectModel.id === currentActiveProjectModel.id) {
        return;
    }

    const currentActiveButton = document.querySelector(`#project-navigation [data-project-id="${currentActiveProjectModel.id}"]`);
    if (currentActiveButton) {
        currentActiveButton.classList.remove('active');
    }
    currentActiveProjectModel.active = false;

    const nextActiveButton = document.querySelector(`#project-navigation [data-project-id="${projectModel.id}"]`);
    if (nextActiveButton) {
        nextActiveButton.classList.add('active');
    }
    projectModel.active = true;

    render(
        createProject(projectModel), 
        document.querySelector('#main'),
        true
    );
}

function initialize_navigation_toggle(navigation) {
    const navigationToggle = document.querySelector(`[aria-controls="${navigation.getAttribute('id')}"]`);
    navigationToggle.addEventListener('click', () => {
        if (navigation.dataset.visible === 'true') {
            closeNavigation()    
        } else {
            openNavigation(); 
        }
    });

    function openNavigation() {
        navigation.dataset.visible = 'true';
        navigationToggle.setAttribute('aria-expanded', true);
    }

    function closeNavigation() {
        navigation.dataset.visible = 'false';
        navigationToggle.setAttribute('aria-expanded', false);
    }

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target !== navigationToggle && target.closest('#project-navigation') === null && navigation.dataset.visible === 'true') {
            closeNavigation()
        }
    });
}

export {
    createNavigation,
    createSectionItem,
    changeActiveProject
};
