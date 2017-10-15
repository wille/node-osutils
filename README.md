# operatingsystem.js

![NPM](https://img.shields.io/npm/v/operatingsystem.svg?style=flat-square)
![Downloads](https://img.shields.io/npm/dt/operatingsystem.svg?style=flat-square)

node implementation of [oslib](https://github.com/redpois0n/oslib) and [goslib](https://github.com/redpois0n/goslib)

Get specific operating system version, edition and other properties

## Usage
```bash
$ npm install --save operatingsystem
```

```javascript
const os = require("operatingsystem");

var info = os.current();

info.getDisplay().then((display) => {
    console.log(display); // Will print Windows 10 or macOS 10.12 Sierra etc...
});

if (info.type === os.OperatingSystemType.Windows) {
    console.log(info.getEdition()) // prints 10 on Windows 10
}
```