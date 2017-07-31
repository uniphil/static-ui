import State, {
    OnEdit,
} from './state';
import {
  DomNode,
  Group,
  GroupNode,
  UiNode,
  Value,
} from './state/ast';


type Context = { children: Array<UiNode> };


const flatMap = (fn: ((node: UiNode) => Array<HTMLElement>), stuff: Array<UiNode>) =>
    stuff.reduce((a: Array<HTMLElement>, e) =>
        a.concat(fn(e)),
        []);


function renderGroupNode(groupNode: GroupNode, context: Context, state: State): Array<HTMLElement> {
    const group = state.ast[groupNode.name];
    if (typeof group === 'undefined') {
        throw new Error(`Unknown group: ${groupNode.name}`);
    }
    const childContext = {
        ...context,
        children: groupNode.children,
    };
    const childEls = renderGroup(group, childContext, state);

    childEls.forEach(el => {
        el.setAttribute(`data-${groupNode.id}`, 'preview');
    });

    if (state.content.hovering === groupNode.id) {
        childEls.forEach(el => {
            el.classList.add('hovering');
        });
    }

    return childEls;
}


function renderGroup(group: Group, context: Context, state: State) {
    const childEls = flatMap((child: UiNode) =>
        renderChild(child, context, state), group.children);

    childEls.forEach(el => {
        el.setAttribute(`data-${group.id}`, 'preview');
    });

    if (state.content.hovering === group.id) {
        childEls.forEach(el => {
            el.classList.add('hovering');
        });
    }

    return childEls;
}


function renderDomNode(domNode: DomNode, context: Context, state: State): HTMLElement {
    const el = document.createElement(domNode.name);

    if (state.content.hovering === domNode.id) {
        el.classList.add('hovering');
    }

    el.id = `preview-${domNode.id}`;

    const childContext = {
        ...context,
        children: domNode.children,
    };
    domNode.children.forEach(child =>
        renderChild(child, childContext, state).forEach(childEl =>
            el.appendChild(childEl)));
    return el;
}


function renderValueNode(value: Value, state: State): HTMLElement {
    const el = document.createElement('span');

    if (state.content.hovering === value.id) {
        el.classList.add('hovering');
    }

    el.innerHTML = `${value.value.value}`;
    el.id = `preview-${value.id}`;
    return el;
}


function renderChild(child: UiNode, context: Context, state: State): Array<HTMLElement> {
    switch (child.type) {
        case "group":
            return renderGroupNode(child, context, state);
        case "dom":
            return [renderDomNode(child, context, state)];
        case "value":
            return [renderValueNode(child, state)];
    }
}


export default function render(el: HTMLElement, state: State, _onEdit: OnEdit) {
    el.innerHTML = '';
    const App = state.ast.App;
    if (typeof App === 'undefined') {
        throw new Error('no App group :(');
    }
    renderGroup(App, { children: App.children }, state)
        .forEach(childEl => el.appendChild(childEl));
}
