using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
	public class RequiredWithMessageAttribute : RequiredAttribute, IClientValidatable
	{
		public RequiredWithMessageAttribute()
		{
			ErrorMessage = string.Format("Obligatoriskt");
		}

		public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
		{
			yield return new ModelClientValidationRequiredRule(ErrorMessage);
		}
	}
}
