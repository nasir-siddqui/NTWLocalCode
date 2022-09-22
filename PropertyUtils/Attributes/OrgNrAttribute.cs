namespace Sigma.Utils.Attributes
{
	public class OrgNrAttribute : CustomRegexAttribute
	{
		public OrgNrAttribute()
			: base(@"^\d{6}-?\d{4}$")
		{
			ErrorMessage = "Organisationsnummer har fel format";
		}
	}
}
