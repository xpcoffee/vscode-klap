import { randomUUID } from "crypto";
import { KlapNoteMetadata } from "./types";

type GenerateMetadataParams = {
    originalMetadata?: Partial<KlapNoteMetadata>;
    metadataChanges?: Partial<KlapNoteMetadata>;
};

export function buildNotesMetadata({ originalMetadata, metadataChanges }: GenerateMetadataParams): KlapNoteMetadata {
    const now = new Date(Date.now());
    console.log({ metadataChanges });
    return {
        type: "metadata",
        uuid: metadataChanges?.uuid || originalMetadata?.uuid || randomUUID(),
        lastModified: now,
        created: metadataChanges?.created || originalMetadata?.created || now,
        tags: metadataChanges?.tags || originalMetadata?.tags || [],
    };
}

export function getMetadataString({
    metadata,
    objectOnly,
}: {
    metadata: KlapNoteMetadata;
    objectOnly?: boolean;
}): string {
    return `${objectOnly ? "" : "klap "}${JSON.stringify(metadata)}`;
}
