using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Telia.NTW.Web.ViewModel.Admin.Loggar
{
    public class LoggarViewModel : BaseViewModel
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool LoadTables { get; set; }

        public List<AdminloggRow> AdminLoggList {get; set;}
        public List<ServiceloggRow> Servicelogg { get; set; }
        public List<StaffloggRow> StaffloggList { get; set; }
        public List<SystemloggRow> SystemloggList { get; set; }
        public List<ProcessloggRow> Processlogs { get; set; }
    }
}