"use strict";
const FS = require("fs");
const PATH = require("path");
const READLINE = require("readline");
try {
  //reading file clean.txt in extension repository
  console.log(
    `\x1b[33m Reading File ${__dirname}/clean.json please wait...\x1b[0m`
  );
  const data = FS.readFileSync(`${__dirname}/clean.json`, "utf8");
  const { repos, deleteDelay, numberOfSauvPerso } = JSON.parse(data);
  //foreach repository too clean
  repos.forEach((value) => {
    cleanUpDirectory(value, deleteDelay, numberOfSauvPerso);
  });
  FS.unlinkSync(`${__dirname}/clean.json`);
} catch (error) {
  console.log(error);
}
/**cleanUpDirectory()
 *TODO: controller manage delete files
 *@sync
 *@param {string} dirPath;
 *@param {number} deleteDelay;
 *@param {number} numberOfSauvPers;
 *@retrun {void};
 */
/*END cleanUpDirectory()*/
async function cleanUpDirectory(dirPath, deleteDelay, numberOfSauvPerso) {
  console.log(
    `\x1b[33m Reading files in Repository ${dirPath} please wait...\x1b[0m`
  );
  const files = recursiveDirectory(dirPath, true, []);
  console.log(
    `\x1b[33m Reading folders in Repository ${dirPath} please wait...\x1b[0m`
  );
  const folders = recursiveDirectory(dirPath, false, []);
  console.log(
    `\x1b[33m Dispatch manual back-up and auto back-up files...\x1b[0m`
  );
  let savePerso = [];
  let save = [];
  let nbSave = 0;
  let nbSavePerso = 0;
  let nbFolder = 0;
  files.forEach((file) => {
    if (!file.includes("SLVcopy-lock.json")) {
      if (file.includes("_SAUV_PERSO_SLV-Copy_")) {
        savePerso.push(file);
        nbSavePerso++;
      } else {
        save.push(file);
        nbSave++;
      }
    }
  });
  console.log(
    `\x1b[33m Repository have ${nbSave} auto back-up files and ${nbSavePerso} manual back-up...\x1b[0m`
  );
  console.log(
    `List of files saved for more than ${deleteDelay} months to delete : `
  );
  let time = 24 * 60 * 60 * 1000 * 30 * deleteDelay;
  let limit = Date.now() - time;
  let nbFile = 0;
  let arrayFile = [];
  save.forEach((file) => {
    const { birthtimeMs } = FS.statSync(file);
    if (birthtimeMs < limit) {
      console.log(file);
      arrayFile.push(file);
      nbFile++;
    }
  });
  if (nbFile == 0) {
    console.log(
      `\x1b[33m No files saved for more than ${deleteDelay} months to delete\x1b[0m`
    );
  } else {
    await askTooUser(
      `Do you confirm the deletion of ${nbFile} files ? (Y/n)`,
      "Y",
      arrayFile
    );
  }
  const deleteSavePersoRestruct = deleteSavePerso(
    savePerso,
    numberOfSauvPerso,
    dirPath
  );
  console.log(
    `List of ${deleteSavePersoRestruct.nbFilePerso} files manual back-up to delete : `
  );
  if (deleteSavePersoRestruct.nbFilePerso == 0) {
    console.log(`\x1b[33m No files manual back-up to delete\x1b[0m`);
  } else {
    deleteSavePersoRestruct.arrayToDelete.forEach((file) => console.log(file));
    const rl = READLINE.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    await askTooUser(
      `Do you confirm the deletion of ${deleteSavePersoRestruct.nbFilePerso} files ? (Y/n)`,
      "Y",
      arrayFile
    );
  }
  console.log(`\x1b[33m Delete empty directory please wait... \x1b[0m`);
  folders.forEach((folder) => {
    try {
      FS.rmdirSync(folder);
      nbFolder++;
    } catch (err) {}
  });
  const strDeleteDirectory =
    nbFolder == 0
      ? `\x1b[33m No empty directory to delete \x1b[0m`
      : `\x1b[33m Delete ${nbFolder} empty directory \x1b[0m`;
  console.log(strDeleteDirectory);
  console.log(`\x1b[33m End of process... Your repository is clean !!!\x1b[0m`);
}

