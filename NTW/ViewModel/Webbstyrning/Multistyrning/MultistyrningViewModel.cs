using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningViewModel : BaseViewModel
    {
        public List<MultistyrningsköRow> Multistyrningskö { get; set; }
        public List<MultistyrningHistorikRow> Multistyrningshistorik { get; set; }
        public List<MultistyrningsalternativRow> Multistyrningsalternativ { get; set; }
    }
}