using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Admin.Loggar
{
    public class ServiceloggRow
    {
        public int Id { get; set; }
        public string Component { get; set; }
        public string InternalFunction { get; set; }
        public string ErrNo { get; set; }
        public string ErrNoHex { get; set; }
        public string Description { get; set; }
        public string DetailDescription { get; set; }
        public Nullable<short> Severity { get; set; }
        public System.DateTime TimeStamp { get; set; }
    }
}