using System.Collections.Generic;
using System.Collections.Immutable;
using System.Web.Mvc;
using AutoMapper;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel.Admin.Hantera;

namespace Telia.NTW.Web.Helpers
{
	public class AdminHelper
	{
		private readonly AnvändareService användareService;
		private readonly RoleHelper roleHelper;

		public AdminHelper(AnvändareService användareService, RoleHelper roleHelper)
		{
			this.användareService = användareService;
			this.roleHelper = roleHelper;
		}

		public void BolagInitDropdowns(BolagEditViewModel bolagEditViewModel)
		{
			// Create dropdowns
			ImmutableList<GroupInfo> koncernList = användareService.Koncern_GetList();
			bolagEditViewModel.KoncernSelectList = new SelectList(koncernList, "GroupId", "GroupName");

			ImmutableList<User> contactList = användareService.Bolag_GetUsers(bolagEditViewModel.CompanyId);
			bolagEditViewModel.ContactSelectList = new SelectList(contactList, "UserID", "Name");
		}

		public void BolagAddRolesToViewModel(BolagEditViewModel bolagEditViewModel, CompanyInfo bolag)
		{
			var roles = bolag.Roles;
			bolagEditViewModel.AnalysActive = roles.Contains(roleHelper.AnalysRole);
			bolagEditViewModel.WebstyrningActive = roles.Contains(roleHelper.WebbstyrningWriteRole);
			bolagEditViewModel.WebstyrningMultistyrningActive = roles.Contains(roleHelper.WebbstyrningMultistyrningRole);
			bolagEditViewModel.LevinfoActive = roles.Contains(roleHelper.LeverantörsinformationRole);
		}

		public HashSet<Role> BolagGetRolesFromViewModel(BolagEditViewModel bolagEditViewModel)
		{
			HashSet<Role> roles = new HashSet<Role>();
			GeneralHelper.conditionalAddRole(roles, roleHelper.AnalysRole, bolagEditViewModel.AnalysActive);
			GeneralHelper.conditionalAddRole(roles, roleHelper.WebbstyrningWriteRole, bolagEditViewModel.WebstyrningActive);
			GeneralHelper.conditionalAddRole(roles, roleHelper.WebbstyrningMultistyrningRole, bolagEditViewModel.WebstyrningMultistyrningActive);
			GeneralHelper.conditionalAddRole(roles, roleHelper.LeverantörsinformationRole, bolagEditViewModel.LevinfoActive);

			return roles;
		}

		public HanteraViewModel GetHanteraViewModel(string search, List<string> errorMessages = null)
		{
			HanteraViewModel viewModel = new HanteraViewModel();
			viewModel.addErrorMessages(errorMessages);
			viewModel.HideResult = false;
			viewModel.Search = search;

			var användareList = användareService.GetAnvändareList(search);
			viewModel.Användare = Mapper.Map<IEnumerable<User>, List<AnvändareRow>>(användareList);

			ImmutableList<CompanyInfo> bolagList = användareService.Bolag_GetList(search);
			viewModel.Bolag = Mapper.Map<ImmutableList<CompanyInfo>, List<BolagListRow>>(bolagList);

			ImmutableList<GroupInfo> koncernList = användareService.Koncern_GetList(search);
			viewModel.Koncerner = Mapper.Map<ImmutableList<GroupInfo>, List<Koncern>>(koncernList);

			return viewModel;
		}
	}
}