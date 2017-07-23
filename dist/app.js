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
        function Group(name) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            this.id = id('group-definition');
            this.name = name;
            this.children = children;
        }
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
        function Value(value) {
            this.type = 'value';
            this.id = id('value');
            this.value = new Literal(value);
        }
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
define("edit", ["require", "exports"], function (require, exports) {
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
    function editDomNode(dom) {
        var el = e('div', ['child', 'dom'], e('h4', ['name'], dom.name), e.apply(void 0, ['div', ['children']].concat(dom.children.map(editChild))));
        return el;
    }
    function editGroupNode(group) {
        var el = e('div', ['child', 'group'], e('h4', ['name'], group.name));
        return el;
    }
    function editValueNode(value) {
        var literal = value.value;
        var content = e('span', ['literal', 'string'], "" + literal.value);
        content.setAttribute('contenteditable', 'true');
        content.addEventListener('input', function (e) {
            var target = document.getElementById("preview-" + value.value.id);
            if (!target) {
                throw new Error("preview out of sync, could not find #preview-" + value.value.id);
            }
            target.textContent = e.target.textContent;
        });
        return e('p', ['child', 'value'], content);
    }
    function editChild(child) {
        switch (child.type) {
            case "dom": return editDomNode(child);
            case "group": return editGroupNode(child);
            case "value": return editValueNode(child);
        }
    }
    function editGroup(group) {
        var el = e('div', ['group'], e('h3', ['name'], group.name), e.apply(void 0, ['div', ['children']].concat(group.children.map(editChild))));
        return el;
    }
    exports.default = function (groups) {
        return Object.keys(groups).map(function (name) {
            return editGroup(groups[name]);
        });
    };
});
define("index", ["require", "exports", "ast", "render", "edit"], function (require, exports, ast_1, render_1, edit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var groups = {
        App: new ast_1.Group('App', new ast_1.GroupNode('Header'), new ast_1.DomNode('div', new ast_1.DomNode('p', new ast_1.Value('hello here is some '), new ast_1.DomNode('em', new ast_1.Value('cool formatted')), new ast_1.Value(' content')), new ast_1.DomNode('p', new ast_1.Value('That is all, thanks'))), new ast_1.GroupNode('Footer')),
        Header: new ast_1.Group('Header', new ast_1.DomNode('div', new ast_1.DomNode('h1', new ast_1.Value('Hello world!')), new ast_1.DomNode('h2', new ast_1.Value('Welcome to this demo.')))),
        Footer: new ast_1.Group('Footer', new ast_1.DomNode('footer', new ast_1.DomNode('p', new ast_1.Value('Good bye!')))),
    };
    console.log('groups', groups);
    var editor = document.getElementById('source');
    if (!editor) {
        throw new Error('no editor');
    }
    editor.innerHTML = '';
    edit_1.default(groups).forEach(function (el) { return editor.appendChild(el); });
    var preview = document.getElementById('preview');
    if (!preview) {
        throw new Error('no preview');
    }
    preview.innerHTML = '';
    render_1.default(groups).forEach(function (el) { return preview.appendChild(el); });
});
//# sourceMappingURL=app.js.map