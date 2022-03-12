"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
//import des modules
const vscode = require("vscode");
const path = require("path");
const os_1 = require("os");
const message_1 = require("./message");
const file_1 = require("./file");
//Préparation des constantes de configurations
const CONF = vscode.workspace.getConfiguration("SLV-copy");
const useDayFolder = CONF.get("useDayFolder");
const keyValueFolder = CONF.get("keyValueFolder");
const exclude = CONF.get("excludeFolder");
const authorizedFileType = CONF.get("authorizedFileType");
let filePathVsCode = process.env.APPDATA?.charAt(0).toLowerCase() + process.env.APPDATA?.slice(1);
const vscodeSet = filePathVsCode + '\\Code\\User\\settings.json';
// préparation des variables système
const USER = (0, os_1.homedir)().split("\\")[2];
//constante de message
const MESS = new message_1.Message();
const FI = new file_1.File();
function run(event, bool, message = "") {
    //vérifie si le fichier n'est pas nouveau et n'est pas le fichier de config de VSCODE
    if (event.fileName !== "Untitled-1" && event.fileName !== vscodeSet) {
        //récupération du type de fichier
        let extensionFile = path.extname(event.fileName);
        //vérification de l'extension du fichier si le fichier doit être sauvegardé
        if (authorizedFileType.includes(extensionFile)) {
            //si les dossiers ne sont pas définis
            if (!keyValueFolder || keyValueFolder.length === 0) {
                //message pour accéder au fichier setting.json de vscode
                MESS.param(true);
            }
            else {
                let isExiste = false;
                //si les dossiers sont définis boucle sur la clé pour savoir si le dossier est dans la config
                for (var item in keyValueFolder) {
                    //le dossier du fichier n'est pas exclu (absent de excludeFolder)
                    if (!exclude.includes(path.dirname(event.fileName))) {
                        //le dossier du fichier est dans la config (présent dans keyValueFolder)
                        if (event.fileName.split(keyValueFolder[item][0]).length > 1) {
                            isExiste = true;
                            FI.setAll(keyValueFolder[item][1], useDayFolder, event.fileName, USER);
                            if (bool) {
                                //sauvegarde automatique
                                FI.save();
                                MESS.information(event.fileName);
                            }
                            else {
                                FI.savePerso(message);
                                MESS.information(event.fileName, false);
                            }
                        }
                    }
                }
                if (isExiste === false) {
                    //Le dossier n'est pas dans la config
                    MESS.param(true);
                }
            }
        }
        else {
            //L'extension du fichier n'est pas dans la config
            MESS.param(false);
        }
    }
}
//Activation de l'extension
function activate(context) {
    const SUB = context.subscriptions;
    //autosauvegarde à l'ouverture
    let array = vscode.workspace.textDocuments;
    for (let i in array) {
        run(array[i], true);
    }
    // END confirme sauvegarde des fichiers ouverts dans l'éditeur
    SUB.push(
    //Ouverture d'un fichier
    vscode.workspace.onDidOpenTextDocument((event) => {
        run(event, true);
    }));
    //commands
    SUB.push(vscode.commands.registerCommand('SLV-copy.copy', () => 
    //récupération du fichier ouvert dans l'éditeur de texte
    run(vscode.workspace.textDocuments[0], false)));
    SUB.push(vscode.commands.registerCommand('SLV-copy.manuelle', async () => 
    //récupération du fichier ouvert dans l'éditeur de texte
    MESS.showInputBox().then(value => {
        if (!value) {
            return;
        }
        else {
            run(vscode.workspace.textDocuments[0], false, value);
        }
    })));
    //commands
    SUB.push(vscode.commands.registerCommand('SLV-copy.cleanUp', async () => 
    //récupération du fichier ouvert dans l'éditeur de texte
    MESS.showQuickPick(keyValueFolder).then((value) => {
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