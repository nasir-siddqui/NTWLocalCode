using System.Web.Security;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Enums;
using Telia.NTW.Core.Services;
using Telia.NTW.Web.Enums;
using Telia.NTW.Web.Selectors;
using Telia.NTW.Web.ViewModel;
using Telia.NTW.Web.ViewModel.Analys;
using Telia.NTW.Web.ActionResults;
using System.Collections;
using Telia.NTW.Web.ViewModel.Shared.EditorTemplateModels;
using Telia.NTW.Web.ViewModel.Shared;

namespace Telia.NTW.Web.Helpers
{
    public class AnalysHelper
    {
        private readonly SecurityService securityService;
        private readonly AnvändareService användarService;
        private readonly AnalysService analysService;

        public AnalysHelper(SecurityService securityService, AnvändareService användarService, AnalysService analysService)
		{
            this.securityService = securityService;
            this.användarService = användarService;
			this.analysService = analysService;
		}

        public CompanyInfo GetBolag(UserDetails userDetails)
        {
           var bolag = användarService.Bolag_Get(userDetails.CompanyId);
           return bolag;
        }

        public IEnumerable<AdvanceExtension> GetAbonnemangList(CompanyInfo bolag, UserDetails userDetails)
        {

            var abonnemangList = (from n in bolag.AdvanceExtensions
                                  where n.Active == "1" 
                                  select n).ToList();

            if (!userDetails.BolagLoggedIn)
            {
                abonnemangList = (from n in abonnemangList
                                   where n.UserAdvanceNumbers.Count(u=>u.UserID==userDetails.UserId)>0
                                  select n
                                  ).ToList();
            }

            return abonnemangList;

        }

        public IEnumerable<SelectListItem> GetAbonnemangSelectList(IEnumerable<AdvanceExtension> abonnemangList)
        {
            var selectList = new SelectList(abonnemangList, "AdvanceExtID", "Number").ToList();
            var selectItem = new SelectListItem { Text = "Välj abonnemang", Value = "" };
            selectList.Insert(0, selectItem);
            return selectList;
        }

        public AdvanceExtension GetAbonnemang(int advanceExtID, IEnumerable<AdvanceExtension> abonnemangList)
        {
            var abonnemang = (from a in abonnemangList
                             where a.AdvanceExtID==advanceExtID
                             select a).SingleOrDefault();
            return abonnemang;
        }

        public AdvanceExtension GetAbonnemang(int advanceExtensionId, UserDetails userDetails)
        {
            var bolag = GetBolag(userDetails);
            var abonnemangList = Enumerable.Empty<AdvanceExtension>();
            if (bolag != null)
            {
                abonnemangList = GetAbonnemangList(bolag,userDetails);
            }
            var abonnemang = GetAbonnemang(advanceExtensionId, abonnemangList);
            return abonnemang;
        }

        public bool hasUrsprungsdataBolag(AdvanceExtension abonnemang)
        {
            bool result = false;
            if (abonnemang.AnalysisView > 1)
            {
                result = true;
            }
            return result;
        }

        public bool hasRådataBolag(AdvanceExtension abonnemang)
        {
            bool result = false;
            if (abonnemang.AnalysisRawdata)
            {
                result = true;
            }
            return result;
        }

        public bool hasUrsprungsdataUser(UserDetails userDetails, AdvanceExtension abonnemang)
        {
            if (userDetails.BolagLoggedIn)
                return true;

            bool result = false;
            var userNummer = (from u in abonnemang.UserAdvanceNumbers
                             where u.UserID== userDetails.UserId
                             select u).SingleOrDefault();

            if (userNummer!=null && userNummer.AnalysisView>1)
            {
                result=true;
            }
            return result;   
        }

        public bool hasRådataUser(UserDetails userDetails, AdvanceExtension abonnemang)
        {
            if (userDetails.BolagLoggedIn)
                return true;

            bool result = false;
            var userNummer = (from u in abonnemang.UserAdvanceNumbers
                              where u.UserID == userDetails.UserId
                             select u).SingleOrDefault();

            if (userNummer!=null && userNummer.AnalysisRawData)
            {
                result=true;
            }
            return result;   
        }

        public void UpdateCheckboxes(AnalysFilterViewModel filterViewModel, IEnumerable<CheckboxModel> svarställenCheckboxList, IEnumerable<CheckboxModel> upptagningsområdeCheckboxList)
        {

            // Markera de svarsställen som tidigare var markerade (om de existerar för given filtrering).
            foreach (CheckboxModel s in svarställenCheckboxList)
            {
                if (filterViewModel.SvarsstalleList.Any(sc => sc.ChkId == s.ChkId))
                    s.ChkSelected = true;
            }


            // Markera de svarsställen som tidigare var markerade (om de existerar för given filtrering).
            foreach (CheckboxModel u in upptagningsområdeCheckboxList)
            {
                if (filterViewModel.UpptagningsomradeList.Any(uc => uc.ChkId == u.ChkId))
                    u.ChkSelected = true;
            }

            // Uppdatera view-modellen för filtret med nya svarsställen och upptagningsområden.
            filterViewModel.SvarsstalleList = svarställenCheckboxList;
            filterViewModel.UpptagningsomradeList = upptagningsområdeCheckboxList;
        }

