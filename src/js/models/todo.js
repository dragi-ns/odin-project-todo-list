import { isEqual, isAfter, isBefore } from 'date-fns';
import { getTodaysDate } from '../utils';
import Project from './project';

class Todo {
    static #storage;
    static #projects;
    static #DEFAULT_DATA = {
        default: {
            title: 'General',
            items: [
                new Project('Inbox', [], true, true, false),
                new Project('Today', [], false, true, true),
                new Project('Upcoming', [], false, true, true)
            ]
        },
        userProjects: {
            title: 'Projects',
            items: []
        }
    }; 

    static initializeStorage(storage) {
        this.#storage = storage;
        let data = this.#storage.loadData();
        if (!data) {
            this.#projects = this.#DEFAULT_DATA;
        } else {
            for (const key in data) {
                data[key].items = data[key].items.map((item) => Project.create(item));
            }
            this.#projects = data;
        }

        this.getProjects(({ dummy }) => dummy).forEach((project) => {
            project.removeTasks();
            if (project.name === 'Today') {
                project.addTasks(this.getTodaysTasks());
            } else if (project.name === 'Upcoming') {
                project.addTasks(this.getUpcomingTasks());
            }
        });
    }
    
    static #getProject(findCallback) {
        for (const sectionKey in this.#projects) {
            const project = this.#projects[sectionKey].items.find(findCallback);
            if (project) {
                return project;
            }
        }
        return null;
    }

    static #saveProjects() {
        this.#storage.saveData(this.#projects);
    }

    static getProjectById(projectId) {
        return this.#getProject(({ id }) => id === projectId);
    }

    static getDefaultProject() {
        return this.#getProject(({ perserve, dummy }) => perserve && !dummy);
    }

    static getActiveProject() {
        return this.#getProject(({ active }) => active);
    }

    static getProjects(filterCallback = null) {
        return Object.values(this.#projects).reduce((aggregator, { items }) => {
            if (filterCallback) {
                return aggregator.concat(items.filter(filterCallback));
            }
            return aggregator.concat(items);
        }, []);
    }

    static getProjectsSections() {
        return Object.assign({}, this.#projects);
    }

    static addProject(newProject) {
        const project = this.getProjectById(newProject.id);
        if (project) {
            return newProject;
        }
        this.#projects.userProjects.items.push(newProject);
        this.#saveProjects();
        return newProject;
    }

    static updateProject(projectId, projectData) {
        const project = this.getProjectById(projectId);
        if (!project) {
            return null;
        }
        project.update(projectData);
        this.#saveProjects();
        return project;
    }

    static removeProject(projectId) {
        const project = this.getProjectById(projectId);
        if (!project) {
            return null;
        }
        this.#projects.userProjects.items = this.#projects.userProjects.items.filter(({ id }) => id !== project.id);
        this.#saveProjects();
        return project;
    }

    static changeActiveProject(projectId) {
        const newActiveProject = this.getProjectById(projectId);
        if (!newActiveProject) {
            return false;
        }
        const currentActiveProject = this.getActiveProject();
        currentActiveProject.active = false;
        newActiveProject.active = true;
        this.#saveProjects();
    }

    static getTaskById(taskId) {
        for (const sectionName in this.#projects) {
            for (const item of this.#projects[sectionName].items) {
                const task = item.getTaskById(taskId);
                if (task) {
                    return task;
                }
            }
        }
        return null;
    }

    static getTasks(filterCallback = null) {
        const tasks = this.getProjects(({ dummy }) => !dummy).flatMap((item) => item.getTasks());
        if (filterCallback) {
            return tasks.filter(filterCallback);
        }
        return tasks;
    }

    static getTodaysTasks() {
        const today = getTodaysDate();
        return this.getTasks(({ dueDate }) => isEqual(dueDate, today));
    }

    static getUpcomingTasks() {
        const today = getTodaysDate();
        return this.getTasks(({ dueDate }) => isEqual(dueDate, today) || isAfter(dueDate, today)).sort((taskA, taskB) => {
            // sort a before b
            if (isBefore(taskA.dueDate, taskB.dueDate)) {
                return -1;
            }
            // sort b before a
            if (isAfter(taskA.dueDate, taskB.dueDate)) {
                return 1;
            }
            // dont change order
            return 0;
        });
    }

    static addTask(projectId, newTask) {
        const project = this.getProjectById(projectId);
        if (!project) {
            return null;
        }
        project.addTask(newTask);
        this.#saveProjects();
        return newTask;
    }

    static updateTask(taskId, data) {
        const task = this.getTaskById(taskId);
        if (!task) {
            return null;
        }
        task.update(data);
        this.#saveProjects();
        return task;
    }

    static removeTask(taskId) {
        const projects = this.getProjects((project) => project.getTaskById(taskId));
        let removedTask = null;
        for (const project of projects) {
            const task = project.getTaskById(taskId);
            project.removeTask(task);
            if (!removedTask) {
                removedTask = task;
            }
        }
        this.#saveProjects();
        return removedTask;
    }

    static toggleCompleted(taskId) {
        const task = this.getTaskById(taskId);
        if (!task) {
            return false;
        }
        const completed = task.toggleCompleted();
        this.#saveProjects();
        return completed;
    }
}

export default Todo;
