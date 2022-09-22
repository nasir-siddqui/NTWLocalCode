using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Sigma.Utils.Attributes;

namespace Telia.NTW.OMT.ViewModels
{
    public class OMTUserAndCompanyViewModel : OMTUserViewModel
    {
        [Text]
        [RequiredWithMessage]
        [StringLengthWithMessage(70)]
        public string Bolagsnamn { get; set; }

        public int? Koncern { get; set; }

        [Text]
        [StringLengthWithMessage(50)]
        public string Land { get; set; }

		[Text]
		[StringLengthWithMessage(200)]
		public string WebbstyrningNyckel { get; set; }

        [Display(Name = "Analys")]
        public bool CompanyAnalys { get; set; }
        [Display(Name = "Webbstyrning")]
        public bool CompanyWebbstyrning { get; set; }
        [Display(Name = "Multistyrning")]
        public bool CompanyMultistyrning { get; set; }
        [Display(Name = "Leverantörsinformation")]
        public bool CompanyLeverantörsinformation { get; set; }

        public SelectList KoncernSelectList { get; set; }
    }
}