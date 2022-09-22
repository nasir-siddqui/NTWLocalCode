using System;


namespace Telia.NTW.Core.Entities
{
    public class AnalysAggregation
    {
        public string Värde { get; set; }
        public int SamtalTotal { get; set; }
        public int SamtalTotalLevel { get; set; }
        public int SamtalKort { get; set; }
        public int SamtalMedium { get; set; }
        public int SamtalLång { get; set; }
        public TimeSpan SamtalstidTotal { get; set; }
        public TimeSpan SamtalstidMedel { get; set; }

        public string SamtalKortPercentage
        {
            get
            {
                double ratio = ((double)SamtalKort / SamtalTotal);
                return string.Format("{0:0.0%}", ratio);
            }
        }

        public string SamtalMediumPercentage
        {
            get
            {
                double ratio = ((double)SamtalMedium / SamtalTotal);
                return string.Format("{0:0.0%}", ratio);
            }
        }

        public string SamtalLångPercentage
        {
            get
            {
                double ratio = ((double)SamtalLång / SamtalTotal);
                return string.Format("{0:0.0%}", ratio);
            }
        }

        public string SamtalTotalLevelPercentage
        {
            get
            {
                double ratio = ((double)SamtalTotal / SamtalTotalLevel);
                return string.Format("{0:0.0%}", ratio);
            }
        }
    }
}
