import { randomUUID } from "crypto";
import { KlapNoteMetadata } from "./types";

type GenerateMetadataParams = {
    originalMetadata?: Partial<KlapNoteMetadata>;
    metadataChanges?: Partial<KlapNoteMetadata>;
};

export function buildNotesMetadata({ originalMetadata, metadataChanges }: GenerateMetadataParams): KlapNoteMetadata {
    const now = new Date(Date.now());
    return {
        type: "metadata",
        uuid: originalMetadata?.uuid || randomUUID(),
        lastModified: now,
        created: originalMetadata?.created || now,
        tags: metadataChanges?.tags || [],
    };
}

export function getMetadataString({ metadata, prefix }: { metadata: KlapNoteMetadata; prefix?: string }): string {
    if (prefix && !prefix.includes("klap")) {
        throw new Error("klap metadata prefix must contain 'klap'");
    }

    return `${prefix || "klap "}${JSON.stringify(metadata)}`;
}
