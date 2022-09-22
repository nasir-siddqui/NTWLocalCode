namespace Telia.NTW.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemovedAnvändareBolagKoncern : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Bolags", "Koncern_KoncernId", "dbo.Koncerns");
            DropForeignKey("dbo.Användare", "Bolag_OrgNr", "dbo.Bolags");
            DropIndex("dbo.Användare", new[] { "Bolag_OrgNr" });
            DropIndex("dbo.Bolags", new[] { "Koncern_KoncernId" });
            DropTable("dbo.Användare");
            DropTable("dbo.Bolags");
            DropTable("dbo.Koncerns");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Koncerns",
                c => new
                    {
                        KoncernId = c.String(nullable: false, maxLength: 128),
                        Namn = c.String(),
                    })
                .PrimaryKey(t => t.KoncernId);
            
            CreateTable(
                "dbo.Bolags",
                c => new
                    {
                        OrgNr = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Koncern_KoncernId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.OrgNr);
            
            CreateTable(
                "dbo.Användare",
                c => new
                    {
                        TeliaId = c.String(nullable: false, maxLength: 128),
                        FullName = c.String(),
                        Email = c.String(),
                        Bolag_OrgNr = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.TeliaId);
            
            CreateIndex("dbo.Bolags", "Koncern_KoncernId");
            CreateIndex("dbo.Användare", "Bolag_OrgNr");
            AddForeignKey("dbo.Användare", "Bolag_OrgNr", "dbo.Bolags", "OrgNr");
            AddForeignKey("dbo.Bolags", "Koncern_KoncernId", "dbo.Koncerns", "KoncernId");
        }
    }
}
