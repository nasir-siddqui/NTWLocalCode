using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Data.Analys.Extensions
{
    public static class DateTimeExtensions
    {
        public static int GetTotalMonthsFrom(this DateTime dt1, DateTime dt2)
        {
            DateTime earlyDate = (dt1 > dt2) ? dt2.Date : dt1.Date;
            DateTime lateDate = (dt1 > dt2) ? dt1.Date : dt2.Date;

            // Start with 1 month's difference and keep incrementing
            // until we overshoot the late date
            int monthsDiff = 1;
            while (earlyDate.AddMonths(monthsDiff) <= lateDate)
            {
                monthsDiff++;
            }

            return monthsDiff - 1;
        }

        public static int GetTotalDaysFrom(this DateTime dt1, DateTime dt2)
        {
            DateTime earlyDate = (dt1 > dt2) ? dt2.Date : dt1.Date;
            DateTime lateDate = (dt1 > dt2) ? dt1.Date : dt2.Date;

            // Start with 1 day's difference and keep incrementing
            // until we overshoot the late date
            int daysDiff = 1;
            while (earlyDate.AddDays(daysDiff) <= lateDate)
            {
                daysDiff++;
            }

            return daysDiff - 1;
        }
    }
}
