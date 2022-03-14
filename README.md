# SLV-copy

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
