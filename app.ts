class Group {
    readonly name: string;
    readonly children: Array<UiNode>;

    constructor(name: string, ...children: Array<UiNode>) {
        this.name = name,
        this.children = children;
    }
}

type UiNode = GroupNode | DomNode | Value;

class GroupNode {
    readonly type = "group";
    readonly requires = null;
    readonly provides = null;
    readonly children: Array<UiNode>;
    readonly name: string;

    constructor(name: string, ...children: Array<UiNode>) {
        this.name = name;
        this.children = children;
    }
}

class DomNode {
    readonly type = "dom";
    readonly requires = null;
    readonly provides = null;
    readonly children: Array<UiNode>;
    readonly name: string;

    constructor(name: string, ...children: Array<UiNode>) {
        this.name = name;
        this.children = children;
    }
}

class Value {
    readonly type = 'value';
    readonly value: Literal;

    constructor(value: string | number | boolean) {
        this.value = new Literal(value);
    }
}

class Literal {
    readonly value: string | number | boolean;

    constructor(value: string | number | boolean) {
        this.value = value;
    }
}


type GroupMap = {App: Group, [key: string]: Group};


let groups: GroupMap = {
    App: new Group('App',
        new GroupNode('Header'),
        new DomNode('div',
            new DomNode('p', new Value('hello here is some content')),
        ),
        new DomNode('footer',
            new DomNode('p', new Value('Good bye!'))),
    ),
    Header: new Group('Header',
        new DomNode('div',
            new DomNode('h1', new Value('Hello world!')))),
};

console.log('groups', groups);


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
    console.log('rgn', groupNode.name, group);
    const childContext = {
        ...context,
        children: groupNode.children,
    };
    return renderGroup(group, childContext, groups);
}


function renderGroup(group: Group, context: Context, groups: GroupMap) {
    console.log('rg', group.name, group.children, context);
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
    console.log('rc', child);
    switch (child.type) {
        case "group":
            return renderGroupNode(child, context, groups);
        case "dom":
            return [renderDomNode(child, context, groups)];
        case "value":
            return [renderValueNode(child.value)];
    }
}


function render(groups: GroupMap) {
    const App = groups.App;
    if (typeof App === 'undefined') {
        throw new Error('no App group :(');
    }
    return renderGroup(App, { children: App.children }, groups);
}

const preview = document.getElementById('preview');
if (!preview) { throw new Error('no preview'); }
preview.innerHTML = '';
const out = render(groups);
console.log('groups', out);
out.forEach((el: HTMLElement) => preview.appendChild(el));
