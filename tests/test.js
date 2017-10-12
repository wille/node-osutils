const os = require("../dist");

let d = os.current();

(async () => {
    console.log("display:", await d.getDisplay());
    console.log("version:", await d.getVersion().catch(() => "unknown"));

    if (d instanceof os.WindowsOperatingSystem) {
        console.log("edition:", await d.getEdition().catch(() => "unknown"));
    }
})();
