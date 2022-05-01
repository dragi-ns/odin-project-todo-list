import { v4 as uuidv4 } from 'uuid';

class Task {
    #id;
    #dueDate;

    static Priority = Object.freeze({
        NORMAL: 'normal',
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    }); 

    constructor(title, description, dueDate, priority, completed = false) {
        this.#id = uuidv4();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.projects = null;
    }

    static create(data) {
        const task = new Task();
        if (data.dueDate) {
            task.dueDate = data.dueDate;
            // TODO: Maybe I shouldn't modify passed 'data' object?
            delete data.dueDate;
        }
        return Object.assign(task, data);
    }

    get id() {
        return this.#id;
    }

    get dueDate() {
        return this.#dueDate;
    }

    set dueDate(newDate) {
        this.#dueDate = new Date(newDate);
        this.#dueDate.setHours(0, 0, 0, 0);
    }

    toggleCompleted() {
        this.completed = !this.completed;
        return this.completed;
    }

    update(data) {
        if (this.project.id !== data.project.id) {
            this.project.removeTask(this);
            data.project.addTask(this);
        }
        // TODO: Maybe I shouldn't modify passed 'data' object?
        delete data.project;
        return Object.assign(this, data);
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            completed: this.completed
        };
    }
}

export default Task;
