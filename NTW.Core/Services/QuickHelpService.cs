using System.Linq;
using Telia.NTW.Core.Entities;

namespace Telia.NTW.Core.Services
{
	public class QuickHelpService
	{
        private readonly NtwCodeFirstContext _ntwCodeFirstContext;

        public QuickHelpService(NtwCodeFirstContext _ntwCodeFirstContext)
        {
            this._ntwCodeFirstContext = _ntwCodeFirstContext;
        }

		public QuickHelp Get(string controller, string action)
		{
			return _ntwCodeFirstContext.QuickHelp
				.SingleOrDefault(w => 
					w.Controller == controller 
					&& w.Action == action);
		}

		public QuickHelpEntry Get(string id)
		{
			return _ntwCodeFirstContext.QuickHelpEntry
				.Single(w => 
					w.Id == id);
		}
	}
}
