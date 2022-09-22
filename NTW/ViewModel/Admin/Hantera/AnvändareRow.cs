using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class AnvändareRow
	{
		[ExcludeFromExcel]
		public int UserId { get; set; }

        public string AnvändarID { get; set; }

		public string Namn { get; set; }

		public string OrgNr { get; set; }

		public string Bolagsnamn { get; set; }
	}
}