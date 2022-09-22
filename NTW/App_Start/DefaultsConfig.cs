using System.Globalization;
using System.Threading;

namespace Telia.NTW.Web
{
    public class DefaultsConfig
    {
        public static void SetDefaultDateTimeFormat()
        {
            // Default DateTime format is ShortDatePattern + ' ' + LongTimePattern.
            // A workaround to set default DateTime format is therefore to set what ShortDatePattern and LongTimePattern is.
//            CultureInfo culture = (CultureInfo)CultureInfo.CurrentCulture.Clone();
			CultureInfo culture = new CultureInfo("sv-SE")
			{
				DateTimeFormat = {LongTimePattern = "HH:mm"}
			};
	        Thread.CurrentThread.CurrentCulture = culture;
        }
    }
}