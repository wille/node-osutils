import { OperatingSystem, OperatingSystemType } from "./os";
import { WindowsOperatingSystem } from "./windows";
import { LinuxOperatingSystem } from "./linux";
import { MacOSOperatingSystem } from "./macos";

/**
 * Gets type from node style platform identifier
 * @param platform defaults to process.platform
 */
function getType(platform: string = process.platform): OperatingSystem {
    let os: OperatingSystem;

    switch (platform) {
        case "win32":
            os = new WindowsOperatingSystem();
            break;
        case "darwin":
            os = new MacOSOperatingSystem();
            break;
        case "linux":
            os = new LinuxOperatingSystem();
            break;
        case "freebsd":
        case "sunos":
        default:
            throw new Error("os " + platform + " not supported");
    }

    return os;
}

export function current(): OperatingSystem {
    return getType();
}

export * from "./windows";
export * from "./linux";
export * from "./macos";