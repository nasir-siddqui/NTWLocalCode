using System.Collections.Generic;
using System.Web.Mvc;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning
{
    public class MultistyrningalternativAddRow
    {
        public decimal Id { get; set; }
        public string Abonnemang { get; set; }
        public IEnumerable<SelectListItem> Styrningsalternativ { get; set; }
    }
}