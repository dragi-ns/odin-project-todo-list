import { v4 as uuidv4 } from 'uuid';

class Project {
    #id;
    #tasks = [];

    constructor(name, tasks = [], active = false, preserve = false, dummy = false) {
        this.#id = uuidv4();
        this.name = name;
        this.active = active;
        this.perserve = preserve;
        this.dummy = dummy;
        this.addTasks(tasks);
    }

    get id() {
        return this.#id;
    }

    getTask(taskId) {
        return this.#tasks.find((task) => task.id === taskId);
    }
    
    getTasks() {
        return this.#tasks.slice(0);
    }

    addTask(newTask, reference = true) {
        const task = this.getTask(newTask.id);
        if (!task) {
            this.#tasks.push(newTask);
            if (reference) {
                newTask.project = this;
            }
        }
        return newTask;
    }

    addTasks(newTasks, reference = true) {
        newTasks.forEach((task) => this.addTask(task, reference));
        return newTasks;
    }

    removeTask(oldTask, dereference = true) {
        this.#tasks = this.#tasks.filter((task) => task.id !== oldTask.id);
        if (dereference) {
            oldTask.project = null;
        }
    }

    removeTasks(dereference = true) {
        if (dereference) {
            this.#tasks.forEach((task) => task.project = null);
        }
        this.#tasks = [];
    }
}

export default Project;
