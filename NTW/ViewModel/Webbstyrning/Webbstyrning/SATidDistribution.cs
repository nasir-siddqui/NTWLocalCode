using System.Collections.Generic;
using System.Text;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
	public class SATidDistribution
	{
		public WeekdayList days { get; set; }

//		public DateTime startTime { get; set; }
//		public DateTime endTime { get; set; }
		public int startTimeHours { get; set; }
		public int startTimeMinutes { get; set; }
		public int endTimeHours { get; set; }
		public int endTimeMinutes { get; set; }

		public bool otherHours { get; set; }

		public List<SAAnropDistribution> anropDistributions { get; set; }

		public bool editing { get; set; }

		public SATidDistribution()
		{
			days = new WeekdayList();
			editing = false;
		}

		public override string ToString()
		{
			string daysString = getDaysString();
			string timeString = getTimeString();

			StringBuilder result = new StringBuilder();
			result.Append(daysString);
			if (daysString.Length > 0 && timeString.Length > 0)
				result.Append(" ");
			result.Append(timeString);

			return result.ToString();
		}

		public string getTimeString()
		{
			if (otherHours)
			{
				return "Övrig tid";
			}
			else if (startTimeHours == 0 && startTimeMinutes == 0 && endTimeHours == 24)
			{
				return "";
			}
//			else if (startTime.Equals(GeneralHelper.START_OF_DAY) && endTime.Equals(GeneralHelper.END_OF_DAY))
//			{
//				return "";
//			}
			else
			{
//				StringBuilder result = new StringBuilder();
//				result.Append(startTime.ToString("hh:mm"));
//				result.Append("-");
//
//				if (endTime.Equals(GeneralHelper.END_OF_DAY))
//				{
//					result.Append("24:00");
//				}
//				else
//				{
//					result.Append(endTime.ToString("hh:mm"));
//				}
//
//				return result.ToString();

				return twoDigits(startTimeHours) + "." + twoDigits(startTimeMinutes) + "-" + twoDigits(endTimeHours) + "." +
				       twoDigits(endTimeMinutes);
			}
		}

		private string twoDigits(int value)
		{
			if (value < 10)
			{
				return "0" + value;
			}
			else
			{
				return value.ToString();
			}
		}

		public void setDays(string value)
		{
			this.days.SetValue(value);
		}

		public string getDaysString()
		{
			return days.ToString();
		}

//		public bool Monday
//		{
//			get { return days.Monday; }
//			set { days.Monday = value; }
//		}
//
//		public bool Tuesday
//		{
//			get { return days.Tuesday; }
//			set { days.Tuesday = value; }
//		}
//
//		public bool Wednesday
//		{
//			get { return days.Wednesday; }
//			set { days.Wednesday = value; }
//		}
//
//		public bool Thursday
//		{
//			get { return days.Thursday; }
//			set { days.Thursday = value; }
//		}
//
//		public bool Friday
//		{
//			get { return days.Friday; }
//			set { days.Friday = value; }
//		}
//
//		public bool Saturday
//		{
//			get { return days.Saturday; }
//			set { days.Saturday = value; }
//		}
//
//		public bool Sunday
//		{
//			get { return days.Sunday; }
//			set { days.Sunday = value; }
//		}
//
//		public bool Holyday
//		{
//			get { return days.Holyday; }
//			set { days.Holyday = value; }
//		}
	}
}