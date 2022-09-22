using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class NummerEditModel : BaseViewModel
	{
		public int advanceExtId { get; set; }
		public int? companyId { get; set; }

		public int id { get; set; }
		public string nummer { get; set; }
		public DateTime created { get; set; }
		public DateTime? changed { get; set; }
		public string changedBy { get; set; }
		public string bolagsnamn { get; set; }
		public string orgNr { get; set; }
		public bool prenumereras { get; set; }
		public short bolagViewLevel { get; set; }
		public bool radata { get; set; }

		public List<NummerUserListRowModel> anvandare { get; set; }

		public List<KeyValuePair<int, string>> viewLevels { get; set; }
	}
}