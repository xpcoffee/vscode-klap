export type KlapConfig = {
    type: "config";
    enabled: boolean;
};

export type KlapConfigError = {
    type: "error";
    errorMsg: string;
};

export type KlapConfigParseResult = KlapConfig | KlapConfigError;
