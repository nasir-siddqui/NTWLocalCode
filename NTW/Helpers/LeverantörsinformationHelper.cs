using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.ViewModel.Leverantörsinformation;

namespace Telia.NTW.Web.Helpers
{
    public class LeverantörsinformationHelper
    {
        private const string NioID = "NioID";
        private const string InnehållslevID = "InnehållslevID";

	    private readonly StaffService staffService;
	    private readonly CookieHelper cookieHelper;

	    public LeverantörsinformationHelper(StaffService staffService, CookieHelper cookieHelper)
	    {
		    this.staffService = staffService;
		    this.cookieHelper = cookieHelper;
	    }

//        public void SetNioIDList(List<StaffLevNioHundraNr> niohundraNr)
//        {
//            List<decimal> accessIdList = niohundraNr.Select(m => m.AccessId).ToList();
//            HttpContext.Current.Session[NioID] = accessIdList;
//        }

        //public void SetInnehållslevIDdList(List<StaffInnehållslev> innehållsleverantörer)
        //{
        //    List<decimal> contentProviderIdList = innehållsleverantörer.Select(m => m.ContentProviderId).ToList();

        //    HttpContext.Current.Session[InnehållslevID] = contentProviderIdList;
        //}

//        public bool CheckIfNioIDExists(decimal accessId)
//        {
//            List<decimal> accessIdList = HttpContext.Current.Session[NioID] as List<decimal>;
//
//            if (accessIdList.Contains(accessId))
//                return true;
//            else
//                return false;
//        }

        //public bool CheckIfInnehållslevIDExists(decimal id)
        //{
        //    List<decimal> contentProviderIdList = HttpContext.Current.Session[InnehållslevID] as List<decimal>;

        //    if (contentProviderIdList.Contains(id))
        //        return true;
        //    else
        //        return false;
        //}

	    public string removeHyphen(string orgNr)
	    {
		    return orgNr.Replace("-", "");
	    }

	    public List<NioHundraNummerRow> GetNioHundraNummerList()
	    {
			List<StaffLevNioHundraNr> nioHundraLista = staffService.NioHundraNummer_Get_List(cookieHelper.GetCustomerId());
			return Mapper.Map<List<StaffLevNioHundraNr>, List<NioHundraNummerRow>>(nioHundraLista);
	    }
    }
}