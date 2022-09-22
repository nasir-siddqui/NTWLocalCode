using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffEjVerkställdaStyrningar
    {
        public DateTime PreferredConnect { get; set; }
        public string KundNamn { get; set; }
        public string Abonnemang { get; set; }
        public string Alternativnamn { get; set; }
    }
}
