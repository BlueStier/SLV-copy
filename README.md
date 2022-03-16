# SLV-copy

[![Licence](https://raw.githubusercontent.com/BlueStier/SLV-copy/main/img/licence.svg)](https://github.com/BlueStier/SLV-copy/blob/main/LICENSE.md)

[Github : BlueStier/SLV-copy](https://github.com/BlueStier/SLV-copy)

SLV-copy allows :
* perform automatic file saves when opening them in VScode.
* to make a renamed copy (manual save) via the palette or the right mouse click.
* to clean up the backup folder according to certain parameters.

![Annotated code](https://raw.githubusercontent.com/BlueStier/SLV-copy/main/img/conf_save.PNG)

# Process :
1. Auto save :
   * When opening VScode, the file present in the text editor is automatically saved in the directory specified according to its initial directory.
   * Each time a new file is opened, the backup is performed on it.
2. Manual save :
   * Allows you to rename the backup file with a comment.
3. Clean up backup folder :
   * The cleaning command operates in 2 stages :
     * First :  Cleanup will delete all auto backup files older than n months depending on the setting.
     * Then :   Cleanup deletes manual backup files keeping the last n backup (regardless of creation date) depending on the parameter. 


# Configuration

This extension can be configured in User Settings or Workspace settings.

` "SLV-copy.keyValueFolder": [[]]` : 
This parameter is used to associate a file opening directory and a saving directory.

` "SLV-copy.useDayFolder": boolean` : 
This parameter is used to set a daily folder

` "SLV-copy.deleteDelay": [3,6,9,12,18,24]` : 
Number of months of backup, files with an earlier date will be deleted from the backup directory (all users combined) when using the clean command

` "SLV-copy.numberOfSauvPerso":[1,2,3,4,5]` :
Number of personal backups kept (from the most recent to the oldest) when using the clean function

` "SLV-copy.authorizedFileType": [".html",".css",".scss",".js",".json"]` : Array of file extension definitions that will be saved. By default : ['html','css','scss','js']

` "SLV-copy.excludeFolder": []` : Folder exclusion array so that the backup does not occur

# Settings.json exemple

```javascript
{
  "SLV-copy.useDayFolder": true,
  "SLV-copy.keyValueFolder": [
      [
         "c:\\exemple1\\",
         "C:/Users/Desktop/exemple1/"
      ],
      [
         "c:\\exemple2\\",
         "C:/Users/Desktop/exemple2/"
      ]
   ],
"SLV-copy.authorizedFileType": [".html",".css",".scss",".js",".json"],
"SLV-copy.numberOfSauvPerso" : 7,
"SLV-copy.deleteDelay": 1,
"SLV-copy.excludeFolder": ["c:\\exemple3\\", "c:\\exemple4\\"]
}
```
