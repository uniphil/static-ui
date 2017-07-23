import {
  DomNode,
  Group,
  GroupMap,
  GroupNode,
  Literal,
  UiNode,
} from './ast';


type Context = { children: Array<UiNode> };


const flatMap = (fn: ((node: UiNode) => Array<HTMLElement>), stuff: Array<UiNode>) =>
    stuff.reduce((a: Array<HTMLElement>, e) =>
        a.concat(fn(e)),
        []);


function renderGroupNode(groupNode: GroupNode, context: Context, groups: GroupMap): Array<HTMLElement> {
    const group = groups[groupNode.name];
    if (typeof group === 'undefined') {
        throw new Error(`Unknown group: ${groupNode.name}`);
    }
    const childContext = {
        ...context,
        children: groupNode.children,
    };
    return renderGroup(group, childContext, groups);
}


function renderGroup(group: Group, context: Context, groups: GroupMap) {
    return flatMap((child: UiNode) => renderChild(child, context, groups),
        group.children);
}


function renderDomNode(domNode: DomNode, context: Context, groups: GroupMap): HTMLElement {
    const el = document.createElement(domNode.name);
    const childContext = {
        ...context,
        children: domNode.children,
    };
    domNode.children.forEach(child =>
        renderChild(child, childContext, groups).forEach(childEl =>
            el.appendChild(childEl)));
    return el;
}


function renderValueNode(value: Literal): HTMLElement {
    const el = document.createElement('span');
    el.innerHTML = `${value.value}`;
    return el;
}


function renderChild(child: UiNode, context: Context, groups: GroupMap): Array<HTMLElement> {
    switch (child.type) {
        case "group":
            return renderGroupNode(child, context, groups);
        case "dom":
            return [renderDomNode(child, context, groups)];
        case "value":
            return [renderValueNode(child.value)];
    }
}


export default function render(groups: GroupMap) {
    const App = groups.App;
    if (typeof App === 'undefined') {
        throw new Error('no App group :(');
    }
    return renderGroup(App, { children: App.children }, groups);
}
