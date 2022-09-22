using Microsoft.VisualStudio.TestTools.UnitTesting;
using Sigma.Utils.Helpers;

namespace Sigma.Utils.Attributes
{
	[TestClass]
	public class TestPropertyHelper
	{
		[TestMethod]
		public void TestToDictionary()
		{
			var testObject = new {Test1Key = "test1Val", Test2Key = "test2Val"};
			var testDic = PropertyHelper.ToDictionary<string>(testObject);
			Assert.IsNotNull(testDic);
			Assert.AreEqual(testDic.Count, 2);
			Assert.AreEqual(testDic["Test1Key"], "test1Val");
			Assert.AreEqual(testDic["Test2Key"], "test2Val");
		}
	}
}
