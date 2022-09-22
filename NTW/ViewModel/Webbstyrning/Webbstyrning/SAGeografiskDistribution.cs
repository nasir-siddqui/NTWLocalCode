using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class SAGeografiskDistribution
    {
	    public string omrade { get; set; }
		public List<SATidDistribution> tidDistributions { get; set; }
    }
}