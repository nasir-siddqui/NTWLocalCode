using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Data.Analys.Entities;
using NTW.Data.Analys.Models;

namespace Telia.NTW.Data.Analys.Services
{
	public class AbonnemangService
	{
		public IEnumerable<Abonnemang> GetAbonnemangList(string organisationsnummer)
		{
			using (AdvanceWebbEntities context = new AdvanceWebbEntities())
			{
				var companyId = (from c in context.CompanyInfo
								 where c.OrgNr == organisationsnummer
								 select c.CompanyId).First();

				var extensionList = from e in context.AdvanceExtension
									where e.CompanyId == companyId
									select e;

				foreach (var e in extensionList)
				{
					var id = e.AdvanceExtID;
					var nummer = e.Number;
					var intervallLågt = e.IntervalLow;
					var intervallHögt = e.IntervalHigh;

					yield return new Abonnemang(id, nummer, intervallLågt, intervallHögt);
				}
			}
		}

		public Abonnemang GetAbonnemang(int id)
		{
			using (AdvanceWebbEntities context = new AdvanceWebbEntities())
			{

				var advanceExtension = (from e in context.AdvanceExtension
										where e.AdvanceExtID == id
										select e).FirstOrDefault();

				if (advanceExtension != null)
					return new Abonnemang(advanceExtension.AdvanceExtID, advanceExtension.Number,
											advanceExtension.IntervalLow, advanceExtension.IntervalHigh);
				else
					return null;
			}
		}
	}
}
