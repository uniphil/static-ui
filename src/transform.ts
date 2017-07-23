import {
    DomNode,
    Group,
    GroupMap,
    GroupNode,
    UiNode,
    Value,
} from './ast';
import {
    Edit,
    EditValue,
} from './edit';


function editValue(groups: GroupMap, edit: EditValue): GroupMap {
    const { App } = groups;

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

    return Object.keys(groups).reduce((g: GroupMap, k) => {
        const group = groups[k];
        const children = group.children.map(editNode);
        g[k] = group.replaceChildren(children);
        return g;
    }, { App });
}


export default function transform(groups: GroupMap, edit: Edit) {
    switch (edit.nodeType) {
        case 'value': return editValue(groups, edit);
    }
}
