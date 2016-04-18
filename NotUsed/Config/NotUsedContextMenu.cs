using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace NotUsed.Config
{
    /// <summary>
    /// Represents an extension element in the editor configuration for creating a context menu extension.
    /// </summary>
    public class NotUsedContextMenu : ContextMenuExtension
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public NotUsedContextMenu()
        {
            // This is the id which gets put on the html element for this menu (to target with css/js).
            AssignId = "NotUsed";

            // The name of the extension menu
            Name = "NotUsedMenu";

            // Where to add the new menu in the current context menu.
            InsertBefore = Constants.ContextMenuIds.MainContextMenu.Separator7;
            
            // Generate all of the context menu items...
            AddItem("cm_notused", "Not Used...", "NotUsed");

            // We need to add our resource group as a dependency to this extension
            Dependencies.Add<NotUsedResourceGroup>();

            // Actually apply our extension to a particular view.  You can have multiple.
            Apply.ToView(Constants.Views.DashboardView);
        }
    }
}
