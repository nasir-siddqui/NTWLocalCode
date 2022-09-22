using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Admin.Loggar
{
    public class SystemloggRow
    {
        public int id { get; set; }
        public DateTime DateTime { get; set; }
        public string UserName { get; set; }
        public string Process { get; set; }
        public string Body { get; set; }
        public Nullable<int> Value { get; set; }
    }
}