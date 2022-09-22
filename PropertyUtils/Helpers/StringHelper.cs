using System;
using System.Text.RegularExpressions;
using UCDArch.Core.Utils;

namespace Sigma.Utils.Helpers
{
	public static class StringHelper
	{
		public static string CamelCaseToDisplay(string text)
		{
			return	Inflector.Capitalize(
				Regex.Replace(
					Regex.Replace(
					Regex.Replace(text, "([a-zåäö\\d])([A-ZÅÄÖ])", "$1 $2"),
					"([a-zåäöA-ZÅÄÖ])(\\d)", "$1 $2"),
					"(\\d)([a-zåäöA-ZÅÄÖ])", "$1 $2"));
		}

		public static string EnumToDisplay(Enum enumType)
		{
			return CamelCaseToDisplay(enumType.ToString());
		}
	}
}
