import { createReadStream, readFileSync } from "fs";
import { KlapNoteMetadata, NoteMetadataParseResult } from "./types";
import { createInterface } from "readline";
import { once } from "events";

const KLAP_METADATA_REGEX = /^(.{0,10}klap.*)(\{.*\})/;

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

function validateMetadata(object: unknown): KlapNoteMetadata {
    if (!(object instanceof Object)) {
        throw new Error("metadata is not an object");
    }

    if (!hasOwnProperty(object, "uuid") || typeof object["uuid"] !== "string") {
        throw new Error("uuid should exist");
    }

    if (!hasOwnProperty(object, "created") || typeof object["created"] !== "string") {
        throw new Error("created should exist");
    }

    if (!hasOwnProperty(object, "lastModified") || typeof object["lastModified"] !== "string") {
        throw new Error("lastModified should exist");
    }

    if (!hasOwnProperty(object, "tags") || !(object["tags"] instanceof Array)) {
        throw new Error("tags array should exist");
    }

    return {
        type: "metadata",
        uuid: object["uuid"],
        created: new Date(object["created"]),
        lastModified: new Date(object["lastModified"]),
        tags: object["tags"],
    };
}

function parseLine(line: string): NoteMetadataParseResult {
    const matches = line.match(KLAP_METADATA_REGEX);
    if (!matches?.length) {
        return undefined;
    }

    try {
        const [fullMatch, prefix, metadataObjectStr] = matches;
        const metadataObject = JSON.parse(metadataObjectStr);
        return {
            ...validateMetadata(metadataObject),
            metadataPrefix: prefix,
            fullMetadataMatch: fullMatch,
        };
    } catch (e) {
        return {
            type: "error",
            errorMsg: `${e}`,
        };
    }
}

export function parseMetadata(content: string): NoteMetadataParseResult {
    const lines = content.split("\n");
    for (let line of lines) {
        console.log(line);
        const parseResult = parseLine(line);
        if (parseResult?.type !== undefined) {
            return parseResult;
        }
    }
    return undefined;
}

export async function getMetadataForPath(filePath: string): Promise<NoteMetadataParseResult> {
    try {
        const rl = createInterface({
            input: createReadStream(filePath),
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            const parseResult = parseLine(line);
            if (parseResult?.type !== undefined) {
                return parseResult;
            }
        }
    } catch (err) {
        console.error(err);
    }
}
