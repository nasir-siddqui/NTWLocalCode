using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Sigma.Utils.Entities;
using UCDArch.Core.Utils;

namespace Sigma.Utils.Helpers
{
    public static class PropertyHelper
    {
		public static bool HasAttribute(this PropertyInfo property, Type attribute)
		{
			if (property == null || attribute == null)
			{
				return false;
			}
			else
			{
				return Attribute.IsDefined(property, attribute);
			}
		}

		public static bool IsNotMapped(PropertyInfo property)
		{
			return HasAttribute(property, typeof(NotMappedAttribute));
		}

	    public static List<BasicPropertyInfo> GetBasicPropertyInfos(IList objects, Type excludeAttribute = null)
	    {
		    Type listType = objects.GetType();
		    if (listType.IsGenericType)
		    {
			    return GetBasicPropertyInfos(listType.GetGenericArguments()[0], excludeAttribute);
		    }
		    else if (objects.Count > 0)
		    {
			    return GetBasicPropertyInfos(objects[0].GetType(), excludeAttribute);
		    }
		    else
		    {
				return new List<BasicPropertyInfo>();
		    }
	    }

	    public static List<BasicPropertyInfo> GetBasicPropertyInfos(Type type, Type excludeAttribute = null)
	    {
		    PropertyInfo[] properties = type.GetProperties();

			return (from property in properties
					where !property.HasAttribute(excludeAttribute)
					select new BasicPropertyInfo{
						DisplayName = GetDisplayName(property),
						Type = property.PropertyType
						}).ToList();
	    }

	    public static List<object> GetValues(object o, Type excludeAttribute = null)
	    {
		    PropertyInfo[] properties = o.GetType().GetProperties();

			return (from property in properties where !property.HasAttribute(excludeAttribute) select property.GetValue(o)).ToList();
	    }

		public static string GetDisplayName(this PropertyInfo property)
		{
			DisplayAttribute attr = (DisplayAttribute)property.GetCustomAttributes(typeof(DisplayAttribute), true).SingleOrDefault();
			string displayName = (attr != null) ? attr.GetName() : property.Name;

			displayName = Inflector.Titleize(displayName);

			return displayName;
		}

		public static string GetDisplayName<TModel, TProperty>(this TModel model, Expression<Func<TModel, TProperty>> expression)
		{
			Type type = typeof(TModel);
			IEnumerable<string> propertyList;

			//unless it's a root property the expression NodeType will always be Convert
			switch (expression.Body.NodeType)
			{
				case ExpressionType.Convert:
				case ExpressionType.ConvertChecked:
					var ue = expression.Body as UnaryExpression;
					propertyList = (ue != null ? ue.Operand : null).ToString().Split(".".ToCharArray()).Skip(1); //don't use the root property
					break;
				default:
					propertyList = expression.Body.ToString().Split(".".ToCharArray()).Skip(1);
					break;
			}

			//the propert name is what we're after
			string propertyName = propertyList.Last();
			//list of properties - the last property name
			string[] properties = propertyList.Take(propertyList.Count() - 1).ToArray();

			Expression expr = null;
			foreach (string property in properties)
			{
				PropertyInfo propertyInfo = type.GetProperty(property);
				expr = Expression.Property(expr, type.GetProperty(property));
				type = propertyInfo.PropertyType;
			}

			DisplayAttribute attr = (DisplayAttribute)type.GetProperty(propertyName).GetCustomAttributes(typeof(DisplayAttribute), true).SingleOrDefault();

			// Look for [MetadataType] attribute in type hierarchy
			// http://stackoverflow.com/questions/1910532/attribute-isdefined-doesnt-see-attributes-applied-with-metadatatype-class
			if (attr == null)
			{
				MetadataTypeAttribute metadataType = (MetadataTypeAttribute)type.GetCustomAttributes(typeof(MetadataTypeAttribute), true).FirstOrDefault();
				if (metadataType != null)
				{
					var property = metadataType.MetadataClassType.GetProperty(propertyName);
					if (property != null)
					{
						attr = (DisplayAttribute)property.GetCustomAttributes(typeof(DisplayNameAttribute), true).SingleOrDefault();
					}
				}
			}
			//To support translations call attr.GetName() instead of attr.Name
			return (attr != null) ? attr.GetName() : String.Empty;
		}

		public static MemberInfo GetMemberInfo<TObject, TProperty>(Expression<Func<TObject, TProperty>> expression)
		{
			var member = expression.Body as MemberExpression;
			if (member != null)
			{
				return member.Member;
			}
			throw new ArgumentException("Member does not exist.");
		}

		public static string PropertyName<TObject, TProperty>(Expression<Func<TObject, TProperty>> expression)
		{
			return GetMemberInfo(expression).Name;
		}

		public static string PropertyName<TModel, TProperty>(this TModel test, Expression<Func<TModel, TProperty>> property)
		{
			return property.ToString();
		}

		public static IDictionary<string, T> ToDictionary<T>(object data)
		{
			const BindingFlags attr = BindingFlags.Public | BindingFlags.Instance;
			var dict = new Dictionary<string, T>();
			foreach (var property in data.GetType().GetProperties(attr))
			{
				if (property.CanRead)
				{
					dict.Add(property.Name, (T)property.GetValue(data, null));
				}
			}
			return dict;
		}
    }
}
