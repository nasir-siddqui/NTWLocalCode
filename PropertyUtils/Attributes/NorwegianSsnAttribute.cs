using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;

namespace Sigma.Utils.Attributes
{
    public class NorwegianSsnAttribute : ValidationAttribute, IClientValidatable
    {
		public NorwegianSsnAttribute(string errorMessage)
		{
			ErrorMessage = errorMessage;
		}

        public override bool IsValid(object value)
        {
            try
            {
                string ssn = value.ToString().Trim();

                if (ssn.Length == 0) return true;
                if (ssn.Length != 11) return false;

                // Validate that the date part of the ssn is a valid date.
                string dateString = ssn.Substring(0, 6);
                DateTime date;
                if (!DateTime.TryParseExact(dateString, "ddMMyy", null, DateTimeStyles.None, out date))
                {
                    return false;
                }

                // Split up digits for checksum calculation
                int[] digits = new int[11];
                for (int i=0; i<digits.Length; i++)
                {
                    digits[i] = int.Parse(ssn.Substring(i, 1));
                }

                // Checksum calculation
                int sum1 = digits[0] * 3 +
                          digits[1] * 7 +
                          digits[2] * 6 +
                          digits[3] * 1 +
                          digits[4] * 8 +
                          digits[5] * 9 +
                          digits[6] * 4 +
                          digits[7] * 5 +
                          digits[8] * 2;
                int checksum1 = 11 - (sum1 % 11);
                if (checksum1 == 11) checksum1 = 0;

                int sum2 = digits[0] * 5 +
                          digits[1] * 4 +
                          digits[2] * 3 +
                          digits[3] * 2 +
                          digits[4] * 7 +
                          digits[5] * 6 +
                          digits[6] * 5 +
                          digits[7] * 4 +
                          digits[8] * 3 +
                          checksum1 * 2;
                var checksum2 = 11 - (sum2 % 11);
                if (checksum2 == 11) checksum2 = 0;

                // Check if control numbers are correct
                if (checksum1 == digits[9] && checksum2 == digits[10])
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception)
            {
                return false;
            }
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            yield return new NorwegianSsnValidationRule(ErrorMessage);
        }
    }

    public class NorwegianSsnValidationRule : ModelClientValidationRule
    {
        public NorwegianSsnValidationRule(string errorMessage)
        {
            ErrorMessage = errorMessage;
            ValidationType = "norwegianSsn";
        }   
    }

}
