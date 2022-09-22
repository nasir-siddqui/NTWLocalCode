using System;
using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Entities.Admin;
using Telia.NTW.Core.Services;

namespace Telia.NTW.Core.Helpers
{
	public class AnvändareHelper
	{
		private readonly NtwEfModel db;
		private readonly RoleHelper roleHelper;
		private readonly SecurityService securityService;

		public AnvändareHelper(NtwEfModel db, RoleHelper roleHelper, SecurityService securityService)
		{
			this.db = db;
			this.roleHelper = roleHelper;
			this.securityService = securityService;
		}

		public void MapBolag(CompanyInfo dbBolag, CompanyInfo bolag, string username)
		{
			dbBolag.CompanyName = bolag.CompanyName;
			dbBolag.GroupId = bolag.GroupId;
			dbBolag.Country = bolag.Country;
			dbBolag.PhoneKey = bolag.PhoneKey;

			dbBolag.UserIdA = bolag.UserIdA;
			dbBolag.UserIdD = bolag.UserIdD;
			dbBolag.UserIdCpa = bolag.UserIdCpa;

			ICollection<Role> roles = dbBolag.Roles;
			roles.Remove(roleHelper.AnalysRole);
			roles.Remove(roleHelper.WebbstyrningRole);
			roles.Remove(roleHelper.WebbstyrningMultistyrningRole);
			roles.Remove(roleHelper.LeverantörsinformationRole);

			foreach (Role role in bolag.Roles)
			{
				roles.Add(role);
			}

			dbBolag.ChangedDate = DateTime.Now;
			dbBolag.ChangedBy = securityService.getUserId(username);
		}

		public void MapAdvanceExtension(BolagNummer bolagNummer, int changedByUserId)
		{
			AdvanceExtension viewAdvanceExtension = bolagNummer.nummer;
			AdvanceExtension dbAdvanceExtension =
				db.AdvanceExtension.Single(i => i.AdvanceExtID == viewAdvanceExtension.AdvanceExtID);

			dbAdvanceExtension.Subscribed = viewAdvanceExtension.Subscribed;
			dbAdvanceExtension.AnalysisView = viewAdvanceExtension.AnalysisView;
			dbAdvanceExtension.AnalysisRawdata = viewAdvanceExtension.AnalysisRawdata;
			dbAdvanceExtension.ChangedDate = DateTime.Now;
			dbAdvanceExtension.ChangedBy = changedByUserId;
		}

		public void MapUserAdvanceExtension(BolagNummer bolagNummer, int changedByUserId)
		{
			int advanceExtId = bolagNummer.nummer.AdvanceExtID;

			// Remove any users changed to inactive
			var inactiveNumberUserIds = bolagNummer.användare.Where(i => !i.Active).Select(i => i.UserId);
			var inactiveNumberUsersDb =
				db.UserAdvanceNumbers.Where(
					i => i.AdvanceExtId == advanceExtId && inactiveNumberUserIds.Contains(i.UserID));
			foreach (UserAdvanceNumbers numberUser in inactiveNumberUsersDb)
			{
				db.UserAdvanceNumbers.Remove(numberUser);
			}

			// Create or updated number users
			var activeNumberUsers = bolagNummer.användare.Where(i => i.Active);
			foreach (NumberUser viewNumberUser in activeNumberUsers)
			{
				var dbNumberUser = db.UserAdvanceNumbers.SingleOrDefault(i => i.UserID == viewNumberUser.UserId && i.AdvanceExtId == advanceExtId);
				if (dbNumberUser == null)
				{
					dbNumberUser = new UserAdvanceNumbers
					{
						UserID = viewNumberUser.UserId,
						AdvanceExtId = viewNumberUser.AdvanceExtId,
						CreationDate = DateTime.Now
					};
					db.UserAdvanceNumbers.Add(dbNumberUser);
				}

				dbNumberUser.AnalysisView = viewNumberUser.ViewLevel;
				dbNumberUser.AnalysisRawData = viewNumberUser.RawData;
				dbNumberUser.ChangedDate = DateTime.Now;
				dbNumberUser.ChangedBy = changedByUserId;
			}
		}
	}
}
