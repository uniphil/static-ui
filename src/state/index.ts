import Ast, {
    Edit as AstEdit,
    editAst,
} from './ast';

import Content, {
    Edit as ContentEdit,
} from './content';


export type Edit = AstEdit | ContentEdit;

export type OnEdit = (payload: Edit) => void;


export default class State {
    readonly ast: Ast;
    readonly content: Content;

    private constructor(ast: Ast, content: Content) {
        this.ast = ast;
        this.content = content;
    }

    static create(ast: Ast) {
        return new State(ast, Content.create());
    }

    edit(edit: Edit) {
        switch (edit.type) {
            case 'ast':     return this.editAst(edit);
            case 'content': return this.editContent(edit);
        }
    }

    editContent(edit: ContentEdit) {
        const nextContent = this.content.edit(edit);
        return new State(this.ast, nextContent);
    }

    editAst(edit: AstEdit) {
        const nextAst = editAst(edit, this.ast);
        return new State(nextAst, this.content);
    }
}
