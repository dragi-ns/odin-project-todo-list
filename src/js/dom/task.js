import { format } from 'date-fns';
import { render, createElement, createButton, createEvent } from './utils';
import { createModal, openModal, closeModal } from './modal';
import { createProject } from './project';
import { changeActiveProject } from './navigation';
import { isFormValid } from './form';
import { toTitleCase } from '../utils';
import Task from '../models/task';
import TodoList from '../models/todo';

function createTask(task) {
    return createElement({
        tagName: 'article',
        attributes: {
            class: 'task',
            'data-task-id': task.id,
            'data-task-priority': task.priority
        },
        children: [
            createTaskHeader(task),
            createTaskDetails(task)
        ]
    });
}

function createTaskHeader(task) {
    return createElement({
        tagName: 'header',
        attributes: {
            class: 'task-header'
        },
        children: [
            createTaskCompleteToggle(task.completed),
            createTaskSummary(task),
            createTaskActions()
        ]
    });
}

function createTaskCompleteToggle(completed) {
    const attributes = {
        type: 'checkbox',
        class: 'task-complete-toggle'
    };
    if (completed) {
        attributes['checked'] = 'checked';
    }
    return createElement({
        tagName: 'input',
        attributes,
        events: [
            createEvent('change', (event) => {
                const taskContainer = event.currentTarget.closest('.task');
                const taskModel = TodoList.getTask(taskContainer.dataset.taskId);
                taskModel.toggleCompleted();
            })
        ]
    });
}

function createTaskSummary(task) {
    return createElement({
        attributes: {
            class: 'task-summary'
        },
        children: [
            createTaskTitle(task.title),
            createTaskDueDate(task.dueDate)
        ],
        events: [
            createEvent('click', (event) => {
                event.currentTarget.closest('.task').classList.toggle('expanded');
            })
        ]
    });
}

function createTaskTitle(title) {
    return createElement({
        tagName: 'h2',
        attributes: {
            class: 'task-title'
        },
        content: title
    });
}

function createTaskDueDate(dueDate) {
    return createElement({
        tagName: 'p',
        attributes: {
            class: 'task-due-date'
        },
        content: format(dueDate, 'dd/MM/yyyy')
    });
}

function createTaskActions() {
    return createElement({
        attributes: {
            class: 'task-actions'
        },
        children: [
            createTaskEditAction(),
            createTaskDeleteAction()
        ]
    });
}

function createTaskEditAction() {
    return createButton({
        btnText: 'Edit Task',
        btnAttributes: {
            class: 'btn btn--square btn--medium edit-task-modal-open'
        },
        iconAttributes: {
            class: 'mdi mdi-square-edit-outline'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', (event) => {
                const taskModel = TodoList.getTask(
                    event.currentTarget.closest('.task').dataset.taskId
                );
                const modal = createTaskModal(taskModel);
                render(modal, document.body);
                openModal(modal);
            })
        ]
    });
}

function createTaskDeleteAction() {
    return createButton({
        btnText: 'Delete Task',
        btnAttributes: {
            class: 'btn btn--square btn--medium delete-task-modal-open'
        },
        iconAttributes: {
            class: 'mdi mdi-delete'
        },
        showOnlyIcon: true,
        events: [
            createEvent('click', (event) => {
                const taskModel = TodoList.getTask(
                    event.currentTarget.closest('.task').dataset.taskId
                );
                const modal = createTaskConfirmationModal(taskModel); 
                render(modal, document.body);
                openModal(modal);
            })
        ]
    });
}

function createTaskDetails(task) {
    return createElement({
        attributes: {
            class: 'task-details'
        },
        children: [
            createTaskDescription(task.description),
            createTaskPriority(task.priority),
            createTaskProject(task.project)
        ]
    });
}

function createTaskDescription(description) {
    return createElement({
        tagName: 'p',
        attributes: {
            class: 'task-description'
        },
        content: description
    });
}

