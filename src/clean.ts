import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
export class CleanUp {
    private folder: string = "";
    private bool: Boolean = true;
    /**constructor
     *@public
     *@sync
     *@retrun {void}
     */
    public constructor(folder: string = "", bool: Boolean = true) {
        this.folder = folder;
        this.bool = bool;
    }
    public launch() {
        const destrucPathClean: string[] = __dirname.split("\\");
        let commandeLaunchJs: string = `echo Switch too SLV-copy extension directory & cd `;
        let strLaunch = destrucPathClean.reduce((arr, value) => arr += `${value}/`, commandeLaunchJs);
        const terminal: vscode.Terminal = vscode.window.createTerminal("slv-copy");
        terminal.show();
        terminal.sendText(strLaunch, true);
        terminal.sendText('node cleanUpRepository.js', true);
    }
}