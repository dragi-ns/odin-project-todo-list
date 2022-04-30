import { isEqual, isAfter } from "date-fns";
import Storage from "./storage";

class TodoList {
    static #projects = Storage.loadProjects();
    
    static getProjectById(projectId) {
        for (const section in this.#projects) {
            const project = this.#projects[section].items.find((item) => item.id === projectId);
            if (project) {
                return project;
            }
        }
        return undefined;
    }

    static getDefaultProject() {
        return this.#projects.default.items.find((item) => item.perserve && !item.dummy);
    }

    static getActiveProject() {
        for (const section in this.#projects) {
            for (const project of this.#projects[section].items) {
                if (project.active) {
                    return project;
                }
            }
        }
        return undefined;
    }

    static getSections() {
        return Object.assign({}, this.#projects);
    }

    static getProjects() {
        return Object.keys(this.#projects).reduce((aggregator, section) => {
            return aggregator.concat(this.#projects[section].items.filter((item) => !item.dummy))
        }, []);
    }

    static addProject(newProject) {
        const project = this.getProjectById(newProject.id);
        if (!project) {
            this.#projects.userProjects.items.push(newProject);
            Storage.saveProjects(this.#projects);
        }
        return newProject;
    }

    static addProjects(newProjects) {
        newProjects.forEach(this.addProject, this);
        return newProjects;
    }

    static updateProject(projectId, data) {
        const project = TodoList.getProjectById(projectId);
        if (!project) {
            return false;
        }
        project.update(data);
        Storage.saveProjects(this.#projects);
        return project;
    }

    static removeProject(project) {
        this.#projects.userProjects.items = this.#projects.userProjects.items.filter((item) => item.id !== project.id);
        Storage.saveProjects(this.#projects);
        return project;
    }

    static getTask(taskId) {
        for (const section in this.#projects) {
            for (const project of this.#projects[section].items) {
                const task = project.getTask(taskId);
                if (task) {
                    return task;
                }
            }
        }
        return undefined;
    }

    static getTasks() {
        return Object.keys(this.#projects).reduce((aggregator, section) => {
            const projects = this.#projects[section].items.filter((item) => !item.dummy);
            return aggregator.concat(...projects.map((project) => project.getTasks()));
        }, []);
    }

    static getTodaysTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.getTasks().filter((task) => isEqual(task.dueDate, today));
    }

    static getUpcomingTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.getTasks().filter((task) => isEqual(task.dueDate, today) || isAfter(task.dueDate, today));
    }

    static addTask(projectId, newTask) {
        const project = this.getProjectById(projectId) ?? this.getDefaultProject();
        project.addTask(newTask);
        Storage.saveProjects(this.#projects);
        return project;
    }

    static addTasks(projectId, newTasks) {
        const project = this.getProjectById(projectId) ?? this.getDefaultProject();
        project.addTasks(newTasks);
        return newTasks;
    }

    static updateTask(taskId, data) {
        const task = this.getTask(taskId);
        if (!task) {
            return false;
        }
        task.update(data);
        Storage.saveProjects(this.#projects);
        return task;
    }

    static removeTask(projectId, oldTask) {
        const project = this.getProjectById(projectId) ?? this.getDefaultProject();     
        project.removeTask(oldTask);
        Storage.saveProjects(this.#projects);
        return oldTask;
    }

    static toggleCompleted(taskId) {
        const task = this.getTask(taskId);
        if (!task) {
            return false;
        }
        const completed = task.toggleCompleted();
        Storage.saveProjects(this.#projects);
        return completed;
    }

    static changeActiveProject(newActiveProject) {
        const currentActiveProject = this.getActiveProject();
        currentActiveProject.active = false;
        newActiveProject.active = true;
        Storage.saveProjects(this.#projects);
    }
}

export default TodoList;
