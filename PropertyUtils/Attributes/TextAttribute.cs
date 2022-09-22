namespace Sigma.Utils.Attributes
{
	public class TextAttribute : CustomRegexAttribute
	{
		public TextAttribute()
			: base("^" + ApprovedCharacters + "*$")
		{
			ErrorMessage = "Du har använt dig utav otillåtna tecken";
		}
	}
}