/**recursiveDirectory()
 *TODO: lists all files and subfolders in the specified path and returns an array
 *@sync
 *@param {string} dirPath;
 *@param {Boolean} useDayFolder;
 *@param {Array<string>} arrayOfFiles;
 *@retrun {Array<string>} arrayOfFiles;
 */
function recursiveDirectory(dirPath, useDayFolder, arrayOfFiles) {
  let files = FS.readdirSync(dirPath);
  files.forEach((file) => {
    if (useDayFolder) {
      if (FS.statSync(dirPath + file).isDirectory()) {
        arrayOfFiles = recursiveDirectory(
          dirPath + file + "/",
          true,
          arrayOfFiles
        );
      } else {
        console.log(file);
        arrayOfFiles.push(PATH.join(dirPath, "/", file));
      }
    } else {
      if (FS.statSync(dirPath + file).isDirectory()) {
        console.log(file);
        arrayOfFiles.push(PATH.join(dirPath, file));
        arrayOfFiles = recursiveDirectory(
          dirPath + file + "/",
          false,
          arrayOfFiles
        );
      }
    }
  });
  return arrayOfFiles;
}
/*END recursiveDirectory()*/
/**deleteSavePerso
 *TODO: remove manual saves
 *@sync
 *@param {Array} savePerso;
 *@param {number} num;
 *@retrun {number} nbFile;
 */
function deleteSavePerso(savePerso, num, folder) {
  let returnInfo = {
    arrayToDelete: [],
    nbFilePerso: 0,
  };
  try {
    let slvJson = JSON.parse(
      FS.readFileSync(folder + "/SLVcopy-lock.json", "utf-8")
    );
    savePerso.forEach((file) => {
      let splitPerso = file.split("\\");
      let namePerso = splitPerso[splitPerso.length - 1];
      let splitInit = file.split("_SAUV_PERSO_SLV-Copy_");
      let nameInit =
        splitInit[0].split("\\")[splitInit[0].split("\\").length - 1] +
        PATH.extname(namePerso);
      Object.entries(slvJson).forEach(([key, value]) => {
        const { name, cName } = slvJson[key];
        if (cName.length > num) {
          let rest = cName.length - num + 1;
          slvJson[key].cName = cName.slice(rest);
        }
        let arrayRestruc = slvJson[key].cName.reduce((arr, val) => {
          const split = val.split("\\")[val.split("\\").length - 1];
          arr.push(split);
          return arr;
        }, []);
        if (name === nameInit) {
          if (!arrayRestruc.includes(namePerso)) {
            returnInfo.arrayToDelete.push(file);
            returnInfo.nbFilePerso++;
          }
        }
      });
    });
  } catch {
    //no SLVcopy-lock.json delete all manual save
    savePerso.forEach((file) => {
      try {
        returnInfo.arrayToDelete.push(file);
        returnInfo.nbFilePerso++;
      } catch (err) {}
    });
  }
  return returnInfo;
}
/*END deleteSavePerso*/
function askTooUser(question, waitAnswer, arrayFile) {
  const rl = READLINE.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question(question, function (answer) {
      if (answer === waitAnswer) {
        console.log(`\x1b[33m Delete is running, please wait...\x1b[0m`);
        arrayFile.forEach((file) => {
          FS.unlinkSync(file);
          console.log(`${file} delete`);
        });
        rl.close();
      } else {
        console.log(`\x1b[33m Clean-up is stopped. NO DELETE\x1b[0m`);
        rl.close();
      }
    });
    rl.on("close", function () {
      resolve();
    });
  });
}
