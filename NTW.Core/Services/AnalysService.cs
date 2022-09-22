using AutoMapper;
using System;
using System.Collections.Generic;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Enums;
using Telia.NTW.Data.Analys.Cubes;
using Telia.NTW.Data.Analys.Entities;
using Telia.NTW.Data.Analys.Enums;
using Telia.NTW.Data.Analys.Services;
using Telia.NTW.Data.Analys.Filters;


namespace Telia.NTW.Core.Services
{
	public class AnalysService
	{

		public AnalysService(AnalysisServicesService analysisServicesService, SamtalService samtalService)
		{
			this.analysisServicesService = analysisServicesService;
			this.samtalService = samtalService;
		}

		private readonly AnalysisServicesService analysisServicesService;
		private readonly SamtalService samtalService;

		public IEnumerable<AnalysCube> GetCubes(AnalysFilter filterAnalys)
		{

			var filter = Mapper.Map<AnalysFilter, DataFilter>(filterAnalys);
			switch (filterAnalys.GetTyp)
			{
				case AnalysFilterTyp.Tidsdata:
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Månad));
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Dag));
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Veckodag));
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Timme));
					break;
				case AnalysFilterTyp.Ursprungsdata:
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Upptagningsområde));
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Ort));
					yield return Mapper.Map<Cube, AnalysCube>(analysisServicesService.GetCube(filter, AggregationLevel.Nummergrupp));
					break;
				default:
					throw new ApplicationException("Denna filtertyp kan inte översättas.");
			}
		}

        public IEnumerable<AnalysUpptagningsområde> GetUpptagningsområdeList(AnalysFilter analysFilter)
		{
            var dataFilter = Mapper.Map<AnalysFilter, DataFilter>(analysFilter);
            return Mapper.Map<IEnumerable<Upptagningsområde>, IEnumerable<AnalysUpptagningsområde>>(analysisServicesService.GetUpptagningsområdeList(dataFilter));
		}

		public IEnumerable<AnalysSvarsställe> GetSvarsställeList(AnalysFilter analysFilter)
		{
            var dataFilter = Mapper.Map<AnalysFilter, DataFilter>(analysFilter);
            return Mapper.Map<IEnumerable<Svarsställe>, IEnumerable<AnalysSvarsställe>>(analysisServicesService.GetSvarsställeList(dataFilter));
		}

		public IEnumerable<AnalysSamtal> GetRådata(AnalysFilter filterAnalys)
		{
			var filter = Mapper.Map<AnalysFilter, DataFilter>(filterAnalys);
			return Mapper.Map<IEnumerable<Samtal>, IEnumerable<AnalysSamtal>>(samtalService.GetSamtalList(filter));
		}
	}

}
