using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Admin.Loggar
{
    public class AdminloggRow
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public string Area { get; set; }
        public string Description { get; set; }
        public string cmdSQL { get; set; }
        public DateTime EffectDate { get; set; }
    }
}