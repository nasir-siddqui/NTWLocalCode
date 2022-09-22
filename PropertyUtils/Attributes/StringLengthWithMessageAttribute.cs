using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
	public class StringLengthWithMessageAttribute : StringLengthAttribute, IClientValidatable
	{
		public StringLengthWithMessageAttribute(int maximumLength) : base(maximumLength)
		{
			ErrorMessage = string.Format("Max {0} tecken", maximumLength);
		}

		public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
		{
			yield return new ModelClientValidationStringLengthRule(ErrorMessage, MinimumLength, MaximumLength);
		}
	}
}
