using System;
using System.Collections.Generic;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Core.Entities
{
	public class AnalysFilter
	{
        public AnalysFilter(AnalysAbonnemang abonnemang, IEnumerable<AnalysUpptagningsområde> upptagningsområdeList, IEnumerable<AnalysSvarsställe> svarsställeList, DateTime? frånDatum, DateTime? tillDatum, AnalysFilterTyp typ)
        {
            this.abonnemang = abonnemang;
            if (upptagningsområdeList == null)
                this.upptagningsområdeList = new List<AnalysUpptagningsområde>();
            else
                this.upptagningsområdeList = upptagningsområdeList;
            if (svarsställeList == null)
                this.svarsställeList = new List<AnalysSvarsställe>();
            else
                this.svarsställeList = svarsställeList;
            this.frånDatum = frånDatum;
            this.tillDatum = tillDatum;
            this.typ = typ;
        }

        private readonly AnalysAbonnemang abonnemang;
        private readonly IEnumerable<AnalysUpptagningsområde> upptagningsområdeList;
        private readonly IEnumerable<AnalysSvarsställe> svarsställeList;
        private readonly DateTime? frånDatum;
        private readonly DateTime? tillDatum;
        private readonly AnalysFilterTyp typ;

        public AnalysAbonnemang GetAbonnemang
        {
            get
            {
                return abonnemang;
            }
        }

        public IEnumerable<AnalysUpptagningsområde> GetUpptagningsområdeList
        {
            get
            {
                return upptagningsområdeList;
            }
        }

        public IEnumerable<AnalysSvarsställe> GetSvarsställeList
        {
            get
            {
                return svarsställeList;
            }
        }

        public DateTime? GetFrånDatum
        {
            get
            {
                return frånDatum;
            }
        }

        public DateTime? GetTillDatum
        {
            get
            {
                return tillDatum;
            }
        }

        public AnalysFilterTyp GetTyp
        {
            get
            {
                return typ;
            }
        }

	}
}
