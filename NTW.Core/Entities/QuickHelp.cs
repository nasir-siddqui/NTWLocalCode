using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Telia.NTW.Core.Entities
{
	public class QuickHelp
	{
		[Key, Column(Order = 0)]
		public string Controller { get; set; }

		[Key, Column(Order = 1)]
		public string Action { get; set; }

		public string HTML { get; set; }
	}
}
