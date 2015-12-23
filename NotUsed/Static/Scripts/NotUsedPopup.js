/**
 * Handles all functionality of my popup window, including retrieving the unused items, refreshing the popup, etc.
 *
 * Note the self executing function wrapping the JS. This is to limit the scope of my variables and avoid
 * conflicts with other scripts.
 */
!(function () {
    // Alchemy comes with jQuery and several other libraries already pre-installed so assigning
    // it a variable here eliminates the redundancy of loading my own copy, and avoids any conflicts over
    // the $ character
    $j = Alchemy.library("jQuery");

    // Grabs the URL of the popup and gets the TCM of the item selected in Tridion from the querystring
    var url = location.href;
    var tcm = url.substring(url.indexOf("uri=tcm%3A") + 10, url.indexOf("#"));

    // On page load I display the items not in use within the folder defined by tcm.
    updateNotUsedItems(tcm);

    /**
     * Takes a TCM ID for a Tridion folder and retrieves the a list of the contained items that are not used.
     */
    function updateNotUsedItems(tcmInput) {

        // This is the call to my controller where the core service code is used to gather the
        // not used information. It is returned as a string of HTML.
        Alchemy.Plugins["${PluginName}"].Api.NotUsedService.getNotUsedItems(tcmInput)
        .success(function (items) {

            // First arg in success is what's returned by your controller's action

            // Upon successful retrieval of Not Used items, we want to remove the progress bar and add the not used items to the markup
            // (there is a progress bar by default in the markup in NotUsed.aspx, as the search starts automatically when the 
            // popup is open).
            $j("#progBar").remove();
            $j(".tab-body.active").append(items);

            // We want to have an action when we click anywhere on the tab body
            // that isn't a used or using item
            $j(".tab-body").mouseup(function (e) {
                // To do this we first find the results item containing the not used items
                var results = $j(".results");
                if (!results.is(e.target) // if the target of the click isn't the results...
                && results.has(e.target).length === 0) // ... nor a descendant of the results
                {
                    // Call a function to deselect the current item
                    deselectItems();
                }
            });

            // The refresh button should always be enabled. It essentially re-runs the entire getNotUsedItems procedure, 
            // discarding any previously returned items. You may want to use this, for instance, in the scenario where you
            // have a component that is linked to. Once the linking component is deleted, the component linked to may no
            // longer be used, and so a refresh is required.
            // TODO: consider ways to make this more efficient (i.e. by only re-running the getNotUsedItems procedure for items
            // linked to from an item that is deleted). And then consider running this automatically after each deletion.
            $j("#refresh_items").click(function () {
                // When the refresh button is clicked, we want to clear out the markup for the list of items and add a progress bar, indicating 
                // a new search for the unused items has begun.
                $j(".tab-body.active").html("");
                $j(".tab-body.active").append("<progress id=\"progBar\"></progress>");
                // Call the same getNotUsedItems() Web API function that is used when the popup is first open.
                Alchemy.Plugins["${PluginName}"].Api.NotUsedService.getNotUsedItems(tcmInput)
                .success(function (items) {
                    // Upon successful retrieval of Not Used items, we want to remove the progress bar and add the not used items to the markup.
                    $j("#progBar").remove();
                    $j(".tab-body.active").append(items);
                })
                .error(function (type, error) {
                    // First arg is a string that shows the type of error i.e. (500 Internal), 2nd arg is object representing
                    // the error.  For BadRequests and Exceptions, the error message will be in the error.message property.
                    console.log("There was an error", error.message);
                })
                .complete(function () {
                    // this is called regardless of success or failure.
                    deselectItems();
                    setupForItemClicked();
                });
            });

            setupForItemClicked();
        })
        .error(function (type, error) {
            // First arg is a string that shows the type of error i.e. (500 Internal), 2nd arg is object representing
            // the error.  For BadRequests and Exceptions, the error message will be in the error.message property.
            console.log("There was an error", error.message);
        })
        .complete(function () {
            // this is called regardless of success or failure.
        });
    }

    /**
     * Common routine that is used to specify what happens when an item in the list of unused items is clicked. 
     * This function should be called each time the Not Used command is run, and in particular, each time the
     * "refresh" button is clicked.
     */
    function setupForItemClicked() {
        // An item is a Tridion item that is not being used by the current item (folder).
        // This is the click function for the items.
        $j(".item").click(function () {
            // When you click on an item we deselect any currently selected item
            $j(".item.selected").removeClass("selected")
            // And select the item you clicked on
            $j(this).addClass("selected");
            // We then use this function to enable the buttons since they are only enabled
            // when an item is selected
            enableButtons();

            // These are all the click functions for the buttons at the bottom of the plugin.
            // They get set when we click on an item because we only want them to happen when
            // the buttons are enabled and the buttons only get enabled when an item is selected.

            $j("#open_item.enabled").click(function () {
                // Gets the selected item TCM
                var selectedItemId = $j(".item.selected .id").html();
                // Checks if the selected item is a container and sets an appropriate command, either
                // "Properties" for containers or "Open" for other items
                var command = $models.isContainerItemType(selectedItemId) ? "Properties" : "Open";
                // Runs the Tridion command to open the selected item in the original CM window
                // Note that because this uses a $ rather than the $j assigned to JQuery this is actually
                // using the Sizzler library from the Tridion CME
                $cme.executeCommand(command, new Tridion.Cme.Selection(new Tridion.Core.Selection([selectedItemId])));

                // Added to fix issue where after deleting several items, opening an item was resulting in multiple
                // popups saying that the item is already open (even though it was only opened once)
                deselectItems();
            });

            $j("#go_to_item_location.enabled").click(function () {
                // Gets the selected item TCM
                var selectedItemId = $j(".item.selected .id").html();
                // Runs the Tridion command to go to the location of the selected item in the original CM window
                // Note that because this uses a $ rather than the $j assigned to JQuery this is actually
                // using the Sizzler library from the Tridion CME
                $cme.executeCommand("Goto", new Tridion.Cme.Selection(new Tridion.Core.Selection([selectedItemId])));

                // Added to fix issue where after deleting several items, opening an item was resulting in multiple
                // popups saying that the item is already open (even though it was only opened once)
                deselectItems();
            });

            $j("#delete_item.enabled").click(function () {
                // Gets the selected item TCM
                var selectedItemId = $j(".item.selected .id").html();
                var itemClicked = $j(".item.selected");

                var itemToDelete = $models.getItem(selectedItemId);

                //$evt.addEventHandler(itemToDelete, "delete", removeClickedItem);

                // TODO: Try to implement this using a named function passed in so that you can remove the EventHandler
                // immediately after deleteItem() is called (to ensure this event handler doesn't cause any conflicts 
                // with deletions from other dialogs, etc.
                //$evt.addEventHandler(itemToDelete, "delete", removeClickedItem);
                // * Note: I had difficulties running itemClicked.remove(); from a named function passed in, which
                // is why I decided to simply use an anonymous function (whose event handler can't be removed), 
                // as that actually worked.

                $evt.addEventHandler(itemToDelete, "delete", function (e) {
                    // If the item is successfully deleted, this code will be reached, causing the html representing
                    // the deleted item to be removed from the Not_Used popup.
                    itemClicked.remove();
                });

                itemToDelete.deleteItem();

                // TODO: Try to implement this using a named function passed in so that you can remove the EventHandler
                // immediately after deleteItem() is called (to ensure this event handler doesn't cause any conflicts 
                // with deletions from other dialogs, etc.
                //$evt.removeEventHandler(itemToDelete, "delete", removeClickedItem);

                deselectItems();
            });
        });
    }

    /**
    ** Whenever we deactivate the current item we need to remove the selected class from the item
    ** and disable all buttons since they are dependent on an item being selected to have a meaning
    **/ 
    function deselectItems() {
        $j("#open_item").addClass("disabled");
        $j("#go_to_item_location").addClass("disabled");
        $j("#delete_item").addClass("disabled");
        $j(".item.selected").removeClass("selected");
    }

    /**
    ** Enables all buttons by removing the disabled class and adding an enabled class.
    **/
    function enableButtons() {
        $j("#open_item").removeClass("disabled");
        $j("#open_item").addClass("enabled");
        $j("#go_to_item_location").removeClass("disabled");
        $j("#go_to_item_location").addClass("enabled");
        $j("#delete_item").removeClass("disabled");
        $j("#delete_item").addClass("enabled");
    }
})();