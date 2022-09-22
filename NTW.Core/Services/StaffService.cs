using log4net;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Enums;
using Telia.NTW.Core.Staff;

namespace Telia.NTW.Core.Services
{
    public class StaffService
    {
        private readonly StaffOdbcConnection _staffOdbcConnection;

		private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public StaffService(StaffOdbcConnection _staffOdbcConnection)
		{
            this._staffOdbcConnection = _staffOdbcConnection;
        }

		#region Transaction
	    public void BeginTransaction()
	    {
		    _staffOdbcConnection.BeginTransaction();
	    }

	    public void Commit()
	    {
		    _staffOdbcConnection.Commit();
	    }

	    public void Rollback()
	    {
		    _staffOdbcConnection.Rollback();
	    }
		#endregion

        public decimal? GetCustomerId(string organisationsnummer)
        {
            return _staffOdbcConnection.CallStaffGetScalar<decimal?>("VIP_Select_CustomerId_v1", organisationsnummer);
        }

		#region Webstyrning Abonnnemang
        public List<StaffSelectServiceRow> Webstyrning_Abonnemang_GetList(decimal customerId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffSelectServiceRow>("VIP_Select_Service_v2", customerId, StaffOdbcConnection.SORT_ORDER_1_ASC);
        }
		#endregion

		#region Webstyrning Kö
        public List<StaffStyrningsköRow> Webstyrning_Kö_GetList(decimal serviceId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffStyrningsköRow>("VIP_List_Schema_v1", serviceId, StaffOdbcConnection.SORT_ORDER_4_ASC, StaffListSchemaRow.OPTION_KÖ);
        }

	    public void Webbstyrning_Kö_Save(decimal serviceid, decimal? styrningsId, decimal alternativId,
		    DateTime? preferredconnect, string username, Inkopplingstyp inkopplingstyp)
	    {
			preferredconnect = preferredconnect ?? DateTime.Now;

		    if (inkopplingstyp != Inkopplingstyp.Manuell)
		    {
			    Webbstyrning_Kö_SaveNormal(serviceid, styrningsId, alternativId,
				    preferredconnect, username, StaffHelper.InkopplingstypToImmediateYn(inkopplingstyp));
		    }
		    else
		    {
			    Webbstyrning_Kö_SaveManual(serviceid, styrningsId, alternativId, preferredconnect, username);
		    }
	    }

		private void Webbstyrning_Kö_SaveNormal(decimal serviceId, decimal? connectLinkId, decimal altConnectLinkId, DateTime? preferredConnect, string username, string immediateYN)
		{
			_staffOdbcConnection.CallStaffGetScalar<decimal>("VIP_Save_QueItem_v1", serviceId, connectLinkId, altConnectLinkId, preferredConnect, StaffType.Alternativ, username, immediateYN);
		}

		private void Webbstyrning_Kö_SaveManual(decimal serviceId, decimal? connectLinkId, decimal AltConnectLinkId, DateTime? preferredConnect, string username)
		{
			string type = (connectLinkId == null) ? StaffSaveManualConnectType.Ny : StaffSaveManualConnectType.Uppdatering;
			_staffOdbcConnection.CallStaffGetNull("VIP_Save_ManualConnect_v1", serviceId, AltConnectLinkId, connectLinkId, preferredConnect, username, type);
		}

        public void Webstyrning_Kö_Delete(decimal serviceId, decimal connectLinkId, decimal AltConnectLinkId, string username)
        {
			_staffOdbcConnection.CallStaffGetList<decimal>("VIP_Save_QueItem_v1", serviceId, connectLinkId, AltConnectLinkId, null, StaffType.Alternativ, username, StaffImmediateYN.No);
        }

        public List<StaffStyrningsköLog> Webstyrning_Kö_GetLog(decimal serviceId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffStyrningsköLog>("VIP_List_Schema_v1", serviceId, StaffOdbcConnection.SORT_ORDER_5_DESC, StaffListSchemaRow.OPTION_LOGG);
        }
        
        #endregion

