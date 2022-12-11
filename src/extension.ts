import * as vscode from "vscode";
import { updateExistingMetadata, initKlapMetadata } from "./vscode-klap";

export function activate(context: vscode.ExtensionContext) {
    let klapUpdateDisposable = vscode.commands.registerCommand("klap.initMetadata", () => {
        initKlapMetadata(vscode.window.activeTextEditor);
    });
    context.subscriptions.push(klapUpdateDisposable);

    const onDidSaveDisposable = vscode.workspace.onDidSaveTextDocument(updateExistingMetadata);
    context.subscriptions.push(onDidSaveDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
