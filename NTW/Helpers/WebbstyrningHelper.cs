using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Helpers;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning;

namespace Telia.NTW.Web.Helpers
{
    public class WebbstyrningHelper
    {
        private const string ServiceIdList = "ServiceIdList";

        private readonly StaffService staffService;
	    private readonly CookieHelper cookieHelper;

        public WebbstyrningHelper(StaffService staffService, CookieHelper cookieHelper)
        {
            this.staffService = staffService;
	        this.cookieHelper = cookieHelper;
        }

		public List<StaffSelectServiceRow> FillWebbstyrningViewModel(WebbstyrningViewModel viewModel)
	    {
			List<StaffSelectServiceRow> abonnemangsLista = staffService.Webstyrning_Abonnemang_GetList(cookieHelper.GetCustomerId());
			viewModel.Abonnemang =
				Mapper.Map<List<StaffSelectServiceRow>, List<AbonnemangslistaRow>>(abonnemangsLista);

			return abonnemangsLista;
	    }

		public void FillAbonnemangViewModel(AbonnemangViewModel abonnemangViewModel, decimal serviceId, string abonnemang)
		{
			decimal customerId = cookieHelper.GetCustomerId();

			abonnemangViewModel.Abonnemang = abonnemang;
			abonnemangViewModel.ServiceId = serviceId;

			List<StaffStyrningsköRow> styrningskö = staffService.Webstyrning_Kö_GetList(serviceId);
			abonnemangViewModel.Styrningskö = Mapper.Map<List<StaffStyrningsköRow>, List<StyrningsköRow>>(styrningskö);

			List<StaffHistorikRow> historik = staffService.Webstyrning_Historik_GetList(serviceId);
			abonnemangViewModel.Historik = Mapper.Map<List<StaffHistorikRow>, List<HistorikRow>>(historik);

			List<StaffSelectCNoRow> svarsställen = staffService.Webstyrning_Svarsställen_GetList(customerId, abonnemang);
			abonnemangViewModel.Svarsställen = Mapper.Map<List<StaffSelectCNoRow>, List<SvarsställeRow>>(svarsställen);

			List<StaffListAlternativesRow> styrningsalternativ = staffService.Webstyrning_Alternativ_GetList(serviceId);
			abonnemangViewModel.Styrningsalternativ = Mapper.Map<List<StaffListAlternativesRow>, List<StyrningsalternativRow>>(styrningsalternativ);

			if (HttpContext.Current.User.IsInRole(RoleHelper.Administratör))
			{
				List<StaffStyrningsköLog> webstyrningLog = staffService.Webstyrning_Kö_GetLog(serviceId);
				abonnemangViewModel.Logg =
					Mapper.Map<List<StaffStyrningsköLog>, List<WebbstyrningLogg>>(webstyrningLog);
			}
	    }

		public int getNextLöpnummer(decimal serviceId)
		{
			var styrningsalternativList = staffService.Webstyrning_Alternativ_GetList(serviceId);

			if (styrningsalternativList != null && styrningsalternativList.Count > 0)
			{
				return styrningsalternativList.Last().Sekvensnummer + 1;
			}
			else
			{
				return 1;
			}
		}

		public void SetServiceIdList(List<StaffSelectServiceRow> abonnemangsLista)
		{
			List<decimal> serviceIdList = abonnemangsLista.Select(m => m.ServiceId).ToList();
			HttpContext.Current.Session[ServiceIdList] = serviceIdList;
		}

		public bool CheckIfServiceIdExists(decimal serviceId)
		{
			List<decimal> serviceIds = HttpContext.Current.Session[ServiceIdList] as List<decimal>;

			if (serviceIds == null)
			{
				return false;
			}

			if (serviceIds.Contains(serviceId))
				return true;
			else
				return false;
		}
    }
}