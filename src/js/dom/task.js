import { format } from 'date-fns';
import { render, createElement, createEvent } from './utils';
import { createModal } from './modal';
import Task from '../models/task';
import TodoList from '../models/todo';

function createTask(options, task) {
    options.attributes['data-priority'] = task.priority;
    if (!options.hasOwnProperty('children')) {
        // NOTE: This changes options object, maybe I should make a copy?
        Object.assign(options, {
            children: [
                createTaskHeader(task),
                createTaskDetails(task)
            ]
        });
    }
    return createElement(options);
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
                const taskElement = event.currentTarget.closest('.task');
                const taskModel = TodoList.getTask(taskElement.dataset.taskId);
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
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'btn btn--square btn--medium edit-task-modal-open'
        },
        children: [
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'sr-only'
                },
                content: 'Edit Task'
            }),
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'mdi mdi-square-edit-outline'
                }
            })
        ],
        events: [
            createEvent('click', (event) => {
                console.log('Edit task');
            })
        ]
    });
}

function createTaskDeleteAction() {
    return createElement({
        tagName: 'button',
        attributes: {
            class: 'btn btn--square btn--medium delete-task-modal-open'
        },
        children: [
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'sr-only'
                },
                content: 'Delete Task'
            }),
            createElement({
                tagName: 'span',
                attributes: {
                    class: 'mdi mdi-delete'
                }
            })
        ],
        events: [
            createEvent('click', (event) => {
                console.log('Delete task');
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
            createTaskProject(task.project.name)
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
                content: priority
            }),
        ]
    });
}

function createTaskProject(projectName) {
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
                tagName: 'span',
                attributes: {
                    class: 'task-project-value'
                },
                content: projectName
            }),
        ]
    });
}

function createNewTaskForm() {
    console.log(TodoList.getRealProjectsArray());
    return createElement({
        tagName: 'form',
        attributes: {
            id: 'new-task-form'
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
                            placeholder: 'Go to the gym already buddy...'
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
                            for: 'task-description'
                        },
                        content: 'Task Description'
                    }),
                    createElement({
                        tagName: 'textarea',
                        attributes: {
                            name: 'task-description',
                            id: 'task-description',
                            placeholder: 'Nothing to see here for now...'
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
                            for: 'task-due-date'
                        },
                        content: 'Task Due Date'
                    }),
                    createElement({
                        tagName: 'input',
                        attributes: {
                            type: 'date',
                            name: 'task-due-date',
                            id: 'task-due-date'
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
                                content: priority
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
                        children: TodoList.getRealProjectsArray().map((project) => {
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
                const inputTaskTitle = event.currentTarget.elements['task-title'];
                const taskTitle = inputTaskTitle.value.trim();

                let msg = null;
                if (!taskTitle) {
                    msg = 'is required!';
                } else if (taskTitle.length > 32) {
                    msg = `should have maximum 32 characters; you entered ${taskTitle.length}!`; 
                } else {
                    const task = new Task(
                        taskTitle,
                        'Description',
                        Task.Priority.NORMAL,
                        new Date()
                    );
                    const project = TodoList.getActiveProject();
                    project.addTask(task);
                    const parentElement = document.querySelector('#project');
                    const tasksContainer = parentElement.querySelector('.tasks');
                    if (parentElement.dataset.projectId === project.id) {
                        render(
                            createTask({
                                tagName: 'article',
                                attributes: {
                                    class: 'task',
                                    'data-task-id': task.id
                                }
                            }, task),
                            tasksContainer,
                            tasksContainer.children.length === 1 && tasksContainer.children[0].tagName.toLowerCase() === 'p'
                        );
                    }
                    const modal = event.currentTarget.closest('.modal');
                    modal.remove();
                }

                if (msg) {
                    const inputLabel = inputTaskTitle.previousElementSibling.textContent;
                    const inputError = inputTaskTitle.nextElementSibling;
                    inputError.textContent = `${inputLabel} ${msg}`;
                    return;
                }
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
                    form: 'new-task-form'
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
                        content: 'Add Task'
                    })
                ]
            })
        ]
    });
}

export {
    createTask,
    createNewTaskModal 
};
