export default class Content {
    readonly hovering?: string;
    readonly selection?: Selection;

    private constructor(hovering?: string, selection?: Selection) {
        this.hovering = hovering;
        this.selection = selection;
    }

    static create() {
        return new Content();
    }

    edit(edit: Edit) {
        switch (edit.edit) {
            case 'hover': return this.hover(edit);
            case 'select': return this.select(edit);
        }
    }

    hover(edit: EditHover) {
        return new Content(edit.id, this.selection);
    }

    select(edit: EditSelect) {
        const nextSelection = edit.selection
            ? new ValueSelection(edit.selection.id)
            : undefined;

        return new Content(this.hovering, nextSelection);
    }
}


export class ValueSelection {
    readonly type = 'value';
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}


type Selection = ValueSelection;


export type Edit = EditHover
                 | EditSelect;


export class EditHover {
    readonly type = 'content';
    readonly edit = 'hover';
    readonly id?: string;

    constructor(id?: string) {
        this.id = id;
    }
}


export class EditSelect {
    readonly type = 'content';
    readonly edit = 'select';
    readonly selection?: Selection;

    constructor(selection?: Selection) {
        this.selection = selection;
    }
}
