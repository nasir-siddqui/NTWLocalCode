﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace NTW.Data.Analys.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class AdvanceWebbEntities : DbContext
    {
        public AdvanceWebbEntities()
            : base("name=AdvanceWebbEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AdvanceExtension> AdvanceExtension { get; set; }
        public virtual DbSet<AnswerExtension> AnswerExtension { get; set; }
        public virtual DbSet<AreaCode> AreaCode { get; set; }
        public virtual DbSet<CallType> CallType { get; set; }
        public virtual DbSet<CompanyInfo> CompanyInfo { get; set; }
        public virtual DbSet<Extension> Extension { get; set; }
        public virtual DbSet<FictiveOrgNr> FictiveOrgNr { get; set; }
        public virtual DbSet<GroupInfo> GroupInfo { get; set; }
        public virtual DbSet<Interval> Interval { get; set; }
        public virtual DbSet<Region> Region { get; set; }
        public virtual DbSet<CallData> CallData { get; set; }
        public virtual DbSet<vCallData> vCallData { get; set; }
    }
}
