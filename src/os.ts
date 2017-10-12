export enum OperatingSystemType {
    Windows = "win32",
    macOS = "darwin",
    Linux = "linux",
    FreeBSD = "freebsd",
    Solaris = "sunos",
    Unknown = "unknown"
}

export abstract class OperatingSystem {

    private _version: string;
    private _text: string;

    constructor(public readonly type: OperatingSystemType) {

    }

    public abstract async getVersion(): Promise<string>;
    public abstract async getDisplay(): Promise<string>;
}
