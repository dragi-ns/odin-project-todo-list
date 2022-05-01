import { 
    render, 
    createElement, 
    createEvent, 
    createButton
} from './utils';
import { createTask, createTaskModal } from './task';
import { createModal, openModal, closeModal } from './modal';
import { isFormValid } from './form';
import { changeActiveProject, createSectionItem } from './navigation';
import { Todo, Project } from '../models';

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
                const modal = createTaskModal();
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
            class: 'btn btn--square btn--medium edit-project-modal-open'
        },
        iconAttributes: {
            class: 'mdi mdi-square-edit-outline'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', () => {
                const modal = createProjectModal(
                    Todo.getActiveProject()
                );
                render(modal, document.body);
                openModal(modal);
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
                const modal = createProjectConfirmationModal(Todo.getActiveProject());
                render(modal, document.body);
                openModal(modal);
            })
        ]
    });
}

function createProjectTasks(tasks) {
    const children = [];
    if (tasks.length === 0) {
        children.push(createElement({
            tagName: 'p',
            content: 'There are no tasks!'
        }));
    } else {
        children.push(...tasks.map((task) => createTask(task)));
    }
    return createElement({
        attributes: {
            class: 'tasks'
        },
        children
    });
}

function createProjectForm(projectModel = null) {
    return createElement({
        tagName: 'form',
        attributes: {
            id: 'project-form',
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
                            required: true,
                            value: projectModel ? projectModel.name : ''
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

                if (projectModel) {
                    const oldProjectName = projectModel.name;
                    Todo.updateProject(projectModel.id, {
                        name: form.elements['project-name'].value
                    });
                    if (projectModel.name !== oldProjectName) {
                        const parentElement = document.querySelector('#user-projects .navigation-section-items');
                        const oldChild = document.querySelector(`#user-projects [data-project-id="${projectModel.id}"]`);
                        const newChild = createSectionItem(projectModel);
                        parentElement.replaceChild(newChild, oldChild);
                        render(
                            createProject(projectModel), 
                            document.querySelector('#main'),
                            true
                        );
                    }
                } else {
                    const newProject = new Project(
                        form.elements['project-name'].value
                    );
                    Todo.addProject(newProject);

                    const userProjectsContainer = document.querySelector('#user-projects .navigation-section-items');
                    render(
                        createSectionItem(newProject),
                        userProjectsContainer,
                        userProjectsContainer.children.length === 1 && userProjectsContainer.children[0].tagName.toLowerCase() === 'p'
                    );

                    changeActiveProject(newProject);
                }

                closeModal(form.closest('.modal'));
            })
        ]
    });
}

function createProjectModal(projectModel = null) {
    return createModal({
        attributes: {
            id: 'project-modal',
            class: 'modal'
        },
        title: projectModel ? 'Edit Project' : 'New Project',
        cardBodyChildren: [
            createProjectForm(projectModel)
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
                btnText: projectModel ? 'Save Changes' : 'Add Project',
                btnAttributes: {
                    class: 'btn btn--primary',
                    type: 'submit',
                    form: 'project-form'
                },
                iconAttributes: {
                    class: 'mdi mdi-plus'
                }
            })
        ]
    });
}

function createProjectConfirmationModal(projectModel) {
    return createModal({
        attributes: {
            id: 'project-confirmation-modal',
            class: 'modal'
        },
        title: 'Confirmation',
        cardBodyChildren: [
            createElement({
                tagName: 'p',
                content: `Are you sure you want to delete "${projectModel.name}" project and it's tasks?`
            })
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
                btnText: 'Delete',
                btnAttributes: {
                    class: 'btn btn--primary',
                    type: 'submit',
                    form: 'project-form'
                },
                iconAttributes: {
                    class: 'mdi mdi-delete'
                },
                events: [
                    createEvent('click', (event) => {
                        const defaultProject = Todo.getDefaultProject();

                        document.querySelector(`#user-projects [data-project-id="${projectModel.id}"]`).remove();

                        const userProjectsContainer = document.querySelector('#user-projects .navigation-section-items');
                        if (userProjectsContainer.children.length === 0) {
                            render(
                                createElement({ tagName: 'p', content: 'There are no projects!'}),
                                userProjectsContainer
                            );
                        }

                        document.querySelector(`#project-navigation [data-project-id="${defaultProject.id}"]`).classList.add('active');
                        render(
                            createProject(defaultProject), 
                            document.querySelector('#main'),
                            true
                        );

                        Todo.changeActiveProject(defaultProject.id);
                        Todo.removeProject(projectModel.id);

                        closeModal(event.currentTarget.closest('.modal'));
                    })
                ]
            })
        ]
    });
}

export {
    createProject,
    createProjectModal
};
