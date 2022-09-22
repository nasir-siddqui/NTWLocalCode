using System;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Core.Staff
{
    public static class StaffHelper
    {
        public static string BoolToYn(bool value)
        {
            return value ? "Y" : "N";
        }

        public static bool YnToBool(string yn)
        {
            return (yn.ToUpper().Equals("Y"));
        }

        public static string InkopplingstypToImmediateYn(Inkopplingstyp inkopplingstyp)
        {
	        return (inkopplingstyp == Inkopplingstyp.SåSnartSomMöjligt) ? "Y" : "N";
        }

	    public static string GetTimeStamp()
	    {
			return DateTime.Now.ToString("yyyyMMddHHmmssffff");
	    }

	    public static string CleanSqlParameter(string parameter)
	    {
			parameter = parameter.Replace("'", "''");
            // Hittade inget sätt att escapa % med. Katarina Bäckström ville verkligen ha % i namn för styrningsalternativ.
            // Kom överens med Tobias Johansson, drift, om att ta bort filtreringen av procenttecken (2015-02-17).
			//parameter = parameter.Replace("%", "");

		    return parameter;
	    }
    }
}
