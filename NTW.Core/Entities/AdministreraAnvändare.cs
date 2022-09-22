using System;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Core.Entities
{
    public class AdministreraAnvändare
    {
        public DateTime Skapad { get; set; }
        public DateTime SenastÄndrad { get; set; }

        public int UserID { get; set; }

        public string AnvändarID { get; set; }
        public string Lösenord { get; set; } // Annan typ?
        public string Namn { get; set; }

        public string Bolagsnamn { get; set; }
        public string OrgNr { get; set; }

        public string Telefon { get; set; }
        public string Email { get; set; }
        public string Notering { get; set; }
        public Användaretyper Användartyper { get; set; }

        public bool AnalysActive { get; set; }
        public bool WebbstyrningLäsActive { get; set; }
        public bool WebbstyrningSkrivActive { get; set; }
        public bool WebbstyrningMultistyrning { get; set; }
        public bool KoncernRattigheterActive { get; set; }
        public bool LeverantörsinformationActive { get; set; }
        public bool Mailmottagare { get; set; }
        public int CompanyId { get; set; }
        public int UserCompanyId { get; set; }
    }
}
