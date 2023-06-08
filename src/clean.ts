import * as vscode from "vscode";
import * as FS from "fs";
export class CleanUp {
  public launch(inputInFile: object) {
    try {
      FS.writeFileSync(`${__dirname}/clean.json`, JSON.stringify(inputInFile));
      const destrucPathClean: string[] = __dirname.split("\\");
      let commandeLaunchJs: string = `echo Switch too SLV-copy extension directory && cd `;
      let strLaunch = destrucPathClean.reduce(
        (arr, value) => (arr += `${value}/`),
        ""
      );
      strLaunch += "cleanUpRepository.js";
      this.focusTerminal(`node ${strLaunch}`);
    } catch (error) {
      console.log(error);
    }
  }

  async focusTerminal(cmd: string) {
    await vscode.commands.executeCommand("workbench.action.terminal.focus");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const terminal = vscode.window.activeTerminal;
    terminal?.sendText(cmd);
  }
}
