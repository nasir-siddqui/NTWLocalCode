using System;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class WebbstyrningLogg
    {
		public DateTime? Registrerad { get; set; }
		public DateTime? Begärt { get; set; }
		public DateTime? Verkställd { get; set; }
		public string Styrning { get; set; }
		public string Händelse { get; set; }
		public string Användare { get; set; }
		public decimal SmsId { get; set; }
		public string Info { get; set; }
    }
}