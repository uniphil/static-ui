let id: (pre: string) => string = (() => {
    let next = 0;
    return (pre: string) => `${pre}-${next++}`;
})();


export class Group {
    readonly id: string;
    readonly type = 'group-definition';
    readonly name: string;
    readonly children: Array<UiNode>;

    private constructor(name: string, children: Array<UiNode>,
                        newId: string = id('group-definition')) {
        this.id = newId;
        this.name = name;
        this.children = children;
    }

    static e(name: string, ...children: Array<UiNode>): Group {
        return new Group(name, children);
    }

    replaceChildren(newChildren: Array<UiNode>) {
        return new Group(this.name, newChildren, this.id);
    }
}

export type UiNode = GroupNode | DomNode | Value;
export type Node = Group | UiNode;

export class GroupNode {
    readonly id: string;
    readonly type = 'group';
    readonly requires = null;
    readonly provides = null;
    readonly children: Array<UiNode>;
    readonly name: string;

    constructor(name: string, ...children: Array<UiNode>) {
        this.id = id('group');
        this.name = name;
        this.children = children;
    }
}

export class DomNode {
    readonly id: string;
    readonly type = 'dom';
    readonly requires = null;
    readonly provides = null;
    readonly children: Array<UiNode>;
    readonly name: string;

    constructor(name: string, ...children: Array<UiNode>) {
        this.id = id('dom');
        this.name = name;
        this.children = children;
    }
}

export class Value {
    readonly id: string;
    readonly type = 'value';
    readonly value: Literal;

    private constructor(value: string | number | boolean,
                        newId: string = id('value')) {
        this.id = newId;
        this.value = new Literal(value);
    }

    static e(value: string): Value {
        return new Value(value);
    }

    replaceValue(newValue: string): Value {
        return new Value(newValue, this.id);
    }
}

export class Literal {
    readonly id: string;
    readonly value: string | number | boolean;

    constructor(value: string | number | boolean) {
        this.id = id('literal');
        this.value = value;
    }
}

export type GroupMap = {
    App: Group,
    [key: string]: Group,
};
