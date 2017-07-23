import {
  Group,
  GroupNode,
  DomNode,
  Value,
} from './ast';
import render, { GroupMap } from './render';


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


const preview = document.getElementById('preview');
if (!preview) { throw new Error('no preview'); }
preview.innerHTML = '';

render(groups).forEach((el: HTMLElement) => preview.appendChild(el));
