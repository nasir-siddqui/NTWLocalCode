using System;
using System.Collections.Generic;
using System.Text;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
	public class WeekdayList
	{
		private readonly List<WeekdayWithBool> _weekdays = new List<WeekdayWithBool>(7);
		private readonly WeekdayWithBool _holyday = new WeekdayWithBool(Weekday.Holyday);

		public WeekdayList()
		{
			_weekdays.Add(new WeekdayWithBool(Weekday.Monday));
			_weekdays.Add(new WeekdayWithBool(Weekday.Tuesday));
			_weekdays.Add(new WeekdayWithBool(Weekday.Wednesday));
			_weekdays.Add(new WeekdayWithBool(Weekday.Thursday));
			_weekdays.Add(new WeekdayWithBool(Weekday.Friday));
			_weekdays.Add(new WeekdayWithBool(Weekday.Saturday));
			_weekdays.Add(new WeekdayWithBool(Weekday.Sunday));
		}

		public WeekdayList(string value) : this()
		{
			SetValue(value);
		}

		public override string ToString()
		{
			bool alldays = true;
			foreach (WeekdayWithBool weekday in _weekdays)
			{
				if (!weekday.Selected)
				{
					alldays = false;
					break;
				}
			}
			if (alldays)
			{
				return "Alla dagar";
			}

			StringBuilder result = new StringBuilder();

			string startDay;
			for (int i = 0; i < _weekdays.Count; i++)
			{
				if (_weekdays[i].Selected)
				{
					startDay = _weekdays[i].ShortName();
					i++;
					if (i < _weekdays.Count)
					{
						for (int j = 0; ; i++, j++)
						{
							if (i == _weekdays.Count || !_weekdays[i].Selected)
							{
								if (j == 0)
								{
									Append(result, startDay);
								}
								else
								{
									Append(result, startDay + "-" + _weekdays[i - 1].ShortName());
								}
								break;
							}
						}
					}
					else
					{
						Append(result, startDay);
					}
				}
			}

			if (_holyday.Selected)
			{
				Append(result, _holyday.ShortName());
			}

			return result.ToString();
		}

		public void SetValue(string value)
		{
			// clear list
			foreach (WeekdayWithBool weekday in _weekdays)
			{
				weekday.Selected = false;
			}

			// set new values
			string[] groups = value.Split(',');

			foreach (string group in groups)
			{
				string trimmedGroup = group.Trim();

				if (trimmedGroup.Equals(_holyday.ShortName()))
				{
					_holyday.Selected = true;
				}
				else
				{
					int startIndex;
					int	endIndex;

					if (trimmedGroup.Equals("Alla dagar") || trimmedGroup.Equals(""))
					{
						startIndex = 0;
						endIndex = 6;
						_holyday.Selected = true;
					}
					else
					{
						string[] startAndEnd = trimmedGroup.Split('-');

						startIndex = Index(startAndEnd[0]);
						endIndex = startIndex;

						if (startAndEnd.Length > 1)
						{
							endIndex = Index(startAndEnd[1]);
						}
					}

					for (int i = startIndex; i <= endIndex && i < _weekdays.Count; i++)
					{
						_weekdays[i].Selected = true;
					}
				}
			}
		}

		private void Append(StringBuilder sb, string value)
		{
			if (sb.Length > 0)
			{
				sb.Append(", ");
			}

			sb.Append(value);
		}

		private int Index(string shortName)
		{
			for (int i=0; i<_weekdays.Count; i++)
			{
				if (_weekdays[i].ShortName().Equals(shortName))
				{
					return i;
				}
			}

			return -1;
		}

		public bool monday
		{
			get { return _weekdays[0].Selected; }
			set { _weekdays[0].Selected = value; }
		}

		public bool tuesday
		{
			get { return _weekdays[1].Selected; }
			set { _weekdays[1].Selected = value; }
		}

		public bool wednesday
		{
			get { return _weekdays[2].Selected; }
			set { _weekdays[2].Selected = value; }
		}

		public bool thursday
		{
			get { return _weekdays[3].Selected; }
			set { _weekdays[3].Selected = value; }
		}

		public bool friday
		{
			get { return _weekdays[4].Selected; }
			set { _weekdays[4].Selected = value; }
		}

		public bool saturday
		{
			get { return _weekdays[5].Selected; }
			set { _weekdays[5].Selected = value; }
		}

		public bool sunday
		{
			get { return _weekdays[6].Selected; }
			set { _weekdays[6].Selected = value; }
		}

		public bool holyday
		{
			get { return _holyday.Selected; }
			set { _holyday.Selected = value; }
		}
	}

	class WeekdayWithBool
	{
		private readonly Weekday weekday;
		public Boolean Selected { get; set; }

		public WeekdayWithBool(Weekday weekday)
		{
			this.weekday = weekday;
		}

		public string ShortName()
		{
			return weekday.ShortName();
		}
	}

	public class Weekday
	{
		private readonly string shortName;
		private readonly string longName;

		public static readonly Weekday Monday = new Weekday("Mån", "Måndag");
		public static readonly Weekday Tuesday = new Weekday("Tis", "Tisdag");
		public static readonly Weekday Wednesday = new Weekday("Ons", "Onsdag");
		public static readonly Weekday Thursday = new Weekday("Tors", "Torsdag");
		public static readonly Weekday Friday = new Weekday("Fre", "Fredag");
		public static readonly Weekday Saturday = new Weekday("Lör", "Lördag");
		public static readonly Weekday Sunday = new Weekday("Sön", "Söndag");

		public static readonly Weekday Holyday = new Weekday("Helgdag", "Helgdag");

		private Weekday(string shortName, string longName)
		{
			this.shortName = shortName;
			this.longName = longName;
		}

		public string ShortName()
		{
			return shortName;
		}

		public string LongName()
		{
			return longName;
		}
	}
}