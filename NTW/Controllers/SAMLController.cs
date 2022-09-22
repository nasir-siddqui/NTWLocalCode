using System;
using System.Collections.Generic;
using System.Web.Security;
using System.Web.Mvc;
using ComponentSpace.SAML2;
using System.Web.Script.Serialization;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Helpers;
using System.Configuration;

namespace Telia.NTW.Web.Controllers
{
	public partial class SAMLController : BaseController
	{
		private readonly SecurityService securityService;
		private readonly CookieHelper cookieHelper;

		private static readonly JavaScriptSerializer serializer = new JavaScriptSerializer();

		public const string AttributesSessionKey = "";
		private static readonly log4net.ILog log = log4net.LogManager.GetLogger(typeof(SAMLController));

		public SAMLController(SecurityService securityService, CookieHelper cookieHelper)
		{
			this.securityService = securityService;
			this.cookieHelper = cookieHelper;
		}

		[AllowAnonymous]
		public ActionResult InitiateSingleSignOn()
		{
			SAMLServiceProvider.InitiateSSO(this.Response, ConfigurationManager.AppSettings["RelayState"], ConfigurationManager.AppSettings["PartnerIdp"]);
			return (ActionResult)new EmptyResult();
		}

		private ActionResult RedirectToLocal(string returnUrl)
		{
			if (Url.IsLocalUrl(returnUrl))
			{
				return Redirect(returnUrl);
			}
			else
			{
				return RedirectToAction("Index", "Home");
			}
		}

		[AllowAnonymous]
		public virtual ActionResult AssertionConsumerService()
		{
			bool isInResponseTo = false;
			string partnerIdP = null;
			string userName = null;
			IDictionary<string, string> attributes = null;
			string targetUrl = null;

			try
			{
				// Remove old authentication if such exists.
				FormsAuthentication.SignOut();

				// Receive and process the SAML assertion contained in the SAML response.
				// The SAML response is received either as part of IdP-initiated or SP-initiated SSO.
				SAMLServiceProvider.ReceiveSSO(Request, out isInResponseTo, out partnerIdP, out userName, out attributes, out targetUrl);

				if (Properties.Settings.Default.ExternalIdP == partnerIdP)
				{
					userName = attributes["PERSONID"];
				}
				log.Debug("Received SAML ticket. User: " + userName + ", IdP: " + partnerIdP);
				log.Debug("SAML attributes for user " + userName + " : " + serializer.Serialize(attributes));

				if (securityService.getUser(userName) == null || userName[0].Equals(SecurityService.CompanyUsernamePrefix))
				{
					// user does not exist or has an illegal starting character.
					log.Info("Refused user: " + userName + ", IdP: " + partnerIdP);
					return new HttpStatusCodeResult(401);
				}
				// If no target URL is provided, provide a default.
				if (targetUrl == null)
				{
					targetUrl = "~/";
				}

				// Login automatically using the asserted identity.
				cookieHelper.LoginUser(userName, partnerIdP);
				log.Info("User: " + userName + " logged in with SAML Ticket. IDP: " + partnerIdP);

				// Update last logon time for user
				securityService.LoggedIn(userName);

				// Redirect to the target URL.
				return RedirectToLocal(targetUrl);
			}
			catch (Exception e)
			{
				log.Error("Unexpected error while logging in (AssertionConsumerService)", e);
				throw e;
			}
		}

		public virtual ActionResult SLOService()
		{
			// Receive the single logout request or response.
			// If a request is received then single logout is being initiated by the identity provider.
			// If a response is received then this is in response to single logout having been initiated by the service provider.
			bool isRequest = false;
			string logoutReason = null;
			string partnerSP = null;

			SAMLServiceProvider.ReceiveSLO(Request, out isRequest, out logoutReason, out partnerSP);

			if (isRequest)
			{
				// Logout locally.
				FormsAuthentication.SignOut();

				// Respond to the IdP-initiated SLO request indicating successful logout.
				SAMLServiceProvider.SendSLO(Response, null);
			}
			else
			{
				// SP-initiated SLO has completed.
				FormsAuthentication.RedirectToLoginPage();
			}

			return new EmptyResult();
		}

		public virtual ActionResult LocalLogout(string logoutUrl)
		{
			FormsAuthentication.SignOut();
			Roles.DeleteCookie();
			return Redirect(logoutUrl);
		}
		/// <summary>
		/// This method was created to mimic(remove) the SAML authentication and allow user to login into the application without 
		/// being authenticated
		/// </summary>
		/// <param name="targetUrl"></param>
		/// <returns></returns>
		[AllowAnonymous]
		public ActionResult Login(string targetUrl)
		{
			string username = "lum298";
			string partnerIdP = "https://sts.windows.net/05764a73-8c6f-4538-83cd-413f1e1b5665/";
			//string targetUrl = null;
			cookieHelper.LoginUser(username, partnerIdP);

			if (targetUrl == null)
			{
				targetUrl = "~/";
			}
			return RedirectToLocal(targetUrl);
		}
		// TODO : Flytta ut till helper klassen CookieHelper
		//public void SetAuthCookie(string userName, bool isPersistent, HttpContext context, UserDetails userDetails)
		//{
		//    /// In order to pickup the settings from config, we create a default cookie and use its values to create a 
		//    /// new one.
		//    var cookie = FormsAuthentication.GetAuthCookie(userName, isPersistent);
		//    var ticket = FormsAuthentication.Decrypt(cookie.Value);

		//    var newTicket = new FormsAuthenticationTicket(ticket.Version, ticket.Name, ticket.IssueDate, ticket.Expiration,
		//             ticket.IsPersistent, serializer.Serialize(userDetails), ticket.CookiePath);
		//    var encTicket = FormsAuthentication.Encrypt(newTicket);

		//    /// Use existing cookie. 
		//    cookie.Value = encTicket;
		//    FormsAuthentication.SignOut();
		//    context.Response.Cookies.Add(cookie);

		//}

	}
}