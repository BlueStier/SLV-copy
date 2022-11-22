import * as vscode from 'vscode';
import * as FS from 'fs';
export class CleanUp {
    public launch(inputInFile: object) {
        try {
            FS.writeFileSync(`${__dirname}/clean.json`, JSON.stringify(inputInFile));
            const destrucPathClean: string[] = __dirname.split("\\");
            let commandeLaunchJs: string = `echo Switch too SLV-copy extension directory & cd `;
            let strLaunch = destrucPathClean.reduce((arr, value) => arr += `${value}/`, commandeLaunchJs);
            const terminal: vscode.Terminal = vscode.window.createTerminal("slv-copy");
            terminal.show();
            terminal.sendText(strLaunch, true);
            terminal.sendText('node cleanUpRepository.js', true);
        } catch (error) {
            console.log(error);
        }
    }
}