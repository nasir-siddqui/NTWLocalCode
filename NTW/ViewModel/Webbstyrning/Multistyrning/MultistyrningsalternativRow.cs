using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningsalternativRow
    {
		[ExcludeFromExcel]
		public decimal Id { get; set; }

        public string Namn { get; set; }
    }
}
