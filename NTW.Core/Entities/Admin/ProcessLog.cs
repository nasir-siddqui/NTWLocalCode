using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities.Admin
{
    public class ProcessLog
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool Success { get; set; }
        public string Notes { get; set; }
        public string ProcessName { get; set; }

    }
}
