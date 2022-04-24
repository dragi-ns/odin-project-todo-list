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

    addTask(newTask) {
        const task = this.getTask(newTask.id);
        if (!task) {
            this.#tasks.push(newTask);
            newTask.project = this;
        }
    }

    addTasks(newTasks) {
        newTasks.forEach(this.addTask, this);
    }
}

export default Project;
