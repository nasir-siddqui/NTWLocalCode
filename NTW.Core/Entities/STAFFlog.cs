//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class STAFFlog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Area { get; set; }
        public string Description { get; set; }
        public string cmdSQL { get; set; }
        public System.DateTime effectDate { get; set; }
    }
}
