using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
	public abstract class CustomRegexAttribute : RegularExpressionAttribute, IClientValidatable
	{
        public const string ApprovedCharacters = @"[a-zA-Z0-9åäöÅÄÖæøÆØ,.!?@_ -]";

		protected CustomRegexAttribute(string pattern) : base(pattern)
		{
		}

		public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
		{
			yield return new ModelClientValidationRegexRule(ErrorMessage, Pattern);
		}
	}
}
