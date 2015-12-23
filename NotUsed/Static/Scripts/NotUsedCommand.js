/**
 * Creates an anguilla command using a wrapper shorthand. Command is responsible for communicating wtih api controller
 *
 * Note the ${PluginName} will get replaced by the actual plugin name.
 */
Alchemy.command("${PluginName}", "NotUsed", {

    /**
     * If an init function is created, this will be called from the command's constructor when a command instance
     * is created.
     */
    init: function () {
        console.log("INIT CALLED FROM NotUsed");
    },
    
    /**
     * Whether or not the command is enabled for the user (will usually have extensions displayed but disabled).
     * @returns {boolean}
     */
    isEnabled: function (selection) {
        // Gets the selected item in Tridion GUI
        var items = selection.getItems();
        var item = $models.getItem(selection.getItem(0));
        // Checks if a single folder (tcm:2) item has been selected.
        // TODO: Add support for categories (tcm:512)
        if (items.length == 1 && (item.getItemType() == 'tcm:2')) { // || item.getItemType() == 'tcm:512')) {
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * Whether or not the command is available to the user. This impacts the context menu option.
     * @returns {boolean}
     */
    isAvailable: function (selection) {
        // Gets the selected item in Tridion GUI
        var items = selection.getItems();
        var item = $models.getItem(selection.getItem(0));
        // Checks if a single folder (tcm:2) item has been selected.
        // TODO: Add support for categories (tcm:512)
        if (items.length == 1 && (item.getItemType() == 'tcm:2')) { // || item.getItemType() == 'tcm:512')) {
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * Executes your command. You can use _execute or execute as the property name.
     */
    execute: function (selection) {
        // Gets the item id
        var itemId = selection.getItem(0);
        // Sets the url of a popup window, passing through params for the ID of the selected folder/item
        var url = "${ViewsUrl}NotUsed.aspx?uri=" + itemId;
        // Creates a popup with the above URL
        var popup = $popup.create(url, "menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=700,height=450,top=10,left=10", null);
        popup.open();
    }
});