using System;
using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class AbonnemangslistaRow
    {
		[ExcludeFromExcel]
        public decimal Id { get; set; }

        public string Abonnemang { get; set; }

        public string AktivStyrning { get; set; }

        public DateTime? Aktiverad { get; set; }
    }
}