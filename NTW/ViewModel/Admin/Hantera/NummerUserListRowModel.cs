namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class NummerUserListRowModel
	{
		public int userId { get; set; }
		public int advanceExtId { get; set; }

		public string name { get; set; }
		public short viewLevel { get; set; }
		public bool radata { get; set; }

		public bool active { get; set; }
	}
}