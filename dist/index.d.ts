export declare enum OperatingSystemType {
    Windows = "win32",
    macOS = "darwin",
    Linux = "linux",
    FreeBSD = "freebsd",
    Solaris = "sunos",
    Unknown = "unknown"
}

export declare interface OperatingSystem {

    readonly type: OperatingSystemType;

    getDisplay(): Promise<string>;
    getVersion(): Promise<string>;
}

export declare interface WindowsOperatingSystem extends OperatingSystem {

    getEdition(): Promise<string>;
}

export declare interface LinuxOperatingSystem extends OperatingSystem {

}

export function current(): OperatingSystem;
