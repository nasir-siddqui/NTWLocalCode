using System;
using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Data.Analys.Entities;
using Telia.NTW.Data.Analys.Filters;
using NTW.Data.Analys.Models;


namespace Telia.NTW.Data.Analys.Services
{
    public class SamtalService
    {
        public IEnumerable<Samtal> GetSamtalList(DataFilter filter)
        {
            using (AdvanceWebbEntities context = new AdvanceWebbEntities())
            {
                var svarställeLista = filter.GetSvarsställeList.Select(s => s.GetNamn).ToList();
                var upptagningsområdeLista = filter.GetUpptagningsområdeList.Select(u => u.GetNamn).ToList();
                var frånDatum = filter.GetFrånDatum.Value;
                var tillDatum = filter.GetTillDatum.Value.AddDays(1);

                var samtalLista = (from call in context.vCallData
                                   let DateInSelectedRange =
                                                            (
                                                               frånDatum.Year < 1900 ||
                                                               call.CallDateTime >= frånDatum
                                                            ) &&
                                                            (
                                                                tillDatum.Year < 1900 ||
                                                                call.CallDateTime <= tillDatum
                                                            )
                                   where call.AdvanceExtID==filter.GetAbonnemang.GetId &&
                                   (!svarställeLista.Any() || svarställeLista.Contains(call.AnswerExtension)) &&
                                   (!upptagningsområdeLista.Any() || upptagningsområdeLista.Contains(call.Region)) &&
                                   DateInSelectedRange
                                   orderby call.CallDateTime
                                    select call
                                   ).ToList();

                foreach (var call in samtalLista)
                {
                    var samtal = new Samtal();
                    samtal.Svarsställe = call.AnswerExtension;
                    samtal.Datum = call.CallDateTime.ToShortDateString();
                    samtal.Tidpunkt = TimeSpan.Parse(call.CallTime);
                    samtal.Region = call.Region;
                    samtal.Ort = call.Ort;
                    samtal.Nummergrupp = call.Extension;
                    samtal.Längd = TimeSpan.FromSeconds(call.CallDuration);
                    samtal.Samtalstyp = call.CallType;

                    /*
                    var samtal = new Samtal();
                    samtal.Svarsställe = call.AnswerExtension;
                    samtal.Datum = call.CallDateTime;
                    samtal.Tidpunkt = TimeSpan.Parse(call.CallTime);
                    samtal.Region = call.Region;
                    samtal.Ort = call.Ort;
                    samtal.Nummergrupp = call.Extension;
                    samtal.Längd = TimeSpan.Parse(call.CallTime);
                    samtal.Samtalstyp = call.CallType;
                    */
                    yield return samtal;
                }
                
            }
        }
    }
}
