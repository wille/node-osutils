import * as os from "./os";
import { spawn } from "child_process";

export class WindowsOperatingSystem extends os.OperatingSystem {

    constructor() {
        super(os.OperatingSystemType.Windows);
    }

    /**
     * Gets the Windows edition (10, 8.1, Vista...) from getVersion()
     * @return the edition identifier
     */
    public async getEdition(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.getVersion().then((version: string) => {
                let parts = version.split(".");
                let majormin = parts[0] + "." + parts[1];

                let edition;

                switch (majormin) {
                    case "10.0": // 10 Server
                        edition = "10"
                        break;
                    case "6.3": // Server 2012 R2
                        edition = "8.1"
                        break;
                    case "6.2": // Server 2012
                        edition = "8"
                        break;
                    case "6.1":
                        edition = "7"
                        break;
                    case "6.0":
                        edition = "Vista"
                        break;
                    case "5.2":
                        edition = "Server 2003"
                        break;
                    case "5.1":
                        edition = "XP"
                        break;
                    case "5.0":
                        edition = "2000"
                        break;
                    default:
                        edition = version;
                        break;
                    }

                    resolve(edition);
            }).catch((reason) => reject(reason));
        });
    }

    /**
     * Gets the windows version number
     * Parses output from cmd.exe
     * @return the current Windows version
     */
    public async getVersion() {
        return new Promise<string>((resolve, reject) => {
            let cmd = spawn("cmd");
            let version;
    
            cmd.stdout.on("data", (data: string | Buffer) => {
                if (typeof data !== "string") {
                    data = data.toString();
                }
    
                cmd.kill();                

                let i = data.indexOf("[Version");
                let i1 = data.indexOf("]", i);
    
                if (i !== -1 && i1 !== -1) {
                    version = data.substring(i + "[Version".length + 1, i1);
                    return resolve(version);                                    
                } else {
                    return reject("failed to find version");
                }
            });
        });        
    }

    /**
     * Returns the Windows display string (Windows 10)
     */
    public async getDisplay() {
        let display = "Windows";
        let version = await this.getEdition().catch();

        if (version) {
            display += " " + version;
        }

        return display;
    }
}