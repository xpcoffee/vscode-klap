import { randomUUID } from "crypto";
import { KlapFileContext, KlapFileMetadata, KLAP_FILE_METADATA_FIELDS } from "./types";

type GenerateMetadataParams = {
    originalMetadata?: Partial<KlapFileMetadata>;
    metadataChanges?: Partial<KlapFileMetadata>;
    customPrefix?: string;
};

const DEFAULT_KLAP_CONFIG_PREFIX = "klap ";

function buildNotesMetadata({
    originalMetadata,
    metadataChanges,
    customPrefix,
}: GenerateMetadataParams): KlapFileMetadata & KlapFileContext {
    const now = new Date(Date.now());
    console.log({ metadataChanges });
    const metadata: KlapFileMetadata = {
        type: "metadata",
        uuid: metadataChanges?.uuid || originalMetadata?.uuid || randomUUID(),
        lastModified: now,
        created: metadataChanges?.created || originalMetadata?.created || now,
        tags: metadataChanges?.tags || originalMetadata?.tags || [],
    };

    return {
        ...metadata,
        metadataObjectString: getMetadataString({ metadata, objectOnly: true, customPrefix }),
    };
}

function getMetadataString({
    metadata,
    objectOnly,
    customPrefix,
}: {
    metadata: KlapFileMetadata;
    objectOnly?: boolean;
    customPrefix?: string;
}): string {
    // Filter out any keys that may have been added to the object
    const metadataToStringify = Object.fromEntries(
        Object.entries(metadata).filter(([key]) => KLAP_FILE_METADATA_FIELDS.find((allowed) => allowed === key))
    );
    return `${objectOnly ? "" : customPrefix ?? DEFAULT_KLAP_CONFIG_PREFIX}${JSON.stringify(metadataToStringify)}`;
}

export { buildNotesMetadata, getMetadataString };
