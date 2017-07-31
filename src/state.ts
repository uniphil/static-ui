import { GroupMap } from './ast';


export default class State {
    readonly hovered?: string;
    readonly selected?: string;
    readonly groups: GroupMap;

    private constructor(groups: GroupMap, hovered?: string, selected?: string) {
        this.hovered = hovered;
        this.selected = selected;
        this.groups = groups;
    }

    static create(groups: GroupMap) {
        return new State(groups);
    }

    hover(id?: string) {
        return new State(this.groups, id, this.selected);
    }

    select(id?: string) {
        return new State(this.groups, this.hovered, id);
    }

    change(groups: GroupMap) {
        return new State(groups, this.hovered, this.selected);
    }
}
