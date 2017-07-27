import { GroupMap } from './ast';


export default class State {
    readonly editor: HTMLElement;
    readonly preview: HTMLElement;
    readonly hovered?: string;
    readonly selected?: string;
    readonly groups: GroupMap;

    private constructor(editor: HTMLElement, preview: HTMLElement,
                        groups: GroupMap, hovered?: string, selected?: string) {
        this.editor = editor;
        this.preview = preview;
        this.hovered = hovered;
        this.selected = selected;
        this.groups = groups;
    }

    static create(editor: HTMLElement, preview: HTMLElement, groups: GroupMap) {
        return new State(editor, preview, groups);
    }

    hover(id?: string) {
        return new State(this.editor, this.preview, this.groups, id, this.selected);
    }

    select(id?: string) {
        return new State(this.editor, this.preview, this.groups, this.hovered, id);
    }

    change(groups: GroupMap) {
        return new State(this.editor, this.preview, groups, this.hovered, this.selected);
    }
}
