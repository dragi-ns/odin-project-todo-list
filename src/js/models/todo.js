import Task from "./task";
import Project from "./project";

class TodoList {
    static #projects = {
        default: {
            title: 'General',
            items: [
                new Project('Inbox', [
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                    new Task('task 1', 'description 1', Task.Priority.HIGH, new Date()),
                ], true, true, false),
                new Project('Today', [], false, true, true),
                new Project('Upcoming', [], false, true, true)
            ]
        },
        userProjects: {
            title: 'Projects',
            items: []
        }
    };
    
    static getProject(projectId) {
        for (const section in this.#projects) {
            const project = this.#projects[section].items.find((item) => item.id === projectId);
            if (project) {
                return project;
            }
        }
        return undefined;
    }

    static getProjectByName(projectName) {
        projectName = projectName.toLowerCase();
        for (const section in this.#projects) {
            const project = this.#projects[section].items.find((item) => item.name.toLowerCase() === projectName);
            if (project) {
                return project;
            }
        }
        return undefined;
    }

    static getDefaultProject() {
        return this.#projects.default.items.find((item) => item.perserve && !item.dummy);
    }

    static getProjects() {
        return Object.assign({}, this.#projects);
    }

    static getRealProjectsArray() {
        // :D
        const smartProjects = [];
        for (const section in this.#projects) {
            for (const project of this.#projects[section].items) {
                if (!project.dummy) {
                    smartProjects.push(project);
                }
            }
        }
        return smartProjects;
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

    static addProject(newProject) {
        const project = this.getProject(newProject.id);
        if (!project) {
            this.#projects.userProjects.items.push(newProject);
        }
        return newProject;
    }

    static addProjects(newProjects) {
        newProjects.forEach(this.addProject, this);
    }
}

export default TodoList;
