import {
    Edit,
} from './state';
import Ast, {
    DomNode,
    Group,
    GroupNode,
    Value,
} from './state/ast';
import State from './state';
import expect from './expect';
import renderEditor from './editContent';
import renderPreview from './preview';
// import transform from './transform';


const demoGroups: Ast = {
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
    const editor = expect(document.getElementById('source'), 'editor pane');
    editor.innerHTML = '';

    const preview = expect(document.getElementById('preview'), 'preview pane');
    preview.innerHTML = '';

    const initialState = State.create(demoGroups);
    const stateManager = new StateManager(initialState);

    function render(state: State) {
        renderEditor(editor, state, update);
        renderPreview(preview, state, update);
    }

    function update(edit: Edit) {
        const nextState = stateManager.get().edit(edit);
        render(nextState);
        stateManager.push(nextState);
    }

    render(initialState);
})();