function createTaskPriority(priority) {
    return createElement({
        tagName: 'p',
        attributes: {
            class: 'task-priority'
        },
        children: [
            createElement({
                tagName: 'span',
                content: 'Priority:'
            }),
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'task-priority-value'
                },
                content: toTitleCase(priority)
            })
        ]
    });
}

function createTaskProject(project) {
    return createElement({
        tagName: 'p',
        attributes: {
            class: 'task-project'
        },
        children: [
            createElement({
                tagName: 'span',
                content: 'Project:'
            }),
            createElement({
                tagName: 'a',
                attributes: {
                    href: '#',
                    class: 'task-project-value',
                    'data-project-id': project.id
                },
                content: project.name,
                events: [
                    createEvent('click', (event) => {
                        changeActiveProject(
                            TodoList.getProjectById(event.currentTarget.dataset.projectId)
                        );
                    }) 
                ]
            })
        ]
    });
}

function createTaskForm(taskModel = null) {
    return createElement({
        tagName: 'form',
        attributes: {
            id: 'task-form',
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
                            for: 'task-title'
                        },
                        content: 'Task Title'
                    }),
                    createElement({
                        tagName: 'input',
                        attributes: {
                            type: 'text',
                            name: 'task-title',
                            id: 'task-title',
                            placeholder: 'Go to the gym already buddy...',
                            maxlength: 32,
                            required: true,
                            autocomplete: 'off',
                            value: taskModel ? taskModel.title : ''
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
            }),
            createElement({
                attributes: {
                    class: 'form-field'
                },
                children: [
                    createElement({
                        tagName: 'label',
                        attributes: {
                            for: 'task-description'
                        },
                        content: 'Task Description'
                    }),
                    createElement({
                        tagName: 'textarea',
                        attributes: {
                            name: 'task-description',
                            id: 'task-description',
                            placeholder: 'Pick the closest gym go go go go go!',
                            maxlength: 256,
                        },
                        content: taskModel ? taskModel.description : '',
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
            }),
            createElement({
                attributes: {
                    class: 'form-field'
                },
                children: [
                    createElement({
                        tagName: 'label',
                        attributes: {
                            for: 'task-due-date'
                        },
                        content: 'Task Due Date'
                    }),
                    createElement({
                        tagName: 'input',
                        attributes: {
                            type: 'date',
                            name: 'task-due-date',
                            id: 'task-due-date',
                            min: format(new Date(), 'yyyy-MM-dd'),
                            value: taskModel ? format(taskModel.dueDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                            required: true
                        }
                    }),
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'error'
                        }
                    })
                ]
            }),
            createElement({
                attributes: {
                    class: 'form-field'
                },
                children: [
                    createElement({
                        tagName: 'label',
                        attributes: {
                            for: 'task-priority'
                        },
                        content: 'Task Priority'
                    }),
                    createElement({
                        tagName: 'select',
                        attributes: {
                            name: 'task-priority',
                            id: 'task-priority'
                        },
                        children: Object.values(Task.Priority).map((priority, index) => {
                            const attributes = {
                                value: priority
                            };
                            if (taskModel && taskModel.priority === priority || taskModel === null && index === 0) {
                                attributes.selected = true;
                            }
                            return createElement({
                                tagName: 'option',
                                attributes,
                                content: toTitleCase(priority)
                            })
                        })
                    }),
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'error'
                        }
                    })
                ]
            }),
            createElement({
                attributes: {
                    class: 'form-field'
                },
                children: [
                    createElement({
                        tagName: 'label',
                        attributes: {
                            for: 'task-project'
                        },
                        content: 'Task Project'
                    }),
                    createElement({
                        tagName: 'select',
                        attributes: {
                            name: 'task-project',
                            id: 'task-project'
                        },
                        children: TodoList.getProjects().map((project) => {
                            const attributes = {
                                value: project.id
                            };
                            if (taskModel && taskModel.project.id === project.id || taskModel === null && project.active) {
                                attributes.selected = true
                            }
                            return createElement({
                                tagName: 'option',
                                attributes,
                                content: project.name
                            })
                        })
                    }),
                    createElement({
                        tagName: 'span',
                        attributes: {
                            class: 'error'
                        }
                    })
                ]
            }),
        ],
        events: [
            createEvent('submit', (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                if (!isFormValid(form)) {
                    return;
                }
                if (taskModel) {
                    taskModel.title = form.elements['task-title'].value;
                    taskModel.description = form.elements['task-description'].value;
                    taskModel.dueDate = new Date(form.elements['task-due-date'].value);
                    taskModel.priority = form.elements['task-priority'].value;

                    const newProjectId = form.elements['task-project'].value;
                    const parentElement = document.querySelector('#project .tasks');
                    const oldChild = parentElement.querySelector(`[data-task-id="${taskModel.id}"]`);

                    if (taskModel.project.id !== newProjectId) {
                        taskModel.project.removeTask(taskModel);
                        TodoList.addTask(newProjectId, taskModel);

                        const currentActiveProject = TodoList.getActiveProject();
                        if (taskModel.project.id !== currentActiveProject.id && !currentActiveProject.dummy) {
                            parentElement.removeChild(oldChild);
                            if (parentElement.children.length === 0) {
                                parentElement.appendChild(createElement({
                                    tagName: 'p',
                                    content: 'There are no tasks!'
                                }));
                            }
                        } else {
                            parentElement.replaceChild(createTask(taskModel), oldChild);
                        }
                    }
                } else {
                    const newTask = new Task(
                        form.elements['task-title'].value,
                        form.elements['task-description'].value,
                        new Date(form.elements['task-due-date'].value),
                        form.elements['task-priority'].value
                    );
                    TodoList.addTask(form.elements['task-project'].value, newTask);

                    if (newTask.project.active) {
                        const tasksContainer = document.querySelector(`#project[data-project-id="${newTask.project.id}"] .tasks`);
                        if (tasksContainer) {
                            render(
                                createTask(newTask),
                                tasksContainer,
                                tasksContainer.children.length === 1 && tasksContainer.children[0].tagName.toLowerCase() === 'p'
                            );
                        }
                    }
                }
                closeModal(form.closest('.modal'));
            })
        ]
    });
}

