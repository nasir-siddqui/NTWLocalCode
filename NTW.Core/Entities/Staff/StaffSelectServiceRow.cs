using System;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffSelectServiceRow
    {
        public string Abonnemang { get; set; }
        public decimal ServiceId { get; set; }
        public string Namn { get; set; }
        public decimal ConnectLinkId { get; set; }
        public DateTime? RealConnect { get; set; }
    }
}
