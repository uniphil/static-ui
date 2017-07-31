import {
    DomNode,
    Group,
    GroupNode,
    Node,
    UiNode,
    Value,
} from './state/ast';
import {
    EditHover,
    EditSelect,
    ValueSelection,
} from './state/content';
import e from './e';
import State, {
    OnEdit,
} from './state';


function renderDomNode(dom: DomNode, onEdit: OnEdit, state: State) {
    const el = e('div', ['child', 'dom'],
        e('h4', ['name'], dom.name),
        e('div', ['children'],
            ...dom.children.map(child => renderChild(child, onEdit, state))));

    el.addEventListener('mouseover', _e => {
        onEdit(new EditHover(dom.id));
    }, true);
    el.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    // el.addEventListener('click', e => {
    //     onEdit(new EditSelect(dom));
    //     e.stopPropagation();
    // }, false);

    el.id = `editor-${dom.id}`;
    return el;
}


function showDomOptions(pane: HTMLElement, anchor: HTMLElement, node: DomNode,
                        _onEdit: OnEdit) {
    const options = pane.querySelector('.floating-edit-options') as HTMLElement;
    if (options === null) {
        throw new Error('missing editor options');
    }

    const del = e('button', [], '× delete');
    // del.addEventListener('click', e => {
    //     onEdit(new EditDeleteDom(node));
    //     e.stopPropagation();
    // });

    const add = e('button', [], '+ child');
    const group = e('button', [], '◱ group');

    popup(options, anchor, pane);

    [   e('h5', [],
            'DOM Node ',
            e('small', [],
                node.name)),
        e('p', [],
            del,
            add,
            group,
        ),
    ].forEach(child => options.appendChild(child));
}


function renderGroupNode(group: GroupNode, onEdit: OnEdit) {
    const el = e('div', ['child', 'group'],
        e('h4', ['name'], group.name));

    el.addEventListener('mouseover', _e => {
        onEdit(new EditHover(group.id));
    }, true);
    el.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    // el.addEventListener('click', _e => {
    //     onEdit(new EditSelect(group));
    // }, true);

    el.id = `editor-${group.id}`;
    return el;
}


function renderValueNode(value: Value, onEdit: OnEdit, state: State) {
    const literal = value.value;
    const content = e('span', ['literal', 'string'], `${literal.value}`);
    content.setAttribute('contenteditable', 'true');

    if (state.content.selection && state.content.selection.id === value.id) {
        content.focus();
    }

    content.addEventListener('mouseover', () => {
        onEdit(new EditHover(value.id));
    }, true);
    content.addEventListener('mouseout', () => {
        onEdit(new EditHover());
    }, true);

    const select: EventListener = () => {
        onEdit(new EditSelect(new ValueSelection(value.id)));
    };
    content.addEventListener('click', select, true);
    content.addEventListener('focus', select, true);
    content.addEventListener('blur', () => {
        onEdit(new EditSelect());
    }, true);

    // content.addEventListener('keydown', e => {
    //     if (e.key === 'Escape') {
    //         (e.target as HTMLElement).blur();
    //     }
    // }, true);

    // content.addEventListener('input', e => {
    //     const text = (e.target as HTMLElement).textContent;
    //     if (text === null) {
    //         throw new Error(`cannot edit a text node without text?`);
    //     }
    //     onEdit(new EditValue(literal.id, text));
    // }, true);

    const el = e('p', ['child', 'value'], content);
    el.id = `editor-${value.id}`;
    return el;
}


function renderChild(child: UiNode, onEdit: OnEdit, state: State) {
    switch (child.type) {
        case "dom":   return renderDomNode(child, onEdit, state);
        case "group": return renderGroupNode(child, onEdit);
        case "value": return renderValueNode(child, onEdit, state);
    }
}


function renderGroup(group: Group, onEdit: OnEdit, state: State): HTMLElement {
    const name = e('h3', ['name'], group.name);

    name.addEventListener('mouseover', _e => {
        onEdit(new EditHover(group.id));
    }, true);
    name.addEventListener('mouseout', _e => {
        onEdit(new EditHover());
    }, true);

    // name.addEventListener('click', _e => {
    //     onEdit(new EditSelect(group));
    // }, true);

    const el = e('div', ['group'],
        name,
        e('div', ['children'],
            ...group.children.map(child => renderChild(child, onEdit, state))));

    el.id = `editor-${group.id}`;
    return el;
}


function editorQuery(node: Node) {
    return `#editor-${node.id}`;
}


function popup(tag: HTMLElement, target: HTMLElement,
               context: HTMLElement = document.body) {
    const ctxRect = context.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    tag.classList.remove('off');
    tag.style.left = `calc(0.5ch + ${targetRect.left - ctxRect.left}px)`;
    tag.style.top = `${targetRect.top + targetRect.height - ctxRect.top}px`;
}


export function popoff(pane: HTMLElement) {
    const options = pane.querySelector('.floating-edit-options') as HTMLElement;
    if (options === null) {
        throw new Error('missing editor options');
    }
    options.innerHTML = '';
    options.classList.add('off');
}


export function renderOptions(pane: HTMLElement, node: Node, onEdit: OnEdit) {
    if (node.type === 'dom') {
        const q = `${editorQuery(node)} > .name`;
        const nameEl = pane.querySelector(q);
        if (nameEl === null) {
            throw new Error(`missing element ${q}`);
        }
        showDomOptions(pane, nameEl as HTMLElement, node, onEdit);
    }
}


export default function render(el: HTMLElement, state: State, onEdit: OnEdit) {
    el.innerHTML = '';
    Object.keys(state.ast)
        .map((name: string) =>
            renderGroup(state.ast[name], onEdit, state))
        .forEach(childEl =>
            el.appendChild(childEl));
    el.appendChild(e('div', ['floating-edit-options', 'off']))
}
