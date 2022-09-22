using System.Data.Entity;

namespace Telia.NTW.Core.Entities
{
	public class NtwCodeFirstContext : DbContext
	{
		public NtwCodeFirstContext()
            : base("NTW")
		{
		}

//        public NtwCodeFirstContext(bool autoCreateDb)
//            : base("NTW")
//        {
//            if(autoCreateDb)
//                Database.SetInitializer<NtwCodeFirstContext>(new NtwContextInitializer());
//        }

		public DbSet<Meddelande> Meddelande { get; set; }
		public DbSet<QuickHelp> QuickHelp { get; set; }
		public DbSet<QuickHelpEntry> QuickHelpEntry { get; set; }
	}
}