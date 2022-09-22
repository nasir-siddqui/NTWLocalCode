using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
	public class DateAfterValidator : DataAnnotationsModelValidator<DateAfterAttribute>
    {
		public DateAfterValidator(ModelMetadata metadata, ControllerContext context, DateAfterAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public override IEnumerable<ModelValidationResult> Validate(object container)
        {
			var field = Metadata.ContainerType.GetProperty(Metadata.PropertyName);
            var dateBeforeField = Metadata.ContainerType.GetProperty(Attribute.PropertyDateBefore);
			
            if (field != null && dateBeforeField != null)
            {
	            var value = field.GetValue(container, null);
                var dateBeforeValue = dateBeforeField.GetValue(container, null);

	            if (value is DateTime && dateBeforeValue is DateTime)
	            {
		            DateTime valueDateTime = (DateTime) value;
		            DateTime dateBeforeDateTime = (DateTime) dateBeforeValue;

		            // compare the value against the target value
		            if (valueDateTime.CompareTo(dateBeforeDateTime) <= 0)
		            {
				        // validation failed - return an error
				        yield return new ModelValidationResult {Message = ErrorMessage};
		            }
	            }
            }
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            string dateBeforePropertyId = GetFullHtmlFieldId(Attribute.PropertyDateBefore);
			yield return new DateAfterValidationRule(ErrorMessage, dateBeforePropertyId);
        }

        private string GetFullHtmlFieldId(string partialFieldName)
        {
            ViewContext viewContext = (ViewContext)ControllerContext;
            return viewContext.ViewData.TemplateInfo.GetFullHtmlFieldId(partialFieldName);
        }
    }

    public class DateAfterValidationRule : ModelClientValidationRule
    {
		public DateAfterValidationRule(string errorMessage, string dateBeforePropertyId)
        {
            ErrorMessage = errorMessage;
            ValidationType = "dateafter";
			ValidationParameters.Add("datebeforepropertyid", dateBeforePropertyId);
        }
    }
}
