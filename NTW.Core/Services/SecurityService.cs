using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Helpers;

namespace Telia.NTW.Core.Services
{
    public class SecurityService
    {
        private readonly NtwEfModel dbContext;
        private readonly RoleHelper roleHelper;
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(typeof(SecurityService));
        public const string CompanyUsernamePrefix = "\u0091";

        // Dependency injection not possible in RoleProvider.
        public SecurityService()
        {
            dbContext = new NtwEfModel();
            roleHelper = new RoleHelper(dbContext);
        }

        #region Private methods
        private HashSet<Role> includeIncludedRoles(Role role)
        {
            HashSet<Role> roles = new HashSet<Role> { role };

            //foreach (Role includedRole in role.IncludedRoles)
            //{
            //	roles.UnionWith(includeIncludedRoles(includedRole));
            //}

            return roles;
        }

        private HashSet<Role> includeIncludedRoles(IEnumerable<Role> baseRoles)
        {
            HashSet<Role> roles = new HashSet<Role>();
            foreach (Role role in baseRoles)
            {
                roles.UnionWith(includeIncludedRoles(role));
            }

            return roles;
        }

        private HashSet<Role> includeIncludedByRoles(Role role)
        {
            HashSet<Role> roles = new HashSet<Role> { role };

            foreach (Role includedByRole in role.IncludedByRoles)
            {
                roles.UnionWith(includeIncludedByRoles(includedByRole));
            }

            return roles;
        }

        private bool IsUserInRole(User user, string roleName)
        {
            string[] rolesForUser = GetRolesForUser(user);

            return rolesForUser.Contains(roleName);
        }

        private string[] GetRolesForUserInternal(string username)
        {
            var user = getUser(username);
            var roles = GetRolesForUser(user);
            return roles;
        }

        private string[] getRolesAsStrings(IEnumerable<Role> roles)
        {
            return roles.Select(role => role.Name).ToArray();
        }

        private Role getRole(string roleName)
        {
            return dbContext.Role.SingleOrDefault(dbRole => dbRole.Name.Equals(roleName));
        }

        private IEnumerable<User> getUsers(string[] usernames)
        {
            return dbContext.User.Where(dbUser => usernames.Contains(dbUser.LoginName));
        }
        #endregion

        #region RoleProvider methods
        public bool IsUserInRole(string username, string roleName)
        {
            if (username == null || username.Equals("") || roleName == null || roleName.Equals(""))
            {
                return false;
            }

            User user = getUser(username);
            return IsUserInRole(user, roleName);
        }

        public string[] GetRolesForUser(string username)
        {
            if (username == null || username.Equals(""))
            {
                return new string[0];
            }

            string[] roles;
            if (!username.StartsWith(CompanyUsernamePrefix))
            {
                roles = GetRolesForUserInternal(username);
            }
            else
            {
                roles = GetRolesForCompany(int.Parse(username.Substring(1)));
            }

            log.Debug("Found roles for user " + username + ": " + String.Join(", ", roles));
            return roles;
        }

        public void CreateRole(string roleName)
        {
            Role newRole = new Role
            {
                Name = roleName
            };

            dbContext.Role.Add(newRole);
            dbContext.SaveChanges();
        }

        public bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            Role role = dbContext.Role.SingleOrDefault(dbRole => dbRole.Name.Equals(roleName));

            if (throwOnPopulatedRole)
            {
                bool roleIsPopulatedWithUsers = role.Users.Count > 0;
                bool roleIsPopulatedWithCompanies = role.Companies.Count > 0;

                if (roleIsPopulatedWithUsers || roleIsPopulatedWithCompanies)
                {
                    throw new InvalidOperationException("Role " + roleName + " is populated");
                }
            }

            dbContext.Role.Remove(role);

            return true;
        }

        public bool RoleExists(string roleName)
        {
            return dbContext.Role.Any(dbRole => dbRole.Name.Equals(roleName));
        }

        public void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            var users = getUsers(usernames);

