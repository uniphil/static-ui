import {
  DomNode,
  Group,
  GroupMap,
  GroupNode,
  Value,
} from './ast';
import render from './render';
import edit from './edit';


let groups: GroupMap = {
    App: new Group('App',
        new GroupNode('Header'),
        new DomNode('div',
            new DomNode('p',
                new Value('hello here is some '),
                new DomNode('em',
                    new Value('cool formatted')),
                new Value(' content')),
            new DomNode('p',
                new Value('That is all, thanks')),
        ),
        new GroupNode('Footer'),
    ),
    Header: new Group('Header',
        new DomNode('div',
            new DomNode('h1', new Value('Hello world!')),
            new DomNode('h2', new Value('Welcome to this demo.')),
        ),
    ),
    Footer: new Group('Footer',
        new DomNode('footer',
            new DomNode('p', new Value('Good bye!'))
        ),
    ),
};

console.log('groups', groups);

const editor = document.getElementById('source');
if (!editor) { throw new Error('no editor'); }
editor.innerHTML = '';

edit(groups).forEach((el: HTMLElement) => editor.appendChild(el));


const preview = document.getElementById('preview');
if (!preview) { throw new Error('no preview'); }
preview.innerHTML = '';

render(groups).forEach((el: HTMLElement) => preview.appendChild(el));
