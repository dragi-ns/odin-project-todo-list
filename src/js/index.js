import '../css/index.css';
import { Todo, Storage } from './models';
import { createNavigation, createProject } from './dom';
import { render } from './dom/utils';

document.addEventListener('DOMContentLoaded', () => {
    Todo.initializeStorage(new Storage('todoin'));

    const mainElement = document.querySelector('#main');
    render(createNavigation(Todo.getProjectsSections()), mainElement);
    render(createProject(Todo.getActiveProject()), mainElement);
});
