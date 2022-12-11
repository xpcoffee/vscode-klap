import { getConfigForFilePath } from "../config/parse";
import { buildNotesMetadata } from "../metadata/generate";
import { getMetadataForPath } from "../metadata/parse";
import { KlapParams } from "./types";

/**
 * Runs klap for a given file path.
 *
 * @param
 * @returns
 */
export function klap({ filePath, action, onStop, onUpdate }: KlapParams) {
    const klapConfig = getConfigForFilePath(filePath);

    if (klapConfig.type !== "config") {
        onStop?.(".klap.config not found");
        return;
    }

    if (klapConfig.type !== "config" || !klapConfig.enabled) {
        onStop?.("Klap disabled in config.");
        return;
    }

    getMetadataForPath(filePath).then((originalMetadata) => {
        if (originalMetadata?.type === "error") {
            onStop?.(originalMetadata.errorMsg);
            return;
        }

        const metadataChanges = action?.(originalMetadata);
        const updatedMetadata = buildNotesMetadata({ originalMetadata, metadataChanges });
        updatedMetadata && onUpdate?.({ originalMetadata, updatedMetadata });
    });
}
