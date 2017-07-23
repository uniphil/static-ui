export class Group {
    readonly name: string;
    readonly children: Array<UiNode>;

    constructor(name: string, ...children: Array<UiNode>) {
        this.name = name,
        this.children = children;
    }
}

export type UiNode = GroupNode | DomNode | Value;

export class GroupNode {
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

export class DomNode {
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

export class Value {
    readonly type = 'value';
    readonly value: Literal;

    constructor(value: string | number | boolean) {
        this.value = new Literal(value);
    }
}

export class Literal {
    readonly value: string | number | boolean;

    constructor(value: string | number | boolean) {
        this.value = value;
    }
}
