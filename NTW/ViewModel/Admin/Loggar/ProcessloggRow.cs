using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Admin.Loggar
{
    public class ProcessloggRow
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool Success { get; set; }
        public string Notes { get; set; }
        public string ProcessName { get; set; }
    }
}