            foreach (User user in users)
            {
                foreach (string roleName in roleNames)
                {
                    // Roles is a HashSet so no risk for duplicates
                    user.Roles.Add(getRole(roleName));
                }
            }
        }

        public void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            var users = getUsers(usernames);

            foreach (User user in users)
            {
                foreach (string roleName in roleNames)
                {
                    Role role = getRole(roleName);
                    user.Roles.Remove(role);
                }
            }
        }

        public string[] GetUsersInRole(string roleName)
        {
            Role baseRole = getRole(roleName);
            var roles = includeIncludedByRoles(baseRole);

            List<User> usersInRoles = new List<User>();
            foreach (Role role in roles)
            {
                var usersInRole = role.Users;

                foreach (User user in usersInRole)
                {
                    var rolesForUser = GetRolesForUserAsSet(user);
                    if (rolesForUser.Contains(role))
                    {
                        usersInRoles.Add(user);
                    }
                }
            }

            return usersInRoles.Select(user => user.LoginName).ToArray();
        }

        public string[] GetAllRoles()
        {
            return getRolesAsStrings(dbContext.Role);
        }

        public string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            var users = dbContext.User.Where(dbUser =>
                dbUser.LoginName.Contains(usernameToMatch)
                && IsUserInRole(dbUser, roleName)
                ).ToList();

            return users.Select(user => user.LoginName).ToArray();
        }

        public string ApplicationName
        {
            get { return "NTW"; }
            set { }
        }
        #endregion

        #region Public Non RoleProvider methods
        public User getUser(string username)
        {
            return dbContext.User.SingleOrDefault(dbUser => dbUser.LoginName == username);
        }

        public CompanyInfo GetCompanyForUser(string username)
        {
            if (username == null || username.Equals(""))
            {
                return null;
            }

            if (!username.StartsWith(CompanyUsernamePrefix))
            {
                return getUser(username).Company;
            }
            else
            {
                return GetCompany(int.Parse(username.Substring(1)));
            }
        }

        public UserDetailsCore GetUserDetails(string username)
        {
            if (username == null || username.Equals(""))
            {
                return null;
            }

            var user = getUser(username);

            var userDetails = new UserDetailsCore
            {
                UserId = user.UserID,
                DisplayName = user.Name,
                CompanyId = user.Company.CompanyId,
                BolagLoggedIn = false,
                OriginalUsername = user.LoginName,
                Bolagsnamn = user.Company.CompanyName,
                BolagOrgNr = user.Company.OrgNr
            };

            return userDetails;
        }

        public bool IsCompany(string username)
        {
            if (username.StartsWith(CompanyUsernamePrefix))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int getUserId(string username)
        {
            return dbContext.User.Single(dbUser => dbUser.LoginName == (username)).UserID;
        }

        public string[] GetRolesForCompany(CompanyInfo company)
        {
            var roles = includeIncludedRoles(company.Roles);
            return getRolesAsStrings(roles);
        }

        public HashSet<Role> GetRolesForUserAsSet(User user)
        {
            var userRoles = includeIncludedRoles(user.Roles);
            var copyOfUserRoles = new HashSet<Role>(userRoles);

            if (user.Company != null)
            {
                var companyRoles = includeIncludedRoles(user.Company.Roles);

                foreach (Role role in copyOfUserRoles)
                {
                    if (!companyRoles.Contains(role))
                    {
                        userRoles.Remove(role);
                    }
                }
            }

            return userRoles;
        }

        public string[] GetRolesForUser(User user)
        {
            var roles = GetRolesForUserAsSet(user);
            return getRolesAsStrings(roles);
        }

        public string[] GetRolesForCompany(int companyId)
        {
            var company = GetCompany(companyId);
            var roles = includeIncludedRoles(company.Roles);
            roles.Add(roleHelper.AdministratörRole);
            return getRolesAsStrings(roles);
        }

        public CompanyInfo GetCompany(int companyId)
        {
            return dbContext.CompanyInfo.Where(dbCompany => dbCompany.CompanyId == companyId).AsNoTracking().SingleOrDefault();
        }

        public void LoggedIn(string userName)
        {
            var user = dbContext.User.Single(s => s.LoginName == userName);
            user.LogonDate = DateTime.Now;
            dbContext.SaveChanges();
            //log.Info("User: " + userName + " logged in date updated to " + user.LogonDate);
        }

        public DateTime? LastLoggedIn(string userName)
        {
            var user = dbContext.User.Single(s => s.LoginName == userName);
            return user.LogonDate;
        }
        #endregion
    }
}