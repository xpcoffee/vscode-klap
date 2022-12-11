/**
 * Defines the actions of the extension and registers it with the editor.
 */

import * as vscode from "vscode";
import { updateExistingMetadata, initKlapMetadata } from "./vscode-klap";

export function activate(context: vscode.ExtensionContext) {
    let klapUpdateDisposable = vscode.commands.registerCommand("klap.initMetadata", () => {
        initKlapMetadata(vscode.window.activeTextEditor);
    });
    context.subscriptions.push(klapUpdateDisposable);

    const onDidSaveDisposable = vscode.workspace.onDidSaveTextDocument(updateExistingMetadata);
    context.subscriptions.push(onDidSaveDisposable);
    console.log("should be activated...");
}

// This method is called when your extension is deactivated
export function deactivate() {}
