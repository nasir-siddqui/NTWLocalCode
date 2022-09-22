using System;

namespace Telia.NTW.Data.Analys.Entities
{
    public class Samtal
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
