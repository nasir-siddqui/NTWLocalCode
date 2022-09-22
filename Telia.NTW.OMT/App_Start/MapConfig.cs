using System.Collections.Generic;
using System.Text.RegularExpressions;
using AutoMapper;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Helpers;
using Telia.NTW.OMT.ViewModels;

namespace Telia.NTW.OMT
{
	public class MapConfig
	{
		 
		public static void RegisterMap()
		{
			MapOMT();
		}

		public static void MapOMT()
		{
			Mapper.CreateMap<User, OMTUserViewModel>()
				.ConvertUsing(user => new OMTUserViewModel()
				{
					UserId = user.UserID,
					AnvändarID = user.LoginName,
					//Username = user.LoginName,
					Organisationsnummer = user.Company.OrgNr,
					Namn = user.Name,
					Email = user.Email,
					Telefon = user.TelNo
				});

			Mapper.CreateMap<OMTUserViewModel, OMTUserAndCompanyViewModel>();

			Mapper.CreateMap<OMTUserAndCompanyViewModel, CompanyInfo>()
				.ConvertUsing(userAndCompany => new CompanyInfo()
					{
						OrgNr = userAndCompany.Organisationsnummer,
						CompanyName = userAndCompany.Bolagsnamn,
						GroupId = userAndCompany.Koncern,
						Country = userAndCompany.Land,
						PhoneKey = userAndCompany.WebbstyrningNyckel
					}
				);
		}
	}
}