import { v4 as uuidv4 } from 'uuid';
import Task from './task';

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

    static create(data) {
        const project = new Project();
        if (data.tasks) {
            project.addTasks(data.tasks.map((task) => Task.create(task)));
            // TODO: Maybe I shouldn't modify passed 'data' object?
            delete data.tasks;
        }
        return Object.assign(project, data);
    }

    get id() {
        return this.#id;
    }

    update(data) {
        return Object.assign(this, data);
    }

    getTaskById(taskId) {
        return this.#tasks.find(({ id }) => id === taskId);
    }
    
    getTasks(filterCallback = null) {
        const copiedTasks = this.#tasks.slice(0);
        if (filterCallback) {
            return copiedTasks.filter(filterCallback);
        }
        return copiedTasks;
    }

    addTask(newTask) {
        const task = this.getTaskById(newTask.id);
        if (!task) {
            this.#tasks.push(newTask);
            if (!this.dummy) {
                newTask.project = this;
            }
        }
        return newTask;
    }

    addTasks(newTasks) {
        newTasks.forEach(this.addTask, this);
        return newTasks;
    }

    removeTask(oldTask) {
        this.#tasks = this.#tasks.filter(({ id }) => id !== oldTask.id);
        if (!this.dummy) {
            oldTask.project = null;
        }
        return oldTask;
    }

    removeTasks() {
        if (!this.dummy) {
            this.#tasks.forEach((task) => task.project = null);
        }
        const oldTasks = this.getTasks();
        this.#tasks = [];
        return oldTasks;
    }

    toJSON() {
        return {
            name: this.name,
            active: this.active,
            perserve: this.perserve,
            dummy: this.dummy,
            tasks: this.getTasks()
        };
    }
}

export default Project;
