using System;

namespace Telia.NTW.Web.ViewModel.Admin.Inloggningsstatistik
{
	public class InloggningsstatistikRow
	{
		public string Användare { get; set; }
		public string Bolag { get; set; }
		public DateTime? SenastInloggad { get; set; }
	}
}