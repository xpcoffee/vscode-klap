export type KlapFileMetadata = {
    type: "metadata";
    uuid: string;
    tags: string[];
    created: Date;
    lastModified: Date;
};

export const KLAP_FILE_METADATA_FIELDS: [keyof KlapFileMetadata][number][] = [
    "uuid",
    "tags",
    "created",
    "lastModified",
];

export type KlapFileContext = {
    metadataObjectString: string;
};

export type KlapFileMetadataError = {
    type: "error";
    errorMsg: string;
};

export type KlapFileMetadataParseResult = (KlapFileMetadata & KlapFileContext) | KlapFileMetadataError | undefined;
