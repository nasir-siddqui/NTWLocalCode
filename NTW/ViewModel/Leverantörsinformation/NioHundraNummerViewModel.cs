using Sigma.Utils.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Leverantörsinformation
{
    public class NioHundraNummerViewModel : BaseViewModel
    {
        public List<NioHundraNummerRow> NioHundraNummer { get; set; }
    }
}