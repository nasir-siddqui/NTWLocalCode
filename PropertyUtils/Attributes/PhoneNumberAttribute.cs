namespace Sigma.Utils.Attributes
{
	public class PhoneNumberAttribute : CustomRegexAttribute
	{
		public PhoneNumberAttribute() : base("^[0-9- ]*$")
		{
			ErrorMessage = "Ej giltigt telefonnummer";
		}
	}
}
