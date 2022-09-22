using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning
{
    public class WebbstyrningViewModel : BaseViewModel
    {
        public decimal CustomerId { get; set; }
        public List<AbonnemangslistaRow> Abonnemang { get; set; }
//        public List<MultistyrningsköRow> Multistyrningskö { get; set; }
//        public List<MultistyrningHistorikRow> MultistyrningHistorik { get; set; }
        public List<EjVerkställdaStyrningar> EjVerkställdaStyrningar { get; set; }
        public string Bolagsnyckel { get; set; }

	    public WebbstyrningViewModel()
	    {
			Abonnemang = new List<AbonnemangslistaRow>(0);
			EjVerkställdaStyrningar = new List<EjVerkställdaStyrningar>(0);
	    }
    }
}