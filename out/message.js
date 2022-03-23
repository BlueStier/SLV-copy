"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
/* Class Message
TODO: centralize message display in vscode
*/
const vscode_1 = require("vscode");
const file_1 = require("./file");
class Message {
    /*constructor*/
    constructor() {
        this.statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 5);
    }
    /*END constructor*/
    /**information()
   *TODO: Displays a message to the user based on the passed parameter
   *@sync
   *@public
   *@param {String} str
   *@param {Boolean} bool
   *@retrun {void}
   */
    information(str, bool = true) {
        let answer = bool ? `The file ${str} was saved automatically` : `Your manual backup of the ${str} file has been made.`;
        vscode_1.window.showInformationMessage(answer);
    }
    /*END information()*/
    /**param()
    *TODO: Displays a message to the user to access setting.json
    *@async
    *@public
    *@param {Boolean} param
    *@retrun {void}
    */
    async param(param) {
        let mess = "";
        let bool = true;
        if (param) {
            mess = "the file path is not present in the config folder. Save the folder in SLV-copy.keyValueFolder to set it or in SLV-copy.excludeFolder to exclude it";
        }
        else {
            mess = "The file extension is not recognized. Save this extension in SLV-copy.authorizedFileType.";
            bool = false;
        }
        const answer = await vscode_1.window.showWarningMessage(mess, "configure in setting.json");
        if (answer === "configure in setting.json") {
            let file = new file_1.File();
            file.config(bool);
            let uri = vscode_1.Uri.file(process.env.APPDATA + '\\Code\\User\\settings.json');
            await vscode_1.commands.executeCommand('vscode.openFolder', uri);
        }
    }
    /*END param()*/
    /**error()
   *TODO: Affiche un message à l'utilisateur si la copie a échouée
   *@sync
   *@public
   *@param {void}
   *@retrun {void}
   */
    error() {
        vscode_1.window.showErrorMessage("Backup failed. The destination folder is not accessible");
    }
    /*END error()*/
    /**showInputBox()
    *TODO: Open the dialog window and return a promise
    *@sync
    *@public
    *@param {void}
    *@retrun {Promesse} showInputBox
    */
    showInputBox() {
        ;
        return vscode_1.window.showInputBox({
            prompt: "Type the title of your backup. Be careful, do not put punctuation",
            placeHolder: 'Message for your manual backup'
        });
    }
    /*END showInputBox*/
    /**showQuickPick()
     *TODO: Open the selection window and return it
     *@sync
     *@public
     *@param {Array < string >} keyValueFolder
     *@retrun {window.showQuickPick} window.showQuickPick
     */
    showQuickPick(keyValueFolder) {
        let optionFolder = [];
        if (!keyValueFolder || keyValueFolder.length !== 0) {
            keyValueFolder.forEach((value) => {
                optionFolder.push(value[1].toString());
            });
            optionFolder.push("All");
        }
        else {
            optionFolder.push("All");
        }
        let options = optionFolder.map(res => { return { label: `${res}` }; });
        return vscode_1.window.showQuickPick(options);
    }
    /*END showQuickPick*/
    /**informationDelete
     *TODO: Open the selection window and return it
     *@async
     *@public
     *@param {number} nbFile
     *@param {number} nbFolder
     *@param {number} nbFilePerso
     *@param {string} value
     *@retrun {void}
     */
    informationDelete(nbFile, nbFolder, nbFilePerso, value) {
        let str = "";
        if (nbFile === 0 && nbFolder === 0 && nbFilePerso === 0) {
            str = `No deleted files or folders on ${value}`;
        }
        else {
            str = `${nbFile} automatic backup file(s), ${nbFilePerso} manual backup files and ${nbFolder} deleted folders on ${value}`;
        }
        vscode_1.window.showInformationMessage(str);
    }
    /*END informationDelete*/
    statusBarClean(bool = true) {
        if (bool) {
            this.statusBar.show();
            this.statusBar.text = `$(sync~spin) SLV-copy clean run...`;
            this.statusBar.tooltip = 'Clean up backup folder is running...';
        }
        else {
            this.statusBar.hide();
        }
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map