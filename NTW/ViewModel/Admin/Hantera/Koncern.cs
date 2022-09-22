using Sigma.Utils.Attributes;

namespace Telia.NTW.Web.ViewModel.Admin.Hantera
{
	public class Koncern : BaseViewModel
	{
		public const string KoncernAlreadyExistsErrorMsg = "Koncernen existerar redan";

		[ExcludeFromExcel]
		public int GroupId { get; set; }

		[Text]
		[StringLengthWithMessage (50)]
        public string Koncernnamn { get; set; }

		[Text]
        [RequiredWithMessage]
		[StringLengthWithMessage (25)]
        public string KoncernId{ get; set; }
	}
}