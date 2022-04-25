import Task from "./task";
import Project from "./project";

class TodoList {
    static #projects = {
        default: {
            title: 'General',
            items: [
                new Project('Inbox', [
                    new Task('task 1', 'description 1', new Date(2022, 2, 26), Task.Priority.HIGH)
                ], true, true, false),
                new Project('Today', [], false, true, true),
                new Project('Upcoming', [], false, true, true)
            ]
        },
        userProjects: {
            title: 'Projects',
            items: [
                new Project('Work')
            ]
        }
    };
    
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
        }
        return newProject;
    }

    static addProjects(newProjects) {
        newProjects.forEach(this.addProject, this);
        return newProjects;
    }

    static removeProject(project) {
        this.#projects.userProjects.items = this.#projects.userProjects.items.filter((item) => item.id === project.id);
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

    static addTask(projectId, newTask) {
        const project = this.getProjectById(projectId) ?? this.getDefaultProject();
        project.addTask(newTask);
        return project;
    }

    static addTasks(projectId, newTasks) {
        const project = this.getProjectById(projectId) ?? this.getDefaultProject();
        project.addTasks(newTasks);
        return newTasks;
    }
}

export default TodoList;
