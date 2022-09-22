using System.ComponentModel.DataAnnotations;

namespace Sigma.Utils.Attributes
{
	public class DateAfterAttribute : ValidationAttribute
	{
        public string PropertyDateBefore { get; set; }

        public DateAfterAttribute(string propertyDateBefore, string propertyBeforeName)
        {
            this.PropertyDateBefore = propertyDateBefore;
			ErrorMessage = string.Format("Måste vara senare än {0}", propertyBeforeName);
        }
    }
}
