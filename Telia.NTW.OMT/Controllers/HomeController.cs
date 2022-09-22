using System.Collections.Generic;
using System.Collections.Immutable;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using AutoMapper;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.OMT.ViewModels;

namespace Telia.NTW.OMT.Controllers
{
    public class HomeController : Controller
    {
        private readonly AnvändareService användareService;
	    private readonly RoleHelper roleHelper;

//	    private const string OmtUsername = "OMT";
//	    private const string OmtPassword = "WDHQGwaCANN8epYOwaPp";

		public HomeController(AnvändareService användareService, RoleHelper roleHelper)
	    {
		    this.användareService = användareService;
			this.roleHelper = roleHelper;
	    }

        [HttpGet]
//		[BasicAuthorize(Username = OmtUsername, Password = OmtPassword)]
		public ActionResult Index(string eno, string username, string orgNo, string name, string email, string phone)
        {
	        var user = användareService.Användare_Get(eno);
            OMTUserViewModel omtUser = user != null ? Mapper.Map<User, OMTUserViewModel>(user) : new OMTUserViewModel();

	        omtUser.AnvändarID = eno;
	        omtUser.Username = username ?? omtUser.Username;
	        omtUser.Organisationsnummer = orgNo ?? omtUser.Organisationsnummer;
	        omtUser.Namn = name ?? omtUser.Namn;
	        omtUser.Email = email ?? omtUser.Email;
	        omtUser.Telefon = phone ?? omtUser.Telefon;

	        if (user != null)
	        {
		        omtUser.UserAnalys = user.Roles.Contains(roleHelper.AnalysRole);
				omtUser.UserWebbstyrningLäs = user.Roles.Contains(roleHelper.WebbstyrningRole);
				omtUser.UserWebbstyrningSkriv = user.Roles.Contains(roleHelper.WebbstyrningWriteRole);
				omtUser.UserMultistyrning = user.Roles.Contains(roleHelper.WebbstyrningMultistyrningRole);
				omtUser.UserLeverantörsinformation = user.Roles.Contains(roleHelper.LeverantörsinformationRole);
	        }

	        return View(omtUser);
        }

	    [HttpPost]
//		[BasicAuthorize(Username = OmtUsername, Password = OmtPassword)]
        public ActionResult Index(OMTUserViewModel omtUserViewModel)
	    {
			var orgNrMatch = Regex.Match(omtUserViewModel.Organisationsnummer, @"^(\d{6})-?(\d{4})$");
			omtUserViewModel.Organisationsnummer = orgNrMatch.Groups[1] + "-" + orgNrMatch.Groups[2];

		    bool success = användareService.Användare_OMT_Save(
				null,
				omtUserViewModel.UserId,
				omtUserViewModel.AnvändarID,
				omtUserViewModel.Organisationsnummer,
				omtUserViewModel.Namn,
				omtUserViewModel.Email,
			    omtUserViewModel.Telefon,
				omtUserViewModel.UserAnalys,
				omtUserViewModel.UserWebbstyrningLäs,
				omtUserViewModel.UserWebbstyrningSkriv,
				omtUserViewModel.UserMultistyrning,
				omtUserViewModel.UserLeverantörsinformation);

		    if (success)
		    {
			    return RedirectToAction("User_Saved");
		    }
		    else
		    {
			    return RedirectToAction("CreateUserAndCompany", omtUserViewModel);
		    }
	    }

        [HttpGet]
        public ActionResult CreateUserAndCompany(OMTUserViewModel omtUserViewModel)
        {
	        var omtUserAndCompanyViewModel = Mapper.Map<OMTUserViewModel, OMTUserAndCompanyViewModel>(omtUserViewModel);

			ImmutableList<GroupInfo> koncernList = användareService.Koncern_GetList();
			omtUserAndCompanyViewModel.KoncernSelectList = new SelectList(koncernList, "GroupId", "GroupName");
			return View(omtUserAndCompanyViewModel);
        }

	    [HttpPost]
	    public ActionResult CreateUserAndCompany(OMTUserAndCompanyViewModel omtUserAndCompanyViewModel)
	    {
		    CompanyInfo bolag = Mapper.Map<OMTUserAndCompanyViewModel, CompanyInfo>(omtUserAndCompanyViewModel);

			bolag.Roles = new HashSet<Role>();
			if (omtUserAndCompanyViewModel.CompanyAnalys) bolag.Roles.Add(roleHelper.AnalysRole);
			if (omtUserAndCompanyViewModel.CompanyWebbstyrning) bolag.Roles.Add(roleHelper.WebbstyrningWriteRole);
			if (omtUserAndCompanyViewModel.CompanyMultistyrning) bolag.Roles.Add(roleHelper.WebbstyrningMultistyrningRole);
			if (omtUserAndCompanyViewModel.CompanyLeverantörsinformation) bolag.Roles.Add(roleHelper.LeverantörsinformationRole);

		    användareService.Bolag_Create(bolag, null);

			användareService.Användare_OMT_Save(
				null,
				omtUserAndCompanyViewModel.UserId,
				omtUserAndCompanyViewModel.AnvändarID,
				bolag.OrgNr,
				omtUserAndCompanyViewModel.Namn,
				omtUserAndCompanyViewModel.Email,
				omtUserAndCompanyViewModel.Telefon,
				omtUserAndCompanyViewModel.UserAnalys,
				omtUserAndCompanyViewModel.UserWebbstyrningLäs,
				omtUserAndCompanyViewModel.UserWebbstyrningSkriv,
				omtUserAndCompanyViewModel.UserMultistyrning,
				omtUserAndCompanyViewModel.UserLeverantörsinformation);

		    return RedirectToAction("User_Saved");
	    }

	    [HttpGet]
	    public ActionResult User_Saved()
	    {
		    return View();
	    }
    }
}