		#region Webstyrning Alternativ
		public List<StaffListAlternativesRow> Webstyrning_Alternativ_GetList(decimal serviceId)
		{
			return _staffOdbcConnection.CallStaffGetList<StaffListAlternativesRow>("VIP_List_Alternatives_v1", serviceId, StaffOdbcConnection.SORT_ORDER_1_ASC);
		}

	    public ImmutableList<StaffMultiSelectBuildRow> Webbstyrning_Alternativ_GetAll(decimal customerId)
	    {
			return _staffOdbcConnection.CallStaffGetList<StaffMultiSelectBuildRow>("VIP_Multi_Select_Build_v1", customerId).ToImmutableList();
	    }

		public StaffSelectAlternatives Webbstyrning_Alternativ_Get(decimal connectLinkId)
		{
			return _staffOdbcConnection.CallStaffGetObject<StaffSelectAlternatives>("VIP_Select_Alternatives_v1", connectLinkId);
		}

		public ImmutableList<StaffRedirectRow> Webstyrning_Alternativ_GetTree(decimal connectLinkId, bool original)
	    {
			var version = original ? StaffSelectCopy.Original : StaffSelectCopy.CreateCopy;
			bool createCopy = !original;
			return _staffOdbcConnection.CallStaffGetList<StaffRedirectRow>(
				"VIP_Select_ReDirect_v1",
				connectLinkId,
				version,
				StaffHelper.BoolToYn(createCopy)
			).ToImmutableList();
	    }

		public decimal Webbstyrning_Alternativ_SaveDetails(decimal? connectLinkId, decimal serviceId, string description,
			string linkNo, string linkNo2, int? seqNo, string username)
		{
			if (connectLinkId == null)
			{
				return _staffOdbcConnection.CallStaffGetScalarWithLog<decimal>(username, "VIP_Save_Alternatives_v1", connectLinkId, serviceId, description,
					linkNo, linkNo2, seqNo);
			}
			else
			{
				_staffOdbcConnection.CallStaffGetNullWithLog(username, "VIP_Save_Alternatives_v1", connectLinkId, serviceId, description,
					linkNo, linkNo2, seqNo);

				return connectLinkId.Value;
			}
		}

//	    public decimal Webbstyrning_Alterantiv_Create(decimal serviceId, string description,
//		    string linkNo, string linkNo2, int seqNo)
//	    {
//			return staffOdbcReader.CallStaffGetScalar<decimal>("VIP_Save_Alternatives_v1", null, serviceId, description,
//				linkNo, linkNo2, seqNo);
//	    }

		public void Webbstyrning_Alternativ_DeleteTree(decimal connectLinkId)
		{
			const bool deleteCopy = true;
			_staffOdbcConnection.CallStaffGetNull("VIP_Del_ReDirectTree_v1", connectLinkId, StaffHelper.BoolToYn(deleteCopy));
		}

		public void Webbstyrning_Alternativ_SaveTreeRow(StaffRedirectRow staffRedirectRow, decimal connectLinkId)
		{
			_staffOdbcConnection.CallStaffGetNull("VIP_Save_ReDirectTreeRow_v1", connectLinkId, staffRedirectRow.Radnummer, StaffRedirectRowAction.Insert,
				staffRedirectRow.Rad_upptagningsomr, staffRedirectRow.Upptagningsområde, staffRedirectRow.Veckodag, staffRedirectRow.Tid,
				staffRedirectRow.Anropsfördelning, staffRedirectRow.Svarsställe, staffRedirectRow.Svarsställe_namn);
		}

	    public void Webbstyrning_Alternativ_Confirm(decimal connnectLinkId)
	    {
			_staffOdbcConnection.CallStaffGetNull("VIP_Confirm_Schema_v1", connnectLinkId);
	    }

        public void Webstyrning_Alternativ_Delete(decimal id)
        {
            _staffOdbcConnection.CallStaffGetNull("VIP_Save_Alternatives_v1", id, TypedNull.DecimalNull, "", TypedNull.StringNull, TypedNull.StringNull, TypedNull.IntNull);
        }
        #endregion

