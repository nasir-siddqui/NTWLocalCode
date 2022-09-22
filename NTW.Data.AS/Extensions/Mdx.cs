using System;
using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Data.Analys.Entities;
using Telia.NTW.Data.Analys.Enums;
using Telia.NTW.Data.Analys.Filters;


namespace Telia.NTW.Data.Analys.Extensions
{
     public static class Mdx
      {
        public static string GetMdx(this Abonnemang abonnemang)
        {
            return string.Format("[Numbers].[Advance Ext ID].&[{0}]", abonnemang.GetId);
        }

        public static string GetMdx(this Upptagningsområde upptagningsområde)
        {
            return String.Format("[Geographic].[Region Id].[{0}]", upptagningsområde.GetNamn);
        }

        public static string GetMdx(this IEnumerable<Upptagningsområde> upptagningsområdeList)
        {
            if (!upptagningsområdeList.Any())
                return String.Empty;

            return String.Format("{{{0}}}",String.Join(",", upptagningsområdeList.Select(u => u.GetMdx()))); 
        }

        public static string GetMdx(this Svarsställe svarsställe)
        {
            return String.Format("[Numbers].[Answer Ext ID].&[{0}]", svarsställe.GetId);
        }

        public static string GetMdx(this IEnumerable<Svarsställe> svarsställeList)
        {
            if (!svarsställeList.Any())
                return String.Empty;

            return String.Format("{{{0}}}",String.Join(",", svarsställeList.Select(s => s.GetMdx())));
        }

        public static string GetMdxDay(this DateTime date)
        {
            return String.Format("[Time].[Date Name].[{0}]", date.ToShortDateString());
        }

        public static string GetMdxDateInterval(DateTime? frånDatum, DateTime? tillDatum)
        {
            if (!tillDatum.HasValue && !frånDatum.HasValue)
                return String.Empty;

            string mdxFrånDatum = "[Time].[Date Name].FirstChild";
            if (frånDatum.HasValue)
                mdxFrånDatum = frånDatum.Value.GetMdxDay();

            string mdxTillDatum =  DateTime.Now.GetMdxDay();
            if (tillDatum.HasValue)
                mdxTillDatum = tillDatum.Value.GetMdxDay();

            string mdx = String.Format("IIF (COUNT(EXISTS({{{0}:{1}}}))=0,{0},{{{0}:{1}}})", mdxFrånDatum, mdxTillDatum);

            return mdx;
        }

        public static string GetMdxTuple(this DataFilter filter,bool includeSvarsställenAndUpptagningsområden)
        {
            List<string> filterList = new List<string>();
            
            filterList.Add(filter.GetAbonnemang.GetMdx());
            if (filter.GetUpptagningsområdeList.Any() && includeSvarsställenAndUpptagningsområden)
                filterList.Add(filter.GetUpptagningsområdeList.GetMdx());
            if (filter.GetSvarsställeList.Any() && includeSvarsställenAndUpptagningsområden)
                filterList.Add(filter.GetSvarsställeList.GetMdx());
            if (!String.IsNullOrEmpty(GetMdxDateInterval(filter.GetFrånDatum,filter.GetTillDatum)))
                filterList.Add(GetMdxDateInterval(filter.GetFrånDatum, filter.GetTillDatum));

            string result = String.Format("({0})", String.Join(",", filterList));
            return result;
        }

        public static string GetMdx(this AggregationLevel typ, DataFilter filter)
        {
            DateTime frånDatum=DateTime.MinValue;
            DateTime tillDatum = DateTime.Now;
            if (filter.GetFrånDatum.HasValue)
                frånDatum= filter.GetFrånDatum.Value;
            if (filter.GetTillDatum.HasValue)
               tillDatum = filter.GetTillDatum.Value;
                        
            switch (typ)
            {
                    
                case AggregationLevel.Månad:
                    if (frånDatum.Year == tillDatum.Year)
                        return "[Time].[Month Name].Children";
                    else
                        return "[Time].[DateTimeHierarchy].[Month]"; 
                case AggregationLevel.Dag:
                        return "[Time].[DateTimeHierarchy].[Date]";
                case AggregationLevel.Veckodag:
                        return "[Time].[Week Day Name].Children";
                case AggregationLevel.Timme:
                        return "[Time].[Hour Of Day].Children";
                case AggregationLevel.Upptagningsområde:
                    return "[Geographic].[Hierarchy].[Region Id]";
                case AggregationLevel.Ort:
                    return "[Geographic].[Hierarchy].[Area Id]";
                case AggregationLevel.Nummergrupp:
                    return "[Geographic].[Hierarchy].[Extension]";
                default:
                    throw new ApplicationException("Denna aggregeringsnivå kan inte översättas.");
            }
        }
    }
}
