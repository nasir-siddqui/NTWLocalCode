using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Leverantörsinformation
{
    public class InnehållsleverantörRow : BaseViewModel
    {
        public decimal Id { get; set; }
        public string OrgNr { get; set; }
        public string Bolagsnamn { get; set; }
        public string Telefon { get; set; }
    }
}