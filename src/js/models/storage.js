import Project from './project';

class Storage {
    static #DEFAULT_DATA = {
        default: {
            title: 'General',
            items: [
                new Project('Inbox', [], true, true, false),
                new Project('Today', [], false, true, true),
                new Project('Upcoming', [], false, true, true)
            ]
        },
        userProjects: {
            title: 'Projects',
            items: []
        }
    };

    static loadProjects() {
        const data = localStorage.getItem('todoin');
        if (!data) {
            return this.#DEFAULT_DATA;
        }
        const parsedSections = JSON.parse(data);
        for (const parsedSection in parsedSections) {
            parsedSections[parsedSection].items = parsedSections[parsedSection].items.map((item) => Project.fromJSON(item))
        }
        return parsedSections;
    }

    static saveProjects(data) {
        localStorage.setItem('todoin', JSON.stringify(data));
    }
}

export default Storage;
