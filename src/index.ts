import {
  DomNode,
  Group,
  GroupMap,
  GroupNode,
  Value,
} from './ast';
import {
    Edit,
    EditInit,
} from './edit';
import State from './state';
import transform from './transform';


const demoGroups: GroupMap = {
    App: Group.e('App',
        new GroupNode('Header'),
        new DomNode('div',
            new DomNode('p',
                Value.e('The application structure is on the left. Text can be '),
                new DomNode('em',
                    Value.e('formatted')),
                Value.e(' with HTML nodes.')),
            new DomNode('p',
                Value.e('HTML also means we can create '),
                new DomNode('a',
                    Value.e('links')),
                Value.e('!')),
        ),
        new GroupNode('Footer'),
    ),
    Header: Group.e('Header',
        new DomNode('div',
            new DomNode('h1', Value.e('Hello world!')),
            new DomNode('h2', Value.e('Welcome to static.')),
        ),
    ),
    Footer: Group.e('Footer',
        new DomNode('footer',
            new DomNode('p', Value.e('Parts of the app can be grouped into reusable pieces, like this footer.'))
        ),
    ),
};


class StateManager {
    private state: State;

    constructor(initialState: State) {
        this.state = initialState;
    }

    push(newState: State) {
        this.state = newState;
    }

    get(): State {
        return this.state;
    }
}


(function() {
    const editor = document.getElementById('source');
    if (!editor) { throw new Error('no editor'); }
    editor.innerHTML = '';

    const preview = document.getElementById('preview');
    if (!preview) { throw new Error('no preview'); }
    preview.innerHTML = '';

    const initialState = State.create(editor, preview, demoGroups);
    const stateManager = new StateManager(initialState);

    function update(edit: Edit) {
        const nextState = transform(stateManager.get(), edit, update);
        stateManager.push(nextState);
    }

    update(new EditInit());
})();