function createTaskModal(taskModel = null) {
    return createModal({
        attributes: {
            id: 'task-modal',
            class: 'modal'
        },
        title: taskModel ? 'Edit Task' : 'New Task',
        cardBodyChildren: [
            createTaskForm(taskModel)
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
                btnText: taskModel ? 'Save Changes' : 'Add Task',
                btnAttributes: {
                    class: 'btn btn--primary',
                    type: 'submit',
                    form: 'task-form'
                },
                iconAttributes: {
                    class: 'mdi mdi-plus'
                }
            })
        ]
    });
}

function createTaskConfirmationModal(taskModel) {
    return createModal({
        attributes: {
            id: 'task-confirmation-modal',
            class: 'modal'
        },
        title: 'Confirmation',
        cardBodyChildren: [
            createElement({
                tagName: 'p',
                content: `Are you sure you want to delete "${taskModel.title}" task?`
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
                        taskModel.project.removeTask(taskModel);

                        const parentElement = document.querySelector('#project .tasks');
                        const oldChild = parentElement.querySelector(`[data-task-id="${taskModel.id}"]`);
                        parentElement.removeChild(oldChild);
                        if (parentElement.children.length === 0) {
                            render(
                                createElement({ tagName: 'p', content: 'There are no tasks!'}),
                                parentElement 
                            );
                        }
                        closeModal(event.currentTarget.closest('.modal'));
                    })
                ]
            })
        ]
    });
}

export {
    createTask,
    createTaskModal
};
