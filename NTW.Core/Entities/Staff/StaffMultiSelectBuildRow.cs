using System.ComponentModel.DataAnnotations.Schema;

namespace Telia.NTW.Core.Entities.Staff
{
	public class StaffMultiSelectBuildRow
	{
		public string Abonnemang { get; set; }
		public decimal AbonnemangsId { get; set; }
		public string AlternativNamn { get; set; }
		public decimal Id { get; set; }

		[NotMapped]
		public string DisplayValue
		{
			get
			{
				return Abonnemang + ": " + AlternativNamn;
			}
		}
	}
}
