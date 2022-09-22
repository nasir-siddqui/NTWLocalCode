using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Web.ViewModel.Admin;
using Telia.NTW.Web.ViewModel.Admin.Meddelanden;

namespace Telia.NTW.Web.ViewModel
{
	public class MeddelandenModel
	{
		public List<MeddelandeViewModel> PanicMessages { get; set; }
		public List<MeddelandeViewModel> InfoMessages { get; set; }

		public MeddelandenModel()
		{
			PanicMessages = new List<MeddelandeViewModel>();
			InfoMessages = new List<MeddelandeViewModel>();
		}
	}
}
