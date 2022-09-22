namespace Telia.NTW.Core.Staff
{
	public class StaffEnum
	{
		private readonly string value;

		protected StaffEnum(string value)
		{
			this.value = value;
		}

		public override string ToString()
		{
			return value;
		}
	}

    public static class StaffAction
    {
        public const string Create = "N";
        public const string Edit   = "C";
        public const string Delete = "R";
    }

	public static class StaffRedirectRowAction
	{
		public const string Insert = "I";
		public const string Update = "U";
		public const string Delete = "D";
	}

    public static class StaffType
    {
        public const string Alternativ  = "A";
        public const string INAS        = "I";
        public const string Undantag    = "U";
    }

	public static class StaffSelectCopy
	{
		public const string Original	= "O";
		public const string CreateCopy	= "A";
		public const string Copy		= "K";
	}

	public static class StaffSaveManualConnectType
	{
		public const string Ny			= "N";
		public const string Uppdatering	= "U";
	}

	public static class StaffImmediateYN
	{
		public const string Yes	= "Y";
		public const string No	= "N";
	}
}
