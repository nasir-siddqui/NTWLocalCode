using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
    public class BolagListRow
    {
		[ExcludeFromExcel]
		public int CompanyId { get; set; }

        public string OrgNr { get; set; }

        public string Bolagsnamn { get; set; }

        public string Koncern { get; set; }
    }
}