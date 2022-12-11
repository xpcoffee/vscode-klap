import { KlapFileContext, KlapFileMetadata } from "../core/metadata/types";

type ModifiableKlapFileMetadata = Pick<KlapFileMetadata, ["tags"][number]>;

export type KlapFileMetadataTransform = (noteMetadata?: KlapFileMetadata) => ModifiableKlapFileMetadata | undefined;

export type KlapOnUpdate = (params: {
    filePath: string;
    originalMetadata?: KlapFileMetadata & KlapFileContext;
    updatedMetadata: KlapFileMetadata & KlapFileContext;
}) => void;

export type KlapOnStop = (message: string) => void;

export type KlapParams = {
    filePath: string;
    metadataTransform?: KlapFileMetadataTransform;
    onStop?: KlapOnStop;
    onUpdate?: KlapOnUpdate;
};
