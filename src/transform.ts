import State from './state';
import {
    DomNode,
    GroupMap,
    GroupNode,
    UiNode,
} from './ast';
import {
    render as renderEditor,
    Edit,
    EditValue,
    OnEdit,
} from './edit';
import renderPreview from './render';


function refresh(state: State, onEdit: OnEdit): State {
    renderEditor(state.editor, state, onEdit);
    renderPreview(state.preview, state, onEdit);
    return state;
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
        case 'init': return refresh(state, onEdit);
        case 'value': return editValue(state, edit);
    }
}