		#region Webstyrning Misc
        public List<StaffSelectCNoRow> Webstyrning_Svarsställen_GetList(decimal customerId, string abonnemang)
        {
            List<StaffSelectCNoRow> svarsställenForAllAbonnemang = _staffOdbcConnection.CallStaffGetList<StaffSelectCNoRow>("VIP_Select_CNo_v1", customerId, StaffOdbcConnection.SORT_ORDER_1_ASC);

            // Remove svarsställen which are not connected to the abonnemang in question
            List<StaffSelectCNoRow> svarsställenForAbonnemang = new List<StaffSelectCNoRow>();
			foreach (StaffSelectCNoRow svarsställe in svarsställenForAllAbonnemang)
            {
                if (abonnemang.Equals(svarsställe.Abonnemang))
                    svarsställenForAbonnemang.Add(svarsställe);
            }

            return svarsställenForAbonnemang;
        }

        public List<StaffHistorikRow> Webstyrning_Historik_GetList(decimal serviceId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffHistorikRow>("VIP_List_Schema_v1", serviceId, StaffOdbcConnection.SORT_ORDER_5_DESC, StaffListSchemaRow.OPTION_HISTORIK);
        }

        public List<StaffEjVerkställdaStyrningar> Webstyrning_EjVerställda_GetList()
        {
            return _staffOdbcConnection.CallStaffGetList<StaffEjVerkställdaStyrningar>("VIP_Select_AllInQueue_v1", StaffOdbcConnection.SORT_ORDER_1_DESC);
        }
		#endregion

		#region Multistyrning Kö
		public List<StaffMultiSelectQueueRow> Multistyrning_Kö_GetList(decimal customerId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffMultiSelectQueueRow>("VIP_Multi_Select_Queue_v1", customerId);
        }

		public void Multistyrning_Kö_Create(decimal VIPMultiConnectedId, DateTime? preferredConnect, string username, bool immidiate)
        {
			_staffOdbcConnection.CallStaffGetScalar<decimal?>("VIP_Multi_SaveToQueue_v1", VIPMultiConnectedId, preferredConnect, preferredConnect, username, StaffHelper.BoolToYn(immidiate), StaffAction.Create, StaffType.Alternativ);
		}

		public void Multistyrning_Kö_Edit(decimal VIPMultiConnectedId, DateTime? preferredConnect, DateTime? oldPreferredConnect, string username, bool immidiate)
		{
			_staffOdbcConnection.CallStaffGetScalar<decimal?>("VIP_Multi_SaveToQueue_v1", VIPMultiConnectedId, preferredConnect, oldPreferredConnect, username, StaffHelper.BoolToYn(immidiate), StaffAction.Edit, StaffType.Alternativ);
        }

		public void Multistyrning_Kö_Delete(decimal VIPMultiConnectedId, DateTime? oldPreferredConnect, string username)
        {
			_staffOdbcConnection.CallStaffGetScalar<decimal?>("VIP_Multi_SaveToQueue_v1", VIPMultiConnectedId, null, oldPreferredConnect, username, null, StaffAction.Delete, StaffType.Alternativ);
        }
		#endregion

		#region Multistyrning Alternativ
        public List<StaffMultiAltRow> Multistyrning_Alternativ_GetList(decimal customerId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffMultiAltRow>("VIP_Multi_Select_All_v1", customerId);
        }

        public void Multistyrning_Alternativ_Edit(decimal multistyrningsId, string multistyrningsAlternativ, decimal customerId, string username)
        {
            _staffOdbcConnection.CallStaffGetNullWithLog(username, "VIP_Multi_Save_v1", multistyrningsId, multistyrningsAlternativ, customerId);
        }

		public decimal Multistyrning_Alternativ_Create(string multistyrningsAlternativ, decimal customerId, string username)
		{
			return _staffOdbcConnection.CallStaffGetScalarWithLog<decimal>(username, "VIP_Multi_Save_v1", 0, multistyrningsAlternativ, customerId);
		}

        public void Mulstistyrning_Alternativ_Delete(decimal vipMultiConnectedId, string username)
        {
            _staffOdbcConnection.CallStaffGetScalarWithLog<decimal?>(username, "VIP_Multi_Delete_v1", vipMultiConnectedId, "N");
        }

