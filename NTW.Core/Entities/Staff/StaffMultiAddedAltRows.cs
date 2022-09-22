using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffMultiAddedAltRows
    {
        public decimal VIPMultiConnectedLinkId { get; set; }
        public decimal ServiceId { get; set; }
        public decimal ConnectLinkId { get; set; }
        public string Alternativnamn { get; set; }
        public string Alternativnummer { get; set; }
        public string TV7 { get; set; }
        public string Status { get; set; }
        public int Sekvensnummer { get; set; }
    }
}