        public AnalysFilterViewModel populateFilterViewModel(UserDetails userDetails)
        {
            var bolag = GetBolag(userDetails);
            var abonnemangList=Enumerable.Empty<AdvanceExtension>();
            if (bolag!=null)
            {
                abonnemangList = GetAbonnemangList(bolag,userDetails);
            }
            var abonnemangSelectList = GetAbonnemangSelectList(abonnemangList);
           
            return new AnalysFilterViewModel
            {
                SelectedAbonnemangId = -1,
                AbonnemangItems = abonnemangSelectList,
                SvarsstalleList = Enumerable.Empty<CheckboxModel>(),
                UpptagningsomradeList = Enumerable.Empty<CheckboxModel>(),
                FrånDatum = new DateTime(DateTime.Now.Year, 1, 1),
                TillDatum = DateTime.Now,
                SvarsstalleAlla = false,
                UpptagningsomradeAlla = false,
                FilterTyp = FilterTyp.Tidsdata,
                DisabledFilterTypeList = new List<FilterTyp> { FilterTyp.Ursprungsdata,FilterTyp.Rådata }
            };
        }

        public AnalysViewModel GetViewModel(AnalysFilterViewModel filterViewModel, UserDetails userDetails)
        {
            var bolag = GetBolag(userDetails);
            var abonnemangList = Enumerable.Empty<AdvanceExtension>();
            if (bolag != null)
            {
                abonnemangList = GetAbonnemangList(bolag,userDetails);
            }
            var abonnemangSelectList = GetAbonnemangSelectList(abonnemangList);
            filterViewModel.AbonnemangItems = abonnemangSelectList;
            filterViewModel.DisabledFilterTypeList = new List<FilterTyp> { FilterTyp.Ursprungsdata, FilterTyp.Rådata };
            if (filterViewModel.SelectedAbonnemangId!=0)
            {
                var abonnemang = GetAbonnemang(filterViewModel.SelectedAbonnemangId, abonnemangList);
                filterViewModel.abonnemang = new AnalysAbonnemang(abonnemang.AdvanceExtID, abonnemang.Number, abonnemang.IntervalLow, abonnemang.IntervalHigh);
                filterViewModel.DisabledFilterTypeList = GetDisabledFilterTyper(userDetails, abonnemang);
            }
            if (filterViewModel.SvarsstalleList == null)
                filterViewModel.SvarsstalleList = Enumerable.Empty<CheckboxModel>();
            if (filterViewModel.UpptagningsomradeList == null)
                filterViewModel.UpptagningsomradeList = Enumerable.Empty<CheckboxModel>();
            var vm = new AnalysViewModel()
            {
                FilterViewModel = filterViewModel,
                DataViewModel = new AnalysDataViewModel(Enumerable.Empty<AnalysCube>(), Enumerable.Empty<AnalysSamtal>())
            };

            vm.ErrorModel = false;

           
            if(!filterViewModel.FrånDatum.HasValue)
            {
                vm.addErrorMessage("Från datum saknas eller är felaktigt.");
                vm.ErrorModel = true;
            }
            if (!filterViewModel.TillDatum.HasValue)
            {
                vm.addErrorMessage("Till datum saknas eller är felaktigt.");
                vm.ErrorModel = true;
            }
            if (filterViewModel.FrånDatum.HasValue && filterViewModel.TillDatum.HasValue && filterViewModel.FrånDatum.Value > filterViewModel.TillDatum.Value)
            {
                vm.addErrorMessage("Från datum är senare än Till datum.");
                vm.ErrorModel = true;
            }
            if (filterViewModel.SelectedAbonnemangId == 0)
            {
                vm.addErrorMessage("Inget abonnemang är valt.");
                vm.ErrorModel = true;
            }
            if (filterViewModel.SelectedAbonnemangId!=0 && !abonnemangList.Any(a=>a.AdvanceExtID==filterViewModel.SelectedAbonnemangId))
            {
                vm.addErrorMessage("Behörighet till det valda abonnemanget saknas.");
                vm.ErrorModel = true;
            }
            if (filterViewModel.SelectedAbonnemangId != 0 && !filterViewModel.SvarsstalleList.Any(s => s.ChkSelected))
            {
                vm.addErrorMessage("Inget svarsställe är valt.");
                vm.ErrorModel = true;
            }
            if (filterViewModel.SelectedAbonnemangId != 0 && !filterViewModel.UpptagningsomradeList.Any(s => s.ChkSelected))
            {
                vm.addErrorMessage("Inget upptagningsområde är valt.");
                vm.ErrorModel = true;
            }
            if (filterViewModel.SelectedAbonnemangId != 0 && filterViewModel.DisabledFilterTypeList.Contains(filterViewModel.FilterTyp))
            {
                vm.addErrorMessage(string.Format("Behörighet saknas för att anaylsera {0}.",filterViewModel.FilterTyp.ToString()));
                vm.ErrorModel = true;
            }
            if (vm.ErrorModel)
            {
                return vm;
            }

            // Tar bort de icke ifyllda checkboxarna från filter vy-modellen innan modellen mappas till nästa lager.
            filterViewModel.SvarsstalleList = filterViewModel.SvarsstalleList.Where(s => s.ChkSelected).ToList();
            filterViewModel.UpptagningsomradeList = filterViewModel.UpptagningsomradeList.Where(s => s.ChkSelected).ToList();

            var filterAnalys = Mapper.Map<AnalysFilterViewModel, AnalysFilter>(filterViewModel);

            var svarställenCheckboxList = Mapper.Map<IEnumerable<AnalysSvarsställe>,
                                                    IEnumerable<CheckboxModel>>(analysService.GetSvarsställeList(filterAnalys));

            var upptagningsområdeCheckboxList = Mapper.Map<IEnumerable<AnalysUpptagningsområde>,
                                                    IEnumerable<CheckboxModel>>(analysService.GetUpptagningsområdeList(filterAnalys));

            // Fyller i de checkboxar som tidigare var ifyllda om de fortfarande existerar för det valda abonnemanget.
            UpdateCheckboxes(filterViewModel, svarställenCheckboxList, upptagningsområdeCheckboxList);

            var cubeList = Enumerable.Empty<AnalysCube>();
            var samtalList = Enumerable.Empty<AnalysSamtal>();

            if (filterAnalys.GetTyp == AnalysFilterTyp.Rådata)
            {
                samtalList = analysService.GetRådata(filterAnalys);
            }
            else
            {
                cubeList = analysService.GetCubes(filterAnalys);
            }

            var analysViewModel = new AnalysViewModel()
            {
                FilterViewModel = filterViewModel,
                DataViewModel = new AnalysDataViewModel(cubeList, samtalList)
            };

            return analysViewModel;
        }

