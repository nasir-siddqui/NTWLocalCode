using System.Linq;
using Telia.NTW.Core.Entities;

namespace Telia.NTW.Core.Helpers
{
	public class RoleHelper
	{
		public const string Administratör = "Administratör";
		public readonly Role AdministratörRole;

        public const string Säljare = "Säljare";
        public readonly Role SäljareRole;

		public const string Analys = "Analys";
		public readonly Role AnalysRole;

		public const string Webbstyrning = "Webbstyrning";
		public readonly Role WebbstyrningRole;

		public const string WebbstyrningWrite = "Webbstyrning_Write";
		public readonly Role WebbstyrningWriteRole;

		public const string WebbstyrningMultistyrning = "Webbstyrning_Multistyrning";
		public readonly Role WebbstyrningMultistyrningRole;

		public const string Leverantörsinformation = "Leverantörsinformation";
        public readonly Role LeverantörsinformationRole;

		// Används inte av behörighetssystemet
		public readonly Role KundRole;
		public readonly Role KoncernrättigheterRole;

		public const string ADMIN_ORG_NR = "999999-9999";

		public RoleHelper(NtwEfModel dbContext)
		{
            KundRole = dbContext.Role.Single(dbRole => dbRole.Id == 1);
            SäljareRole = dbContext.Role.Single(dbRole => dbRole.Id == 2);
			AdministratörRole = dbContext.Role.Single(dbRole => dbRole.Id == 3);
			KoncernrättigheterRole = dbContext.Role.Single(dbRole => dbRole.Id == 4);
			AnalysRole = dbContext.Role.Single(dbRole => dbRole.Id == 5);
			WebbstyrningRole = dbContext.Role.Single(dbRole => dbRole.Id == 6);
			WebbstyrningWriteRole = dbContext.Role.Single(dbRole => dbRole.Id == 7);
			WebbstyrningMultistyrningRole = dbContext.Role.Single(dbRole => dbRole.Id == 8);
            LeverantörsinformationRole = dbContext.Role.Single(dbRole => dbRole.Id == 9);
		}

		public static string GetRoles(params string[] roles)
		{
			return string.Join(", ", roles);
		}

		public static bool isAdminCompany(string orgNr)
		{
			return (orgNr.Equals(ADMIN_ORG_NR));
		}
	}
}
