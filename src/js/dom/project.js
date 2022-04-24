import { render, createElement, createEvent, createButton} from './utils';
import { createTask, createNewTaskModal } from './task';
import { createModal, openModal, closeModal } from './modal';
import { isFormValid } from './form';
import { createSectionItem } from './navigation';
import Project from '../models/project';
import TodoList from '../models/todo';

function createProject(project) {
    return createElement({
        tagName: 'section',
        attributes: {
            id: 'project',
            class: 'project',
            'data-project-id': project.id
        },
        children: [
            createProjectHeader(project),
            createProjectTasks(project.getTasks())
        ]
    });
}

function createProjectHeader(project) {
    return createElement({
        tagName: 'header',
        attributes: {
            class: 'project-header'
        },
        children: [
            createProjectHeaderTitle(project.name),
            createProjectHeaderActions(project.perserve, project.dummy)
        ]
    });
}

function createProjectHeaderTitle(name) {
    return createElement({
        tagName: 'h1',
        attributes: {
            class: 'project-title'
        },
        content: name
    });
}

function createProjectHeaderActions(perserve, dummy) {
    const children = [];
    if (!dummy) {
        children.push(createProjectAddTaskAction());
    }
    if (!perserve) {
        children.push(
            createProjectEditAction(),
            createProjectDeleteAction()
        )
    }
    return createElement({
        attributes: {
            class: 'project-actions'
        },
        children
    });
}

function createProjectAddTaskAction() {
    return createButton({
        btnText: 'New Task',
        btnAttributes: {
            class: 'btn btn--square btn--medium new-task-modal-open'
        },
        iconAttributes: {
            class: 'mdi mdi-plus-box-outline'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', () => {
                const modal = createNewTaskModal();
                render(modal, document.body);
                openModal(modal);
            })
        ]
    });
}

function createProjectEditAction() {
    return createButton({
        btnText: 'Edit Project',
        btnAttributes: {
            class: 'btn btn--square btn--medium new-project-modal-open'
        },
        iconAttributes: {
            class: 'mdi mdi-square-edit-outline'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', () => {
                console.log('open edit project modal');
            })
        ]
    });
}

function createProjectDeleteAction() {
    return createButton({
        btnText: 'Delete Project',
        btnAttributes: {
            class: 'btn btn--square btn--medium delete-project-modal-open'
        },
        iconAttributes: {
            class: 'mdi mdi-delete'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', () => {
                console.log('open delete project modal');
            })
        ]
    });
}

function createProjectTasks(tasks) {
    return createElement({
        attributes: {
            class: 'tasks'
        },
        children: tasks.map((task) => createTask(task))
    });
}

function createNewProjectForm() {
    return createElement({
        tagName: 'form',
        attributes: {
            id: 'new-project-form',
            class: 'form',
            novalidate: true
        },
        children: [
            createElement({
                attributes: {
                    class: 'form-field'
                },
                children: [
                    createElement({
                        tagName: 'label',
                        attributes: {
                            for: 'project-name'
                        },
                        content: 'Project Name'
                    }),
                    createElement({
                        tagName: 'input',
                        attributes: {
                            type: 'text',
                            name: 'project-name',
                            id: 'project-name',
                            placeholder: 'Work',
                            maxlength: 16,
                            autocomplete: 'off',
                            required: true
                        },
                        events: [
                            createEvent('blur', (event) => {
                                const input = event.currentTarget;
                                input.value = input.value.trim();
                            })
                        ]
                    }),
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'error'
                        }
                    })
                ]
            })
        ],
        events: [
            createEvent('submit', (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                if (!isFormValid(form)) {
                    return;
                }
                const newProject = new Project(
                    form.elements['project-name'].value
                );
                TodoList.addProject(newProject);
                const userProjectsContainer = document.querySelector('#user-projects .navigation-section-items');
                render(
                    createSectionItem(newProject),
                    userProjectsContainer,
                    userProjectsContainer.children.length === 1 && userProjectsContainer.children[0].tagName.toLowerCase() === 'p'
                );
                closeModal(form.closest('.modal'));
            })
        ]
    });
}

function createNewProjectModal() {
    return createModal({
        attributes: {
            id: 'new-project-modal',
            class: 'modal'
        },
        title: 'New Project',
        cardBodyChildren: [
            createNewProjectForm()
        ],
        cardFooterChildren: [
            createButton({
                btnText: 'Cancel',
                btnAttributes: {
                    class: 'btn'
                },
                iconAttributes: {
                    class: 'mdi mdi-close'
                },
                events: [
                    createEvent('click', (event) => {
                        closeModal(event.currentTarget.closest('.modal'));
                    })
                ]
            }),
            createButton({
                btnText: 'Add Project',
                btnAttributes: {
                    class: 'btn btn--primary',
                    type: 'submit',
                    form: 'new-project-form'
                },
                iconAttributes: {
                    class: 'mdi mdi-plus'
                }
            })
        ]
    });
}

export {
    createProject,
    createNewProjectModal
};
