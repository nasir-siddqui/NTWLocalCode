﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
	public enum Comparison
	{
		IsEqualTo,
		IsNotEqualTo
	}

	[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
	public sealed class RequiredIfAttribute : ValidationAttribute, IClientValidatable
	{
		private const string DefaultErrorMessageFormatString = "Obligatoriskt";

		public string OtherProperty { get; private set; }
		public Comparison Comparison { get; private set; }
		public object OtherPropertyValue { get; private set; }

		public RequiredIfAttribute(string otherProperty, Comparison comparison, object otherPropertyValue)
		{
			if (string.IsNullOrEmpty(otherProperty))
			{
				throw new ArgumentNullException("otherProperty");
			}

			OtherProperty = otherProperty;
			Comparison = comparison;
			OtherPropertyValue = otherPropertyValue;

			ErrorMessage = DefaultErrorMessageFormatString;
		}

		private bool IsRequired(object actualPropertyValue)
		{
			switch (Comparison)
			{
				case Comparison.IsNotEqualTo:
					return actualPropertyValue == null || !actualPropertyValue.Equals(OtherPropertyValue);
				default:
					return actualPropertyValue != null && actualPropertyValue.Equals(OtherPropertyValue);
			}
		}

		protected override ValidationResult IsValid(object value,
			ValidationContext validationContext)
		{
			if (value == null)
			{
				var property = validationContext.ObjectInstance.GetType()
					.GetProperty(OtherProperty);

				var propertyValue = property.GetValue(validationContext.ObjectInstance, null);

				if (IsRequired(propertyValue))
				{
					return new ValidationResult(
						string.Format(ErrorMessageString, validationContext.DisplayName));
				}
			}
			return ValidationResult.Success;
		}

		public IEnumerable<ModelClientValidationRule> GetClientValidationRules(
			ModelMetadata metadata,
			ControllerContext context)
		{
			return new[]
			{
				new ModelClientValidationRequiredIfRule(string.Format(ErrorMessageString, 
					metadata.GetDisplayName()), OtherProperty, Comparison, OtherPropertyValue)
			};
		}
	}

	public class ModelClientValidationRequiredIfRule : ModelClientValidationRule
	{
		public ModelClientValidationRequiredIfRule(string errorMessage,
			string otherProperty,
			Comparison comparison,
			object value)
		{
			ErrorMessage = errorMessage;
			ValidationType = "requiredif";
			ValidationParameters.Add("other", otherProperty);
			ValidationParameters.Add("comp", comparison.ToString().ToLower());
			ValidationParameters.Add("value", value.ToString().ToLower());
		}
	}
}