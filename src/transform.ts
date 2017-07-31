import State from './state';
import {
    DomNode,
    GroupMap,
    GroupNode,
    Node,
    UiNode,
} from './ast';
import {
    Edit,
    EditDeleteDom,
    EditHover,
    EditSelect,
    EditValue,
    OnEdit,
    popoff,
    render as renderEditor,
    renderOptions,
} from './edit';
import expect from './expect';
import renderPreview from './render';


function refresh(editor: HTMLElement, preview: HTMLElement, state: State,
                 onEdit: OnEdit): State {
    renderEditor(editor, state, onEdit);
    renderPreview(preview, state, onEdit);
    return state;
}


function editorQuery(node: Node) {
    return `#editor-${node.id}`;
}


function previewQuery(node: Node) {
    switch (node.type) {
        case 'group-definition': return `[data-${node.id}]`;
        case 'group': return `[data-${node.id}]`;
        case 'dom':   return `#preview-${node.id}`;
        case 'value': return `#preview-${node.value.id}`;
    }
}


function editRemove(node: Node, state: State): State {
    const { id } = node;
    const { App } = state.groups;

    function filter(children: UiNode[]): UiNode[] {
        return children
            .filter(child => child.id !== id)
            .map(child => {
                switch (child.type) {
                    case 'group':
                        return new GroupNode(child.name, ...filter(child.children));
                    case 'dom':
                        return new DomNode(child.name, ...filter(child.children));
                    case 'value':
                        return child;
                }
            });
    }

    return state.change(Object.keys(state.groups).reduce((g: GroupMap, k) => {
        const group = state.groups[k];
        const children = filter(group.children);
        g[k] = group.replaceChildren(children);
        return g;
    }, { App }))
}


function editDeleteDom(editor: HTMLElement, preview: HTMLElement, state: State,
                       edit: EditDeleteDom, onEdit: OnEdit): State {
    // unselect first
    let nextState = editSelect(editor, preview, state, new EditSelect(), onEdit);

    const id = edit.node.id;
    // delete from editor
    const editorQ = editor.querySelector(editorQuery(edit.node));
    const editorEl = expect(editorQ, `node to remove, ${id}`);
    expect(editorEl.parentNode, `node's parent, ${id}`)
        .removeChild(editorEl);
    // delete from preview
    const previewEls = preview.querySelectorAll(previewQuery(edit.node));
    Array.prototype.forEach.call(previewEls, (el: HTMLElement) => {
        const parent = expect(el.parentNode, `node's parent, ${id}`);
        parent.removeChild(el);
    });
    // delete from ast
    nextState = editRemove(edit.node, state);

    return nextState;
}


function editHover(preview: HTMLElement, state: State, edit: EditHover): State {
    const id = edit.node === undefined ? undefined : edit.node.id;
    const nextState = state.hover(id);

    const hovered = preview.querySelectorAll('.hovering');
    Array.prototype.forEach.call(hovered, (el: HTMLElement) =>
        el.classList.remove('hovering'));

    if (edit.node) {
        const els = preview.querySelectorAll(previewQuery(edit.node));
        Array.prototype.forEach.call(els, (el: HTMLElement) =>
            el.classList.add('hovering'));
    }

    return nextState;
}


function editSelect(editor: HTMLElement, preview: HTMLElement, state: State,
                    edit: EditSelect, onEdit: OnEdit): State {
    const id = edit.node === undefined ? undefined : edit.node.id;
    const nextState = state.select(id);

    const selected = preview.querySelectorAll('.selecting');
    Array.prototype.forEach.call(selected, (el: HTMLElement) =>
        el.classList.remove('selecting'));

    popoff(editor);

    if (edit.node) {
        const els = preview.querySelectorAll(previewQuery(edit.node));
        Array.prototype.forEach.call(els, (el: HTMLElement) =>
            el.classList.add('selecting'));

        renderOptions(editor, edit.node, onEdit);
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


export default function transform(editor: HTMLElement, preview: HTMLElement,
    state: State, edit: Edit, onEdit: OnEdit): State {
    switch (edit.editType) {
        case 'delete-dom':
            return editDeleteDom(editor, preview, state, edit, onEdit);
        case 'init':
            return refresh(editor, preview, state, onEdit);
        case 'hover':
            return editHover(preview, state, edit);
        case 'select':
            return editSelect(editor, preview, state, edit, onEdit);
        case 'value':
            return editValue(state, edit);
    }
}
