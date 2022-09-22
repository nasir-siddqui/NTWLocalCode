using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class StyrningsalternativRow
    {
		[ExcludeFromExcel]
		public decimal ConnectLinkId { get; set; }

        public int Löpnr { get; set; }
        public string Styrning { get; set; }
        public string Status { get; set; }
        public string AltNr { get; set; }
        public string Index { get; set; }
    }
}