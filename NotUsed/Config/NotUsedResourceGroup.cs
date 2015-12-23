using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace NotUsed.Config
{
    /// <summary>
    /// Represents the ResourceGroup element within the editor configuration that contains this plugin's files
    /// and references.
    /// </summary>
    public class NotUsedResourceGroup : ResourceGroup
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public NotUsedResourceGroup()
        {
            // When adding files you only need to specify the filename and not full path
            AddFile("NotUsedCommand.js");
            AddFile("NotUsed.css");

            // When referencing commandsets you can just use the generic AddFile with your CommandSet as the type.
            AddFile<NotUsedCommandSet>();
            // The above is just a convenient way of doing the following...
            // AddFile(FileTypes.Reference, "Alchemy.Plugins.HelloWorld.Commands.HelloCommandSet");
            
            // If you want this resource group to contain the js proxies to call your webservice, call AddWebApiProxy()
            AddWebApiProxy();
        }
    }
}
