using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class FutureDateAttribute : ValidationAttribute, IClientValidatable
    {
        public FutureDateAttribute()
        {
            ErrorMessage = "Måste vara en framtida tidpunkt";
        }

        public override bool IsValid(object value)
        {
            if (value == null)
            {
                return true;
            }
            else if (!(value is DateTime))
            {
                return false;
            }
            else if ((DateTime) value > DateTime.Now)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            yield return new ModelClientValidationFutureDateRule(ErrorMessage);
        }
    }

    public class ModelClientValidationFutureDateRule : ModelClientValidationRule
    {
        public ModelClientValidationFutureDateRule(string errorMessage)
        {
            ErrorMessage = errorMessage;
            ValidationType = "futuredate";
        }
    }
}
