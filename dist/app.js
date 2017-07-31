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
define("state", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = (function () {
        function State(groups, hovered, selected) {
            this.hovered = hovered;
            this.selected = selected;
            this.groups = groups;
        }
        State.create = function (groups) {
            return new State(groups);
        };
        State.prototype.hover = function (id) {
            return new State(this.groups, id, this.selected);
        };
        State.prototype.select = function (id) {
            return new State(this.groups, this.hovered, id);
        };
        State.prototype.change = function (groups) {
            return new State(groups, this.hovered, this.selected);
        };
        return State;
    }());
    exports.default = State;
});
define("edit", ["require", "exports", "e"], function (require, exports, e_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditDeleteDom = (function () {
        function EditDeleteDom(node) {
            this.editType = 'delete-dom';
            this.node = node;
        }
        return EditDeleteDom;
    }());
    exports.EditDeleteDom = EditDeleteDom;
    var EditInit = (function () {
        function EditInit() {
            this.editType = 'init';
        }
        return EditInit;
    }());
    exports.EditInit = EditInit;
    var EditHover = (function () {
        function EditHover(node) {
            this.editType = 'hover';
            this.node = node;
        }
        return EditHover;
    }());
    exports.EditHover = EditHover;
    var EditSelect = (function () {
        function EditSelect(node) {
            this.editType = 'select';
            this.node = node;
        }
        return EditSelect;
    }());
    exports.EditSelect = EditSelect;
    var EditValue = (function () {
        function EditValue(id, newValue) {
            this.editType = 'value';
            this.id = id;
            this.newValue = newValue;
        }
        return EditValue;
    }());
    exports.EditValue = EditValue;
    function renderDomNode(dom, onEdit) {
        var el = e_1.default('div', ['child', 'dom'], e_1.default('h4', ['name'], dom.name), e_1.default.apply(void 0, ['div', ['children']].concat(dom.children.map(function (child) { return renderChild(child, onEdit); }))));
        el.addEventListener('mouseover', function (_e) {
            onEdit(new EditHover(dom));
        }, true);
        el.addEventListener('mouseout', function (_e) {
            onEdit(new EditHover());
        }, true);
        el.addEventListener('click', function (e) {
            onEdit(new EditSelect(dom));
            e.stopPropagation();
        }, false);
        el.id = "editor-" + dom.id;
        return el;
    }
    function showDomOptions(pane, anchor, node, onEdit) {
        var options = pane.querySelector('.floating-edit-options');
        if (options === null) {
            throw new Error('missing editor options');
        }
        var del = e_1.default('button', [], '× delete');
        del.addEventListener('click', function (e) {
            onEdit(new EditDeleteDom(node));
            e.stopPropagation();
        });
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
            onEdit(new EditHover(group));
        }, true);
        el.addEventListener('mouseout', function (_e) {
            onEdit(new EditHover());
        }, true);
        el.addEventListener('click', function (_e) {
            onEdit(new EditSelect(group));
        }, true);
        el.id = "editor-" + group.id;
        return el;
    }
    function renderValueNode(value, onEdit) {
        var literal = value.value;
        var content = e_1.default('span', ['literal', 'string'], "" + literal.value);
        content.setAttribute('contenteditable', 'true');
        content.addEventListener('mouseover', function (_e) {
            onEdit(new EditHover(value));
        }, true);
        content.addEventListener('mouseout', function (_e) {
            onEdit(new EditHover());
        }, true);
        var select = function (_e) {
            onEdit(new EditSelect(value));
        };
        content.addEventListener('click', select, true);
        content.addEventListener('focus', select, true);
        content.addEventListener('blur', function (_e) {
            onEdit(new EditSelect());
        }, true);
        content.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                e.target.blur();
            }
        }, true);
        content.addEventListener('input', function (e) {
            var text = e.target.textContent;
            if (text === null) {
                throw new Error("cannot edit a text node without text?");
            }
            onEdit(new EditValue(literal.id, text));
        }, true);
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
            onEdit(new EditHover(group));
        }, true);
        name.addEventListener('mouseout', function (_e) {
            onEdit(new EditHover());
        }, true);
        name.addEventListener('click', function (_e) {
            onEdit(new EditSelect(group));
        }, true);
        var el = e_1.default('div', ['group'], name, e_1.default.apply(void 0, ['div', ['children']].concat(group.children.map(function (child) { return renderChild(child, onEdit); }))));
        el.id = "editor-" + group.id;
        return el;
    }
    function render(el, state, onEdit) {
        el.innerHTML = '';
        Object.keys(state.groups)
            .map(function (name) {
            return renderGroup(state.groups[name], onEdit);
        })
            .forEach(function (childEl) {
            return el.appendChild(childEl);
        });
        el.appendChild(e_1.default('div', ['floating-edit-options', 'off']));
    }
    exports.render = render;
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
define("render", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var flatMap = function (fn, stuff) {
        return stuff.reduce(function (a, e) {
            return a.concat(fn(e));
        }, []);
    };
    function renderGroupNode(groupNode, context, groups) {
        var group = groups[groupNode.name];
        if (typeof group === 'undefined') {
            throw new Error("Unknown group: " + groupNode.name);
        }
        var childContext = __assign({}, context, { children: groupNode.children });
        var childEls = renderGroup(group, childContext, groups);
        childEls.forEach(function (el) {
            el.setAttribute("data-" + groupNode.id, 'preview');
        });
        return childEls;
    }
    function renderGroup(group, context, groups) {
        var childEls = flatMap(function (child) {
            return renderChild(child, context, groups);
        }, group.children);
        childEls.forEach(function (el) {
            el.setAttribute("data-" + group.id, 'preview');
        });
        return childEls;
    }
    function renderDomNode(domNode, context, groups) {
        var el = document.createElement(domNode.name);
        el.id = "preview-" + domNode.id;
        var childContext = __assign({}, context, { children: domNode.children });
        domNode.children.forEach(function (child) {
            return renderChild(child, childContext, groups).forEach(function (childEl) {
                return el.appendChild(childEl);
            });
        });
        return el;
    }
    function renderValueNode(value) {
        var el = document.createElement('span');
        el.innerHTML = "" + value.value;
        el.id = "preview-" + value.id;
        return el;
    }
    function renderChild(child, context, groups) {
        switch (child.type) {
            case "group":
                return renderGroupNode(child, context, groups);
            case "dom":
                return [renderDomNode(child, context, groups)];
            case "value":
                return [renderValueNode(child.value)];
        }
    }
    function render(el, state, _onEdit) {
        el.innerHTML = '';
        var App = state.groups.App;
        if (typeof App === 'undefined') {
            throw new Error('no App group :(');
        }
        renderGroup(App, { children: App.children }, state.groups)
            .forEach(function (childEl) { return el.appendChild(childEl); });
    }
    exports.default = render;
});
define("transform", ["require", "exports", "ast", "edit", "expect", "render"], function (require, exports, ast_1, edit_1, expect_1, render_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function refresh(editor, preview, state, onEdit) {
        edit_1.render(editor, state, onEdit);
        render_1.default(preview, state, onEdit);
        return state;
    }
    function editorQuery(node) {
        return "#editor-" + node.id;
    }
    function previewQuery(node) {
        switch (node.type) {
            case 'group-definition': return "[data-" + node.id + "]";
            case 'group': return "[data-" + node.id + "]";
            case 'dom': return "#preview-" + node.id;
            case 'value': return "#preview-" + node.value.id;
        }
    }
    function editRemove(node, state) {
        var id = node.id;
        var App = state.groups.App;
        function filter(children) {
            return children
                .filter(function (child) { return child.id !== id; })
                .map(function (child) {
                switch (child.type) {
                    case 'group':
                        return new (ast_1.GroupNode.bind.apply(ast_1.GroupNode, [void 0, child.name].concat(filter(child.children))))();
                    case 'dom':
                        return new (ast_1.DomNode.bind.apply(ast_1.DomNode, [void 0, child.name].concat(filter(child.children))))();
                    case 'value':
                        return child;
                }
            });
        }
        return state.change(Object.keys(state.groups).reduce(function (g, k) {
            var group = state.groups[k];
            var children = filter(group.children);
            g[k] = group.replaceChildren(children);
            return g;
        }, { App: App }));
    }
    function editDeleteDom(editor, preview, state, edit, onEdit) {
        // unselect first
        var nextState = editSelect(editor, preview, state, new edit_1.EditSelect(), onEdit);
        var id = edit.node.id;
        // delete from editor
        var editorQ = editor.querySelector(editorQuery(edit.node));
        var editorEl = expect_1.default(editorQ, "node to remove, " + id);
        expect_1.default(editorEl.parentNode, "node's parent, " + id)
            .removeChild(editorEl);
        // delete from preview
        var previewEls = preview.querySelectorAll(previewQuery(edit.node));
        Array.prototype.forEach.call(previewEls, function (el) {
            var parent = expect_1.default(el.parentNode, "node's parent, " + id);
            parent.removeChild(el);
        });
        // delete from ast
        nextState = editRemove(edit.node, state);
        return nextState;
    }
    function editHover(preview, state, edit) {
        var id = edit.node === undefined ? undefined : edit.node.id;
        var nextState = state.hover(id);
        var hovered = preview.querySelectorAll('.hovering');
        Array.prototype.forEach.call(hovered, function (el) {
            return el.classList.remove('hovering');
        });
        if (edit.node) {
            var els = preview.querySelectorAll(previewQuery(edit.node));
            Array.prototype.forEach.call(els, function (el) {
                return el.classList.add('hovering');
            });
        }
        return nextState;
    }
    function editSelect(editor, preview, state, edit, onEdit) {
        var id = edit.node === undefined ? undefined : edit.node.id;
        var nextState = state.select(id);
        var selected = preview.querySelectorAll('.selecting');
        Array.prototype.forEach.call(selected, function (el) {
            return el.classList.remove('selecting');
        });
        edit_1.popoff(editor);
        if (edit.node) {
            var els = preview.querySelectorAll(previewQuery(edit.node));
            Array.prototype.forEach.call(els, function (el) {
                return el.classList.add('selecting');
            });
            edit_1.renderOptions(editor, edit.node, onEdit);
        }
        return nextState;
    }
    function editValue(state, edit) {
        var App = state.groups.App;
        function editNode(node) {
            var children;
            switch (node.type) {
                case 'dom':
                    children = node.children.map(editNode);
                    return new (ast_1.DomNode.bind.apply(ast_1.DomNode, [void 0, node.name].concat(children)))();
                case 'group':
                    children = node.children.map(editNode);
                    return new (ast_1.GroupNode.bind.apply(ast_1.GroupNode, [void 0, node.name].concat(children)))();
                case 'value':
                    if (node.id === edit.id) {
                        return node.replaceValue(edit.newValue);
                    }
                    return node;
            }
        }
        var newGroups = Object.keys(state.groups).reduce(function (g, k) {
            var group = state.groups[k];
            var children = group.children.map(editNode);
            g[k] = group.replaceChildren(children);
            return g;
        }, { App: App });
        var nextState = state.change(newGroups);
        var el = document.getElementById("preview-" + edit.id);
        if (el === null) {
            throw new Error("missing node to edit: " + edit.id);
        }
        el.textContent = edit.newValue;
        return nextState;
    }
    function transform(editor, preview, state, edit, onEdit) {
        switch (edit.editType) {
            case 'delete-dom':
                return editDeleteDom(editor, preview, state, edit, onEdit);
            case 'init':
                return refresh(editor, preview, state, onEdit);
            case 'hover':
                return editHover(preview, state, edit);
            case 'select':
                return editSelect(editor, preview, state, edit, onEdit);
            case 'value':
                return editValue(state, edit);
        }
    }
    exports.default = transform;
});
define("index", ["require", "exports", "ast", "edit", "state", "expect", "transform"], function (require, exports, ast_2, edit_2, state_1, expect_2, transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        var editor = expect_2.default(document.getElementById('source'), 'editor pane');
        editor.innerHTML = '';
        var preview = expect_2.default(document.getElementById('preview'), 'preview pane');
        preview.innerHTML = '';
        var initialState = state_1.default.create(demoGroups);
        var stateManager = new StateManager(initialState);
        function update(edit) {
            var nextState = transform_1.default(editor, preview, stateManager.get(), edit, update);
            stateManager.push(nextState);
        }
        update(new edit_2.EditInit());
    })();
});
//# sourceMappingURL=app.js.map