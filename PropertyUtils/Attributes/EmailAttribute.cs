namespace Sigma.Utils.Attributes
{
	public class EmailAttribute : CustomRegexAttribute
	{
		public EmailAttribute() : base(ApprovedCharacters + "+@" + ApprovedCharacters + @"+\." + ApprovedCharacters + "+")
		{
			ErrorMessage = "Ej giltig emailadress";
		}
	}
}
