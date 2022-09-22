using System;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Sigma.Utils.Attributes
{
    public class BasicAuthorizeAttribute : AuthorizeAttribute
   {
		public string Username { get; set; }
		public string Password { get; set; }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

	        var httpContext = filterContext.HttpContext;
 
            string auth = httpContext.Request.Headers["Authorization"];

//	        if (String.IsNullOrEmpty(auth))
//	        {
//				auth = httpContext.Response.Headers["Authorization"];
//	        }
 
            if (!String.IsNullOrEmpty(auth))
            {
                byte[] encodedDataAsBytes = Convert.FromBase64String(auth.Replace("Basic ", ""));
                string value = Encoding.ASCII.GetString(encodedDataAsBytes);
                string enteredUsername = value.Substring(0, value.IndexOf(':'));
                string enteredPassword = value.Substring(value.IndexOf(':') + 1);

	            bool success;
	            if (Username != null && Password != null)
	            {
		            success = (enteredUsername.Equals(Username) && enteredPassword.Equals(Password));
	            }
	            else
	            {
		            success = Membership.ValidateUser(enteredUsername, enteredPassword);
	            }

	            if (success)
                {
                    httpContext.User = new GenericPrincipal(new GenericIdentity(enteredUsername), null);
                }
                else
                {
                    filterContext.Result = new HttpStatusCodeResult(401);
                }
            }
            else
            {
                if (AuthorizeCore(httpContext))
                {
                    HttpCachePolicyBase cachePolicy = httpContext.Response.Cache;
                    cachePolicy.SetProxyMaxAge(new TimeSpan(0));
                    cachePolicy.AddValidationCallback(CacheValidateHandler, null);
                }
                else
                {
                    httpContext.Response.Clear();
                    httpContext.Response.StatusDescription = "Unauthorized";
                    httpContext.Response.AddHeader("WWW-Authenticate", "Basic realm=\"Secure Area\"");
                    httpContext.Response.Write("401, please authenticate");
                    httpContext.Response.StatusCode = 401;
                    filterContext.Result = new EmptyResult();
                    httpContext.Response.End();
                }
            }
        }
 
        private void CacheValidateHandler(HttpContext context, object data, ref HttpValidationStatus validationStatus)
        {
            validationStatus = OnCacheAuthorization(new HttpContextWrapper(context));
        }
    }
}