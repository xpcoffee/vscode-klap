/**
 * Contains klap functionality that is specific to vscode.
 */

import * as vscode from "vscode";
import { getMetadataString } from "../klap/core/metadata";
import { klap } from "../klap/toolkit";
import { asNewCommentOnFirstLine } from "./vscodeUtils";

function initKlapMetadata(editor?: vscode.TextEditor, forceInit?: boolean) {
    const filePath = editor?.document?.uri.fsPath;

    if (!filePath) {
        return;
    }

    klap({
        filePath,
        onUpdate: ({ originalMetadata, updatedMetadata }) => {
            if (forceInit || originalMetadata === undefined) {
                const newMetadataString = getMetadataString({ metadata: updatedMetadata, objectOnly: false });
                asNewCommentOnFirstLine(newMetadataString, editor);
            }
        },
        onStop: console.error,
    });
}

export { initKlapMetadata };
