using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Staff;

namespace Telia.NTW.Core.Services
{
    [TestClass]
    public class TestStaffService
    {
        private const string STAFF_ODBC_NAME = "AdvanceStaff";
        private const string STAFF_USERNAME = "stavip";
        private const string STAFF_PASSWORD = "9tt_PW12";

        private readonly StaffService staffService;

        public TestStaffService()
        {
            StaffOdbcConnection _staffOdbcConnection = new StaffOdbcConnection(
                STAFF_ODBC_NAME,
                STAFF_USERNAME,
                STAFF_PASSWORD
            );

            staffService = new StaffService(_staffOdbcConnection);
        }

        [TestMethod]
        public void TestGetCustomerId()
        {
            decimal? customerId = staffService.GetCustomerId("5565585873");
            Assert.IsTrue(customerId > 0, "customerId is not greater than 0");
        }

        [TestMethod]
        public void TestGetAbonnemang()
        {
            List<StaffSelectServiceRow> abonnemang = staffService.Webstyrning_Abonnemang_GetList(12332593);
            Assert.IsNotNull(abonnemang, "Abonnemang is null");
            Assert.IsTrue(abonnemang.Count > 0, "Abonnemang is empty");
        }

        /*[TestMethod]
        public void TestGetSvarsställen()
        {
            List<StaffSelectCNoRow> svarsställen = staffService.GetSvarsställen(12332593);
            Assert.IsNotNull(svarsställen, "svarsställen is null");
            Assert.IsTrue(svarsställen.Count > 0, "svarsställen is empty");
        }*/

        [TestMethod]
        public void TestGetMultistyrningskö()
        {
            List<StaffMultiSelectQueueRow> multistyrningskö = staffService.Multistyrning_Kö_GetList(482101);
            Assert.IsNotNull(multistyrningskö);
            Assert.IsTrue(multistyrningskö.Count > 0);
        }
    }
}
