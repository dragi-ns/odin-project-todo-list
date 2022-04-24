import { format } from 'date-fns';
import { render, createElement, createButton, createEvent } from './utils';
import { createModal, closeModal } from './modal';
import { createProject } from './project';
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
                console.log(TodoList.getDefaultProject());
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
                const parentElement = event.currentTarget.closest('.task');
                parentElement.classList.toggle('expanded');
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
                console.log('edit task');
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
                console.log('delete task');
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
            }),
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
                        const projectId = event.currentTarget.dataset.projectId;
        
                        const currentActiveProject = TodoList.getActiveProject();
                        document.querySelector(`#project-navigation [data-project-id="${currentActiveProject.id}"]`).classList.remove('active');
                        currentActiveProject.active = false;
        
                        const nextActiveProject = TodoList.getProjectById(projectId) ?? TodoList.getDefaultProject();
                        nextActiveProject.active = true;
                        document.querySelector(`#project-navigation [data-project-id="${nextActiveProject.id}"]`).classList.add('active');
        
                        render(
                            createProject(nextActiveProject), 
                            document.querySelector('#main'),
                            true
                        );
                    }) 
                ]
            })
        ]
    });
}

function createNewTaskForm() {
    return createElement({
        tagName: 'form',
        attributes: {
            id: 'new-task-form',
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
                            placeholder: 'Nothing to see here for now...',
                            maxlength: 256
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
                            value: format(new Date(), 'yyyy-MM-dd'),
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
                            if (index === 0) {
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
                            if (project.active) {
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
                const newTask = new Task(
                    form.elements['task-title'].value,
                    form.elements['task-description'].value,
                    new Date(form.elements['task-due-date'].value),
                    form.elements['task-priority'].value
                );
                const project = TodoList.getProjectById(form.elements['task-project'].value) ?? TodoList.getDefaultProject();
                project.addTask(newTask);

                if (project.active) {
                    const tasksContainer = document.querySelector(`#project[data-project-id="${project.id}"] .tasks`);
                    if (tasksContainer) {
                        render(createTask(newTask), tasksContainer);
                    }
                }
                closeModal(form.closest('.modal'));
            })
        ]
    });
}

function createNewTaskModal() {
    return createModal({
        attributes: {
            id: 'new-task-modal',
            class: 'modal'
        },
        title: 'New Task',
        cardBodyChildren: [
            createNewTaskForm()
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
                btnText: 'Add Task',
                btnAttributes: {
                    class: 'btn btn--primary',
                    type: 'submit',
                    form: 'new-task-form'
                },
                iconAttributes: {
                    class: 'mdi mdi-plus'
                }
            })
        ]
    });
}

export {
    createTask,
    createNewTaskModal 
};
