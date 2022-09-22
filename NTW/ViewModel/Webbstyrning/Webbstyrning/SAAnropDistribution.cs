namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
	public class SAAnropDistribution
	{
		public byte distribution { get; set; }
		public SASvarsstalle svarsstalle { get; set; }

		public bool editing { get; set; }

		public SAAnropDistribution()
		{
			distribution = 100;
			editing = false;
		}

		public override string ToString()
		{
			return distribution + "%";
		}
	}
}