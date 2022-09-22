using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web.Routing;
using Telia.NTW.Core.Entities;

namespace Telia.NTW.Web.Helpers
{
	public static class GeneralHelper
	{
		public static readonly DateTime START_OF_DAY = new DateTime(0);
		public static readonly DateTime END_OF_DAY = START_OF_DAY.AddDays(1).AddTicks(-1);

		public static DateTime getTime(int hour, int minute)
		{
			return START_OF_DAY.AddHours(hour).AddMinutes(minute);
		}

		public static void conditionalAddRole(HashSet<Role> roles, Role role, bool shouldAdd)
		{
			if (shouldAdd)
			{
				roles.Add(role);
			}
		}

		public static RouteValueDictionary GetRouteList(List<string> list, string listName)
		{
			return GetRouteList(list, listName, new RouteValueDictionary());
		}

		public static RouteValueDictionary GetRouteList(List<string> list, string listName, RouteValueDictionary rv)
		{
			for (int i = 0; i < list.Count; i++)
			{
				addSingle(list[i], listName, i, rv);
			}

			return rv;
		}

		public static RouteValueDictionary GetRouteList(string s, string listName)
		{
			return addSingle(s, listName, 0, new RouteValueDictionary());
		}

		private static RouteValueDictionary addSingle(string s, string listName, int i, RouteValueDictionary rv)
		{
			string key = listName + "[" + i + "]";
			rv[key] = s;

			return rv;
		}
	}
}