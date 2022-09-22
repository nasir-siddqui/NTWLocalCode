using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffInnehållslevEditCreate
    {
        public string Name { get; set; }
        public string CompanyId { get; set; }
        public string CoAddress { get; set; }
        public string Street { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string MailAddress { get; set; }
        public string URL { get; set; }
        public string VATNo { get; set; }

        public DateTime ValidFrom { get; set; }
        public DateTime UpdateDate { get; set; }

    }
}
