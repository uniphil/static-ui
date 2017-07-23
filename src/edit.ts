import {
    DomNode,
    Group,
    GroupMap,
    GroupNode,
    UiNode,
    Value,
} from './ast';

function e(name: string, classes: Array<string>, ...children: Array<HTMLElement | string>) {
    const el = document.createElement(name);
    el.classList.add(...classes);
    children.forEach((child: HTMLElement | string) =>
        typeof child === 'string'
            ? el.appendChild(document.createTextNode(child))
            : el.appendChild(child));
    return el;
}


function editDomNode(dom: DomNode) {
    const el = e('div', ['child', 'dom'],
        e('h4', ['name'], dom.name),
        e('div', ['children'],
            ...dom.children.map(editChild)));
    return el;
}


function editGroupNode(group: GroupNode) {
    const el = e('div', ['child', 'group'],
        e('h4', ['name'], group.name));
    return el;
}


function editValueNode(value: Value) {
    const literal = value.value;
    const content = e('span', ['literal', 'string'], `${literal.value}`);
    content.setAttribute('contenteditable', 'true');
    content.addEventListener('input', e => {
        const target = document.getElementById(`preview-${value.value.id}`);
        if (!target) { throw new Error(`preview out of sync, could not find #preview-${value.value.id}`) }
        target.textContent = (e.target as HTMLElement).textContent;
    });
    return e('p', ['child', 'value'], content);
}


function editChild(child: UiNode) {
    switch (child.type) {
        case "dom":   return editDomNode(child);
        case "group": return editGroupNode(child);
        case "value": return editValueNode(child);
    }
}


function editGroup(group: Group): HTMLElement {
    const el = e('div', ['group'],
        e('h3', ['name'], group.name),
        e('div', ['children'],
            ...group.children.map(editChild)));
    return el;
}

export default (groups: GroupMap) =>
    Object.keys(groups).map((name: string) =>
        editGroup(groups[name]));
