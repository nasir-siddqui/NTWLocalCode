using System.Collections.Generic;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Web.ViewModel.Analys
{
	public class AnalysDataViewModel 
    {
        
        public AnalysDataViewModel(IEnumerable<AnalysCube> cubeList, IEnumerable<AnalysSamtal> samtalList)
        {
            CubeList = cubeList;
            SamtalList = samtalList;
        }

        public IEnumerable<AnalysCube> CubeList { get; set; }
        public IEnumerable<AnalysSamtal> SamtalList { get; set; }

		public bool HideResult { get; set; }
    }
}