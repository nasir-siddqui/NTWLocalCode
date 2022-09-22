using System.Collections.Generic;
using Telia.NTW.Data.Analys.Aggregations;
using Telia.NTW.Data.Analys.Enums;


namespace Telia.NTW.Data.Analys.Cubes
{
    public class Cube
    {
        public AggregationLevel AggregationLevel { get; set; }
        public IEnumerable<Aggregation> AggregationList { get; set; } 
    }
}
