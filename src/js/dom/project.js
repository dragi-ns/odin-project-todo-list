import { createElement, createEvent, render } from './utils';
import { createTask, createNewTaskModal } from './task';
import { createSectionItem } from './navigation';
import { createModal } from './modal';
import Project from '../models/project';
import TodoList from '../models/todo';

function createProject(options, project) {
    if (!options.hasOwnProperty('children')) {
        // NOTE: This changes options object, maybe I should make a copy?
        Object.assign(options, {
            children: [
                createProjectHeader(project),
                createProjectTasks(project.getTasks())
            ]
        });
    }
    return createElement(options);
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
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'btn btn--square btn--medium new-task-modal-open'
        },
        children: [
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'sr-only'
                },
                content: 'New Task'
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
                render(createNewTaskModal(), document.body);
            })
        ]
    });
}

function createProjectEditAction() {
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'btn btn--square btn--medium edit-project-modal-open'
        },
        children: [
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'sr-only'
                },
                content: 'Edit Project'
            }),
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'mdi mdi-square-edit-outline'
                }
            })
        ]
    });
}

function createProjectDeleteAction() {
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'btn btn--square btn--medium delete-project-modal-open'
        },
        children: [
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'sr-only'
                },
                content: 'Delete Project'
            }),
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'mdi mdi-delete'
                }
            })
        ]
    });
}

function createProjectTasks(tasks) {
    return createElement({
        attributes: {
            class: 'tasks'
        },
        children: tasks.map((task) => {
            return createTask({
                tagName: 'article',
                attributes: {
                    class: 'task',
                    'data-task-id': task.id
                }
            }, task);
        })
    });
}

function createNewProjectForm() {
    return createElement({
        tagName: 'form',
        attributes: {
            id: 'new-project-form'
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
                            placeholder: 'Work'
                        }
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
                const input = event.currentTarget.elements['project-name'];
                const projectName = input.value.trim();

                let msg = null;
                if (!projectName) {
                    msg = 'is required!';
                } else if (projectName.length > 16) {
                    msg = `should have maximum 16 characters; you entered ${projectName.length}!`; 
                } else if (TodoList.getProjectByName(projectName)) {
                    msg = 'is already taken!';
                } else {
                    const project = new Project(projectName);
                    TodoList.addProject(project);
                    const parentElement = document.querySelector('#user-projects .navigation-section-items');
                    render(
                        createSectionItem(project),
                        parentElement,
                        parentElement.children.length === 1 && parentElement.children[0].tagName.toLowerCase() === 'p'
                    );
                    const modal = event.currentTarget.closest('.modal');
                    modal.remove();
                }

                if (msg) {
                    const inputLabel = input.previousElementSibling.textContent;
                    const inputError = input.nextElementSibling;
                    inputError.textContent = `${inputLabel} ${msg}`;
                    return;
                }
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
            createElement({
                tagName: 'button',
                attributes: {
                    class: 'btn'
                },
                children: [
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'mdi mdi-close'
                        }
                    }),
                    createElement({
                        tagName: 'span',
                        content: 'Cancel'
                    })
                ],
                events: [
                    createEvent('click', (event) => {
                        const modal = event.currentTarget.closest('.modal');
                        modal.remove();
                    })
                ]
            }),
            createElement({
                tagName: 'button',
                attributes: {
                    class: 'btn',
                    type: 'submit',
                    form: 'new-project-form'
                },
                children: [
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'mdi mdi-plus'
                        }
                    }),
                    createElement({
                        tagName: 'span',
                        content: 'Add Project'
                    })
                ]
            })
        ]
    });
}

export {
    createProject,
    createNewProjectModal
};
