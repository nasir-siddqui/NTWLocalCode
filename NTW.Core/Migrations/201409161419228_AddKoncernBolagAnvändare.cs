namespace Telia.NTW.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddKoncernBolagAnvändare : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Användare",
                c => new
                    {
                        TeliaId = c.String(nullable: false, maxLength: 128),
                        FullName = c.String(),
                        Email = c.String(),
                        Bolag_OrgNr = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.TeliaId)
                .ForeignKey("dbo.Bolags", t => t.Bolag_OrgNr)
                .Index(t => t.Bolag_OrgNr);
            
            CreateTable(
                "dbo.Bolags",
                c => new
                    {
                        OrgNr = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Koncern_KoncernId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.OrgNr)
                .ForeignKey("dbo.Koncerns", t => t.Koncern_KoncernId)
                .Index(t => t.Koncern_KoncernId);
            
            CreateTable(
                "dbo.Koncerns",
                c => new
                    {
                        KoncernId = c.String(nullable: false, maxLength: 128),
                        Namn = c.String(),
                    })
                .PrimaryKey(t => t.KoncernId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Användare", "Bolag_OrgNr", "dbo.Bolags");
            DropForeignKey("dbo.Bolags", "Koncern_KoncernId", "dbo.Koncerns");
            DropIndex("dbo.Bolags", new[] { "Koncern_KoncernId" });
            DropIndex("dbo.Användare", new[] { "Bolag_OrgNr" });
            DropTable("dbo.Koncerns");
            DropTable("dbo.Bolags");
            DropTable("dbo.Användare");
        }
    }
}
