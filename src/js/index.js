import '../css/index.css';
import { render } from './dom/utils';
import { createNavigation, createProject } from './dom';
import TodoList from './models/todo';

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('#main');

    render(
        createNavigation({
            tagName: 'nav',
            attributes: {
                id: 'project-navigation',
                class: 'project-navigation',
                'data-visible': false 
            }
        }, TodoList.getProjects()),
        mainElement
    );

    render(
        createProject({
            tagName: 'section',
            attributes: {
                id: 'project',
                class: 'project',
                'data-project-id': TodoList.getDefaultProject().id
            }
        }, TodoList.getDefaultProject()),
        mainElement
    );
});
