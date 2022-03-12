/* Class Message
TODO: centralise les action de copy et de création de dossier si nécessaire
*/
import * as fs from 'fs';
import * as path from 'path';
import {Message} from './message';
import * as vscode from 'vscode';
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
    public constructor(folder: string="", daly: Boolean=false, pathFile: string="", user: string="") {
        this.folder = folder;
        this.daly = daly;
        this.pathFile = pathFile;
        this.user = user;
    }
    /*END constructor*/
     /**set_all
     *TODO: setter de tous les paramètres d'un object de la classe File
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
     *TODO: vérifie la présence du paramètre dans setting.json
     *@sync
     *@public
     *@param {Boolean} param
     *@retrun {void}
     */
    public config(param:Boolean) {
        try{
            let set:String = fs.readFileSync(process.env.APPDATA+'\\Code\\User\\settings.json','utf-8');
            let str:any = param ? "SLV-copy.keyValueFolder" : "SLV-copy.authorizedFileType";
            let array:Array<String> = set.split(str);
            //le paramètre n'est pas présent dans settings.json
            if(array.length < 2){
                let destruct:Array<String> = set.split(",");
                let str2:String = "";
                if(str === "SLV-copy.keyValueFolder"){
                        str2 = '"SLV-copy.keyValueFolder": [],}';
                }else if (str === "SLV-copy.authorizedFileType"){
                    str2 = '\n"SLV-copy.authorizedFileType": [".html",".css",".scss",".js",".json"],\n}';
                }
                destruct[destruct.length-1] = str2;
                fs.writeFileSync(process.env.APPDATA+'\\Code\\User\\settings.json',destruct.toString());
            }
        }catch(err){
            console.log(err);
        }
    }
     /*END config()*/
    /**save()
     *TODO: génère la copie
     *@sync
     *@public
     *@param {String} message
     *@retrun {void}
     */
    public save(message:String="") {
        //on vérifie si la demande de sous dossier journalier est active
        let pathDirectory: string = this.folder + this.user;
        if (this.daly) {
            let date = new Date();
            pathDirectory += "/"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        }
        //Vérifie si le dossier de sauvegarde n'existe pas on le crée
        if (!fs.existsSync(pathDirectory)) {
            fs.mkdirSync(pathDirectory, {
                recursive: true
            });
        }
        //récupération du nom du fichier
        let name = path.basename(this.pathFile);
        //récupération de l'extension
        let ext = path.extname(this.pathFile);
        //récupération du nom du fichier
        let splitName = name.split(".")[0];
        let concatName = "";
        if(message === ""){
            //sauvegarde auto ou sauvegarde manuelle mais l'utilisateur n'a pas laissé de message
        let date2 = new Date();
        //concatenation du chemin vers le repo et du nom avec timstamp
        concatName = pathDirectory + "/"+splitName+"-"+date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate()+"-"+date2.getHours()+"h"+date2.getMinutes()+"m"+date2.getSeconds()+"s"+ext;
        }else{
            //message perso
            concatName = pathDirectory + "/"+splitName + message + ext;
            //enregistre dans SLVcopy-lock.json
            this.slvCopyUpdate(concatName);
        }
        try {
        fs.copyFileSync(this.pathFile,concatName,fs.constants.COPYFILE_FICLONE);
        }catch{
            //dossier de réception non dispo
            let mess: Message = new Message();
            mess.error();
        }
    }
    /*END save()*/
     /**SlvCopyUpdate()
     *TODO: insert le nom du fichier dans la sauvegarde
     *@sync
     *@public
     *@param {string}name 
     *@retrun {void}
     */
    public slvCopyUpdate(concatName:string){
        try{
        let slvJson:String[] = JSON.parse(fs.readFileSync(this.folder+"/SLVcopy-lock.json",'utf-8'));
        let check = false;
        slvJson.forEach(element => {
            if(element[0] === this.pathFile){

            }else{
                check = true;
            }
        });
        }catch{
            let insert = [
                 [this.pathFile,[concatName]]
            ];
            fs.writeFileSync(this.folder+"/SLVcopy-lock.json",JSON.stringify(insert));
        }
    }
    /*END SlvCopyUpdate()*/
     /**savePerso()
     *TODO: génère la copie en tennant compte du message
     *@sync
     *@public
     *@param {Sring}message 
     *@retrun {void}
     */
    public savePerso(message: String){
        message = message.replace(/ /g,"_");
        message = `_SAUV_PERSO_SLV-Copy_${message}`;
        this.save(message);
    }
    /*END savePerso()*/
    /**clean()
     *TODO: nettoie le repo
     *@sync
     *@public
     *@param {vscode.WorkspaceConfiguration} conf;
     *@retrun {void}
     */
    public clean(conf:vscode.WorkspaceConfiguration,value:string){
        const deleteDelay: number = conf.get("deleteDelay") !;
        const numberOfSauvPerso: Number = conf.get("numberOfSauvPerso") !;
        let files:string[] =  this.recursiveDirectory(value);
        let folders:string[] = this.recursiveDirectory(value,false);
        let savePerso:string[] = [];
        let save:string[] = [];
        files.forEach((file) => {
            if(file.includes("_SAUV_PERSO_SLV-Copy_")){
                savePerso.push(file);
            }else{
                save.push(file);
            }
        });
        //suppression des fichiers de sauvegarde automatique
        let time = (24*60*60*1000*30)*deleteDelay;
        let limit = Date.now()- time;
        let nbFile:number = 0; 
        let nbFolder:number = 0;
        save.forEach((file)=>{
            const { birthtimeMs } = fs.statSync(file);
            if(birthtimeMs < limit){
                fs.unlinkSync(file);
                nbFile++;
            }
        });
        //suppression de répertoire si vide
        folders.forEach((folder)=>{
            try{
            fs.rmdirSync(folder);
            nbFolder++;
            }catch(err){               
            }
        });
        let mem:Message = new Message;
        mem.informationDelete(nbFile,nbFolder);
    }
     /*END clean()*/
     /**recursiveDirectory()
     *TODO: liste tous les fichiers et sous dossiers du chemin spécifié et retourne un tableau
     *@sync
     *@private
     *@param {string} dirPath;
     *@param {Boolean} useDayFolder;
     *@param {Array<string>} arrayOfFiles;
     *@retrun {Array<string>} arrayOfFiles;
     */
     private recursiveDirectory(dirPath:string,useDayFolder:Boolean = true, arrayOfFiles:Array<string> = []) {
        let files:string[] = fs.readdirSync(dirPath);
        files.forEach((file) => {
            if(useDayFolder){
                if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles = this.recursiveDirectory(dirPath + "/" + file,true, arrayOfFiles);
                } else {
                    arrayOfFiles.push(path.join(dirPath, "/", file));
                }
        }else{
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
                arrayOfFiles = this.recursiveDirectory(dirPath + "/" + file,false, arrayOfFiles);
            }
        }
        });      
        return arrayOfFiles;
      }
       /*END recursiveDirectory()*/
}