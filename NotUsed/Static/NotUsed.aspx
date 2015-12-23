<%@ Page Language="C#" Inherits="Tridion.Web.UI.Editors.CME.Views.Page" %>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Not Used</title>
        <cc:tridionmanager runat="server" editor="CME">
            <dependencies runat="server"> 
                <dependency runat="server">Tridion.Web.UI.Editors.CME</dependency>
                <dependency runat="server">Tridion.Web.UI.Editors.CME.commands</dependency>
                <dependency runat="server">Alchemy.Resources.Libs.Jquery</dependency>
                <dependency runat="server">Alchemy.Plugins.${PluginName}.Resources.NotUsedPopupResourceGroup</dependency>
            </dependencies>
        </cc:tridionmanager>
		<link rel='shortcut icon' type='image/x-icon' href='${ImgUrl}favicon.png' />
    </head>
    <body>
        <div class="tabs">
            <div class="active">The following items are not used:</div>
        </div>
        <div class="tab-body active">
            <progress id="progBar"></progress>
        </div>
		<div class="controls">
			<div class="button disabled" id="open_item"><span class="text">Open</span></div>
			<div class="button disabled" id="go_to_item_location"><span class="text">Go To Location</span></div>
            <div class="button disabled" id="delete_item"><span class="text">Delete</span></div>
            <div class="button" id="refresh_items"><span class="text">Refresh</span></div>
		</div>
    </body>
</html>