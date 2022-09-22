namespace Telia.NTW.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Meddelandes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Type = c.Int(nullable: false),
                        From = c.DateTime(nullable: false),
                        To = c.DateTime(nullable: false),
                        Text = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.QuickHelps",
                c => new
                    {
                        Controller = c.String(nullable: false, maxLength: 128),
                        Action = c.String(nullable: false, maxLength: 128),
                        HTML = c.String(),
                    })
                .PrimaryKey(t => new { t.Controller, t.Action });
            
            CreateTable(
                "dbo.QuickHelpEntries",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Content = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.QuickHelpEntries");
            DropTable("dbo.QuickHelps");
            DropTable("dbo.Meddelandes");
        }
    }
}
