using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities
{
    public class AnalysSamtal
    {
        public string Svarsställe { get; set; }
        public string Datum { get; set; }
        public TimeSpan Tidpunkt { get; set; }
        public TimeSpan Längd { get; set; }
        public string Samtalstyp { get; set; }
        public string Region { get; set; }
        public string Ort { get; set; }
        public string Nummergrupp { get; set; }
    }
}
