"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
//import of modules
const vscode = require("vscode");
const path = require("path");
const os_1 = require("os");
const message_1 = require("./message");
const file_1 = require("./file");
//Preparation of configuration constants
const CONF = vscode.workspace.getConfiguration("SLV-copy");
const useDayFolder = CONF.get("useDayFolder");
const keyValueFolder = CONF.get("keyValueFolder");
const exclude = CONF.get("excludeFolder");
const authorizedFileType = CONF.get("authorizedFileType");
let filePathVsCode = process.env.APPDATA?.charAt(0).toLowerCase() + process.env.APPDATA?.slice(1);
const vscodeSet = filePathVsCode + '\\Code\\User\\settings.json';
const numberOfSauvPerso = CONF.get("numberOfSauvPerso");
// preparing system variables
const USER = (0, os_1.homedir)().split("\\")[2];
//message constant
const MESS = new message_1.Message();
const FI = new file_1.File();
function run(event, bool, message = "") {
    //get file name via event
    let name = "";
    if (bool) {
        name = event.fileName;
    }
    else {
        name = event;
    }
    //checks if the file is not new and is not the config file of VSCODE
    if (name !== "Untitled-1" && name !== vscodeSet) {
        //file type recovery
        let extensionFile = path.extname(name);
        //checking the file extension if the file should be saved
        if (authorizedFileType.includes(extensionFile)) {
            //if the folders are not defined
            if (!keyValueFolder || keyValueFolder.length === 0) {
                //message pour accéder au fichier setting.json de vscode
                MESS.param(true);
            }
            else {
                let isExiste = false;
                //if folders are set loop on key to find out if folder is in config
                for (var item in keyValueFolder) {
                    //the folder of the file is not excluded (missing from excludeFolder)
                    if (!exclude.includes(path.dirname(name))) {
                        //the file folder is in the config (present in keyValueFolder)
                        if (name.split(keyValueFolder[item][0]).length > 1) {
                            isExiste = true;
                            FI.setAll(keyValueFolder[item][1], useDayFolder, name, USER);
                            if (bool) {
                                //auto save
                                FI.save();
                                MESS.information(name);
                            }
                            else {
                                FI.savePerso(message, numberOfSauvPerso);
                                MESS.information(name, false);
                            }
                        }
                    }
                }
                if (isExiste === false) {
                    //The folder is not in the config
                    MESS.param(true);
                }
            }
        }
        else {
            //The file extension is not in the config
            MESS.param(false);
        }
    }
}
//Activating the extension
function activate(context) {
    const SUB = context.subscriptions;
    //autosave on open
    let array = vscode.workspace.textDocuments;
    for (let i in array) {
        run(array[i], true);
    }
    SUB.push(
    //Opening a file
    vscode.workspace.onDidOpenTextDocument((event) => {
        run(event, true);
    }));
    //commands
    SUB.push(vscode.commands.registerCommand('SLV-copy.copy', () => 
    //recovery of the file opened in the text editor
    run(vscode.workspace.textDocuments[0], true)));
    SUB.push(vscode.commands.registerCommand('SLV-copy.manuelle', async (uri) => {
        let fileName = "";
        if (typeof uri === "undefined") {
            fileName = vscode.workspace.textDocuments[0].fileName;
        }
        else {
            fileName = uri.fsPath;
        }
        //recovery of the file opened in the text editor
        MESS.showInputBox().then(value => {
            if (!value) {
                return;
            }
            else {
                run(fileName, false, value);
            }
        });
    }));
    //commands
    SUB.push(vscode.commands.registerCommand('SLV-copy.cleanUp', async () => MESS.showQuickPick(keyValueFolder).then((value) => {
        if (value !== undefined) {
            FI.clean(vscode.workspace.getConfiguration("SLV-copy"), value.label);
        }
    })));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map