        public IEnumerable<FilterTyp> GetDisabledFilterTyper(UserDetails userDetails, AdvanceExtension abonnemang)
        {
            if (abonnemang == null)
            {
                return new List<FilterTyp> { FilterTyp.Ursprungsdata, FilterTyp.Rådata };
            }
            
            var disabledFilterList = new List<FilterTyp>();
            if (!hasUrsprungsdataBolag(abonnemang) || !hasUrsprungsdataUser(userDetails, abonnemang))
            {
                disabledFilterList.Add(FilterTyp.Ursprungsdata);
            }
            if (!hasRådataBolag(abonnemang) || !hasRådataUser(userDetails, abonnemang))
            {
                disabledFilterList.Add(FilterTyp.Rådata);
            }
            return disabledFilterList;
        }

       
        public IEnumerable<CheckboxModel> GetSvarsställeList(int abonnemangId,DateTime? frånDatum, DateTime? tillDatum, UserDetails userDetails)
        {
            var bolag = GetBolag(userDetails);
            var abonnemangList = Enumerable.Empty<AdvanceExtension>();
            if (bolag != null)
            {
                abonnemangList = GetAbonnemangList(bolag,userDetails);
            }
            var abonnemang = GetAbonnemang(abonnemangId, abonnemangList);
            var analysAbonnemang= new AnalysAbonnemang(abonnemang.AdvanceExtID, abonnemang.Number, abonnemang.IntervalLow, abonnemang.IntervalHigh);
            var analysFilter = new AnalysFilter(analysAbonnemang, Enumerable.Empty<AnalysUpptagningsområde>(), Enumerable.Empty<AnalysSvarsställe>(),
                frånDatum, tillDatum, AnalysFilterTyp.Tidsdata);
                    
            var svarställenCheckboxList = Mapper.Map<IEnumerable<AnalysSvarsställe>,
                                                    IEnumerable<CheckboxModel>>(analysService.GetSvarsställeList(analysFilter));
            return svarställenCheckboxList.OrderBy(s=>s.ChkNamn);
        }

        public IEnumerable<CheckboxModel> GetUpptagningsområdeList(int abonnemangId,DateTime? frånDatum, DateTime? tillDatum, UserDetails userDetails)
        {
            var bolag = GetBolag(userDetails);
            var abonnemangList = Enumerable.Empty<AdvanceExtension>();
            if (bolag != null)
            {
                abonnemangList = GetAbonnemangList(bolag,userDetails);
            }
            var abonnemang = GetAbonnemang(abonnemangId, abonnemangList);
            var analysAbonnemang = new AnalysAbonnemang(abonnemang.AdvanceExtID, abonnemang.Number, abonnemang.IntervalLow, abonnemang.IntervalHigh);
            var analysFilter = new AnalysFilter(analysAbonnemang, Enumerable.Empty<AnalysUpptagningsområde>(), Enumerable.Empty<AnalysSvarsställe>(),
                frånDatum, tillDatum, AnalysFilterTyp.Tidsdata);
            var upptagningsområdeCheckboxList = Mapper.Map<IEnumerable<AnalysUpptagningsområde>,
                                                    IEnumerable<CheckboxModel>>(analysService.GetUpptagningsområdeList(analysFilter));
            return upptagningsområdeCheckboxList.OrderBy(u=>u.ChkNamn);
        }

    }
}