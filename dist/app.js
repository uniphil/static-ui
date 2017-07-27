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
define("state", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = (function () {
        function State(editor, preview, groups, hovered, selected) {
            this.editor = editor;
            this.preview = preview;
            this.hovered = hovered;
            this.selected = selected;
            this.groups = groups;
        }
        State.create = function (editor, preview, groups) {
            return new State(editor, preview, groups);
        };
        State.prototype.hover = function (id) {
            return new State(this.editor, this.preview, this.groups, id, this.selected);
        };
        State.prototype.select = function (id) {
            return new State(this.editor, this.preview, this.groups, this.hovered, id);
        };
        State.prototype.change = function (groups) {
            return new State(this.editor, this.preview, groups, this.hovered, this.selected);
        };
        return State;
    }());
    exports.default = State;
});
define("edit", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    function editDomNode(dom, onEdit) {
        var el = e('div', ['child', 'dom'], e('h4', ['name'], dom.name), e.apply(void 0, ['div', ['children']].concat(dom.children.map(function (child) { return editChild(child, onEdit); }))));
        el.addEventListener('mouseover', function (e) {
            e.preventDefault();
            onEdit(new EditHover(dom));
        }, true);
        el.addEventListener('mouseout', function (e) {
            e.preventDefault();
            onEdit(new EditHover());
        }, true);
        return el;
    }
    function editGroupNode(group, onEdit) {
        var el = e('div', ['child', 'group'], e('h4', ['name'], group.name));
        el.addEventListener('mouseover', function (e) {
            e.preventDefault();
            onEdit(new EditHover(group));
        }, true);
        el.addEventListener('mouseout', function (e) {
            e.preventDefault();
            onEdit(new EditHover());
        }, true);
        return el;
    }
    function editValueNode(value, onEdit) {
        var literal = value.value;
        var content = e('span', ['literal', 'string'], "" + literal.value);
        content.setAttribute('contenteditable', 'true');
        content.addEventListener('mouseover', function (e) {
            e.preventDefault();
            onEdit(new EditHover(value));
        }, true);
        content.addEventListener('mouseout', function (e) {
            e.preventDefault();
            onEdit(new EditHover());
        }, true);
        content.addEventListener('click', function (e) {
            e.preventDefault();
            onEdit(new EditSelect(value));
        }, true);
        content.addEventListener('input', function (e) {
            var text = e.target.textContent;
            if (text === null) {
                throw new Error("cannot edit a text node without text?");
            }
            onEdit(new EditValue(literal.id, text));
        }, true);
        return e('p', ['child', 'value'], content);
    }
    function editChild(child, onEdit) {
        switch (child.type) {
            case "dom": return editDomNode(child, onEdit);
            case "group": return editGroupNode(child, onEdit);
            case "value": return editValueNode(child, onEdit);
        }
    }
    function renderGroup(group, onEdit) {
        var name = e('h3', ['name'], group.name);
        name.addEventListener('mouseover', function (e) {
            e.preventDefault();
            onEdit(new EditHover(group));
        }, true);
        name.addEventListener('mouseout', function (e) {
            e.preventDefault();
            onEdit(new EditHover());
        }, true);
        var el = e('div', ['group'], name, e.apply(void 0, ['div', ['children']].concat(group.children.map(function (child) { return editChild(child, onEdit); }))));
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
    }
    exports.render = render;
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
            el.setAttribute("data-" + groupNode.id, 'ya');
        });
        return childEls;
    }
    function renderGroup(group, context, groups) {
        var childEls = flatMap(function (child) {
            return renderChild(child, context, groups);
        }, group.children);
        childEls.forEach(function (el) {
            el.setAttribute("data-" + group.id, 'ya');
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
define("transform", ["require", "exports", "ast", "edit", "render"], function (require, exports, ast_1, edit_1, render_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function refresh(state, onEdit) {
        edit_1.render(state.editor, state, onEdit);
        render_1.default(state.preview, state, onEdit);
        return state;
    }
    // function selectPreview(preview: HTMLElement, node: DomNode | GroupNode) {
    // }
    function selectPreviewAll(preview, node) {
        var q = (function () {
            switch (node.type) {
                case 'group-definition': return "[data-" + node.id + "]";
                case 'group': return "[data-" + node.id + "]";
                case 'dom': return "#preview-" + node.id;
                case 'value': return "#preview-" + node.value.id;
            }
        })();
        return preview.querySelectorAll(q);
    }
    function editHover(state, edit) {
        var id = edit.node === undefined ? undefined : edit.node.id;
        var nextState = state.hover(id);
        var hovered = state.preview.querySelectorAll('.hovering');
        Array.prototype.forEach.call(hovered, function (el) {
            return el.classList.remove('hovering');
        });
        if (edit.node) {
            var els = selectPreviewAll(state.preview, edit.node);
            Array.prototype.forEach.call(els, function (el) {
                return el.classList.add('hovering');
            });
        }
        return nextState;
    }
    function editSelect(state, edit) {
        var id = edit.node === undefined ? undefined : edit.node.id;
        var nextState = state.select(id);
        var selected = state.preview.querySelectorAll('.selecting');
        Array.prototype.forEach.call(selected, function (el) {
            return el.classList.remove('selecting');
        });
        if (edit.node) {
            var els = selectPreviewAll(state.preview, edit.node);
            Array.prototype.forEach.call(els, function (el) {
                return el.classList.add('selecting');
            });
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
    function transform(state, edit, onEdit) {
        switch (edit.editType) {
            case 'init': return refresh(state, onEdit);
            case 'hover': return editHover(state, edit);
            case 'select': return editSelect(state, edit);
            case 'value': return editValue(state, edit);
        }
    }
    exports.default = transform;
});
define("index", ["require", "exports", "ast", "edit", "state", "transform"], function (require, exports, ast_2, edit_2, state_1, transform_1) {
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
        var editor = document.getElementById('source');
        if (!editor) {
            throw new Error('no editor');
        }
        editor.innerHTML = '';
        var preview = document.getElementById('preview');
        if (!preview) {
            throw new Error('no preview');
        }
        preview.innerHTML = '';
        var initialState = state_1.default.create(editor, preview, demoGroups);
        var stateManager = new StateManager(initialState);
        function update(edit) {
            var nextState = transform_1.default(stateManager.get(), edit, update);
            stateManager.push(nextState);
        }
        update(new edit_2.EditInit());
    })();
});
//# sourceMappingURL=app.js.map