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
            let strLaunch = destrucPathClean.reduce((arr, value) => (arr += `${value}/`), commandeLaunchJs);
            const terminal = vscode.window.createTerminal("slv-copy");
            console.log(vscode.window.terminals[0]);
            terminal.sendText(strLaunch, true);
            terminal.sendText("node cleanUpRepository.js", true);
            // const intval = setInterval(() => {
            //   const state = terminal.state.isInteractedWith;
            //   console.log(state);
            //   terminal.show();
            //   if (state === true) {
            //     console.log("ouaip");
            //     terminal.sendText(strLaunch, true);
            //     terminal.sendText("node cleanUpRepository.js", true);
            //     clearInterval(intval);
            //   }
            // }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.CleanUp = CleanUp;
//# sourceMappingURL=clean.js.map