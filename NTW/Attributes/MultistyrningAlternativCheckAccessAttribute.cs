using System.Linq;

namespace Telia.NTW.Web.Attributes
{
	public class MultistyrningAlternativCheckAccessAttribute : CheckDirectObjectAccessAttribute
	{
		public MultistyrningAlternativCheckAccessAttribute(string parameterName)
			: base(parameterName)
		{
		}

		protected override bool IsValid(decimal id)
		{
			var staffMultiAlternativList = StaffService.Multistyrning_Alternativ_GetList(CustomerId);
			return (staffMultiAlternativList.Any(staffItem => staffItem.VIPMultiConnectedId == id));
		}
	}
}