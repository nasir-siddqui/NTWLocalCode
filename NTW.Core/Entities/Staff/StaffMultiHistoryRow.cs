using System;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffMultiHistoryRow
    {
        public string Name { get; set; }
        public DateTime? PreferredConnect { get; set; }
        public DateTime? RealConnect { get; set; }
        public string Status { get; set; }
    }
}
