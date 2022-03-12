/* Class Message
TODO: centralise l'affichage des message dans vscode
*/
import {window,commands, Uri,QuickPickItem} from 'vscode';
import {File} from './file';
export class Message {
    /*constructor*/
    public constructor() {
	}
     /*END constructor*/
      /**information()
     *TODO: Affiche un message à l'utilisateur en fonction du paramètre passé
     *@sync
     *@public
     *@param {String} str
     *@param {Boolean} bool
     *@retrun {void}
     */
    public information(str:string,bool:Boolean = true){ 
        let answer:string = bool ? `Le fichier ${str} a été sauvegardé automatiquement` : `Votre sauvegarde manuelle du fichier ${str} a été faite.`;        
        window.showInformationMessage(answer);
    }
    /*END information()*/
     /**param()
     *TODO: Affiche un message à l'utilisateur pour accéder à setting.json
     *@async
     *@public
     *@param {Boolean} param
     *@retrun {void}
     */
    public async param(param:Boolean){
        let mess ="";
        let bool = true;
        if(param){
            mess = "le chemin du fichier n'est pas présent dans le dossier de config. Enregistrez le dossier dans SLV-copy.keyValueFolder pour le paramétrer ou dans SLV-copy.excludeFolder pour l'exclure";
        }else{
            mess = "L'extension du fichier n'est pas reconnue. Enregistrez cette extension dans SLV-copy.authorizedFileType.";
            bool = false;
        }
        const answer = await window.showWarningMessage( mess, "configurer dans setting.json"  );
        if(answer === "configurer dans setting.json"){
            let file = new File();
            file.config(bool);
            let uri = Uri.file(process.env.APPDATA+'\\Code\\User\\settings.json');
           await commands.executeCommand('vscode.openFolder', uri);
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
     public error(){        
        window.showErrorMessage("La sauvegarde a échouée. Le dossier de destination n'est pas accessible");
    }
    /*END error()*/
     /**showInputBox()
     *TODO: Ouvre la fenêtre de dialogue et retourne une promesse 
     *@sync
     *@public
     *@param {void} 
     *@retrun {Promesse} showInputBox
     */
    public showInputBox(){
       return window.showInputBox({ 
			prompt: "Tappez le titre de votre sauvegarde. Attention, ne pas mettre de ponctuation",
			placeHolder: 'Message pour votre sauvegarde manuelle' 
		});
    }
    /*END showInputBox*/
    /**showQuickPick()
     *TODO: Ouvre la fenêtre de sélection et la retourne
     *@sync
     *@public
     *@param {Array < string >} keyValueFolder
     *@retrun {window.showQuickPick} window.showQuickPick
     */
    public showQuickPick(keyValueFolder: Array < string >){ 
        let optionFolder:Array<String> = [];       
        if (!keyValueFolder || keyValueFolder.length !== 0) {            
            keyValueFolder.forEach((value)=>{
                optionFolder.push(value[1].toString());          
            });
            optionFolder.push("Tous");
        }else{
            optionFolder.push("Tous");
        }
            let options : QuickPickItem[] = optionFolder.map(res =>{return{label:`${res}`};});
            return  window.showQuickPick(options);
    }
    /*END showQuickPick*/
    /**informationDelete
     *TODO: Ouvre la fenêtre de sélection et la retourne
     *@async
     *@public
     *@param {number} nbFile
     *@param {number} nbFolder
     *@retrun {void}
     */
    public informationDelete(nbFile:number,nbFolder:number){
        let str:string = "";
        if(nbFile === 0 && nbFolder === 0){
            str = "Pas de fichiers ni de dossiers supprimé";
        }else{
            str = `${nbFile} fichier(s) et ${nbFolder} dossiers supprimés`;
        }
        window.showInformationMessage(str);
    }  
    /*END informationDelete*/      
}