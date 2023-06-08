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
            let commandeLaunchJs = `echo Switch too SLV-copy extension directory && cd `;
            let strLaunch = destrucPathClean.reduce((arr, value) => (arr += `${value}/`), "");
            strLaunch += "cleanUpRepository.js";
            this.focusTerminal(`node ${strLaunch}`);
        }
        catch (error) {
            console.log(error);
        }
    }
    async focusTerminal(cmd) {
        await vscode.commands.executeCommand("workbench.action.terminal.focus");
        await new Promise((resolve) => setTimeout(resolve, 500));
        const terminal = vscode.window.activeTerminal;
        terminal?.sendText(cmd);
    }
}
exports.CleanUp = CleanUp;
//# sourceMappingURL=clean.js.map