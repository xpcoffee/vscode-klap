/**
 * Adapts functionality from the klap toolkit so it can be more-easily used in vscode.
 */

import * as vscode from "vscode";
import { klap, updateExistingMetadata as toolkitUpdateExistingMetadata } from "../klap/toolkit";

function updateExistingMetadata(document?: vscode.TextDocument) {
    const filePath = document?.uri.fsPath;

    if (!filePath) {
        return;
    }

    klap({
        filePath,
        onUpdate: toolkitUpdateExistingMetadata,
        onStop: console.error,
    });
}

export { updateExistingMetadata };
