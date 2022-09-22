using Microsoft.VisualStudio.TestTools.UnitTesting;
using Sigma.Utils.ActionResults.TestData;
using Sigma.Utils.Helpers;

namespace Sigma.Utils.ActionResults
{
	[TestClass]
	public class TestExcelActionResult
	{
		[TestMethod]
		public void TestGetDisplayNames()
		{
			var data = TestEntity.GetListWithTestData();
			Assert.IsNotNull(data, "Testdata is null");

			var headers = PropertyHelper.GetBasicPropertyInfos(data);
			Assert.IsNotNull(data, "headers is null");
			Assert.AreEqual(3, headers.Count, "headers did not contain 3 values");
			Assert.AreEqual("Strängnamn", headers[0]);
			Assert.AreEqual("AnInt", headers[1]);
			Assert.AreEqual("ADateTime", headers[2]);
		}

		[TestMethod]
		public void TestGetValues()
		{
			var data = TestEntity.GetListWithTestData();
			Assert.IsNotNull(data, "Testdata is null");

			var values0 = PropertyHelper.GetValues(data[0]);
			Assert.AreEqual(3, values0.Count, "values0 does not contain 3 values");
			Assert.AreEqual(TestEntity.Values0AString, values0[0]);
			Assert.AreEqual(TestEntity.Values0AnInt, values0[1]);
			Assert.AreEqual(TestEntity.Values0ADateTime, values0[2]);

			var values1 = PropertyHelper.GetValues(data[1]);
			Assert.AreEqual(3, values1.Count, "values1 does not contain 3 values");
			Assert.AreEqual(TestEntity.Values1AString, values1[0]);
			Assert.AreEqual(TestEntity.Values1AnInt, values1[1]);
			Assert.AreEqual(TestEntity.Values1ADateTime, values1[2]);

			var values2 = PropertyHelper.GetValues(data[2]);
			Assert.AreEqual(3, values2.Count, "values2 does not contain 3 values");
			Assert.AreEqual(TestEntity.Values2AString, values2[0]);
			Assert.AreEqual(TestEntity.Values2AnInt, values2[1]);
			Assert.AreEqual(TestEntity.Values2ADateTime, values2[2]);
		} 
	}
}
