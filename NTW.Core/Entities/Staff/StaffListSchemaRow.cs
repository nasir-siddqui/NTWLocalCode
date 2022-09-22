using System;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffListSchemaRow
    {
        public const string OPTION_KÖ = "Q";
        public const string OPTION_HISTORIK = "H";
        public const string OPTION_LOGG = "L";

        public int Sekvensnummer { get; set; }
        public string Alternativnummer { get; set; }
        public string Alternativnamn { get; set; }
        public DateTime? PreferredConnect { get; set; }
        public DateTime? RealConnect { get; set; }
        public decimal OrigAltId { get; set; }
        public decimal Id { get; set; }
    }
}
