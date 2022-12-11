import { readFileSync, writeFileSync } from "fs";
import * as vscode from "vscode";
import { getMetadataString } from "./metadata/generate";
import { KlapNoteMetadata } from "./metadata/types";
import { klap } from "./toolkit";

export function activate(context: vscode.ExtensionContext) {
    let klapUpdateDisposable = vscode.commands.registerCommand("klap.update", klapUpdateWithEditor);
    context.subscriptions.push(klapUpdateDisposable);

    const onDidSaveDisposable = vscode.workspace.onDidSaveTextDocument(klapUpdateWithoutEditor);
    context.subscriptions.push(onDidSaveDisposable);
}

function klapUpdateWithEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // only update current open file
    const filePath = editor.document.uri.fsPath;

    klap({
        filePath,
        onUpdate: ({ originalMetadata, updatedMetadata }) => {
            if (originalMetadata === undefined && editor) {
                insertNewMetadata(editor, updatedMetadata);
            }
        },
        onStop: console.log,
    });
}

function klapUpdateWithoutEditor(document?: vscode.TextDocument) {
    const filePath = document?.uri.fsPath;
    console.log({ filePath, document });

    if (!filePath) {
        return;
    }

    klap({
        filePath,
        onUpdate: ({ originalMetadata, updatedMetadata }) => {
            console.log("updating");
            if (originalMetadata !== undefined) {
                updateExistingMetadata({
                    path: filePath,
                    originalMetadataObjectString: originalMetadata.metadataObjectString,
                    updatedMetadata,
                });
            }
        },
        onStop: console.log,
    });
}

function insertNewMetadata(editor: vscode.TextEditor, metadata: KlapNoteMetadata) {
    const metadataString = getMetadataString({ metadata });
    withNewCommentOnFirstLine(editor, () => {
        editor.edit((builder) => {
            builder.insert(editor.selection.active, `${metadataString}`);
        });
    });
}

function updateExistingMetadata({
    path,
    originalMetadataObjectString,
    updatedMetadata,
}: {
    path: string;
    originalMetadataObjectString: string;
    updatedMetadata: KlapNoteMetadata;
}) {
    const updatedMetadataString = getMetadataString({ metadata: updatedMetadata, objectOnly: true });
    const fileContents = readFileSync(path, "utf-8");
    const newContents = fileContents.replace(originalMetadataObjectString, updatedMetadataString);
    writeFileSync(path, newContents);
}

function withNewCommentOnFirstLine(editor: vscode.TextEditor, callback: () => void) {
    editor.edit((builder) => {
        builder.insert(editor.document.positionAt(0), `\n`);
    });
    const documentStart = editor.selection.active.with(0);
    const cursorStart = new vscode.Selection(documentStart, documentStart);
    editor.selection = cursorStart;

    vscode.commands.executeCommand("editor.action.commentLine").then(callback);
}

// This method is called when your extension is deactivated
export function deactivate() {}
