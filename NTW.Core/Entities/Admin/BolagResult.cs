using System.Collections.Generic;

namespace Telia.NTW.Core.Entities.Admin
{
	public class BolagNummer
	{
		public AdvanceExtension nummer { get; set; }
		public List<NumberUser> användare { get; set; }
	}
}
