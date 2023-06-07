import * as vscode from "vscode";
import * as FS from "fs";
export class CleanUp {
  public launch(inputInFile: object) {
    try {
      FS.writeFileSync(`${__dirname}/clean.json`, JSON.stringify(inputInFile));
      const destrucPathClean: string[] = __dirname.split("\\");
      let commandeLaunchJs: string = `echo Switch too SLV-copy extension directory & cd `;
      let strLaunch = destrucPathClean.reduce(
        (arr, value) => (arr += `${value}/`),
        commandeLaunchJs
      );
      const terminal: vscode.Terminal =
        vscode.window.createTerminal("slv-copy");
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
    } catch (error) {
      console.log(error);
    }
  }
}
