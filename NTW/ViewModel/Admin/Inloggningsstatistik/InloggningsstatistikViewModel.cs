using System.Collections.Generic;

namespace Telia.NTW.Web.ViewModel.Admin.Inloggningsstatistik
{
    public class InloggningsstatistikViewModel : BaseViewModel
    {
        public List<InloggningsstatistikRow> SenasteTjugoMinList { get; set; }
		public List<InloggningsstatistikRow> UnderDagenList { get; set; }
		public List<InloggningsstatistikRow> SenasteMånadenList { get; set; }

		public int LiveSessionsCount { get; set; }
    }
}