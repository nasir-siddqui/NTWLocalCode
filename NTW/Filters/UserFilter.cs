using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using AutoMapper;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel;
using UserDetails = Telia.NTW.Web.ViewModel.Shared.UserDetails;
using Telia.NTW.Web.Helpers;
using System.Web.Security;

namespace Telia.NTW.Web.Filters
{
    public class UserFilter : ActionFilterAttribute
    {

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var model = (BaseViewModel)filterContext.Controller.ViewData.Model;
            if (model == null)
                return;

            model.UserDetails = CookieHelper.GetUserDetails();
        }

    }     
}