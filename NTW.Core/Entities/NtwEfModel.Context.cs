﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Telia.NTW.Core.Entities
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class NtwEfModel : DbContext
    {
        public NtwEfModel()
            : base("name=NtwEfModel")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<CompanyInfo> CompanyInfo { get; set; }
        public virtual DbSet<GroupInfo> GroupInfo { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<AdvanceExtension> AdvanceExtension { get; set; }
        public virtual DbSet<UserAdvanceNumbers> UserAdvanceNumbers { get; set; }
        public virtual DbSet<FictiveOrgNr> FictiveOrgNr { get; set; }
        public virtual DbSet<Meddelandes> Meddelandes { get; set; }
        public virtual DbSet<RolesForMessage> RolesForMessage { get; set; }
        public virtual DbSet<SystemLog> SystemLog { get; set; }
        public virtual DbSet<ProcessTable> ProcessTable { get; set; }
        public virtual DbSet<ServiceLog> ServiceLog { get; set; }
        public virtual DbSet<STAFFlog> STAFFlog { get; set; }
        public virtual DbSet<SupportLog> SupportLog { get; set; }
        public virtual DbSet<ProcessHeader> ProcessHeader { get; set; }
    }
}
