using System.Linq;

namespace Telia.NTW.Web.Attributes
{
	public class MultistyrningKöCheckAccessAttribute : CheckDirectObjectAccessAttribute
	{
		public MultistyrningKöCheckAccessAttribute(string parameterName) : base (parameterName)
		{
		}

		protected override bool IsValid(decimal id)
		{
			var staffMultiKöList = StaffService.Multistyrning_Kö_GetList(CustomerId);
			return (staffMultiKöList.Any(staffItem => staffItem.VIPMultiConnectedId == id));
		}
	}
}