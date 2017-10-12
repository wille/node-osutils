import * as os from "./os";
import { spawn } from "child_process";
import * as fs from "fs";

interface Distribution {
    /**
     * Name of the dist
     */
    name: string;

    /**
     * Alternative names which can appear in some files
     */
    altnames?: string[];

    /**
     * Files that only exists if running this dist
     */
    files?: string[];
}

const dists: Distribution[] = [
    {
        name: "Debian"
    },
    {
        name: "Ubuntu"
    },
    {
        name: "openSUSE",
        altnames: [
            "SUSE Linux",
            "openSUSE project"
        ],
        files: [
            "/etc/SuSE-release"
        ]
    },
    {
        name: "Mint Linux",
        altnames: [
            "LinuxMint",
            "mint"
        ]
    },
    {
        name: "Gentoo",
        files: [
            "/etc/gentoo-release"
        ]
    },
    {
        name: "Fedora",
        files: [
            "/etc/fedora-release"
        ]
    },
    {
        name: "CentOS",
        files: [
            "/etc/centos-release"
        ]
    },
    {
        name: "Arch Linux",
        altnames: [
            "archlinux",
            "archarm"
        ]
    },
    {
        name: "Kali Linux",
        altnames: [
            "kali",
            "debian kali linux"
        ]
    }
];

/**
 * Returns output of "lsb_release -irc" command
 * mapped in array with key-value
 */
async function getLSB() {
    return new Promise<string[]>((resolve, reject) => {
        let cmd = spawn("lsb_release", ["-irc"]);

        let output = "";

        cmd.stdout.on("data", (data) => {
            output += data.toString();
        });

        cmd.stdout.on("end", () => {
            // split at newline
            let lines = output.split("\n");

            let map: string[] = [];

            // split keys and values and add to map
            for (let pair of lines) {
                let split = pair.split(":");
                if (split && split.length === 2) {
                    map[split[0].trim()] = split[1].trim();
                }
            }

            resolve(map);
        });
    });
}

/**
 * Returns /etc/os-release file
 */
async function getOSRelease() {
    let map: string[] = [];

    await fs.readFile("/etc/os-release", (err, data) => {
        for (let line of data.toString().split("\n")) {
            let pair = line.split("=");
            map[pair[0].trim()] = pair[1].trim();
        }
    });

    return map;
}

export class LinuxOperatingSystem extends os.OperatingSystem {

    constructor() {
        super(os.OperatingSystemType.Linux);
    }

    /**
     * Returns the kernel version (uname -r)
     */
    public async getVersion() {
        return new Promise<string>((resolve, reject) => {
            let p = spawn("uname", ["-r"]);

            p.stdout.on("data", (data) => {
                p.kill();
                resolve(data.toString());
            });
        });
    }

    /**
     * Returns the display string
     */
    public async getDisplay() {
        let detect;
        let release;
        let codename;
        
        try {
            let lsb = await getLSB();
            detect = lsb["Distributor ID"];
            release = lsb["Release"];
            codename = lsb["Codename"];
        } catch (e) {
            let map = await getOSRelease().catch((e) => {
                throw e;
            });

            detect = map["DISTRIB_ID"] || map["NAME"];
            release = map["VERSION_ID"] || map["DISTRIB_RELEASE"];
            codename = map["DISTRIB_CODENAME"];
        }

        for (let dist of dists) {
            if (dist.name.toLowerCase() === detect.toLowerCase()) {
                break;
            }

            let found = false;            
            if (dist.altnames) {
                for (let alt of dist.altnames) {
                    if (alt === detect.toLowerCase()) {
                        found = true;
                        break;
                    }
                }
    
                if (found) {
                    break;
                }
            }

            if (dist.files) {
                for (let file of dist.files) {
                    if (fs.existsSync(file)) {
                        found = true;
                        break;
                    }
                }
    
                if (found) {
                    break;
                }
            }
        }

        return detect + " " + release + " " + codename;
    }
}