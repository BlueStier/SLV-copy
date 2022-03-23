/* Class Message
TODO: centralize message display in vscode
*/
import {window,commands,Uri,QuickPickItem,StatusBarAlignment,StatusBarItem} from 'vscode';
import {File} from './file';
export class Message {
    private statusBar: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left,5);
    /*constructor*/
    public constructor() {
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
    public information(str:string,bool:Boolean = true){ 
        let answer:string = bool ? `The file ${str} was saved automatically` : `Your manual backup of the ${str} file has been made.`;        
        window.showInformationMessage(answer);
    }
    /*END information()*/
     /**param()
     *TODO: Displays a message to the user to access setting.json
     *@async
     *@public
     *@param {Boolean} param
     *@retrun {void}
     */
    public async param(param:Boolean){
        let mess ="";
        let bool = true;
        if(param){
            mess = "the file path is not present in the config folder. Save the folder in SLV-copy.keyValueFolder to set it or in SLV-copy.excludeFolder to exclude it";
        }else{
            mess = "The file extension is not recognized. Save this extension in SLV-copy.authorizedFileType.";
            bool = false;
        }
        const answer = await window.showWarningMessage( mess, "configure in setting.json"  );
        if(answer === "configure in setting.json"){
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
        window.showErrorMessage("Backup failed. The destination folder is not accessible");
    }
    /*END error()*/
     /**showInputBox()
     *TODO: Open the dialog window and return a promise 
     *@sync
     *@public
     *@param {void} 
     *@retrun {Promesse} showInputBox
     */
    public showInputBox(){;
       return window.showInputBox({ 
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
    public showQuickPick(keyValueFolder: Array < string >){ 
        let optionFolder:Array<String> = [];       
        if (!keyValueFolder || keyValueFolder.length !== 0) {            
            keyValueFolder.forEach((value)=>{
                optionFolder.push(value[1].toString());          
            });
            optionFolder.push("All");
        }else{
            optionFolder.push("All");
        }
            let options : QuickPickItem[] = optionFolder.map(res =>{return{label:`${res}`};});
            return  window.showQuickPick(options);
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
    public informationDelete(nbFile:number,nbFolder:number,nbFilePerso:number,value:string){
        let str:string = "";
        if(nbFile === 0 && nbFolder === 0 && nbFilePerso === 0){
            str = `No deleted files or folders on ${value}`;
        }else{
            str = `${nbFile} automatic backup file(s), ${nbFilePerso} manual backup files and ${nbFolder} deleted folders on ${value}`;
        }
        window.showInformationMessage(str);
    }  
    /*END informationDelete*/
    /**statusBarClean
     *TODO: insert statusbar when clean-up is launch
     *@async
     *@public
     *@param {boolean} bool
     *@retrun {void}
     */ 
    public statusBarClean(bool:boolean = true){
        if(bool){
            this.statusBar.show();
            this.statusBar.text = `$(sync~spin) SLV-copy clean run...`;
            this.statusBar.tooltip = 'Clean up backup folder is running...';
        }else{
            this.statusBar.hide();
        }
    }  
    /*END statusBarClean*/   
}