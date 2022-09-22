using System;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffStyrningsköLog
    {
        public int Sekvensnummer { get; set; }
        public string Alternativnummer { get; set; }
        public string Alternativnamn { get; set; }
        public DateTime? PreferredConnect { get; set; }
        public DateTime? RealConnect { get; set; }
        public decimal OrigAltId { get; set; }
        public decimal Id { get; set; }
        public string Action { get; set; }
        public string ActionUser { get; set; }
        public DateTime? ActionTime { get; set; }
        public string InfoText { get; set; }
    }
}
