import { createReadStream } from "fs";
import { KlapFileMetadata, KlapFileMetadataParseResult } from "./types";
import { createInterface } from "readline";

const DEFAULT_KLAP_METADATA_REGEX = /^.{0,10}klap.*(\{.*\})/;

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

function validateMetadata(object: unknown): KlapFileMetadata {
    if (!(object instanceof Object)) {
        throw new Error("Klap metadata is not a JSON object");
    }

    if (!hasOwnProperty(object, "uuid") || typeof object["uuid"] !== "string") {
        throw new Error("value for 'uuid' must be specified");
    }

    if (!hasOwnProperty(object, "created") || typeof object["created"] !== "string") {
        throw new Error("value for 'created' must be specified");
    }

    if (!hasOwnProperty(object, "lastModified") || typeof object["lastModified"] !== "string") {
        throw new Error("value for 'lastModified' must be specified");
    }

    if (!hasOwnProperty(object, "tags") || !(object["tags"] instanceof Array)) {
        throw new Error("value for 'tags' must be specified");
    }

    return {
        type: "metadata",
        uuid: object["uuid"],
        created: new Date(object["created"]),
        lastModified: new Date(object["lastModified"]),
        tags: object["tags"],
    };
}

function parseLine(line: string, customMetadataRegex?: RegExp): KlapFileMetadataParseResult {
    const matches = line.match(customMetadataRegex ?? DEFAULT_KLAP_METADATA_REGEX);
    if (!matches?.length) {
        return undefined;
    }

    try {
        const [_fullMatch, metadataObjectStr] = matches;
        const metadataObject = JSON.parse(metadataObjectStr);
        return {
            ...validateMetadata(metadataObject),
            metadataObjectString: metadataObjectStr,
        };
    } catch (e) {
        return {
            type: "error",
            errorMsg: `[Error parsing klap metadata] ${e}`,
        };
    }
}

function parseMetadata(content: string, customMetadataRegex?: RegExp): KlapFileMetadataParseResult {
    const lines = content.split("\n");
    for (let line of lines) {
        console.log(line);
        const parseResult = parseLine(line, customMetadataRegex);
        if (parseResult?.type !== undefined) {
            return parseResult;
        }
    }
    return undefined;
}

async function readKlapMetadataFromFile(
    filePath: string,
    customMetadataRegex?: RegExp
): Promise<KlapFileMetadataParseResult> {
    try {
        const rl = createInterface({
            input: createReadStream(filePath),
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            const parseResult = parseLine(line, customMetadataRegex);
            if (parseResult?.type !== undefined) {
                return parseResult;
            }
        }
    } catch (e) {
        console.error(`[Error reading klap metadata] ${e}`);
    }
}

export { readKlapMetadataFromFile as getMetadataForPath, parseMetadata };
