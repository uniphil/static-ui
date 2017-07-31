"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("ast", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id = (function () {
        var next = 0;
        return function (pre) { return pre + "-" + next++; };
    })();
    var Group = (function () {
        function Group(name, children, newId) {
            if (newId === void 0) { newId = id('group-definition'); }
            this.type = 'group-definition';
            this.id = newId;
            this.name = name;
            this.children = children;
        }
        Group.e = function (name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            return new Group(name, children);
        };
        Group.prototype.replaceChildren = function (newChildren) {
            return new Group(this.name, newChildren, this.id);
        };
        return Group;
    }());
    exports.Group = Group;
    var GroupNode = (function () {
        function GroupNode(name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            this.type = 'group';
            this.requires = null;
            this.provides = null;
            this.id = id('group');
            this.name = name;
            this.children = children;
        }
        return GroupNode;
    }());
    exports.GroupNode = GroupNode;
    var DomNode = (function () {
        function DomNode(name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            this.type = 'dom';
            this.requires = null;
            this.provides = null;
            this.id = id('dom');
            this.name = name;
            this.children = children;
        }
        return DomNode;
    }());
    exports.DomNode = DomNode;
    var Value = (function () {
        function Value(value, newId) {
            if (newId === void 0) { newId = id('value'); }
            this.type = 'value';
            this.id = newId;
            this.value = new Literal(value);
        }
        Value.e = function (value) {
            return new Value(value);
        };
        Value.prototype.replaceValue = function (newValue) {
            return new Value(newValue, this.id);
        };
        return Value;
    }());
    exports.Value = Value;
    var Literal = (function () {
        function Literal(value) {
            this.id = id('literal');
            this.value = value;
        }
        return Literal;
    }());
    exports.Literal = Literal;
});
define("e", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function e(name, classes) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var el = document.createElement(name);
        (_a = el.classList).add.apply(_a, classes);
        children.forEach(function (child) {
            return typeof child === 'string'
                ? el.appendChild(document.createTextNode(child))
                : el.appendChild(child);
        });
        return el;
        var _a;
    }
    exports.default = e;
});
define("state/ast", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id = (function () {
        var next = 0;
        return function (pre) { return pre + "-" + next++; };
    })();
    var Group = (function () {
        function Group(name, children, newId) {
            if (newId === void 0) { newId = id('group-definition'); }
            this.type = 'group-definition';
            this.id = newId;
            this.name = name;
            this.children = children;
        }
        Group.e = function (name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            return new Group(name, children);
        };
        Group.prototype.replaceChildren = function (newChildren) {
            return new Group(this.name, newChildren, this.id);
        };
        return Group;
    }());
    exports.Group = Group;
    var GroupNode = (function () {
        function GroupNode(name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            this.type = 'group';
            this.requires = null;
            this.provides = null;
            this.id = id('group');
            this.name = name;
            this.children = children;
        }
        return GroupNode;
    }());
    exports.GroupNode = GroupNode;
    var DomNode = (function () {
        function DomNode(name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            this.type = 'dom';
            this.requires = null;
            this.provides = null;
            this.id = id('dom');
            this.name = name;
            this.children = children;
        }
        return DomNode;
    }());
    exports.DomNode = DomNode;
    var Value = (function () {
        function Value(value, newId) {
            if (newId === void 0) { newId = id('value'); }
            this.type = 'value';
            this.id = newId;
            this.value = new Literal(value);
        }
        Value.e = function (value) {
            return new Value(value);
        };
        Value.prototype.replaceValue = function (newValue) {
            return new Value(newValue, this.id);
        };
        return Value;
    }());
    exports.Value = Value;
    var Literal = (function () {
        function Literal(value) {
            this.id = id('literal');
            this.value = value;
        }
        return Literal;
    }());
    exports.Literal = Literal;
    var EditRemove = (function () {
        function EditRemove(id) {
            this.type = 'ast';
            this.edit = 'remove';
            this.id = id;
        }
        return EditRemove;
    }());
    exports.EditRemove = EditRemove;
    function editAst(edit, ast) {
        switch (edit.edit) {
            case 'remove':
                return ast;
        }
    }
    exports.editAst = editAst;
});
define("state/content", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Content = (function () {
        function Content(hovering, selection) {
            this.hovering = hovering;
            this.selection = selection;
        }
        Content.create = function () {
            return new Content();
        };
        Content.prototype.edit = function (edit) {
            switch (edit.edit) {
                case 'hover': return this.hover(edit);
                case 'select': return this.select(edit);
            }
        };
        Content.prototype.hover = function (edit) {
            return new Content(edit.id, this.selection);
        };
        Content.prototype.select = function (_edit) {
            return this;
        };
        return Content;
    }());
    exports.default = Content;
    var Selection = (function () {
        function Selection() {
        }
        return Selection;
    }());
    var EditHover = (function () {
        function EditHover(id) {
            this.type = 'content';
            this.edit = 'hover';
            this.id = id;
        }
        return EditHover;
    }());
    exports.EditHover = EditHover;
    var EditSelect = (function () {
        function EditSelect(_id) {
            this.type = 'content';
            this.edit = 'select';
            this.id = undefined;
        }
        return EditSelect;
    }());
});
define("state/index", ["require", "exports", "state/ast", "state/content"], function (require, exports, ast_1, content_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = (function () {
        function State(ast, content) {
            this.ast = ast;
            this.content = content;
        }
        State.create = function (ast) {
            return new State(ast, content_1.default.create());
        };
        State.prototype.edit = function (edit) {
            switch (edit.type) {
                case 'ast': return this.editAst(edit);
                case 'content': return this.editContent(edit);
            }
        };
        State.prototype.editContent = function (edit) {
            var nextContent = this.content.edit(edit);
            return new State(this.ast, nextContent);
        };
        State.prototype.editAst = function (edit) {
            var nextAst = ast_1.editAst(edit, this.ast);
            return new State(nextAst, this.content);
        };
        return State;
    }());
    exports.default = State;
});
define("editContent", ["require", "exports", "state/content", "e"], function (require, exports, content_2, e_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function renderDomNode(dom, onEdit) {
        var el = e_1.default('div', ['child', 'dom'], e_1.default('h4', ['name'], dom.name), e_1.default.apply(void 0, ['div', ['children']].concat(dom.children.map(function (child) { return renderChild(child, onEdit); }))));
        el.addEventListener('mouseover', function (_e) {
            onEdit(new content_2.EditHover(dom.id));
        }, true);
        el.addEventListener('mouseout', function (_e) {
            onEdit(new content_2.EditHover());
        }, true);
        // el.addEventListener('click', e => {
        //     onEdit(new EditSelect(dom));
        //     e.stopPropagation();
        // }, false);
        el.id = "editor-" + dom.id;
        return el;
    }
    function showDomOptions(pane, anchor, node, _onEdit) {
        var options = pane.querySelector('.floating-edit-options');
        if (options === null) {
            throw new Error('missing editor options');
        }
        var del = e_1.default('button', [], '× delete');
        // del.addEventListener('click', e => {
        //     onEdit(new EditDeleteDom(node));
        //     e.stopPropagation();
        // });
        var add = e_1.default('button', [], '+ child');
        var group = e_1.default('button', [], '◱ group');
        popup(options, anchor, pane);
        [e_1.default('h5', [], 'DOM Node ', e_1.default('small', [], node.name)),
            e_1.default('p', [], del, add, group),
        ].forEach(function (child) { return options.appendChild(child); });
    }
    function renderGroupNode(group, onEdit) {
        var el = e_1.default('div', ['child', 'group'], e_1.default('h4', ['name'], group.name));
        el.addEventListener('mouseover', function (_e) {
            onEdit(new content_2.EditHover(group.id));
        }, true);
        el.addEventListener('mouseout', function (_e) {
            onEdit(new content_2.EditHover());
        }, true);
        // el.addEventListener('click', _e => {
        //     onEdit(new EditSelect(group));
        // }, true);
        el.id = "editor-" + group.id;
        return el;
    }
    function renderValueNode(value, onEdit) {
        var literal = value.value;
        var content = e_1.default('span', ['literal', 'string'], "" + literal.value);
        content.setAttribute('contenteditable', 'true');
        content.addEventListener('mouseover', function () {
            onEdit(new content_2.EditHover(value.id));
        }, true);
        content.addEventListener('mouseout', function () {
            onEdit(new content_2.EditHover());
        }, true);
        // const select: EventListener = _e => {
        //     onEdit(new EditSelect(value));
        // };
        // content.addEventListener('click', select, true);
        // content.addEventListener('focus', select, true);
        // content.addEventListener('blur', _e => {
        //     onEdit(new EditSelect());
        // }, true);
        // content.addEventListener('keydown', e => {
        //     if (e.key === 'Escape') {
        //         (e.target as HTMLElement).blur();
        //     }
        // }, true);
        // content.addEventListener('input', e => {
        //     const text = (e.target as HTMLElement).textContent;
        //     if (text === null) {
        //         throw new Error(`cannot edit a text node without text?`);
        //     }
        //     onEdit(new EditValue(literal.id, text));
        // }, true);
        var el = e_1.default('p', ['child', 'value'], content);
        el.id = "editor-" + value.id;
        return el;
    }
    function renderChild(child, onEdit) {
        switch (child.type) {
            case "dom": return renderDomNode(child, onEdit);
            case "group": return renderGroupNode(child, onEdit);
            case "value": return renderValueNode(child, onEdit);
        }
    }
    function renderGroup(group, onEdit) {
        var name = e_1.default('h3', ['name'], group.name);
        name.addEventListener('mouseover', function (_e) {
            onEdit(new content_2.EditHover(group.id));
        }, true);
        name.addEventListener('mouseout', function (_e) {
            onEdit(new content_2.EditHover());
        }, true);
        // name.addEventListener('click', _e => {
        //     onEdit(new EditSelect(group));
        // }, true);
        var el = e_1.default('div', ['group'], name, e_1.default.apply(void 0, ['div', ['children']].concat(group.children.map(function (child) { return renderChild(child, onEdit); }))));
        el.id = "editor-" + group.id;
        return el;
    }
    function editorQuery(node) {
        return "#editor-" + node.id;
    }
    function popup(tag, target, context) {
        if (context === void 0) { context = document.body; }
        var ctxRect = context.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        tag.classList.remove('off');
        tag.style.left = "calc(0.5ch + " + (targetRect.left - ctxRect.left) + "px)";
        tag.style.top = targetRect.top + targetRect.height - ctxRect.top + "px";
    }
    function popoff(pane) {
        var options = pane.querySelector('.floating-edit-options');
        if (options === null) {
            throw new Error('missing editor options');
        }
        options.innerHTML = '';
        options.classList.add('off');
    }
    exports.popoff = popoff;
    function renderOptions(pane, node, onEdit) {
        if (node.type === 'dom') {
            var q = editorQuery(node) + " > .name";
            var nameEl = pane.querySelector(q);
            if (nameEl === null) {
                throw new Error("missing element " + q);
            }
            showDomOptions(pane, nameEl, node, onEdit);
        }
    }
    exports.renderOptions = renderOptions;
    function render(el, state, onEdit) {
        el.innerHTML = '';
        Object.keys(state.ast)
            .map(function (name) {
            return renderGroup(state.ast[name], onEdit);
        })
            .forEach(function (childEl) {
            return el.appendChild(childEl);
        });
        el.appendChild(e_1.default('div', ['floating-edit-options', 'off']));
    }
    exports.default = render;
});
define("expect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function expect(el, msg) {
        if (el === null) {
            throw new Error("Element was null: " + msg);
        }
        return el;
    }
    exports.default = expect;
});
define("preview", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var flatMap = function (fn, stuff) {
        return stuff.reduce(function (a, e) {
            return a.concat(fn(e));
        }, []);
    };
    function renderGroupNode(groupNode, context, state) {
        var group = state.ast[groupNode.name];
        if (typeof group === 'undefined') {
            throw new Error("Unknown group: " + groupNode.name);
        }
        var childContext = __assign({}, context, { children: groupNode.children });
        var childEls = renderGroup(group, childContext, state);
        childEls.forEach(function (el) {
            el.setAttribute("data-" + groupNode.id, 'preview');
        });
        if (state.content.hovering === groupNode.id) {
            childEls.forEach(function (el) {
                el.classList.add('hovering');
            });
        }
        return childEls;
    }
    function renderGroup(group, context, state) {
        var childEls = flatMap(function (child) {
            return renderChild(child, context, state);
        }, group.children);
        childEls.forEach(function (el) {
            el.setAttribute("data-" + group.id, 'preview');
        });
        if (state.content.hovering === group.id) {
            childEls.forEach(function (el) {
                el.classList.add('hovering');
            });
        }
        return childEls;
    }
    function renderDomNode(domNode, context, state) {
        var el = document.createElement(domNode.name);
        if (state.content.hovering === domNode.id) {
            el.classList.add('hovering');
        }
        el.id = "preview-" + domNode.id;
        var childContext = __assign({}, context, { children: domNode.children });
        domNode.children.forEach(function (child) {
            return renderChild(child, childContext, state).forEach(function (childEl) {
                return el.appendChild(childEl);
            });
        });
        return el;
    }
    function renderValueNode(value, state) {
        var el = document.createElement('span');
        if (state.content.hovering === value.id) {
            el.classList.add('hovering');
        }
        el.innerHTML = "" + value.value.value;
        el.id = "preview-" + value.id;
        return el;
    }
    function renderChild(child, context, state) {
        switch (child.type) {
            case "group":
                return renderGroupNode(child, context, state);
            case "dom":
                return [renderDomNode(child, context, state)];
            case "value":
                return [renderValueNode(child, state)];
        }
    }
    function render(el, state, _onEdit) {
        el.innerHTML = '';
        var App = state.ast.App;
        if (typeof App === 'undefined') {
            throw new Error('no App group :(');
        }
        renderGroup(App, { children: App.children }, state)
            .forEach(function (childEl) { return el.appendChild(childEl); });
    }
    exports.default = render;
});
define("index", ["require", "exports", "state/ast", "state/index", "expect", "editContent", "preview"], function (require, exports, ast_2, state_1, expect_1, editContent_1, preview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import transform from './transform';
    var demoGroups = {
        App: ast_2.Group.e('App', new ast_2.GroupNode('Header'), new ast_2.DomNode('div', new ast_2.DomNode('p', ast_2.Value.e('The application structure is on the left. Text can be '), new ast_2.DomNode('em', ast_2.Value.e('formatted')), ast_2.Value.e(' with HTML nodes.')), new ast_2.DomNode('p', ast_2.Value.e('HTML also means we can create '), new ast_2.DomNode('a', ast_2.Value.e('links')), ast_2.Value.e('!'))), new ast_2.GroupNode('Footer')),
        Header: ast_2.Group.e('Header', new ast_2.DomNode('div', new ast_2.DomNode('h1', ast_2.Value.e('Hello world!')), new ast_2.DomNode('h2', ast_2.Value.e('Welcome to static.')))),
        Footer: ast_2.Group.e('Footer', new ast_2.DomNode('footer', new ast_2.DomNode('p', ast_2.Value.e('Parts of the app can be grouped into reusable pieces, like this footer.')))),
    };
    var StateManager = (function () {
        function StateManager(initialState) {
            this.state = initialState;
        }
        StateManager.prototype.push = function (newState) {
            this.state = newState;
        };
        StateManager.prototype.get = function () {
            return this.state;
        };
        return StateManager;
    }());
    (function () {
        var editor = expect_1.default(document.getElementById('source'), 'editor pane');
        editor.innerHTML = '';
        var preview = expect_1.default(document.getElementById('preview'), 'preview pane');
        preview.innerHTML = '';
        var initialState = state_1.default.create(demoGroups);
        var stateManager = new StateManager(initialState);
        function render(state) {
            editContent_1.default(editor, state, update);
            preview_1.default(preview, state, update);
        }
        function update(edit) {
            var nextState = stateManager.get().edit(edit);
            render(nextState);
            stateManager.push(nextState);
        }
        render(initialState);
    })();
});
// import State from './state';
// import {
//     DomNode,
//     GroupMap,
//     GroupNode,
//     Node,
//     UiNode,
// } from './ast';
// import {
//     Edit,
//     EditDeleteDom,
//     EditHover,
//     EditSelect,
//     EditValue,
//     OnEdit,
//     popoff,
//     render as renderEditor,
//     renderOptions,
// } from './editContent';
// import expect from './expect';
// import renderPreview from './preview';
// function refresh(editor: HTMLElement, preview: HTMLElement, state: State,
//                  onEdit: OnEdit): State {
//     renderEditor(editor, state, onEdit);
//     renderPreview(preview, state, onEdit);
//     return state;
// }
// function editorQuery(node: Node) {
//     return `#editor-${node.id}`;
// }
// function previewQuery(node: Node) {
//     switch (node.type) {
//         case 'group-definition': return `[data-${node.id}]`;
//         case 'group': return `[data-${node.id}]`;
//         case 'dom':   return `#preview-${node.id}`;
//         case 'value': return `#preview-${node.value.id}`;
//     }
// }
// function editRemove(node: Node, state: State): State {
//     const { id } = node;
//     const { App } = state.ast;
//     function filter(children: UiNode[]): UiNode[] {
//         return children
//             .filter(child => child.id !== id)
//             .map(child => {
//                 switch (child.type) {
//                     case 'group':
//                         return new GroupNode(child.name, ...filter(child.children));
//                     case 'dom':
//                         return new DomNode(child.name, ...filter(child.children));
//                     case 'value':
//                         return child;
//                 }
//             });
//     }
//     return state.change(Object.keys(state.ast).reduce((g: GroupMap, k) => {
//         const group = state.ast[k];
//         const children = filter(group.children);
//         g[k] = group.replaceChildren(children);
//         return g;
//     }, { App }))
// }
// function editDeleteDom(editor: HTMLElement, preview: HTMLElement, state: State,
//                        edit: EditDeleteDom, onEdit: OnEdit): State {
//     // unselect first
//     let nextState = editSelect(editor, preview, state, new EditSelect(), onEdit);
//     const id = edit.node.id;
//     // delete from editor
//     const editorQ = editor.querySelector(editorQuery(edit.node));
//     const editorEl = expect(editorQ, `node to remove, ${id}`);
//     expect(editorEl.parentNode, `node's parent, ${id}`)
//         .removeChild(editorEl);
//     // delete from preview
//     const previewEls = preview.querySelectorAll(previewQuery(edit.node));
//     Array.prototype.forEach.call(previewEls, (el: HTMLElement) => {
//         const parent = expect(el.parentNode, `node's parent, ${id}`);
//         parent.removeChild(el);
//     });
//     // delete from ast
//     nextState = editRemove(edit.node, state);
//     return nextState;
// }
// function editHover(preview: HTMLElement, state: State, edit: EditHover): State {
//     const id = edit.node === undefined ? undefined : edit.node.id;
//     const nextState = state.hover(id);
//     const hovered = preview.querySelectorAll('.hovering');
//     Array.prototype.forEach.call(hovered, (el: HTMLElement) =>
//         el.classList.remove('hovering'));
//     if (edit.node) {
//         const els = preview.querySelectorAll(previewQuery(edit.node));
//         Array.prototype.forEach.call(els, (el: HTMLElement) =>
//             el.classList.add('hovering'));
//     }
//     return nextState;
// }
// function editSelect(editor: HTMLElement, preview: HTMLElement, state: State,
//                     edit: EditSelect, onEdit: OnEdit): State {
//     const id = edit.node === undefined ? undefined : edit.node.id;
//     const nextState = state.select(id);
//     const selected = preview.querySelectorAll('.selecting');
//     Array.prototype.forEach.call(selected, (el: HTMLElement) =>
//         el.classList.remove('selecting'));
//     popoff(editor);
//     if (edit.node) {
//         const els = preview.querySelectorAll(previewQuery(edit.node));
//         Array.prototype.forEach.call(els, (el: HTMLElement) =>
//             el.classList.add('selecting'));
//         renderOptions(editor, edit.node, onEdit);
//     }
//     return nextState;
// }
// function editValue(state: State, edit: EditValue): State {
//     const { App } = state.ast;
//     function editNode(node: UiNode): UiNode {
//         let children;
//         switch (node.type) {
//             case 'dom':
//                 children = node.children.map(editNode)
//                 return new DomNode(node.name, ...children);
//             case 'group':
//                 children = node.children.map(editNode)
//                 return new GroupNode(node.name, ...children);
//             case 'value':
//                 if (node.id === edit.id) {
//                     return node.replaceValue(edit.newValue);
//                 }
//                 return node;
//         }
//     }
//     const newGroups = Object.keys(state.ast).reduce((g: GroupMap, k) => {
//         const group = state.ast[k];
//         const children = group.children.map(editNode);
//         g[k] = group.replaceChildren(children);
//         return g;
//     }, { App });
//     const nextState = state.change(newGroups);
//     const el = document.getElementById(`preview-${edit.id}`);
//     if (el === null) {
//         throw new Error(`missing node to edit: ${edit.id}`);
//     }
//     el.textContent = edit.newValue;
//     return nextState;
// }
// export default function transform(editor: HTMLElement, preview: HTMLElement,
//     state: State, edit: Edit, onEdit: OnEdit): State {
//     switch (edit.editType) {
//         case 'delete-dom':
//             return editDeleteDom(editor, preview, state, edit, onEdit);
//         case 'init':
//             return refresh(editor, preview, state, onEdit);
//         case 'hover':
//             return editHover(preview, state, edit);
//         case 'select':
//             return editSelect(editor, preview, state, edit, onEdit);
//         case 'value':
//             return editValue(state, edit);
//     }
// }
//# sourceMappingURL=app.js.map