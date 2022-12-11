import { getConfigForFilePath } from "../core/config";
import { buildNotesMetadata, getMetadataForPath } from "../core/metadata";
import { KlapParams } from "./types";

/**
 * Runs klap for a given file path.
 *
 * @param
 * @returns
 */
export async function klap({ filePath, metadataTransform: action, onStop, onUpdate }: KlapParams) {
    const klapConfig = getConfigForFilePath(filePath);

    if (klapConfig.type !== "config") {
        onStop?.(".klap.config not found");
        return;
    }

    if (klapConfig.type !== "config" || !klapConfig.enabled) {
        onStop?.("Klap disabled in config.");
        return;
    }

    const originalMetadata = await getMetadataForPath(filePath);
    if (originalMetadata?.type === "error") {
        onStop?.(originalMetadata.errorMsg);
        return;
    }

    const metadataChanges = action?.(originalMetadata);
    const updatedMetadata = buildNotesMetadata({ originalMetadata, metadataChanges });
    updatedMetadata &&
        onUpdate?.({
            filePath,
            originalMetadata,
            updatedMetadata,
        });
}
