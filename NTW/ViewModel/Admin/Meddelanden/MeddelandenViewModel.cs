using System.Collections.Generic;
using Telia.NTW.Web.ViewModel.Admin.Meddelanden;

namespace Telia.NTW.Web.ViewModel.Admin
{
	public class MeddelandenViewModel : BaseViewModel
	{
		public IEnumerable<MeddelandeViewModel> Future { get; set; }
		public IEnumerable<MeddelandeViewModel> Present { get; set; }
		public IEnumerable<MeddelandeViewModel> Past { get; set; }
	}
}