namespace Telia.NTW.Web.ViewModel.Analys
{
	public class AnalysViewModel : BaseViewModel
	{
		public AnalysFilterViewModel FilterViewModel { get; set; }
		public AnalysDataViewModel DataViewModel { get; set; }
        public bool ErrorModel { get; set; }
	}
}