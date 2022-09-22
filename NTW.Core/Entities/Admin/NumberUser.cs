namespace Telia.NTW.Core.Entities.Admin
{
	public class NumberUser
	{
		public int UserId { get; set; }
		public int AdvanceExtId { get; set; }

		public string Name { get; set; }
		public short ViewLevel { get; set; }
		public bool RawData { get; set; }

		public bool Active { get; set; }
	}
}
