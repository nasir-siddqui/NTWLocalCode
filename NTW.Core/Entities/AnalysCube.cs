using System.Collections.Generic;
using Telia.NTW.Core.Enums;


namespace Telia.NTW.Core.Entities
{
    public class AnalysCube
    {
        public AnalysAggregationLevel AggregationLevel { get; set; }
        public IEnumerable<AnalysAggregation> AggregationList { get; set; }
    }
}
