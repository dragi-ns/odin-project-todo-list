import '../css/index.css';
import { render } from './dom/utils';
import { createNavigation, createProject } from './dom';
import TodoList from './models/todo';

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('#main');

    render(
        createNavigation(TodoList.getSections()),
        mainElement
    );

    render(
        createProject(TodoList.getActiveProject()),
        mainElement
    );
});
