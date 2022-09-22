using System.Collections.Generic;

namespace Telia.NTW.Core.Entities
{
	public class MeddelandeContainer
	{
		public IEnumerable<Meddelande> Future { get; set; }
		public IEnumerable<Meddelande> Present { get; set; }
		public IEnumerable<Meddelande> Past { get; set; }
	}
}
