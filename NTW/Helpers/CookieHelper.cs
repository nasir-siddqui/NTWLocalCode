using System;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;
using AutoMapper;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel.Shared;

namespace Telia.NTW.Web.Helpers
{
    public class CookieHelper
    {
	    private readonly StaffService staffService;
	    private readonly SecurityService securityService;

        private static readonly JavaScriptSerializer serializer = new JavaScriptSerializer();

	    public CookieHelper(StaffService staffService, SecurityService securityService)
	    {
		    this.staffService = staffService;
		    this.securityService = securityService;
	    }

		#region Login
		public void LoginUser(string username, string idp)
		{
			var userDetailsCore = securityService.GetUserDetails(username);
			var userDetails = Mapper.Map<UserDetailsCore, UserDetails>(userDetailsCore);
			userDetails.LogoutUrl = idp.Equals(Properties.Settings.Default.ExternalIdP)
				? Properties.Settings.Default.ExternalLogin
				: "";
			login(username, userDetails);
		}

		public void LoginCompany(int companyId)
		{
			string companyUsername = string.Format("{0}{1}", SecurityService.CompanyUsernamePrefix, companyId);

			var userDetails = GetUserDetails();

			CompanyInfo bolag = securityService.GetCompany(companyId);
			userDetails.CompanyId = companyId;
			userDetails.BolagLoggedIn = true;
			userDetails.BolagOrgNr = bolag.OrgNr;
			userDetails.Bolagsnamn = bolag.CompanyName;

			login(companyUsername, userDetails);
		}

		private void login(string username, UserDetails userDetails)
		{
			HttpContext httpContext = HttpContext.Current;
			var cookie = FormsAuthentication.GetAuthCookie(username, false);

			FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(cookie.Value);

			var newTicket = new FormsAuthenticationTicket(ticket.Version, username, ticket.IssueDate, ticket.Expiration,
					 ticket.IsPersistent, serializer.Serialize(userDetails), ticket.CookiePath);
			var encTicket = FormsAuthentication.Encrypt(newTicket);

			cookie.Value = encTicket;
			httpContext.Response.Cookies.Add(cookie);

			Roles.DeleteCookie();
		}
		#endregion

		#region UserDetails
		public static UserDetails GetUserDetails()
		{
			var cookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

			if (cookie == null)
				return null;

			var ticket = FormsAuthentication.Decrypt(cookie.Value);
			return serializer.Deserialize<UserDetails>(ticket.UserData);
	    }

	    public static string GetOriginalUsername()
	    {
            return GetUserDetails().OriginalUsername;
	    }

		public static string GetUserDisplayName()
		{
			return GetUserDetails().DisplayName;
		}
		#endregion

		public decimal GetCustomerId()
	    {
			try
			{
				var orgNr = GetUserDetails().BolagOrgNr;

				if (RoleHelper.isAdminCompany(orgNr))
				{
					return -1;
				}

				orgNr = orgNr.Replace("-", "");
				decimal? customerId = staffService.GetCustomerId(orgNr);
				if (customerId != null)
				{
					return customerId.Value;
				}
				else
				{
					return -1;
				}
			}

			catch (Exception)
			{
				// Exception already logged. Company does not exist in staff.
				return -1;
			}
	    }
    }
}