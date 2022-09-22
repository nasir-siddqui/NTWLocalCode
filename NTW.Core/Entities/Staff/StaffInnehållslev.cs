using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffInnehållslev
    {
        public decimal ContentProviderId { get; set; }
        public string CompanyId { get; set; }
        public string Name { get; set; }
        public string ContentProviderTfn { get; set; }
    }
}
