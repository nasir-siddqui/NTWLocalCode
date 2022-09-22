using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning;

namespace Telia.NTW.Web.Helpers
{
	public class MultistyrningHelper
	{
		private readonly StaffService staffService;
		private readonly CookieHelper cookieHelper;

		private const string VIPMultiConnectedId = "VIPMultiConnectedId";

		public MultistyrningHelper(StaffService staffService, CookieHelper cookieHelper)
		{
			this.staffService = staffService;
			this.cookieHelper = cookieHelper;
		}

		public MultistyrningViewModel GetMultistyrningViewModel()
		{
			MultistyrningViewModel multistyrningViewModel = new MultistyrningViewModel();

			List<StaffMultiSelectQueueRow> multistyrningskö = staffService.Multistyrning_Kö_GetList(cookieHelper.GetCustomerId());
			multistyrningViewModel.Multistyrningskö =
				Mapper.Map<List<StaffMultiSelectQueueRow>, List<MultistyrningsköRow>>(multistyrningskö);

			List<StaffMultiHistoryRow> multistyrningshistorik = staffService.Multistyrning_Historik_GetList(cookieHelper.GetCustomerId());
			multistyrningViewModel.Multistyrningshistorik =
				Mapper.Map<List<StaffMultiHistoryRow>, List<MultistyrningHistorikRow>>(multistyrningshistorik);

			List<StaffMultiAltRow> multistyrningsalternativ = staffService.Multistyrning_Alternativ_GetList(cookieHelper.GetCustomerId());
			multistyrningViewModel.Multistyrningsalternativ =
				Mapper.Map<List<StaffMultiAltRow>, List<MultistyrningsalternativRow>>(multistyrningsalternativ);

			return multistyrningViewModel;
		}

		public SelectList FillMultistyrningsalternativSelectList(decimal customerId)
		{
			List<StaffMultiAltRow> multistyrningsalternativ = staffService.Multistyrning_Alternativ_GetList(customerId);
			return new SelectList(multistyrningsalternativ, "VIPMultiConnectedId", "Name");
		}

		public SelectList FillMultistyrningsabonnemangSelectList(decimal customerId)
		{
			List<StaffSelectServiceRow> abonnemangsLista = staffService.Webstyrning_Abonnemang_GetList(customerId);
			return new SelectList(abonnemangsLista, "ServiceId", "Abonnemang");
		}

		public DateTime? GetBegärtDatum(MultistyrningsköEditViewModel multistyrningsköEditViewModel)
		{
			DateTime? begärtDatum = null;

			if (!multistyrningsköEditViewModel.SåSnartSomMöjligt)
			{
				begärtDatum = multistyrningsköEditViewModel.BegärtDatum;
			}

			return begärtDatum;
		}

		public void Multistyrning_Alternativ_FillLists(Multistyrning_Alternativ_FormViewModel viewModel)
		{
			// Get all abonnemang for customer
			viewModel.abonnemangList = new List<Multistyrning_Alternativ_Abonnemang>();
			var abonnemangList = staffService.Webstyrning_Abonnemang_GetList(cookieHelper.GetCustomerId());
			foreach (var abonnemang in abonnemangList)
			{
				var abonnemangForMultistyrningsalternativ = new Multistyrning_Alternativ_Abonnemang();

				abonnemangForMultistyrningsalternativ.ServiceId = abonnemang.ServiceId;
				abonnemangForMultistyrningsalternativ.Abonnemang = abonnemang.Abonnemang;

				var styrningsalternativList = staffService.Webstyrning_Alternativ_GetList(abonnemang.ServiceId);
				abonnemangForMultistyrningsalternativ.StyrningsalternativList = new SelectList(styrningsalternativList, "Id", "Alternativnamn").ToList();

				viewModel.abonnemangList.Add(abonnemangForMultistyrningsalternativ);
			}
		}

		public void Multistyrning_Alternativ_GetKoppladeAbonnemang(Multistyrning_Alternativ_FormViewModel viewModel)
		{
			var koppladeAbonnemang = staffService.Multistyrning_Alternativ_GetAlternatives(viewModel.VIPMultiConnectedId);
			foreach (var kopplatAbonnemang in koppladeAbonnemang)
			{
				var abonnemang =
					viewModel.abonnemangList.SingleOrDefault(i => i.ServiceId == kopplatAbonnemang.ServiceId);

				if (abonnemang == null)
				{
					continue;
				}

				abonnemang.VIPMultiConnectedLinkId = kopplatAbonnemang.VIPMultiConnectedLinkId;
				abonnemang.Kopplat = true;
				abonnemang.ConnectLinkId = kopplatAbonnemang.ConnectLinkId;

				var selectedItem = abonnemang.StyrningsalternativList.SingleOrDefault(i => i.Value == abonnemang.ConnectLinkId.ToString());
				if (selectedItem != null)
				{
					selectedItem.Selected = true;
				}
			}

			viewModel.abonnemangList = viewModel.abonnemangList.OrderByDescending(abonnemang => abonnemang.Kopplat).ThenBy(abonnemang => abonnemang.Abonnemang).ToList();
		}

		public void Multistyrning_Alternativ_Save(Multistyrning_Alternativ_FormViewModel viewModel)
		{
			// Save multistyrning name
			var customerId = cookieHelper.GetCustomerId();
			staffService.Multistyrning_Alternativ_Edit(viewModel.VIPMultiConnectedId, viewModel.Namn, customerId, CookieHelper.GetOriginalUsername());

			// Get previous kopplade abonnemang
			var previousKoppladeAbonnemang = staffService.Multistyrning_Alternativ_GetAlternatives(viewModel.VIPMultiConnectedId);

			// Get new kopplade abonnemang
			var newKoppladeAbonnemang = viewModel.abonnemangList.Where(i => i.Kopplat);

			// Remove any removed kopplade abonnemang
			var abonnemangToRemoveList =
				previousKoppladeAbonnemang.Where(i => newKoppladeAbonnemang.All(j => j.ServiceId != i.ServiceId));

			foreach (var abonnemangToRemove in abonnemangToRemoveList)
			{
				staffService.Multistyrning_Alternativ_DeleteAlternative(abonnemangToRemove.VIPMultiConnectedLinkId, CookieHelper.GetOriginalUsername());
			}

			// Save all new kopplade abonnemang
			foreach (var kopplatAbonnemang in newKoppladeAbonnemang)
			{
				staffService.Multistyrning_Alternativ_SaveStyrningsalternativ(kopplatAbonnemang.VIPMultiConnectedLinkId, viewModel.VIPMultiConnectedId, kopplatAbonnemang.ServiceId, kopplatAbonnemang.ConnectLinkId, CookieHelper.GetOriginalUsername());
			}
		}

		public bool CheckIfMultistyrningContainsRows(decimal multistyrningsId)
		{
			if (staffService.Multistyrning_Alternativ_GetAlternatives(multistyrningsId).Count > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
}