using System;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningHistorikRow
    {
        public string Multistyrning { get; set; }
        public DateTime? Begärt { get; set; }
        public DateTime? Verkställd { get; set; }
        public string Status { get; set; }

    }
}