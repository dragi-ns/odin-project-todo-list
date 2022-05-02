import { 
    createButton,
    createElement, 
    createEvent, 
    render 
} from './utils';
import { createProject, createProjectModal } from './project';
import { openModal } from './modal';
import { Todo } from '../models';

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
    return createElement({
        attributes: {
            class: 'navigation-section-items'
        },
        children: [...projectModels.map((projectModel) => createSectionItem(projectModel))]
    });
}

function createSectionItem(projectModel) {
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'navigation-section-item btn' + (projectModel.active ? ' active' : ''),
            'data-project-id': projectModel.id
        },
        content: projectModel.name,
        events: [
            createEvent('click', () => {
                if (projectModel.dummy) {
                    projectModel.removeTasks();
                    if (projectModel.name === 'Today') {
                        projectModel.addTasks(Todo.getTodaysTasks());
                    } else if (projectModel.name === 'Upcoming') {
                        projectModel.addTasks(Todo.getUpcomingTasks());
                    }
                }
                changeActiveProject(projectModel);
            })
        ]
    });
}

function changeActiveProject(projectModel) {
    const currentActiveProjectModel = Todo.getActiveProject();
    if (projectModel.id === currentActiveProjectModel.id) {
        return;
    }

    const currentActiveButton = document.querySelector(`#project-navigation [data-project-id="${currentActiveProjectModel.id}"]`);
    if (currentActiveButton) {
        currentActiveButton.classList.remove('active');
    }

    const nextActiveButton = document.querySelector(`#project-navigation [data-project-id="${projectModel.id}"]`);
    if (nextActiveButton) {
        nextActiveButton.classList.add('active');
    }

    Todo.changeActiveProject(projectModel.id);

    render(
        createProject(projectModel), 
        document.querySelector('#main'),
        true
    );

    closeNavigation(
        document.querySelector('#project-navigation'),
        document.querySelector('button[data-target="project-navigation"]')
    );
}

function initialize_navigation_toggle(navigation) {
    const navigationToggle = document.querySelector(`button[data-target="${navigation.getAttribute('id')}"]`);
    navigationToggle.addEventListener('click', () => {
        if (navigation.dataset.visible === 'true') {
            closeNavigation(navigation, navigationToggle);
        } else {
            openNavigation(navigation, navigationToggle); 
        }
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target !== navigationToggle && target.closest('#project-navigation') === null && navigation.dataset.visible === 'true') {
            closeNavigation(navigation, navigationToggle)
        }
    });
}

function openNavigation(navigation, navigationToggle) {
    navigation.dataset.visible = 'true';
    navigationToggle.setAttribute('data-expanded', true);
}

function closeNavigation(navigation, navigationToggle) {
    navigation.dataset.visible = 'false';
    navigationToggle.setAttribute('data-expanded', false);
}

export {
    createNavigation,
    createSectionItem,
    changeActiveProject
};
