using System.Web.Security;
using Telia.NTW.Core.Services;

namespace Telia.NTW.Web
{
	public class NTWRoleProvider : RoleProvider
	{
		private readonly SecurityService _securityService;

		public NTWRoleProvider()
		{
			_securityService = new SecurityService();
		}

		public override bool IsUserInRole(string username, string roleName)
		{
			return _securityService.IsUserInRole(username, roleName);
		}

		public override string[] GetRolesForUser(string username)
		{
			return _securityService.GetRolesForUser(username);
		}

		public override void CreateRole(string roleName)
		{
			_securityService.CreateRole(roleName);
		}

		public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
		{
			return _securityService.DeleteRole(roleName, throwOnPopulatedRole);
		}

		public override bool RoleExists(string roleName)
		{
			return _securityService.RoleExists(roleName);
		}

		public override void AddUsersToRoles(string[] usernames, string[] roleNames)
		{
			_securityService.AddUsersToRoles(usernames, roleNames);
		}

		public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
		{
			_securityService.RemoveUsersFromRoles(usernames, roleNames);
		}

		public override string[] GetUsersInRole(string roleName)
		{
			return _securityService.GetUsersInRole(roleName);
		}

		public override string[] GetAllRoles()
		{
			return _securityService.GetAllRoles();
		}

		public override string[] FindUsersInRole(string roleName, string usernameToMatch)
		{
			return _securityService.FindUsersInRole(roleName, usernameToMatch);
		}

		public override string ApplicationName
		{
			get { return _securityService.ApplicationName; }
			set { _securityService.ApplicationName = value; }
		}
	}
}