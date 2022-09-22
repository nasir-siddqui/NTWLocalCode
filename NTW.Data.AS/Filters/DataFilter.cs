using System;
using System.Collections.Generic;
using Telia.NTW.Data.Analys.Entities;
using Telia.NTW.Data.Analys.Services;

namespace Telia.NTW.Data.Analys.Filters
{
    public class DataFilter
    {
        public DataFilter(Abonnemang abonnemang, IEnumerable<Upptagningsområde> upptagningsområdeList, 
                                IEnumerable<Svarsställe> svarsställeList, DateTime? frånDatum,
                                DateTime? tillDatum)
        {
            this.abonnemang = abonnemang;
            this.upptagningsområdeList = upptagningsområdeList;
            this.svarsställeList = svarsställeList;
            this.frånDatum = frånDatum;
            this.tillDatum = tillDatum;
        }

        private readonly Abonnemang abonnemang;
        private readonly IEnumerable<Upptagningsområde> upptagningsområdeList;
        private readonly IEnumerable<Svarsställe> svarsställeList;
        private readonly DateTime? frånDatum;
        private readonly DateTime? tillDatum;

        public Abonnemang GetAbonnemang
        {
            get
            {
                return abonnemang;
            }
        }

        public IEnumerable<Upptagningsområde> GetUpptagningsområdeList
        {
            get
            {
                return upptagningsområdeList;
            }
        }

        public IEnumerable<Svarsställe> GetSvarsställeList
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
    }
}
