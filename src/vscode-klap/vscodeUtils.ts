import * as vscode from "vscode";

async function asNewCommentOnFirstLine(content: string, editor: vscode.TextEditor) {
    editor.edit((builder) => {
        builder.insert(editor.document.positionAt(0), `\n`);
    });

    const documentStart = editor.selection.active.with(0);
    const cursorStart = new vscode.Selection(documentStart, documentStart);
    editor.selection = cursorStart;

    await vscode.commands.executeCommand("editor.action.commentLine");

    editor.edit((builder) => {
        builder.insert(editor.selection.active, `${content}`);
    });
}

export { asNewCommentOnFirstLine };
