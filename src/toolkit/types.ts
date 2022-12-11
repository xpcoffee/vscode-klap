import { FileContext, KlapNoteMetadata } from "../metadata/types";

type ModifiableKlapNotesMetadata = Pick<KlapNoteMetadata, ["tags"][number]>;
export type KlapAction = (noteMetadata?: KlapNoteMetadata) => ModifiableKlapNotesMetadata | undefined;

export type KlapParams = {
    filePath: string;
    action?: KlapAction;
    onStop?: (message: string) => void;
    onUpdate?: (params: {
        originalMetadata?: KlapNoteMetadata & FileContext;
        originalMetadataMatch?: string;
        updatedMetadata: KlapNoteMetadata;
    }) => void;
};
