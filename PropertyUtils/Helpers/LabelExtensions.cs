using System;
using System.Linq.Expressions;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using UCDArch.Core.Utils;

namespace Sigma.Utils.Helpers
{
	public static class LabelExtensions
	{
		public static MvcHtmlString LabelForV2<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression)
		{
			return LabelForV2(html, expression, null);
		}

		public static MvcHtmlString LabelForV2<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes)
		{
			return LabelFor(html, expression, htmlAttributes, DisplayOptions.Humanize);
		}

		public static MvcHtmlString LabelFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes, DisplayOptions displayOptions)
		{
			ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, html.ViewData);

			string labelText = metadata.DisplayName ?? metadata.PropertyName;
			if (String.IsNullOrEmpty(labelText))
			{
				return MvcHtmlString.Empty;
			}
			var sb = new StringBuilder();
			if (displayOptions == DisplayOptions.Humanize || displayOptions == DisplayOptions.HumanizeAndColon)
			{
				sb.Append(Inflector.Titleize(labelText));
			}
			else
			{
				sb.Append(labelText);
			}

			if (metadata.IsRequired)
			{
				sb.Append("*");
			}

			if (displayOptions == DisplayOptions.HumanizeAndColon && labelText.Substring(labelText.Length - 1) != ":")
			{
				sb.Append(":");
			}

			return html.LabelFor(expression, sb.ToString(), htmlAttributes);
		}

	}
	public enum DisplayOptions
	{
		Humanize,
		HumanizeAndColon,
		None
	}
}