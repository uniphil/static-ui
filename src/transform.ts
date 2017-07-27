import State from './state';
import {
    DomNode,
    GroupMap,
    GroupNode,
    Node,
    UiNode,
} from './ast';
import {
    render as renderEditor,
    Edit,
    EditHover,
    EditSelect,
    EditValue,
    OnEdit,
} from './edit';
import renderPreview from './render';


function refresh(state: State, onEdit: OnEdit): State {
    renderEditor(state.editor, state, onEdit);
    renderPreview(state.preview, state, onEdit);
    return state;
}


function selectNode(node: Node) {
    switch (node.type) {
        case 'group-definition': return `[data-${node.id}]`;
        case 'group': return `[data-${node.id}]`;
        case 'dom':   return `#preview-${node.id}`;
        case 'value': return `#preview-${node.value.id}`;
    }
}


function editHover(state: State, edit: EditHover): State {
    const id = edit.node === undefined ? undefined : edit.node.id;
    const nextState = state.hover(id);

    const hovered = state.preview.querySelectorAll('.hovering');
    Array.prototype.forEach.call(hovered, (el: HTMLElement) =>
        el.classList.remove('hovering'));

    if (edit.node) {
        const els = state.preview.querySelectorAll(selectNode(edit.node));
        Array.prototype.forEach.call(els, (el: HTMLElement) =>
            el.classList.add('hovering'));
    }

    return nextState;
}


function editSelect(state: State, edit: EditSelect): State {
    const id = edit.node === undefined ? undefined : edit.node.id;
    const nextState = state.select(id);

    const selected = state.preview.querySelectorAll('.selecting');
    Array.prototype.forEach.call(selected, (el: HTMLElement) =>
        el.classList.remove('selecting'));

    if (edit.node) {
        const els = state.preview.querySelectorAll(selectNode(edit.node));
        Array.prototype.forEach.call(els, (el: HTMLElement) =>
            el.classList.add('selecting'));
    }

    return nextState;
}


function editValue(state: State, edit: EditValue): State {
    const { App } = state.groups;

    function editNode(node: UiNode): UiNode {
        let children;
        switch (node.type) {
            case 'dom':
                children = node.children.map(editNode)
                return new DomNode(node.name, ...children);
            case 'group':
                children = node.children.map(editNode)
                return new GroupNode(node.name, ...children);
            case 'value':
                if (node.id === edit.id) {
                    return node.replaceValue(edit.newValue);
                }
                return node;
        }
    }

    const newGroups = Object.keys(state.groups).reduce((g: GroupMap, k) => {
        const group = state.groups[k];
        const children = group.children.map(editNode);
        g[k] = group.replaceChildren(children);
        return g;
    }, { App });

    const nextState = state.change(newGroups);

    const el = document.getElementById(`preview-${edit.id}`);
    if (el === null) {
        throw new Error(`missing node to edit: ${edit.id}`);
    }
    el.textContent = edit.newValue;

    return nextState;
}


export default function transform(state: State, edit: Edit, onEdit: OnEdit): State {
    switch (edit.editType) {
        case 'init':   return refresh(state, onEdit);
        case 'hover':  return editHover(state, edit);
        case 'select': return editSelect(state, edit);
        case 'value':  return editValue(state, edit);
    }
}
