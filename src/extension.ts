//import of modules
import * as vscode from 'vscode';
import * as path from 'path';
import {homedir} from 'os';
import {Message} from './message';
import {File} from './file';
import { fileURLToPath } from 'url';
//Preparation of configuration constants
const CONF:vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("SLV-copy");
const useDayFolder: Boolean = CONF.get("useDayFolder") !;
const keyValueFolder: Array < string > = CONF.get("keyValueFolder") !;
const exclude: Array < string > = CONF.get("excludeFolder") !;
const authorizedFileType: Array < string > = CONF.get("authorizedFileType") !;
let filePathVsCode = process.env.APPDATA?.charAt(0).toLowerCase()+process.env.APPDATA?.slice(1) !;
const vscodeSet = filePathVsCode + '\\Code\\User\\settings.json';
const numberOfSauvPerso: number = CONF.get("numberOfSauvPerso") !;
const showWarningMessageFolder : boolean = CONF.get("showWarningMessageFolder") !;
const showWarningExtensionFile : boolean = CONF.get("showWarningExtensionFile") !;
// preparing system variables
const USER = homedir().split("\\")[2];
//message constant
const MESS:Message = new Message(); 
const FI:File = new File();

function run(event: any, bool:boolean,message:String="") {
	//get file name via event
	let name:string = "";
	if(bool){
		name = event.fileName;
	}else{
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
				if(showWarningMessageFolder){
				//message for VScode settings.json
				MESS.param(true);
				}
			} else {
				let isExiste: Boolean = false;
				//if folders are set loop on key to find out if folder is in config
				for (var item in keyValueFolder) {
					//the folder of the file is not excluded (missing from excludeFolder)
					if (!exclude.includes(path.dirname(name))) {
						//the file folder is in the config (present in keyValueFolder)
						if (name.split(keyValueFolder[item][0]).length > 1) {
							isExiste = true;
							FI.setAll(keyValueFolder[item][1], useDayFolder, name, USER);
							if(bool){
								//auto save
							FI.save();
							MESS.information(name);
							}else{
								FI.savePerso(message,numberOfSauvPerso);
								MESS.information(name,false);
							}
						}
					}
				}
				if (isExiste === false) {
					//The folder is not in the config
					if(showWarningMessageFolder){
						//message for VScode settings.json
						MESS.param(true);
						}
				}
			}
		}else{
			//The file extension is not in the config
			if(showWarningExtensionFile){
			MESS.param(false);
			}
		}
	}
}

//Activating the extension
export function activate(context: vscode.ExtensionContext) {
	const SUB = context.subscriptions;
	//autosave on open
	let array = vscode.workspace.textDocuments;
	for (let i in array) {
		 run(array[i],true);
	}
	SUB.push(
		//Opening a file
		vscode.workspace.onDidOpenTextDocument((event) => {
			run(event,true);
		})
	);
	//commands
	SUB.push(
		vscode.commands.registerCommand('SLV-copy.copy',()=>
		//recovery of the file opened in the text editor
			run(vscode.window.activeTextEditor!.document,true)
		)		
	);
	SUB.push(
		vscode.commands.registerCommand('SLV-copy.manuelle',async(uri:vscode.Uri)=>
			{
				let fileName:string = "";
				if(typeof uri === "undefined"){
					fileName = vscode.window.activeTextEditor!.document.fileName;
				}else{
					fileName = uri.fsPath;
				}
				//recovery of the file opened in the text editor
				MESS.showInputBox().then(value => {
				if (!value){
					return;
				}else{
					run(fileName,false,value);
				}
				});

		}
		)		
	);
	//commands
	SUB.push(
		vscode.commands.registerCommand('SLV-copy.cleanUp',async()=>
			MESS.showQuickPick(keyValueFolder).then((value)=>{
				if(value !== undefined){
					MESS.statusBarClean();
					FI.clean(vscode.workspace.getConfiguration("SLV-copy"),value.label);
					 setTimeout(()=>{
						MESS.statusBarClean(false);
            		 },2000);
				}
			})
		)		
	);
}
// this method is called when your extension is deactivated
export function deactivate() {}