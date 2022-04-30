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
        this.project = null;
    }

    get id() {
        return this.#id;
    }

    get dueDate() {
        return this.#dueDate;
    }

    set dueDate(newDate) {
        this.#dueDate = newDate;
        this.#dueDate.setHours(0, 0, 0, 0);
    }

    toggleCompleted() {
        this.completed = !this.completed;
        return this.completed;
    }

    update(data) {
        this.title = data.title;
        this.description = data.description;
        this.dueDate = data.dueDate;
        this.priority = data.priority;

        if (this.project.id !== data.project.id) {
            this.project.removeTask(this);
            data.project.addTask(this);
        }

        return this;
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

    static fromJSON(data) {
        return new Task(
            data.title,
            data.description,
            new Date(data.dueDate),
            data.priority,
            data.completed
        );
    }
}

export default Task;
