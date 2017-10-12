import * as os from "./os";
import { spawn } from "child_process";
import * as fs from "fs";

interface Release {
    /**
     * kern.osrelease number
     */
    release: number;

    /**
     * macOS or Mac OS X
     */
    name: "macOS" | "Mac OS X";

    /**
     * Version number (10.12)
     */
    version: string;

    /**
     * Edition (Sierra)
     */
    edition: string;
}

const releases: Release[] = [
    {
        release: 16,
        name: "macOS",
        version: "10.12",
        edition: "Sierra"
    },
    {
        release: 15,
        name: "Mac OS X",
        version: "10.11",
        edition: "El Capitan"
    },
    {
        release: 14,
        name: "Mac OS X",
        version: "10.10",
        edition: "Yosemite"
    },
    {
        release: 13,
        name: "Mac OS X",
        version: "10.9",
        edition: "Mavericks"
    },
    {
        release: 12,
        name: "Mac OS X",
        version: "10.8",
        edition: "Mountain Lion"
    },
    {
        release: 11,
        name: "Mac OS X",
        version: "10.6",
        edition: "Snow Leopard"
    }
];

export class MacOSOperatingSystem extends os.OperatingSystem {

    constructor() {
        super(os.OperatingSystemType.macOS);
    }

    /**
     * Returns the internal release number (kern.osrelease)
     */
    private async getRelease() {
        return new Promise<string>((resolve, reject) => {
            let cmd = spawn("sysctl", [ "-n", "kern.osrelease" ]);

            cmd.stdout.on("data", (data: string | Buffer) => {
                if (typeof data !== "string") {
                    data = data.toString();
                }

                cmd.kill();

                resolve(data);
            });
        });
    }

    /**
     * Returns the macOS version (10.12, 10.11...)
     */
    public async getVersion() {
        let release = await this.getRelease();

        for (let r of releases) {
            if (String(r.release) === release) {
                return r.version;
            }
        }

        return null;
    }

    /**
     * Returns the macOS display string
     * macOS 10.12 Sierra
     * Mac OS X 10.11 El Capitan
     */
    public async getDisplay() {
        let display = "macOS";
        let release = await this.getRelease();

        if (release) {
            for (let r of releases) {
                if (String(r.release) === release) {
                    display = r.name + " " + r.version + " " + r.edition;
                    break;
                }
            }
        }

        return display;
    }
}