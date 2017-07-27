import {
    DomNode,
    Group,
    GroupNode,
    Node,
    UiNode,
    Value,
} from './ast';

import State from './state';


export type Edit = EditInit
                 | EditHover
                 | EditSelect
                 | EditValue;


export class EditInit {
    readonly editType = 'init';
}


export class EditHover {
    readonly editType = 'hover';
    readonly node?: Node;

    constructor(node?: Node) {
        this.node = node;
    }
}


export class EditSelect {
    readonly editType = 'select';
    readonly node?: Node;

    constructor(node?: Node) {
        this.node = node;
    }
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


function renderDomNode(dom: DomNode, onEdit: OnEdit) {
    const el = e('div', ['child', 'dom'],
        e('h4', ['name'], dom.name),
        e('div', ['children'],
            ...dom.children.map(child => renderChild(child, onEdit))));

    el.addEventListener('mouseover', _e => {
        onEdit(new EditHover(dom));
    }, true);
    el.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    el.addEventListener('click', _e => {
        onEdit(new EditSelect(dom));
    }, true);

    el.id = `editor-${dom.id}`;
    return el;
}


function renderGroupNode(group: GroupNode, onEdit: OnEdit) {
    const el = e('div', ['child', 'group'],
        e('h4', ['name'], group.name));

    el.addEventListener('mouseover', _e => {
        onEdit(new EditHover(group));
    }, true);
    el.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    el.addEventListener('click', _e => {
        onEdit(new EditSelect(group));
    }, true);

    el.id = `editor-${group.id}`;
    return el;
}


function renderValueNode(value: Value, onEdit: OnEdit) {
    const literal = value.value;
    const content = e('span', ['literal', 'string'], `${literal.value}`);
    content.setAttribute('contenteditable', 'true');

    content.addEventListener('mouseover', _e => {
        onEdit(new EditHover(value));
    }, true);
    content.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    const select: EventListener = _e => {
        onEdit(new EditSelect(value));
    };
    content.addEventListener('click', select, true);
    content.addEventListener('focus', select, true);
    content.addEventListener('blur', _e => {
        onEdit(new EditSelect());
    }, true);

    content.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            (e.target as HTMLElement).blur();
        }
    }, true);

    content.addEventListener('input', e => {
        const text = (e.target as HTMLElement).textContent;
        if (text === null) {
            throw new Error(`cannot edit a text node without text?`);
        }
        onEdit(new EditValue(literal.id, text));
    }, true);

    const el = e('p', ['child', 'value'], content);
    el.id = `editor-${value.id}`;
    return el;
}


function renderChild(child: UiNode, onEdit: OnEdit) {
    switch (child.type) {
        case "dom":   return renderDomNode(child, onEdit);
        case "group": return renderGroupNode(child, onEdit);
        case "value": return renderValueNode(child, onEdit);
    }
}


function renderGroup(group: Group, onEdit: OnEdit): HTMLElement {
    const name = e('h3', ['name'], group.name);

    name.addEventListener('mouseover', _e => {
        onEdit(new EditHover(group));
    }, true);
    name.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    name.addEventListener('click', _e => {
        onEdit(new EditSelect(group));
    }, true);

    const el = e('div', ['group'],
        name,
        e('div', ['children'],
            ...group.children.map(child => renderChild(child, onEdit))));

    el.id = `editor-${group.id}`;
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
