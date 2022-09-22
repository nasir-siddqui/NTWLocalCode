﻿// <auto-generated />
// This file was generated by a T4 template.
// Don't change it directly as your change would get overwritten.  Instead, make changes
// to the .tt file (i.e. the T4 template) and save it to regenerate this file.

// Make sure the compiler doesn't complain about missing Xml comments and CLS compliance
#pragma warning disable 1591, 3008, 3009
#region T4MVC

using System;
using System.Diagnostics;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using System.Web.Mvc.Html;
using System.Web.Routing;
using T4MVC;

[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
public static partial class MVC
{
    public static Telia.NTW.Web.Controllers.AdminController Admin = new Telia.NTW.Web.Controllers.T4MVC_AdminController();
    public static Telia.NTW.Web.Controllers.AnalysController Analys = new Telia.NTW.Web.Controllers.T4MVC_AnalysController();
    public static Telia.NTW.Web.Controllers.BaseController Base = new Telia.NTW.Web.Controllers.T4MVC_BaseController();
    public static Telia.NTW.Web.Controllers.CustomErrorsController CustomErrors = new Telia.NTW.Web.Controllers.T4MVC_CustomErrorsController();
    public static Telia.NTW.Web.Controllers.HomeController Home = new Telia.NTW.Web.Controllers.T4MVC_HomeController();
    public static Telia.NTW.Web.Controllers.LeverantörsinformationController Leverantörsinformation = new Telia.NTW.Web.Controllers.T4MVC_LeverantörsinformationController();
    public static Telia.NTW.Web.Controllers.MultistyrningController Multistyrning = new Telia.NTW.Web.Controllers.T4MVC_MultistyrningController();
    public static Telia.NTW.Web.Controllers.QuickHelpController QuickHelp = new Telia.NTW.Web.Controllers.T4MVC_QuickHelpController();
    public static Telia.NTW.Web.Controllers.SAMLController SAML = new Telia.NTW.Web.Controllers.T4MVC_SAMLController();
    public static Telia.NTW.Web.Controllers.WebbstyrningController Webbstyrning = new Telia.NTW.Web.Controllers.T4MVC_WebbstyrningController();
    public static T4MVC.SharedController Shared = new T4MVC.SharedController();
}

namespace T4MVC
{
}

namespace T4MVC
{
    [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
    public class Dummy
    {
        private Dummy() { }
        public static Dummy Instance = new Dummy();
    }
}

[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
internal partial class T4MVC_System_Web_Mvc_ActionResult : System.Web.Mvc.ActionResult, IT4MVCActionResult
{
    public T4MVC_System_Web_Mvc_ActionResult(string area, string controller, string action, string protocol = null): base()
    {
        this.InitMVCT4Result(area, controller, action, protocol);
    }
     
    public override void ExecuteResult(System.Web.Mvc.ControllerContext context) { }
    
    public string Controller { get; set; }
    public string Action { get; set; }
    public string Protocol { get; set; }
    public RouteValueDictionary RouteValueDictionary { get; set; }
}
[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
internal partial class T4MVC_Sigma_Utils_ActionResults_ExcelActionResult : Sigma.Utils.ActionResults.ExcelActionResult, IT4MVCActionResult
{
    public T4MVC_Sigma_Utils_ActionResults_ExcelActionResult(string area, string controller, string action, string protocol = null): base(" ")
    {
        this.InitMVCT4Result(area, controller, action, protocol);
    }
    
    public string Controller { get; set; }
    public string Action { get; set; }
    public string Protocol { get; set; }
    public RouteValueDictionary RouteValueDictionary { get; set; }
}
[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
internal partial class T4MVC_System_Web_Mvc_JsonResult : System.Web.Mvc.JsonResult, IT4MVCActionResult
{
    public T4MVC_System_Web_Mvc_JsonResult(string area, string controller, string action, string protocol = null): base()
    {
        this.InitMVCT4Result(area, controller, action, protocol);
    }
    
    public string Controller { get; set; }
    public string Action { get; set; }
    public string Protocol { get; set; }
    public RouteValueDictionary RouteValueDictionary { get; set; }
}
[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
internal partial class T4MVC_System_Web_Mvc_RedirectToRouteResult : System.Web.Mvc.RedirectToRouteResult, IT4MVCActionResult
{
    public T4MVC_System_Web_Mvc_RedirectToRouteResult(string area, string controller, string action, string protocol = null): base(default(System.Web.Routing.RouteValueDictionary))
    {
        this.InitMVCT4Result(area, controller, action, protocol);
    }
    
    public string Controller { get; set; }
    public string Action { get; set; }
    public string Protocol { get; set; }
    public RouteValueDictionary RouteValueDictionary { get; set; }
}
[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
internal partial class T4MVC_System_Web_Mvc_PartialViewResult : System.Web.Mvc.PartialViewResult, IT4MVCActionResult
{
    public T4MVC_System_Web_Mvc_PartialViewResult(string area, string controller, string action, string protocol = null): base()
    {
        this.InitMVCT4Result(area, controller, action, protocol);
    }
    
    public string Controller { get; set; }
    public string Action { get; set; }
    public string Protocol { get; set; }
    public RouteValueDictionary RouteValueDictionary { get; set; }
}



namespace Links
{
    [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
    public static class Scripts {
        private const string URLPATH = "~/Scripts";
        public static string Url() { return T4MVCHelpers.ProcessVirtualPath(URLPATH); }
        public static string Url(string fileName) { return T4MVCHelpers.ProcessVirtualPath(URLPATH + "/" + fileName); }
        public static readonly string analys_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/analys.min.js") ? Url("analys.min.js") : Url("analys.js");
        public static readonly string combobox_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/combobox.min.js") ? Url("combobox.min.js") : Url("combobox.js");
        public static readonly string deleteConfirmation_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/deleteConfirmation.min.js") ? Url("deleteConfirmation.min.js") : Url("deleteConfirmation.js");
        public static readonly string jquery_ui_timepicker_addon_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/jquery-ui-timepicker-addon.min.js") ? Url("jquery-ui-timepicker-addon.min.js") : Url("jquery-ui-timepicker-addon.js");
        public static readonly string jquery_validate_unobtrusive_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/jquery.validate.unobtrusive.min.js") ? Url("jquery.validate.unobtrusive.min.js") : Url("jquery.validate.unobtrusive.js");
        public static readonly string jquery_validate_unobtrusive_min_js = Url("jquery.validate.unobtrusive.min.js");
        public static readonly string modernizr_2_6_2_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/modernizr-2.6.2.min.js") ? Url("modernizr-2.6.2.min.js") : Url("modernizr-2.6.2.js");
        public static readonly string validation_isdatetimeafter_js = T4MVCHelpers.IsProduction() && T4Extensions.FileExists(URLPATH + "/validation.isdatetimeafter.min.js") ? Url("validation.isdatetimeafter.min.js") : Url("validation.isdatetimeafter.js");
    }

    [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
    public static class Content {
        private const string URLPATH = "~/Content";
        public static string Url() { return T4MVCHelpers.ProcessVirtualPath(URLPATH); }
        public static string Url(string fileName) { return T4MVCHelpers.ProcessVirtualPath(URLPATH + "/" + fileName); }
        public static readonly string _all_less = Url("_all.less");
        public static readonly string _anchor_less = Url("_anchor.less");
        public static readonly string _datepicker_less = Url("_datepicker.less");
        public static readonly string _dropdown_less = Url("_dropdown.less");
        public static readonly string _form_less = Url("_form.less");
        public static readonly string _slider_less = Url("_slider.less");
        public static readonly string _table_less = Url("_table.less");
        public static readonly string _tree_less = Url("_tree.less");
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public static class images {
            private const string URLPATH = "~/Content/images";
            public static string Url() { return T4MVCHelpers.ProcessVirtualPath(URLPATH); }
            public static string Url(string fileName) { return T4MVCHelpers.ProcessVirtualPath(URLPATH + "/" + fileName); }
            public static readonly string ui_icons_ffffff_256x240_png = Url("ui-icons_ffffff_256x240.png");
        }
    
    }

    [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
    public static partial class Bundles
    {
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public static partial class Scripts {}
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public static partial class Styles {}
    }
}

[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
internal static class T4MVCHelpers {
    // You can change the ProcessVirtualPath method to modify the path that gets returned to the client.
    // e.g. you can prepend a domain, or append a query string:
    //      return "http://localhost" + path + "?foo=bar";
    private static string ProcessVirtualPathDefault(string virtualPath) {
        // The path that comes in starts with ~/ and must first be made absolute
        string path = VirtualPathUtility.ToAbsolute(virtualPath);
        
        // Add your own modifications here before returning the path
        return path;
    }

    // Calling ProcessVirtualPath through delegate to allow it to be replaced for unit testing
    public static Func<string, string> ProcessVirtualPath = ProcessVirtualPathDefault;

    // Calling T4Extension.TimestampString through delegate to allow it to be replaced for unit testing and other purposes
    public static Func<string, string> TimestampString = System.Web.Mvc.T4Extensions.TimestampString;

    // Logic to determine if the app is running in production or dev environment
    public static bool IsProduction() { 
        return (HttpContext.Current != null && !HttpContext.Current.IsDebuggingEnabled); 
    }
}





#endregion T4MVC
#pragma warning restore 1591, 3008, 3009


