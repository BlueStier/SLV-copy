"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanUp = void 0;
const vscode = require("vscode");
const FS = require("fs");
class CleanUp {
    launch(inputInFile) {
        try {
            FS.writeFileSync(`${__dirname}/clean.json`, JSON.stringify(inputInFile));
            const destrucPathClean = __dirname.split("\\");
            let commandeLaunchJs = `echo Switch too SLV-copy extension directory & cd `;
            let strLaunch = destrucPathClean.reduce((arr, value) => arr += `${value}/`, commandeLaunchJs);
            const terminal = vscode.window.createTerminal("slv-copy");
            terminal.show();
            terminal.sendText(strLaunch, true);
            terminal.sendText('node cleanUpRepository.js', true);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.CleanUp = CleanUp;
//# sourceMappingURL=clean.js.map