import { KlapConfig, KlapConfigParseResult } from "./types";
import { join, dirname } from "path";
import { readFileSync } from "fs";

const DEFAULT_KLAP_CONFIG_FILE = ".klap.json";

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

function validateConfig(object: unknown): KlapConfig {
    if (!(object instanceof Object)) {
        throw new Error("config is not a JSON object");
    }

    if (!hasOwnProperty(object, "enabled") || typeof object["enabled"] !== "boolean") {
        throw new Error("key 'enabled' should exist");
    }

    return {
        type: "config",
        enabled: object["enabled"],
    };
}

function parseConfig(content: string): KlapConfigParseResult {
    try {
        return validateConfig(JSON.parse(content));
    } catch (e) {
        return {
            type: "error",
            errorMsg: `[Error validating klap config contents] ${e}`,
        };
    }
}

function getConfigForFilePath(path: string, configFileName?: string): KlapConfigParseResult {
    try {
        const directory = dirname(path);
        const configPath = join(directory, configFileName || DEFAULT_KLAP_CONFIG_FILE);
        const contents = readFileSync(configPath, "utf-8");
        return parseConfig(contents);
    } catch (e) {
        return {
            type: "error",
            errorMsg: `[Error parsing klap config] ${e}`,
        };
    }
}

export { parseConfig, getConfigForFilePath };
