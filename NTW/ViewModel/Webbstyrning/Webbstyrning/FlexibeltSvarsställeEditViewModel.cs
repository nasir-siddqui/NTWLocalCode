using System;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class FlexibeltSvarsställeEditViewModel : BaseViewModel
    {
        public string AktivtSvarsställe { get; set; }
        public string NyttSvarsställe { get; set; }
        public DateTime? DatumFörNyttSvarsställe { get; set; }
    }
}