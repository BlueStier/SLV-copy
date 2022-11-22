/* Class Message
TODO: centralizes copy and folder creation actions if necessary
*/
import * as fs from 'fs';
import * as path from 'path';
import {
    Message
} from './message';
import * as vscode from 'vscode';
import {
    CleanUp
} from './clean';
export class File {
    private folder: string = "";
    private daly: Boolean = false;
    private pathFile: string = "";
    private user: string = "";
    /**constructor
     *@public
     *@sync
     *@param {string} folder
     *@param {Boolean} daly
     *@param {string} pathFile
     *@retrun {void}
     */
    public constructor(folder: string = "", daly: Boolean = false, pathFile: string = "", user: string = "") {
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
    public setAll(folder: string, daly: Boolean, pathFile: string, user: string) {
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
    public config(param: Boolean) {
        try {
            let set: String = fs.readFileSync(process.env.APPDATA + '\\Code\\User\\settings.json', 'utf-8');
            let str: any = param ? "SLV-copy.keyValueFolder" : "SLV-copy.authorizedFileType";
            let array: Array < String > = set.split(str);
            //parameter is not present in settings.json
            if (array.length < 2) {
                let destruct: Array < String > = set.split(",");
                let str2: String = "";
                if (str === "SLV-copy.keyValueFolder") {
                    str2 = '"SLV-copy.keyValueFolder": [],}';
                } else if (str === "SLV-copy.authorizedFileType") {
                    str2 = '\n"SLV-copy.authorizedFileType": [".html",".css",".scss",".js",".json"],\n}';
                }
                destruct[destruct.length - 1] = str2;
                fs.writeFileSync(process.env.APPDATA + '\\Code\\User\\settings.json', destruct.toString());
            }
        } catch (err) {
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
    public save(message: String = "", num: number = 0) {
        //we check if the daily sub-folder request is active
        let pathDirectory: string = this.folder + this.user;
        if (this.daly) {
            let date = new Date();
            pathDirectory += `\\${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
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
            concatName = `${pathDirectory}\\${splitName}-${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}-${date2.getHours()}h${date2.getMinutes()}m${date2.getSeconds()}s${ext}`;
        } else {
            //personal message
            concatName = `${pathDirectory}\\${splitName}${message}${ext}`;
            //saves to SLVcopy-lock.json
            this.slvCopyUpdate(concatName, num);
        }
        try {
            fs.copyFileSync(this.pathFile, concatName, fs.constants.COPYFILE_FICLONE);
        } catch {
            //reception folder not available
            let mess: Message = new Message();
            mess.error();
        }
    }
    /*END save()*/
    /**SlvCopyUpdate()
     *TODO: insert file name into backup
     *@sync
     *@public
     *@param {string}concatName 
     *@param {number}num
     *@retrun {void}
     */
    public slvCopyUpdate(concatName: string, num: number) {
        let nameFile: string = this.pathFile.split("\\")[this.pathFile.split("\\").length - 1];
        try {
            let slvJson = JSON.parse(fs.readFileSync(this.folder + "/SLVcopy-lock.json", 'utf-8'));
            let check: boolean = true;
            slvJson.forEach((item:any,key:number) => {
                let {
                    name,
                    cName
                } = item;
                if (name === nameFile) {
                    if (cName.length >= num) {
                        let rest: number = cName.length - num + 1;
                        slvJson[key].cName = cName.slice(rest);
                    }
                    slvJson[key].cName.push(concatName);
                    check = false;
                }
            });
            if (check) {
                let insert = {
                    name: nameFile,
                    cName: [concatName]
                };
                slvJson.push(insert);
            }
            fs.writeFileSync(this.folder + "/SLVcopy-lock.json", JSON.stringify(slvJson));
        } catch {
            let insert = [{
                name: nameFile,
                cName: [concatName]
            }];
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
    public savePerso(message: String, num: number) {
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
    public clean(conf: vscode.WorkspaceConfiguration, value: string) {
        const clean: CleanUp = new CleanUp();
        let arrayToJsonFile: Array < string > = [];
        if (value === "All") {
            const keyValueFolder: Array < string > = conf.get("keyValueFolder") !;
            keyValueFolder.forEach(value => arrayToJsonFile.push(value[1]));
        } else {
            arrayToJsonFile.push(value);
        }
        const inputInFile: object = {
            repos: arrayToJsonFile,
            deleteDelay: conf.get("deleteDelay"),
            numberOfSauvPerso: conf.get("numberOfSauvPerso")
        };
        clean.launch(inputInFile);
    }
    /*END clean()*/
}