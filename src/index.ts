import {
  DomNode,
  Group,
  GroupMap,
  GroupNode,
  Value,
} from './ast';
import edit, {
    Edit,
    OnEdit,
} from './edit';
import render from './render';
import transform from './transform';


let groups: GroupMap = {
    App: Group.e('App',
        new GroupNode('Header'),
        new DomNode('div',
            new DomNode('p',
                Value.e('hello here is some '),
                new DomNode('em',
                    Value.e('cool formatted')),
                Value.e(' content')),
            new DomNode('p',
                Value.e('That is all, '),
                new DomNode('a',
                    Value.e('thanks')),
                Value.e('!')),
        ),
        new GroupNode('Footer'),
    ),
    Header: Group.e('Header',
        new DomNode('div',
            new DomNode('h1', Value.e('Hello world!')),
            new DomNode('h2', Value.e('Welcome to this demo.')),
        ),
    ),
    Footer: Group.e('Footer',
        new DomNode('footer',
            new DomNode('p', Value.e('Good bye!'))
        ),
    ),
};

function update(groups: GroupMap) {
    const preview = document.getElementById('preview');
    if (!preview) { throw new Error('no preview'); }
    preview.innerHTML = '';

    console.log('groups', groups);

    render(groups).forEach((el: HTMLElement) => preview.appendChild(el));
}


const editor = document.getElementById('source');
if (!editor) { throw new Error('no editor'); }
editor.innerHTML = '';

function blah(edit: Edit) {
    groups = transform(groups, edit);
    update(groups);
}

edit(groups, blah).forEach((el: HTMLElement) => editor.appendChild(el));

update(groups);

