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
define("edit", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditValue = (function () {
        function EditValue(id, newValue) {
            this.nodeType = 'value';
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
        return el;
    }
    function editGroupNode(group, onEdit) {
        var el = e('div', ['child', 'group'], e('h4', ['name'], group.name));
        return el;
    }
    function editValueNode(value, onEdit) {
        var literal = value.value;
        var content = e('span', ['literal', 'string'], "" + literal.value);
        content.setAttribute('contenteditable', 'true');
        content.addEventListener('input', function (e) {
            var text = e.target.textContent;
            if (text === null) {
                throw new Error("cannot edit a text node without text?");
            }
            onEdit(new EditValue(value.id, text));
        });
        return e('p', ['child', 'value'], content);
    }
    function editChild(child, onEdit) {
        switch (child.type) {
            case "dom": return editDomNode(child, onEdit);
            case "group": return editGroupNode(child, onEdit);
            case "value": return editValueNode(child, onEdit);
        }
    }
    function editGroup(group, onEdit) {
        var el = e('div', ['group'], e('h3', ['name'], group.name), e.apply(void 0, ['div', ['children']].concat(group.children.map(function (child) { return editChild(child, onEdit); }))));
        return el;
    }
    exports.default = function (groups, onEdit) {
        return Object.keys(groups).map(function (name) {
            return editGroup(groups[name], onEdit);
        });
    };
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
        return renderGroup(group, childContext, groups);
    }
    function renderGroup(group, context, groups) {
        return flatMap(function (child) { return renderChild(child, context, groups); }, group.children);
    }
    function renderDomNode(domNode, context, groups) {
        var el = document.createElement(domNode.name);
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
    function render(groups) {
        var App = groups.App;
        if (typeof App === 'undefined') {
            throw new Error('no App group :(');
        }
        return renderGroup(App, { children: App.children }, groups);
    }
    exports.default = render;
});
define("transform", ["require", "exports", "ast"], function (require, exports, ast_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function editValue(groups, edit) {
        var App = groups.App;
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
        return Object.keys(groups).reduce(function (g, k) {
            var group = groups[k];
            var children = group.children.map(editNode);
            g[k] = group.replaceChildren(children);
            return g;
        }, { App: App });
    }
    function transform(groups, edit) {
        switch (edit.nodeType) {
            case 'value': return editValue(groups, edit);
        }
    }
    exports.default = transform;
});
define("index", ["require", "exports", "ast", "edit", "render", "transform"], function (require, exports, ast_2, edit_1, render_1, transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var groups = {
        App: ast_2.Group.e('App', new ast_2.GroupNode('Header'), new ast_2.DomNode('div', new ast_2.DomNode('p', ast_2.Value.e('hello here is some '), new ast_2.DomNode('em', ast_2.Value.e('cool formatted')), ast_2.Value.e(' content')), new ast_2.DomNode('p', ast_2.Value.e('That is all, '), new ast_2.DomNode('a', ast_2.Value.e('thanks')), ast_2.Value.e('!'))), new ast_2.GroupNode('Footer')),
        Header: ast_2.Group.e('Header', new ast_2.DomNode('div', new ast_2.DomNode('h1', ast_2.Value.e('Hello world!')), new ast_2.DomNode('h2', ast_2.Value.e('Welcome to this demo.')))),
        Footer: ast_2.Group.e('Footer', new ast_2.DomNode('footer', new ast_2.DomNode('p', ast_2.Value.e('Good bye!')))),
    };
    function update(groups) {
        var preview = document.getElementById('preview');
        if (!preview) {
            throw new Error('no preview');
        }
        preview.innerHTML = '';
        console.log('groups', groups);
        render_1.default(groups).forEach(function (el) { return preview.appendChild(el); });
    }
    var editor = document.getElementById('source');
    if (!editor) {
        throw new Error('no editor');
    }
    editor.innerHTML = '';
    function blah(edit) {
        groups = transform_1.default(groups, edit);
        update(groups);
    }
    edit_1.default(groups, blah).forEach(function (el) { return editor.appendChild(el); });
    update(groups);
});
//# sourceMappingURL=app.js.map