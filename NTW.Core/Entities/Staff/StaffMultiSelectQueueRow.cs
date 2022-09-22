using System;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffMultiSelectQueueRow
    {
        public decimal VIPMultiConnectedId { get; set; }
        public string Name { get; set; }
        public DateTime? PreferredConnect { get; set; }
        public DateTime? RealConnect { get; set; }
    }
}
