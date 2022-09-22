using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class AbonnemangViewModel : BaseViewModel
    {
        public string Abonnemang { get; set; }
        public decimal ServiceId { get; set; }

        public List<StyrningsköRow> Styrningskö { get; set; }
		public List<StyrningsalternativRow> Styrningsalternativ { get; set; }
        public List<HistorikRow> Historik { get; set; }
        public List<SvarsställeRow> Svarsställen { get; set; }
        public List<WebbstyrningLogg> Logg { get; set; }
    }
}