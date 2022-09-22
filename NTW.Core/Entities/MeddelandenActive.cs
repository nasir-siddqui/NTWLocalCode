using System.Collections.Generic;

namespace Telia.NTW.Core.Entities
{
	public class MeddelandenActive
	{
		public IEnumerable<Meddelandes> Panic { get; set; }
		public IEnumerable<Meddelandes> Info { get; set; }
	}
}
