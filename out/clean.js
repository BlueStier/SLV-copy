"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanUp = void 0;
const vscode = require("vscode");
class CleanUp {
    /**constructor
     *@public
     *@sync
     *@retrun {void}
     */
    constructor(folder = "", bool = true) {
        this.folder = "";
        this.bool = true;
        this.folder = folder;
        this.bool = bool;
    }
    launch() {
        const destrucPathClean = __dirname.split("\\");
        let commandeLaunchJs = `echo Switch too SLV-copy extension directory & cd `;
        let strLaunch = destrucPathClean.reduce((arr, value) => arr += `${value}/`, commandeLaunchJs);
        const terminal = vscode.window.createTerminal("slv-copy");
        terminal.show();
        terminal.sendText(strLaunch, true);
        terminal.sendText('node cleanUpRepository.js', true);
    }
}
exports.CleanUp = CleanUp;
//# sourceMappingURL=clean.js.map