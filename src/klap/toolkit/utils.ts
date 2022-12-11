import { readFileSync, writeFileSync } from "fs";
import { KlapOnUpdate } from "./types";

const updateExistingMetadata: KlapOnUpdate = ({ filePath, originalMetadata, updatedMetadata }) => {
    if (originalMetadata !== undefined) {
        replaceTextInFile({
            path: filePath,
            searchValue: originalMetadata.metadataObjectString,
            replaceValue: updatedMetadata.metadataObjectString,
        });
    }
};

function replaceTextInFile({
    path,
    searchValue,
    replaceValue,
}: {
    path: string;
    searchValue: string;
    replaceValue: string;
}) {
    const fileContents = readFileSync(path, "utf-8");
    const newContents = fileContents.replace(searchValue, replaceValue);
    writeFileSync(path, newContents);
}

export { updateExistingMetadata };
