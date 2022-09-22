using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using log4net;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Entities.Admin;

using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Core.Services
{
	public class AnvändareService
	{
		private readonly NtwEfModel db;
		private readonly SecurityService securityService;
		private readonly RoleHelper roleHelper;
		private readonly AnvändareHelper användareHelper;

		private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public AnvändareService(NtwEfModel db, SecurityService securityService, RoleHelper roleHelper, AnvändareHelper användareHelper)
		{
			this.db = db;
			this.securityService = securityService;
			this.roleHelper = roleHelper;
			this.användareHelper = användareHelper;
		}

		#region Användare
		public IEnumerable<User> GetAnvändareList()
		{
			return db.User.Include("Company").Where(i => i.CompanyId > -1).ToList();
		}

		public IEnumerable<User> GetAnvändareList(string searchTerm)
		{
			return db.User.Include("Company").Where(i =>
					i.CompanyId > -1 
					&&
					(
						i.LoginName.Contains(searchTerm) ||
						i.Name.Contains(searchTerm) ||
						i.Company.CompanyName.Contains(searchTerm)||
						i.Company.OrgNr.Contains(searchTerm)
					)
				).ToList();
		}

		public User GetAnvändare(int userId)
		{
			return db.User.Include("Company").Single(i => i.UserID == userId);
		}

		public void Användare_Create(AdministreraAnvändare viewAnvändare, string username)
		{
			try
			{
				bool notAdminAndCustomer = !(viewAnvändare.UserCompanyId == 489 && viewAnvändare.Användartyper == Användaretyper.Kund);
				bool notCustomerAndAdmin = !(viewAnvändare.UserCompanyId != 489 && viewAnvändare.Användartyper == Användaretyper.Administratör);
				bool notCustomerAndSales = !(viewAnvändare.UserCompanyId != 489 && viewAnvändare.Användartyper == Användaretyper.Säljare);

				var dbAnvändare = db.User.Add(new User());
				var company = db.CompanyInfo.Single(i => i.CompanyId == viewAnvändare.UserCompanyId);

                // Denna if körs för att kolla så att
                // användarens bolag inte har bytts från ett kundbolag till Telia Admin Säljare som bolag, utan att välja roll
                // detta görs för att inte en admin/säljare ska ha kundroller
                // och även tvärtom koll
                if (notAdminAndCustomer && notCustomerAndAdmin && notCustomerAndSales)
                {
                    switch (viewAnvändare.Användartyper)
                    {
                        case Användaretyper.Kund:
                            //dbAnvändare.Roles.Add(db.Role.Single(m => m.Id == KundId));
                            dbAnvändare.Roles.Add(roleHelper.KundRole);

                            if (viewAnvändare.AnalysActive)
                                dbAnvändare.Roles.Add(roleHelper.AnalysRole);
                            if (viewAnvändare.WebbstyrningLäsActive)
                                dbAnvändare.Roles.Add(roleHelper.WebbstyrningRole);
                            if (viewAnvändare.WebbstyrningSkrivActive)
                                dbAnvändare.Roles.Add(roleHelper.WebbstyrningWriteRole);
                            if (viewAnvändare.WebbstyrningMultistyrning)
                                dbAnvändare.Roles.Add(roleHelper.WebbstyrningMultistyrningRole);
                            if (viewAnvändare.KoncernRattigheterActive)
                                dbAnvändare.Roles.Add(roleHelper.KoncernrättigheterRole);
                            if (viewAnvändare.LeverantörsinformationActive)
                                dbAnvändare.Roles.Add(roleHelper.LeverantörsinformationRole);
                            break;
                        case Användaretyper.Administratör:
                            dbAnvändare.Roles.Add(roleHelper.AdministratörRole);
                            break;
                        case Användaretyper.Säljare:
                            dbAnvändare.Roles.Add(roleHelper.SäljareRole);
                            break;
                    }
                }

				dbAnvändare.LoginName = viewAnvändare.AnvändarID;
				dbAnvändare.ChangedDate = DateTime.Now;
				dbAnvändare.ChangedBy = securityService.getUserId(username);
				dbAnvändare.CreationDate = DateTime.Now;
				dbAnvändare.LoginName = viewAnvändare.AnvändarID;
				dbAnvändare.Name = viewAnvändare.Namn;
				dbAnvändare.Company = company;
				dbAnvändare.TelNo = viewAnvändare.Telefon;
				dbAnvändare.Email = viewAnvändare.Email;
				dbAnvändare.Note = viewAnvändare.Notering;

				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewAnvändare != null && viewAnvändare.AnvändarID != null)
				{
					log.Error("Failed to create användare with username " + viewAnvändare.AnvändarID, e);
				}
				else
				{
					log.Error("Failed to create användare. ViewAnvändare or username is null", e);
				}

				throw e;
			}

		}

		public void Användare_Edit(AdministreraAnvändare viewAnvändare, string username)
		{
			try
			{
				bool notAdminAndCustomer = !(viewAnvändare.UserCompanyId == 489 && viewAnvändare.Användartyper == Användaretyper.Kund);
				bool notCustomerAndAdmin = !(viewAnvändare.UserCompanyId != 489 && viewAnvändare.Användartyper == Användaretyper.Administratör);
				bool notCustomerAndSales = !(viewAnvändare.UserCompanyId != 489 && viewAnvändare.Användartyper == Användaretyper.Säljare);

				var dbAnvändare = db.User.Single(i => i.UserID == viewAnvändare.UserID);
				var company = db.CompanyInfo.Single(i => i.CompanyId == viewAnvändare.UserCompanyId);

				dbAnvändare.Roles.Remove(roleHelper.KundRole);
				dbAnvändare.Roles.Remove(roleHelper.AdministratörRole);
                dbAnvändare.Roles.Remove(roleHelper.SäljareRole);
				dbAnvändare.Roles.Remove(roleHelper.AnalysRole);
				dbAnvändare.Roles.Remove(roleHelper.WebbstyrningRole);
				dbAnvändare.Roles.Remove(roleHelper.WebbstyrningWriteRole);
                dbAnvändare.Roles.Remove(roleHelper.WebbstyrningMultistyrningRole);
				dbAnvändare.Roles.Remove(roleHelper.KoncernrättigheterRole);
				dbAnvändare.Roles.Remove(roleHelper.LeverantörsinformationRole);

                // Denna if körs för att kolla så att
                // användarens bolag inte har bytts från ett kundbolag till Telia Admin Säljare som bolag, utan att välja roll
                // detta görs för att inte en admin/säljare ska ha kundroller
                // och även tvärtom koll
                if (notAdminAndCustomer && notCustomerAndAdmin && notCustomerAndSales)
                {
                    switch (viewAnvändare.Användartyper)
                    {
                        case Användaretyper.Kund:
                            dbAnvändare.Roles.Add(roleHelper.KundRole);

                            if (viewAnvändare.AnalysActive)
                                dbAnvändare.Roles.Add(roleHelper.AnalysRole);
                            if (viewAnvändare.WebbstyrningLäsActive)
                                dbAnvändare.Roles.Add(roleHelper.WebbstyrningRole);
                            if (viewAnvändare.WebbstyrningSkrivActive)
                                dbAnvändare.Roles.Add(roleHelper.WebbstyrningWriteRole);
                            if (viewAnvändare.WebbstyrningMultistyrning)
                                dbAnvändare.Roles.Add(roleHelper.WebbstyrningMultistyrningRole);
                            if (viewAnvändare.KoncernRattigheterActive)
                                dbAnvändare.Roles.Add(roleHelper.KoncernrättigheterRole);
                            if (viewAnvändare.LeverantörsinformationActive)
                                dbAnvändare.Roles.Add(roleHelper.LeverantörsinformationRole);
                            break;
                        case Användaretyper.Administratör:
                            dbAnvändare.Roles.Add(roleHelper.AdministratörRole);
                            break;
                        case Användaretyper.Säljare:
                            dbAnvändare.Roles.Add(roleHelper.SäljareRole);
                            break;
                    }

                }

				dbAnvändare.ChangedDate = DateTime.Now;
				dbAnvändare.ChangedBy = securityService.getUserId(username);
				dbAnvändare.LoginName = viewAnvändare.AnvändarID;
				dbAnvändare.Name = viewAnvändare.Namn;
				dbAnvändare.Company = company;
				dbAnvändare.TelNo = viewAnvändare.Telefon;
				dbAnvändare.Email = viewAnvändare.Email;
				dbAnvändare.Note = viewAnvändare.Notering;

				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewAnvändare != null && viewAnvändare.AnvändarID != null)
				{
					log.Error("Failed to edit användare with username " + viewAnvändare.AnvändarID, e);
				}
				else
				{
					log.Error("Failed to edit användare. ViewAnvändare or username is null", e);
				}

				throw e;
			}

		}

        public DeleteAnvändareResult Användare_Delete(int userIdToDelete, string username)
		{
			string usernameToDelete = null;

			try
			{
				User userToDelete = db.User.Single(m => m.UserID == userIdToDelete);
				usernameToDelete = userToDelete.LoginName;
				var company = userToDelete.Company;

				if (userToDelete.Equals(company.AnalysContact))
				{
				    return DeleteAnvändareResult.AnalysContact;
				}

                if (userToDelete.Equals(company.LevInfoContact))
				{
				    return DeleteAnvändareResult.LevInfoContact;
				}

                if (userToDelete.Equals(company.WebstyrningContact))
				{
				    return DeleteAnvändareResult.WebstyrningContact;
				}

			    var userAdvanceNumbersChangedByUser =
			        db.UserAdvanceNumbers.Where(
                        userAdvanceNumber => userIdToDelete == userAdvanceNumber.ChangedBy).ToList();
			    foreach (var userAdvanceNumber in userAdvanceNumbersChangedByUser)
			    {
			        userAdvanceNumber.ChangedByUser = null;
			    }

			    var usersChangedByUser = db.User.Where(user => userIdToDelete == user.ChangedBy).ToList();
			    foreach (var user in usersChangedByUser)
			    {
			        user.ChangedByUser = null;
			    }
                db.SaveChanges();

				db.User.Remove(userToDelete);
				db.SaveChanges();
				log.Info("User " + usernameToDelete + " deleted by " + username);

                return DeleteAnvändareResult.Success;
			}
			catch (Exception e)
			{
				if (usernameToDelete != null)
				{
					log.Error("Failed to delete användare with username " + usernameToDelete, e);
				}
				else
				{
					log.Error("Failed to delete användare with userId " + userIdToDelete, e);
				}

				throw e;
			}
		}

        public List<User> GetLastThirtyDaysUsers()
        {
            DateTime date = DateTime.Now.AddMonths(-1);
            return db.User.Where(m => m.LogonDate > date).ToList();

        }

		public bool CheckIfUserExists(string loginNamn)
		{
			return db.User.Any(m => m.LoginName == loginNamn);
		}
		#endregion

		#region OMT Användare
		public User Användare_Get(string username)
		{
			return securityService.getUser(username);
		}

		public bool Användare_OMT_Save(string adminUserName, int? userId, string eno, 
			string organisationsnummer, string namn, string email, string telefon,
			bool analys, bool webbstyrningLäs, bool webbstyrningSkriv, bool multistyrning, bool levinfo)
		{
			try
			{
				CompanyInfo bolag = db.CompanyInfo.SingleOrDefault(dbCompanyInfo => dbCompanyInfo.OrgNr == organisationsnummer);

				if (bolag == null)
				{
					return false;
				}

				User user;
				if (userId == null)
				{
					user = new User();
					db.User.Add(user);
					user.CreationDate = DateTime.Now;
				}
				else
				{
					user = GetAnvändare(userId.Value);
				}

				user.LoginName = eno;
				user.Eno = eno;
				user.Name = namn;
				user.Email = email;
				user.TelNo = telefon;
				user.CompanyId = bolag.CompanyId;

				user.Roles.Clear();
				if (analys) user.Roles.Add(roleHelper.AnalysRole);
				if (webbstyrningLäs) user.Roles.Add(roleHelper.WebbstyrningRole);
				if (webbstyrningSkriv) user.Roles.Add(roleHelper.WebbstyrningWriteRole);
				if (multistyrning) user.Roles.Add(roleHelper.WebbstyrningMultistyrningRole);
				if (levinfo) user.Roles.Add(roleHelper.LeverantörsinformationRole);

				if (adminUserName != null)
				{
					user.ChangedByUser = securityService.getUser(adminUserName);
				}
				user.ChangedDate = DateTime.Now;

				db.SaveChanges();
				return true;
			}
			catch (Exception e)
			{
				log.Error("Failed saving OMT user with eno=" + eno + ";orgNr=" + organisationsnummer + ";namn=" + namn);
				throw e;
			}
		}
		#endregion

		#region Bolag
		public ImmutableList<CompanyInfo> Bolag_GetList()
		{
			return db.CompanyInfo
				.Include("GroupInfo")
				.Include("Roles")
				.ToImmutableList();
		}

		public ImmutableList<CompanyInfo> Bolag_GetList(string searchTerm)
		{
			return db.CompanyInfo
				.Include("GroupInfo")
				.Include("Roles")
				.Where(w =>
					w.OrgNr.Contains(searchTerm) ||
					w.CompanyName.Contains(searchTerm) ||
					w.GroupInfo.GroupName.Contains(searchTerm)
				)
				.ToImmutableList();
		}

		public CompanyInfo Bolag_Get(int companyId)
		{
			return db.CompanyInfo
				.Include("GroupInfo")
				.Include("AdvanceExtensions")
				.Include("AdvanceExtensions.UserAdvanceNumbers")
				.Single(bolag => bolag.CompanyId == companyId);
		}

		public ImmutableList<User> Bolag_GetUsers(int? companyId)
		{
			if (companyId == null)
				return new List<User>().ToImmutableList();

			return db.User.Where(dbUser => dbUser.CompanyId == companyId).ToImmutableList();
		}

		public void Bolag_Create(CompanyInfo viewBolag, string username)
		{
			try
			{
				if (username != null)
					viewBolag.ChangedBy = securityService.getUserId(username);

				viewBolag.ChangedDate = DateTime.Now;
				viewBolag.CreationDate = DateTime.Now;

				db.CompanyInfo.Add(viewBolag);

				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewBolag != null && viewBolag.OrgNr != null)
				{
					log.Error("Failed to create bolag with orgNr " + viewBolag.OrgNr, e);
				}
				else
				{
					log.Error("Failed to create bolag. ViewBolag or OrgNr is null.", e);
				}

				throw e;
			}
		}

		public void Bolag_Edit(CompanyInfo viewBolag, string username)
		{
			try
			{
				CompanyInfo dbBolag = db.CompanyInfo.Single(i => i.CompanyId == viewBolag.CompanyId);
				användareHelper.MapBolag(dbBolag, viewBolag, username);
				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewBolag != null && viewBolag.OrgNr != null)
				{
					log.Error("Failed to edit bolag with orgNr " + viewBolag.OrgNr, e);
				}
				else
				{
					log.Error("Failed to edit bolag. ViewBolag or OrgNr is null.", e);
				}

				throw e;
			}
		}

		public bool Bolag_Delete(int companyId, string username)
		{
			string orgNrToDelete = null;

			try
			{
				CompanyInfo dbBolag = db.CompanyInfo.Single(i => i.CompanyId == companyId);
				if (dbBolag.Users.Any())
				{
					return false;
				}

				orgNrToDelete = dbBolag.OrgNr;
				db.CompanyInfo.Remove(dbBolag);
				db.SaveChanges();
				log.Info("CompanyInfo with orgNr " + orgNrToDelete + " deleted by user " + username);

				return true;
			}
			catch (Exception e)
			{
				if (orgNrToDelete != null)
				{
					log.Error("Failed to delete bolag with orgNr " + orgNrToDelete, e);
				}
				else
				{
					log.Error("Failed to delete bolag with companyId " + companyId, e);
				}

				throw e;
			}
		}
		#endregion

		#region Koncern
		public GroupInfo Koncern_Get(int groupId)
		{
			return db.GroupInfo.Single(i => i.GroupId == groupId);
		}

		public ImmutableList<GroupInfo> Koncern_GetList()
		{
			return db.GroupInfo.OrderBy(koncern => koncern.GroupName).ToImmutableList();
		}

		public ImmutableList<GroupInfo> Koncern_GetList(string searchTerm)
		{
			return db.GroupInfo
				.Where(w =>
					w.GroupCode.Contains(searchTerm) ||
					w.GroupName.Contains(searchTerm)
				)
				.ToImmutableList();
		}

		public void Koncern_Edit(GroupInfo viewKoncern, string username)
		{
			try
			{
				var dbKoncern = db.GroupInfo.Single(i => i.GroupId == viewKoncern.GroupId);

				dbKoncern.GroupName = viewKoncern.GroupName;
                dbKoncern.GroupCode = viewKoncern.GroupCode;
				dbKoncern.ChangedBy = securityService.getUserId(username);

				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewKoncern != null && viewKoncern.GroupName != null)
				{
					log.Error("Failed to edit koncern with namn " + viewKoncern.GroupName, e);
				}
				else
				{
					log.Error("Failed to edit koncern. viewKoncern or koncernnamn is null.", e);
				}

				throw e;
			}
		}

		public void Koncern_Create(GroupInfo viewKoncern, string username)
		{
			try
			{
				viewKoncern.CreationDate = DateTime.Now;
				viewKoncern.ChangedBy = securityService.getUserId(username);
				db.GroupInfo.Add(viewKoncern);

				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewKoncern != null && viewKoncern.GroupName != null)
				{
					log.Error("Failed to create koncern with namn " + viewKoncern.GroupName, e);
				}
				else
				{
					log.Error("Failed to create koncern. ViewKoncern or koncernnamn is null.", e);
				}

				throw e;
			}
		}

		public void Koncern_Delete(int groupId, string username)
		{
			string koncernnamnToDelete = null;

			try
			{
				GroupInfo dbKoncern = db.GroupInfo.Single(m => m.GroupId == groupId);
				koncernnamnToDelete = dbKoncern.GroupName;

				db.GroupInfo.Attach(dbKoncern);
				db.GroupInfo.Remove(dbKoncern);

				db.SaveChanges();
				log.Info("Koncern " + koncernnamnToDelete + " was deleted by user " + username);
			}
			catch (Exception e)
			{
				if (koncernnamnToDelete != null)
				{
					log.Error("Failed to delete koncern with namn " + koncernnamnToDelete, e);
				}
				else
				{
					log.Error("Failed to delete koncern with groupId " + groupId, e);
				}

				throw e;
			}
		}

		public bool CheckIfGroupExists(string groupName)
		{
			return db.GroupInfo.Any(i => i.GroupName.ToLower() == groupName.ToLower());

		}
		#endregion

		#region Nummer
		public BolagNummer Bolag_Nummer_Get(int advanceExtId)
		{
			var result = new BolagNummer();

			result.nummer = db.AdvanceExtension
				.Include("CompanyInfo")
				.Include("ChangedByUser")
				.Single(i => i.AdvanceExtID == advanceExtId);

			result.användare =
				(from user in db.User.Where(dbUser => dbUser.CompanyId == result.nummer.CompanyId)
				 from numberUser in db.UserAdvanceNumbers.Where(dbNumberUser =>
					user.UserID == dbNumberUser.UserID
					&& dbNumberUser.AdvanceExtId == advanceExtId).DefaultIfEmpty()
				 select new NumberUser
				 {
					 UserId = user.UserID,
					 AdvanceExtId = advanceExtId,
					 Name = user.Name,
					 ViewLevel = numberUser != null ? numberUser.AnalysisView : (short)0,
					 RawData = numberUser != null ? numberUser.AnalysisRawData : false,
					 Active = (numberUser != null)
				 })
					.OrderByDescending(i => i.Active).ThenBy(i => i.Name).ToList();

			return result;
		}

		public void Bolag_Nummer_Edit(BolagNummer viewBolagNummer, string username)
		{
			try
			{
				int changedByUserId = securityService.getUserId(username);

				användareHelper.MapAdvanceExtension(viewBolagNummer, changedByUserId);
				användareHelper.MapUserAdvanceExtension(viewBolagNummer, changedByUserId);

				db.SaveChanges();
			}
			catch (Exception e)
			{
				if (viewBolagNummer != null && viewBolagNummer.nummer != null)
				{
					log.Error("Failed to edit nummer with advanceExtId" + viewBolagNummer.nummer.AdvanceExtID, e);
				}
				else
				{
					log.Error("Failed to edit nummer. AdvanceExtId is null.", e);
				}

				throw e;
			}
		}

		public int Bolag_Nummer_Add(string nummer, int companyId, string username)
		{
            AdvanceExtension dbNummer = null;
            try
            {
                dbNummer = db.AdvanceExtension.SingleOrDefault(i => i.Number.Equals(nummer));

                if (dbNummer == null)
                {
                    dbNummer = new AdvanceExtension
                    {
                        CompanyId = companyId,
                        Number = nummer,
                        Active = "1",
                        CreationDate = DateTime.Now
                    };

                    dbNummer.ChangedDate = DateTime.Now;
                    dbNummer.ChangedBy = securityService.getUserId(username);

                    db.AdvanceExtension.Add(dbNummer);
                    db.SaveChanges();
                }
                else
                {
                    dbNummer.CompanyId = companyId;
                    dbNummer.CreationDate = DateTime.Now;
                    dbNummer.ChangedDate = DateTime.Now;
                    dbNummer.ChangedBy = securityService.getUserId(username);

                    db.SaveChanges();
                }


                return dbNummer.AdvanceExtID;
            }
            catch (Exception e)
            {
                if (dbNummer != null)
                {
                    log.Error("Failed to add nummer with advanceExtId" + dbNummer.AdvanceExtID, e);
                }
                else if (nummer != null)
                {
                    log.Error("Failed to add nummer " + nummer, e);
                }
                else
                {
                    log.Error("Failed to add nummer. Nummer is null.", e);
                }

                throw e;
            }
		}

        public int Bolag_Nummer_Change(string nummer, int companyId, string username)
        {
            AdvanceExtension dbNummer = null;
            try
            {
                dbNummer = db.AdvanceExtension.SingleOrDefault(i => i.Number.Equals(nummer));
                dbNummer.AnalysisRawdata = false;
                dbNummer.AnalysisView = 0;


                var dbUserAdv = db.UserAdvanceNumbers.Where(i => i.AdvanceExtId == dbNummer.AdvanceExtID);

                foreach (var user in dbUserAdv)
                {
                    db.UserAdvanceNumbers.Remove(user);
                }

                db.SaveChanges();

                return dbNummer.AdvanceExtID;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public bool Bolag_Nummer_ExistsOnAnyCompany(string nummer)
        {
            return db.AdvanceExtension.Any(dbNummer => dbNummer.Number == nummer && dbNummer.CompanyId != null);
        }

        public string Bolag_Nummer_ExistingCompany(string nummer)
        {
            return db.AdvanceExtension.Single(dbNummer => dbNummer.Number == nummer).CompanyInfo.CompanyName;
        }

		public void Bolag_Nummer_Delete(int advanceExtId, string username)
		{
			try
			{
				// Around 17 of 18 AdvanceExtension in the db is not mapped to a company.
				// These are probably from the statistics file.
				// So in order to not delete any statistics data we do not delete the AdvanceExtension,
				// only the connection to the company and users.
				var advanceExtensionToRemove = db.AdvanceExtension.Single(i => i.AdvanceExtID == advanceExtId);
				advanceExtensionToRemove.CompanyId = null;
				db.UserAdvanceNumbers.RemoveRange(advanceExtensionToRemove.UserAdvanceNumbers);
				advanceExtensionToRemove.ChangedDate = DateTime.Now;
				advanceExtensionToRemove.ChangedBy = securityService.getUserId(username);

				db.SaveChanges();
			}
			catch (Exception e)
			{
				log.Error("Failed to remove nummer with advanceExtId" + advanceExtId, e);
				throw e;
			}
		}
		#endregion
	}
}