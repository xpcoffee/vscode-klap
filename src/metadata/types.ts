export type KlapNoteMetadata = {
    type: "metadata";
    uuid: string;
    tags: string[];
    created: Date;
    lastModified: Date;
};

export type FileContext = {
    metadataPrefix: string;
    fullMetadataMatch: string;
};

export type KlapMetadataError = {
    type: "error";
    errorMsg: string;
};

export type NoteMetadataParseResult = (KlapNoteMetadata & FileContext) | KlapMetadataError | undefined;
