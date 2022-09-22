using System.Collections.Generic;
using Sigma.Utils.Attributes;
using Telia.NTW.Web.Enums;
using Telia.NTW.Web.ViewModel.Admin;
using Telia.NTW.Web.ViewModel.Admin.Meddelanden;
using Telia.NTW.Web.ViewModel.Shared;

namespace Telia.NTW.Web.ViewModel
{
	public abstract class BaseViewModel
    {
		[ExcludeFromExcel]
        public MeddelandenModel MeddelandeList { get; set; }

		[ExcludeFromExcel]
		public bool HasSubMenu { get; set; }

		[ExcludeFromExcel]
		public QuickHelpViewModel QuickHelp { get; set; }

		[ExcludeFromExcel]
		public UserDetails UserDetails { get; set; }

		protected BaseViewModel() {
			HasSubMenu = true;
			MeddelandeList = new MeddelandenModel();
			UserDetails = new UserDetails();
		}

		public void addErrorMessage(string message)
		{
			if (message != null && !message.Equals(""))
			{
				MeddelandeList.PanicMessages.Add(new MeddelandeViewModel {Type = MeddelandeType.Panic, Text = message});
			}
		}

		public void addErrorMessages(List<string> messages)
		{
			if (messages != null)
			{
				foreach (string message in messages)
				{
					addErrorMessage(message);
				}
			}
		}
	}
}