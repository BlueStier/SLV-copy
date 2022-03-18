"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
/* Class Message
TODO: centralizes copy and folder creation actions if necessary
*/
const fs = require("fs");
const path = require("path");
const message_1 = require("./message");
class File {
    /**constructor
     *@public
     *@sync
     *@param {string} folder
     *@param {Boolean} daly
     *@param {string} pathFile
     *@retrun {void}
     */
    constructor(folder = "", daly = false, pathFile = "", user = "") {
        this.folder = "";
        this.daly = false;
        this.pathFile = "";
        this.user = "";
        this.folder = folder;
        this.daly = daly;
        this.pathFile = pathFile;
        this.user = user;
    }
    /*END constructor*/
    /**set_all
    *TODO: setter of all parameters of an object of class File
    *@sync
    *@public
    *@param {string} folder
    *@param {Boolean} daly
    *@param {string} pathFile
    *@retrun {void}
    */
    setAll(folder, daly, pathFile, user) {
        this.folder = folder;
        this.daly = daly;
        this.pathFile = pathFile;
        this.user = user;
    }
    /*END set_all*/
    /**config()
     *TODO: checks the presence of the parameter in setting.json
     *@sync
     *@public
     *@param {Boolean} param
     *@retrun {void}
     */
    config(param) {
        try {
            let set = fs.readFileSync(process.env.APPDATA + '\\Code\\User\\settings.json', 'utf-8');
            let str = param ? "SLV-copy.keyValueFolder" : "SLV-copy.authorizedFileType";
            let array = set.split(str);
            //parameter is not present in settings.json
            if (array.length < 2) {
                let destruct = set.split(",");
                let str2 = "";
                if (str === "SLV-copy.keyValueFolder") {
                    str2 = '"SLV-copy.keyValueFolder": [],}';
                }
                else if (str === "SLV-copy.authorizedFileType") {
                    str2 = '\n"SLV-copy.authorizedFileType": [".html",".css",".scss",".js",".json"],\n}';
                }
                destruct[destruct.length - 1] = str2;
                fs.writeFileSync(process.env.APPDATA + '\\Code\\User\\settings.json', destruct.toString());
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    /*END config()*/
    /**save()
     *TODO: generates the copy
     *@sync
     *@public
     *@param {String} message
     *@param {number} num
     *@retrun {void}
     */
    save(message = "", num = 0) {
        //we check if the daily sub-folder request is active
        let pathDirectory = this.folder + this.user;
        if (this.daly) {
            let date = new Date();
            pathDirectory += "/" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        //Check if the backup folder does not exist, create it
        if (!fs.existsSync(pathDirectory)) {
            fs.mkdirSync(pathDirectory, {
                recursive: true
            });
        }
        //file name recovery
        let name = path.basename(this.pathFile);
        //récupération de l'extension
        let ext = path.extname(this.pathFile);
        //extension recovery
        let splitName = name.split(".")[0];
        let concatName = "";
        if (message === "") {
            //autosave or manual save but the user did not leave a message
            let date2 = new Date();
            //concatenation of path to repo and name with timstamp
            concatName = pathDirectory + "/" + splitName + "-" + date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate() + "-" + date2.getHours() + "h" + date2.getMinutes() + "m" + date2.getSeconds() + "s" + ext;
        }
        else {
            //personal message
            concatName = pathDirectory + "/" + splitName + message + ext;
            //saves to SLVcopy-lock.json
            this.slvCopyUpdate(concatName, num);
        }
        try {
            fs.copyFileSync(this.pathFile, concatName, fs.constants.COPYFILE_FICLONE);
        }
        catch {
            //reception folder not available
            let mess = new message_1.Message();
            mess.error();
        }
    }
    /*END save()*/
    /**SlvCopyUpdate()
    *TODO: insert file name into backup
    *@sync
    *@public
    *@param {string}name
    *@retrun {void}
    */
    slvCopyUpdate(concatName, num) {
        let nameFile = this.pathFile.split("\\")[this.pathFile.split("\\").length - 1];
        try {
            let slvJson = JSON.parse(fs.readFileSync(this.folder + "/SLVcopy-lock.json", 'utf-8'));
            let check = true;
            Object.entries(slvJson).forEach(([key, value]) => {
                Object.entries(slvJson[key]).forEach(([key1, value1]) => {
                    if (value1 === this.pathFile) {
                        if (slvJson[key][1].length > num) {
                            let rest = slvJson[key][1].length - num;
                            slvJson[key][1] = slvJson[key][1].slice(rest);
                        }
                        slvJson[key][1].push(concatName);
                        check = false;
                    }
                });
            });
            if (check) {
                let insert = [
                    nameFile, [concatName]
                ];
                slvJson.push(insert);
            }
            fs.writeFileSync(this.folder + "/SLVcopy-lock.json", JSON.stringify(slvJson));
        }
        catch {
            let insert = [
                [nameFile, [concatName]]
            ];
            fs.writeFileSync(this.folder + "/SLVcopy-lock.json", JSON.stringify(insert));
        }
    }
    /*END SlvCopyUpdate()*/
    /**savePerso()
    *TODO: generates the copy taking into account the message
    *@sync
    *@public
    *@param {Sring}message
    *@param {number} num
    *@retrun {void}
    */
    savePerso(message, num) {
        message = message.replace(/ /g, "_");
        message = `_SAUV_PERSO_SLV-Copy_${message}`;
        this.save(message, num);
    }
    /*END savePerso()*/
    /**clean()
     *TODO: clean the repo
     *@sync
     *@public
     *@param {vscode.WorkspaceConfiguration} conf;
     *@retrun {void}
     */
    clean(conf, value) {
        if (value === "All") {
            const keyValueFolder = conf.get("keyValueFolder");
            keyValueFolder.forEach((value) => {
                this.clean(conf, value[1].toString());
            });
        }
        else {
            const deleteDelay = conf.get("deleteDelay");
            const numberOfSauvPerso = conf.get("numberOfSauvPerso");
            let files = this.recursiveDirectory(value);
            let folders = this.recursiveDirectory(value, false);
            let savePerso = [];
            let save = [];
            files.forEach((file) => {
                if (!file.includes("SLVcopy-lock.json")) {
                    if (file.includes("_SAUV_PERSO_SLV-Copy_")) {
                        savePerso.push(file);
                    }
                    else {
                        save.push(file);
                    }
                }
            });
            //delete autosave files
            let time = (24 * 60 * 60 * 1000 * 30) * deleteDelay;
            let limit = Date.now() - time;
            let nbFile = 0;
            let nbFolder = 0;
            save.forEach((file) => {
                const { birthtimeMs } = fs.statSync(file);
                if (birthtimeMs < limit) {
                    fs.unlinkSync(file);
                    nbFile++;
                }
            });
            //manual save file deletion
            let nbFilePerso = this.deleteSavePerso(savePerso, numberOfSauvPerso);
            //remove directory if empty
            folders.forEach((folder) => {
                try {
                    fs.rmdirSync(folder);
                    nbFolder++;
                }
                catch (err) {
                }
            });
            let mem = new message_1.Message;
            mem.informationDelete(nbFile, nbFolder, nbFilePerso, value);
        }
    }
    /*END clean()*/
    /**recursiveDirectory()
    *TODO: lists all files and subfolders in the specified path and returns an array
    *@sync
    *@private
    *@param {string} dirPath;
    *@param {Boolean} useDayFolder;
    *@param {Array<string>} arrayOfFiles;
    *@retrun {Array<string>} arrayOfFiles;
    */
    recursiveDirectory(dirPath, useDayFolder = true, arrayOfFiles = []) {
        let files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            if (useDayFolder) {
                if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles = this.recursiveDirectory(dirPath + "/" + file, true, arrayOfFiles);
                }
                else {
                    arrayOfFiles.push(path.join(dirPath, "/", file));
                }
            }
            else {
                if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles.push(path.join(dirPath, "/", file));
                    arrayOfFiles = this.recursiveDirectory(dirPath + "/" + file, false, arrayOfFiles);
                }
            }
        });
        return arrayOfFiles;
    }
    /*END recursiveDirectory()*/
    /**deleteSavePerso
     *TODO: remove manual saves
     *@sync
     *@private
     *@param {Array} savePerso;
     *@param {number} num;
     *@retrun {number} nbFile;
     */
    deleteSavePerso(savePerso, num) {
        let nbFilePerso = 0;
        try {
            let slvJson = JSON.parse(fs.readFileSync(this.folder + "/SLVcopy-lock.json", 'utf-8'));
            savePerso.forEach((file) => {
                let fileRestruc = file.replace(/\\/g, "/");
                let splitPerso = file.split("\\");
                let namePerso = splitPerso[splitPerso.length - 1];
                let splitInit = file.split("_SAUV_PERSO_SLV-Copy_");
                let nameInit = splitInit[0].split("\\")[splitInit[0].split("\\").length - 1] + path.extname(namePerso);
                Object.entries(slvJson).forEach(([key, value]) => {
                    Object.entries(slvJson[key]).forEach(([key1, value1]) => {
                        // verification of the size of the backup if there has been a change in the number of backups to keep                       
                        if (slvJson[key][1].length > num) {
                            let rest = slvJson[key][1].length - num;
                            slvJson[key][1] = slvJson[key][1].slice(rest);
                        }
                        if (value1 === nameInit) {
                            if (!value1.includes(fileRestruc)) {
                                fs.unlinkSync(file);
                                nbFilePerso++;
                            }
                        }
                    });
                });
            });
        }
        catch {
            //no SLVcopy-lock.json delete all munaul save
            savePerso.forEach((file) => {
                try {
                    fs.unlinkSync(file);
                    nbFilePerso++;
                }
                catch (err) {
                }
            });
        }
        return nbFilePerso;
    }
}
exports.File = File;
//# sourceMappingURL=file.js.map