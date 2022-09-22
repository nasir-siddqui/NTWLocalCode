namespace Telia.NTW.Core.Entities
{
	public class UserDetailsCore
	{
		public int UserId { get; set; }
		public string DisplayName { get; set; }
		public string OriginalUsername { get; set; }

        public int CompanyId { get; set; }
        public string Bolagsnamn { get; set; }
		public string BolagOrgNr { get; set; }
        
        public bool BolagLoggedIn { get; set; }
        
        public string LogoutUrl { get; set; }
	}
}