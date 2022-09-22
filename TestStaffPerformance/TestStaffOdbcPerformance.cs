using System.Diagnostics;
using NTW.Data.STAFF.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Telia.NTW.Web.Core.Entities.Staff;
using Telia.NTW.Web.Core.Services;
using Telia.NTW.Web.Core.Staff;

namespace TestStaffPerformance
{
    class TestStaffOdbcPerformance
    {
        private const string STAFF_ODBC_NAME = "AdvanceStaff";
        private const string STAFF_USERNAME = "stavip";
        private const string STAFF_PASSWORD = "9tt_PW12";

        private StaffService staffService;

        static void Main(string[] args)
        {
            new TestStaffOdbcPerformance();
        }

        public TestStaffOdbcPerformance()
        {
            StaffOdbcReader staffOdbcReader = new StaffOdbcReader(
                STAFF_ODBC_NAME,
                STAFF_USERNAME,
                STAFF_PASSWORD
            );

            staffService = new StaffService(staffOdbcReader);

            Stopwatch timer = new Stopwatch();
            timer.Start();
            List<StaffHistorikRow> historik = staffService.GetHistorik(11838358);
            timer.Stop();
            Console.Out.WriteLine("Total: " + timer.ElapsedMilliseconds);
        }
    }
}
