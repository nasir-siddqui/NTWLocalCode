using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Core.Entities.Staff;

namespace Telia.NTW.Web.Attributes
{
	public class LevInfo900CheckAccessAttribute : CheckDirectObjectAccessAttribute
	{
		public LevInfo900CheckAccessAttribute(string parameterName) : base(parameterName)
		{
		}

		protected override bool IsValid(decimal id)
		{
			List<StaffLevNioHundraNr> nioHundraLista = StaffService.NioHundraNummer_Get_List(CookieHelper.GetCustomerId());
            return nioHundraLista.Any(nioHundraNr => nioHundraNr.AccessId == id);
		}
	}
}