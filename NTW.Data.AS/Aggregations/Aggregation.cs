using System;

namespace Telia.NTW.Data.Analys.Aggregations
{
    public class Aggregation
    {
        public string Värde { get; set; }
        public int SamtalTotal { get; set; }
        public int SamtalTotalLevel { get; set; }
        public int SamtalKort { get; set; }
        public int SamtalMedium { get; set; }
        public int SamtalLång { get; set; }
        
        public TimeSpan SamtalstidTotal { get; set; }
        public TimeSpan SamtalstidMedel { get; set; }
           
    }
}
