import {
    DomNode,
    Group,
    GroupNode,
    UiNode,
    Value,
} from './ast';

import State from './state';


export type Edit = EditInit | EditValue;


export class EditInit {
    readonly editType = 'init';
}


export class EditValue {
    readonly editType = 'value';
    readonly id: string;
    readonly newValue: string;

    constructor(id: string, newValue: string) {
        this.id = id;
        this.newValue = newValue;
    }
}


export type OnEdit = ((payload: Edit) => void);


function e(name: string, classes: Array<string>,
           ...children: Array<HTMLElement | string>) {
    const el = document.createElement(name);
    el.classList.add(...classes);
    children.forEach((child: HTMLElement | string) =>
        typeof child === 'string'
            ? el.appendChild(document.createTextNode(child))
            : el.appendChild(child));
    return el;
}


function editDomNode(dom: DomNode, onEdit: OnEdit) {
    const el = e('div', ['child', 'dom'],
        e('h4', ['name'], dom.name),
        e('div', ['children'],
            ...dom.children.map(child => editChild(child, onEdit))));
    return el;
}


function editGroupNode(group: GroupNode, _onEdit: OnEdit) {
    const el = e('div', ['child', 'group'],
        e('h4', ['name'], group.name));
    return el;
}


function editValueNode(value: Value, onEdit: OnEdit) {
    const literal = value.value;
    const content = e('span', ['literal', 'string'], `${literal.value}`);
    content.setAttribute('contenteditable', 'true');
    content.addEventListener('input', e => {
        const text = (e.target as HTMLElement).textContent;
        if (text === null) {
            throw new Error(`cannot edit a text node without text?`);
        }
        onEdit(new EditValue(literal.id, text));
    });
    return e('p', ['child', 'value'], content);
}


function editChild(child: UiNode, onEdit: OnEdit) {
    switch (child.type) {
        case "dom":   return editDomNode(child, onEdit);
        case "group": return editGroupNode(child, onEdit);
        case "value": return editValueNode(child, onEdit);
    }
}


function renderGroup(group: Group, onEdit: OnEdit): HTMLElement {
    const el = e('div', ['group'],
        e('h3', ['name'], group.name),
        e('div', ['children'],
            ...group.children.map(child => editChild(child, onEdit))));
    return el;
}


export function render(el: HTMLElement, state: State, onEdit: OnEdit) {
    el.innerHTML = '';
    Object.keys(state.groups)
        .map((name: string) =>
            renderGroup(state.groups[name], onEdit))
        .forEach(childEl =>
            el.appendChild(childEl));
}
