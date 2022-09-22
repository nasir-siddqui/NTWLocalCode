namespace Sigma.Utils.Attributes.TestData
{
	class TestEntity
	{
		public string Name { get; set; }

		[RequiredIf ("Name", Comparison.IsEqualTo, "Jeremia")]
		public int Age { get; set; }
	}
}