		public void Multistyrning_Alternativ_SaveStyrningsalternativ(decimal? vipMultiConnectedLinkId, decimal multistyrningsId, decimal serviceId, decimal? connectLinkId, string username)
        {
            _staffOdbcConnection.CallStaffGetScalarWithLog<decimal?>(username, "VIP_MultiLink_Save_v1", vipMultiConnectedLinkId, multistyrningsId, serviceId, connectLinkId);
        }

        public List<StaffMultiAddedAltRows> Multistyrning_Alternativ_GetAlternatives(decimal multistyrningsId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffMultiAddedAltRows>("VIP_Multi_Select_v1", multistyrningsId);
        }

        public void Multistyrning_Alternativ_DeleteAlternative(decimal vIPMultiConnectedLinkId, string username)
        {
            _staffOdbcConnection.CallStaffGetNullWithLog(username, "VIP_MultiLink_Delete_v1", vIPMultiConnectedLinkId);
        }

		#endregion

		#region Multistyrning Misc
		public List<StaffMultiHistoryRow> Multistyrning_Historik_GetList(decimal customerId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffMultiHistoryRow>("VIP_Multi_History_v1", customerId, 0,
                StaffOdbcConnection.SORT_ORDER_3_DESC);
        }

//        public List<StaffHistorikRow> GetStyrningsköHistorik(decimal serviceId)
//        {
//            return _staffOdbcConnection.CallStaffGetList<StaffHistorikRow>("VIP_List_Schema_v1", serviceId, StaffOdbcConnection.SORT_ORDER_4_ASC, StaffListSchemaRow.OPTION_HISTORIK);
//        }

        #endregion

        #region Leverantörsinformation
        public List<StaffInnehållslev> Innehållsleverantörer_Get_List()
        {
            return _staffOdbcConnection.CallStaffGetList<StaffInnehållslev>("CPW_ContentProviders_Browse_v1");
        }

        public List<StaffLevNioHundraNr> NioHundraNummer_Get_List(decimal customerId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffLevNioHundraNr>("CPW_Accesses_Select_v1", customerId);
        }

        public List<StaffInnehållslevEditCreate> Innehållsleverantör_Get(decimal customerId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffInnehållslevEditCreate>("CPW_ContentProvider_Select_v1", customerId);
        }

        public void Innehållsleverantör_Create(decimal contentProviderId, string name, string companyId, string coAddress, string street, string postalcode, string city, string country, string mail, string url, string vatNo, string username)
        {
            _staffOdbcConnection.CallStaffGetNullWithLog(username, "CPW_ContentProvider_Save_v1", 0, name, companyId, coAddress, street, postalcode, city, country, mail, url, vatNo);
        }

        public void Innehållsleverantör_Edit(decimal contentProviderId, string name, string companyId, string coAddress, string street, string postalcode, string city, string country, string mail, string url, string vatNo, string username)
        {
            _staffOdbcConnection.CallStaffGetNullWithLog(username, "CPW_ContentProvider_Save_v1", contentProviderId, name, companyId, coAddress, street, postalcode, city, country, mail, url, vatNo);
        }

        public string Innehållsleverantör_Inactivate(decimal contentProviderId)
        {
            return _staffOdbcConnection.CallStaffGetScalar<string>("CPW_ContentProv_Inactivate_v1", contentProviderId);
        }

        public List<StaffNioHundraNrEdit> NioHundraNummer_Get(decimal accessId)
        {
            return _staffOdbcConnection.CallStaffGetList<StaffNioHundraNrEdit>("CPW_Access_Select_v1", accessId);
        }

        public void NioHundraNummer_Edit(decimal accessId, decimal contentProvidedId, string eventDescr, string contentProviderTfn, string username)
        {
            _staffOdbcConnection.CallStaffGetNullWithLog(username, "CPW_ContProv_Access_Connect_v1", accessId, contentProvidedId, eventDescr, contentProviderTfn);
        }
        
        #endregion
    }
}