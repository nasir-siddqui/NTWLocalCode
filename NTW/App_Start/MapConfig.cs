using System;
using System.Collections.Immutable;
using System.Web.Mvc;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Entities.Admin;
using Telia.NTW.Core.Entities.Staff;
using Telia.NTW.Core.Enums;
using Telia.NTW.Core.Staff;
using Telia.NTW.Data.Analys.Aggregations;
using Telia.NTW.Data.Analys.Cubes;
using Telia.NTW.Data.Analys.Entities;
using Telia.NTW.Data.Analys.Filters;
using Telia.NTW.Web.Enums;
using Telia.NTW.Web.ViewModel;
using Telia.NTW.Web.ViewModel.Admin.Hantera;
using Telia.NTW.Web.ViewModel.Admin.Inloggningsstatistik;
using Telia.NTW.Web.ViewModel.Admin.Meddelanden;
using Telia.NTW.Web.ViewModel.Analys;
using Telia.NTW.Web.ViewModel.Admin;
using Telia.NTW.Web.ViewModel.Shared;
using Telia.NTW.Web.ViewModel.Shared.EditorTemplateModels;
using Telia.NTW.Web.ViewModel.Webbstyrning.Multistyrning;
using Telia.NTW.Web.ViewModel.Webbstyrning.Webbstyrning;
using Telia.NTW.Web.ViewModel.Leverantörsinformation;
using Telia.NTW.Web.ViewModel.Admin.Loggar;

namespace Telia.NTW.Web
{
	public class MapConfig
	{

		public static void RegisterMap()
		{
			MapAnalys();

			MapWebbstyrning();

			MapMultistyrning();

			MapLeverantörsinformation();

			MapAdmin();

			MapMeddelanden();

			MapShared();
		}

		private static void MapAnalys()
		{
			Mapper.CreateMap<Aggregation, AnalysAggregation>();
			Mapper.CreateMap<Cube, AnalysCube>();
			Mapper.CreateMap<Svarsställe, AnalysSvarsställe>().ReverseMap();
			Mapper.CreateMap<Upptagningsområde, AnalysUpptagningsområde>().ReverseMap();
			Mapper.CreateMap<Samtal, AnalysSamtal>();
			Mapper.CreateMap<Abonnemang, AnalysAbonnemang>().ReverseMap();

			Mapper.CreateMap<AnalysSvarsställe, CheckboxModel>()
				.ConvertUsing(m => new CheckboxModel
				{
					ChkId = m.GetId,
					ChkNamn = m.GetNamn
				});

			Mapper.CreateMap<AnalysUpptagningsområde, CheckboxModel>()
				.ConvertUsing(m => new CheckboxModel
				{
					ChkId = m.GetId,
					ChkNamn = m.GetNamn
				});

			Mapper.CreateMap<CheckboxModel, AnalysSvarsställe>()
				.ConvertUsing(m => { return new AnalysSvarsställe(m.ChkId, m.ChkNamn); }
				 );
			Mapper.CreateMap<CheckboxModel, AnalysUpptagningsområde>()
				.ConvertUsing(m => { return new AnalysUpptagningsområde(m.ChkId, m.ChkNamn); }
				 );

			Mapper.CreateMap<AnalysFilterViewModel, AnalysFilter>()
				.ConvertUsing(m =>
								   {
									   return new AnalysFilter(
									   m.abonnemang,
									   Mapper.Map<IEnumerable<CheckboxModel>,
									   IEnumerable<AnalysUpptagningsområde>>(m.UpptagningsomradeList),
									   Mapper.Map<IEnumerable<CheckboxModel>,
									   IEnumerable<AnalysSvarsställe>>(m.SvarsstalleList),
									   m.FrånDatum,
									   m.TillDatum,
									   Mapper.Map<FilterTyp, AnalysFilterTyp>(m.FilterTyp)
								   );
								   }
								);


			Mapper.CreateMap<AnalysFilter, DataFilter>();

		}

		private static void MapMeddelanden()
		{
			Mapper.CreateMap<MeddelandeViewModel, Meddelande>().ReverseMap();

			Mapper.CreateMap<MeddelandeViewModel, Meddelandes>().ConvertUsing(m =>
				{
					var meddelandes = new Meddelandes
					{
						Id = m.Id,
						From = m.From,
						To = m.To,
						Text = m.Text,
						Type = (int)m.Type
					};

					var rolesList = new List<RolesForMessage>();
					if (m.AdminActive)
					{
						rolesList.Add(new RolesForMessage
						{
							Meddelandes = meddelandes,
							RoleId = 3
						});
					}
					if (m.AnalysActive)
					{
						rolesList.Add(new RolesForMessage
						{
							Meddelandes = meddelandes,
							RoleId = 5
						});
					}
					if (m.WebbstyrningActive)
					{
						rolesList.Add(new RolesForMessage
						{
							Meddelandes = meddelandes,
							RoleId = 6
						});
					}
					if (m.WebbstyrningMultistyrning)
					{
						rolesList.Add(new RolesForMessage
						{
							Meddelandes = meddelandes,
							RoleId = 8
						});
					}
					if (m.LeverantörsinformationActive)
					{
						rolesList.Add(new RolesForMessage
						{
							Meddelandes = meddelandes,
							RoleId = 9
						});
					}

					meddelandes.RolesForMessage = rolesList;

					return meddelandes;
				});

			Mapper.CreateMap<Meddelandes, MeddelandeViewModel>().ConvertUsing(m =>
			{
				var meddelandes = new MeddelandeViewModel
				{
					Id = m.Id,
					From = m.From,
					To = m.To,
					Text = m.Text,
					Type = (Telia.NTW.Web.Enums.MeddelandeType)Enum.Parse(typeof(Telia.NTW.Web.Enums.MeddelandeType), m.Type.ToString())
				};

				var rolesList = new List<RolesForMessage>();
				if (m.RolesForMessage.Any(w => w.RoleId == 3))
				{
					meddelandes.AdminActive = true;
				}
				if (m.RolesForMessage.Any(w => w.RoleId == 5))
				{
					meddelandes.AnalysActive = true;
				}
				if (m.RolesForMessage.Any(w => w.RoleId == 6))
				{
					meddelandes.WebbstyrningActive = true;
				}
				if (m.RolesForMessage.Any(w => w.RoleId == 8))
				{
					meddelandes.WebbstyrningMultistyrning = true;
				}
				if (m.RolesForMessage.Any(w => w.RoleId == 9))
				{
					meddelandes.LeverantörsinformationActive = true;
				}

				return meddelandes;
			});

			Mapper.CreateMap<MeddelandeContainer, MeddelandenViewModel>()
				.ConvertUsing(m =>
				{
					return new MeddelandenViewModel
					{
						Future = m.Future.Select(s => Mapper.Map<Meddelande, MeddelandeViewModel>(s)),
						Present = m.Present.Select(s => Mapper.Map<Meddelande, MeddelandeViewModel>(s)),
						Past = m.Past.Select(s => Mapper.Map<Meddelande, MeddelandeViewModel>(s))
					};
				}
				);

			Mapper.CreateMap<Core.Entities.MeddelandenActive, MeddelandenModel>()
				.ConvertUsing(m => new MeddelandenModel
				{
					PanicMessages = Mapper.Map<IEnumerable<Meddelandes>, List<MeddelandeViewModel>>(m.Panic),
					InfoMessages = Mapper.Map<IEnumerable<Meddelandes>, List<MeddelandeViewModel>>(m.Info)
				});

			Mapper.CreateMap<QuickHelp, QuickHelpViewModel>();
		}

		private static void MapWebbstyrning()
		{
			Mapper.CreateMap<StaffSelectServiceRow, AbonnemangslistaRow>()
				.AfterMap((src, dest) =>
				{
					dest.Id = src.ServiceId;
					dest.AktivStyrning = src.Namn;
					dest.Aktiverad = src.RealConnect;
				}
				);

			Mapper.CreateMap<StaffStyrningsköRow, StyrningsköRow>()
				.ConvertUsing(m => new StyrningsköRow
				{
					BegärtDatum = m.PreferredConnect,
					Benämning = m.Alternativnamn,
					VerkställtDatum = m.RealConnect,
					AlternativId = m.OrigAltId,
					StyrningsId = m.Id,
					DelAvMultistyrning = StaffHelper.YnToBool(m.MultiYN)
				});

			Mapper.CreateMap<StaffSelectCNoRow, SvarsställeRow>()
				 .ConvertUsing(src => new SvarsställeRow
				 {
					 SvarsställeNr = src.Svarställe,
					 SvarsställeBeskrivning = src.Svarsställe_namn,
					 Styrning = src.Alternativnamn
				 });

			Mapper.CreateMap<StaffHistorikRow, HistorikRow>()
				.ConvertUsing(src => new HistorikRow
				{
					BegärtDatum = src.PreferredConnect,
					Benämning = src.Alternativnamn,
					VerkställtDatum = src.RealConnect
				});

			Mapper.CreateMap<StaffListAlternativesRow, StyrningsalternativRow>()
				.ConvertUsing(src =>
				{
					if (src == null)
					{
						return null;
					}
					else
					{
						var result = new StyrningsalternativRow
						{
							ConnectLinkId = src.Id,
							Löpnr = src.Sekvensnummer,
							Styrning = src.Alternativnamn,
							Status = src.Status
						};

						if (src.Alternativnummer != null)
						{
							result.AltNr = src.Alternativnummer.Trim();
						}

						if (src.TV8 != null)
						{
							result.Index = src.TV8.Trim();
						}

						return result;
					}
				});

			Mapper.CreateMap<StaffSelectAlternatives, StyrningsalternativViewModel>()
				.ConvertUsing(staffSelectAlternatives => new StyrningsalternativViewModel
				{
					lopnummer = staffSelectAlternatives.Sekvensnummer,
					alternativnummer = staffSelectAlternatives.Alternativnummer,
					namn = staffSelectAlternatives.Alternativnamn,
					index = staffSelectAlternatives.TV8,
					status = staffSelectAlternatives.Status
				});

			Mapper.CreateMap<ImmutableList<StaffRedirectRow>, List<SAGeografiskDistribution>>()
				.ConvertUsing(src =>
				{
					List<StaffRedirectRow> staffTree = src.OrderBy(m => m.Radnummer).ToList();
					List<SAGeografiskDistribution> viewTree = new List<SAGeografiskDistribution>();

					for (int i = 0; i < staffTree.Count; i++)
					{
						StaffRedirectRow rowLevel1 = staffTree[i];
						SAGeografiskDistribution geografiskDistribution = Mapper.Map<StaffRedirectRow, SAGeografiskDistribution>(rowLevel1);
						viewTree.Add(geografiskDistribution);

						string område = rowLevel1.Upptagningsområde;
						bool nextIsSameArea = false;
						for (int j = 0; i < staffTree.Count; j++, i++)
						{
							StaffRedirectRow rowLevel2 = staffTree[i];
							string veckodag = rowLevel2.Veckodag;
							string tid = rowLevel2.Tid;

							SATidDistribution tidDistribution = Mapper.Map<StaffRedirectRow, SATidDistribution>(rowLevel2);
							geografiskDistribution.tidDistributions.Add(tidDistribution);

							StaffRedirectRow nextRow;
							if (i + 1 < staffTree.Count)
							{
								nextRow = staffTree[i + 1];
								if (nextRow.Upptagningsområde.Equals(område) || (j + 1) < rowLevel1.Rad_upptagningsomr)
								{
									nextIsSameArea = true;
								}
								else
								{
									nextIsSameArea = false;
								}
							}

							for (; i < staffTree.Count; i++, j++)
							{
								StaffRedirectRow rowLevel3 = staffTree[i];
								SAAnropDistribution anropsfordelning =
									Mapper.Map<StaffRedirectRow, SAAnropDistribution>(rowLevel3);
								tidDistribution.anropDistributions.Add(anropsfordelning);

								if (i + 1 < staffTree.Count)
								{
									nextRow = staffTree[i + 1];
									if (nextRow.Upptagningsområde.Equals(område) || (j + 1) < rowLevel1.Rad_upptagningsomr)
									{
										// Check if next row exists and has the same tidsfördelning
										if (!nextRow.Veckodag.Equals(veckodag) || !nextRow.Tid.Equals(tid))
										{
											break;
										}

										nextIsSameArea = true;
									}
									else
									{
										nextIsSameArea = false;
										break;
									}
								}
							}

							if (!nextIsSameArea)
							{
								break;
							}
						}
					}

					return viewTree;
				});

			Mapper.CreateMap<StaffRedirectRow, SAGeografiskDistribution>()
				.ConvertUsing(src => new SAGeografiskDistribution
				{
					omrade = src.Upptagningsområde,
					tidDistributions = new List<SATidDistribution>()
				});

			Mapper.CreateMap<StaffRedirectRow, SATidDistribution>()
				.ConvertUsing(src =>
				{
					SATidDistribution result = new SATidDistribution();

					result.setDays(src.Veckodag);

					string time = src.Tid;

					if (time.Equals("Övrig tid"))
					{
						result.otherHours = true;
					}
					else
					{
						string[] times = time.Split('-');

						int startTimeHours = 0;
						int startTimeMinutes = 0;
						int endTimeHours = 24;
						int endTimeMinutes = 0;

						if (times.Count() == 2)
						{
							string[] startTime = times[0].Split('.');
							if (startTime.Count() == 2)
							{
								int.TryParse(startTime[0], out startTimeHours);
								int.TryParse(startTime[1], out startTimeMinutes);
							}
							else
							{
								startTime = times[0].Split(':');
								int.TryParse(startTime[0], out startTimeHours);
								int.TryParse(startTime[1], out startTimeMinutes);
							}

							string[] endTime = times[1].Split('.');
							if (endTime.Count() == 2)
							{
								int.TryParse(endTime[0], out endTimeHours);
								int.TryParse(endTime[1], out endTimeMinutes);
							}
							else
							{
								endTime = times[1].Split(':');
								int.TryParse(endTime[0], out endTimeHours);
								int.TryParse(endTime[1], out endTimeMinutes);
							}
						}

						result.startTimeHours = startTimeHours;
						result.startTimeMinutes = startTimeMinutes;
						result.endTimeHours = endTimeHours;
						result.endTimeMinutes = endTimeMinutes;

						//						result.startTime = GeneralHelper.getTime(startTimeHours, startTimeMinutes);
						//						result.endTime = endTimeHours == 24 ? GeneralHelper.END_OF_DAY : GeneralHelper.getTime(endTimeHours, endTimeMinutes);
					}

					result.anropDistributions = new List<SAAnropDistribution>();
					return result;
				});

			Mapper.CreateMap<StaffRedirectRow, SAAnropDistribution>()
				.ConvertUsing(src =>
				{
					SAAnropDistribution result = new SAAnropDistribution();

					if (src.Anropsfördelning != null)
					{
						string anropsfördelningOnlyValue = src.Anropsfördelning.Replace("%", "").Trim();
						byte tempAnropsfördelning;
						if (Byte.TryParse(anropsfördelningOnlyValue, out tempAnropsfördelning))
						{
							result.distribution = tempAnropsfördelning;
						}
						else
						{
							result.distribution = 100;
						}
					}
					else
					{
						result.distribution = 100;
					}

					result.svarsstalle = new SASvarsstalle { svarsstalle = src.Svarsställe };

					return result;
				});

			Mapper.CreateMap<List<SAGeografiskDistribution>, List<StaffRedirectRow>>()
				.ConvertUsing(viewTree =>
				{
					List<StaffRedirectRow> staffTree = new List<StaffRedirectRow>();

					int rowCounter = 1;
					for (int i = 0; i < viewTree.Count; i++)
					{
						var geoDistribution = viewTree[i];
						var geoCounter = 1;

						if (geoDistribution.tidDistributions != null)
						{
							for (int j = 0; j < geoDistribution.tidDistributions.Count; j++)
							{
								var tidDistribution = geoDistribution.tidDistributions[j];

								if (tidDistribution.anropDistributions != null)
								{
									for (int k = 0; k < tidDistribution.anropDistributions.Count; k++, rowCounter++, geoCounter++)
									{
										var anropDistribution = tidDistribution.anropDistributions[k];

										var staffRedirectRow = new StaffRedirectRow
										{
											Radnummer = rowCounter,
											Rad_upptagningsomr = geoCounter,
											Upptagningsområde = geoDistribution.omrade,
											Veckodag = tidDistribution.getDaysString(),
											Tid = tidDistribution.getTimeString(),
											Anropsfördelning = anropDistribution.ToString(),
											Svarsställe = anropDistribution.svarsstalle.svarsstalle,
											Svarsställe_namn = ""
										};

										staffTree.Add(staffRedirectRow);
									}
								}
							}
						}
					}

					return staffTree;
				});

			Mapper.CreateMap<StaffStyrningsköLog, WebbstyrningLogg>()
				.ConvertUsing(staffStyrningsköLog => new WebbstyrningLogg
				{
					Registrerad = staffStyrningsköLog.RealConnect,
					Begärt = staffStyrningsköLog.PreferredConnect,
					Verkställd = staffStyrningsköLog.ActionTime,
					Styrning = staffStyrningsköLog.Alternativnamn,
					Händelse = staffStyrningsköLog.Action,
					Användare = staffStyrningsköLog.ActionUser,
					SmsId = staffStyrningsköLog.Id,
					Info = staffStyrningsköLog.InfoText
				});
		}

		private static void MapMultistyrning()
		{
			Mapper.CreateMap<StaffMultiSelectQueueRow, MultistyrningsköRow>()
				.ConvertUsing(src => new MultistyrningsköRow
				{
					KöVIPMultiConnectedId = src.VIPMultiConnectedId,
					BegärtDatum = src.PreferredConnect,
					Namn = src.Name,
					VerkställtDatum = src.RealConnect
				});

			Mapper.CreateMap<StaffMultiHistoryRow, MultistyrningHistorikRow>()
				.ConvertUsing(src => new MultistyrningHistorikRow
				{
					Multistyrning = src.Name,
					Begärt = src.PreferredConnect,
					Verkställd = src.RealConnect,
					Status = src.Status
				});

			Mapper.CreateMap<StaffMultiAltRow, MultistyrningsalternativRow>()
				.ConvertUsing(src => new MultistyrningsalternativRow
				{
					Namn = src.Name,
					Id = src.VIPMultiConnectedId
				});

			Mapper.CreateMap<List<StaffMultiAltRow>, SelectList>()
				.ConvertUsing(src =>
				{
					List<KeyValuePair<decimal, string>> selectListItems = new List<KeyValuePair<decimal, string>>();
					foreach (StaffMultiAltRow multistyrningsalternativ in src)
					{
						selectListItems.Add(new KeyValuePair<decimal, string>(multistyrningsalternativ.VIPMultiConnectedId, multistyrningsalternativ.Name));
					}
					return new SelectList(selectListItems, "Key", "Value");
				});
		}

		private static void MapLeverantörsinformation()
		{
			Mapper.CreateMap<NioHundraNummerRow, StaffLevNioHundraNr>()
				.ConvertUsing(lev => new StaffLevNioHundraNr
				{
					AccessId = lev.AccessId,
					AccessNo = lev.Nummer,
					EventDescr = lev.Tjänst,
					ContentProviderId = lev.ContentProviderId,
					CompanyId = lev.Organisationsnummer
				});

			Mapper.CreateMap<StaffLevNioHundraNr, NioHundraNummerRow>()
				.ConvertUsing(lev => new NioHundraNummerRow
				{
					AccessId = lev.AccessId,
					Tjänst = lev.EventDescr,
					ContentProviderId = lev.ContentProviderId,
					Organisationsnummer = lev.CompanyId,
                    Nummer = lev.AccessNo
				});

			Mapper.CreateMap<NioHundraNummerRow, StaffNioHundraNrEdit>()
				.ConvertUsing(nummer => new StaffNioHundraNrEdit
				{
					CompanyId = nummer.Organisationsnummer,
					ContentProviderId = nummer.ContentProviderId,
					AccessNo = nummer.Kundtjänstnummer,
                    EventDescr = nummer.Tjänst,
					Name = nummer.Bolagsnamn
				});

			Mapper.CreateMap<StaffNioHundraNrEdit, NioHundraNummerRow>()
				.ConvertUsing(nummer => new NioHundraNummerRow
				{
                    Kundtjänstnummer = nummer.AccessNo,
					Organisationsnummer = nummer.CompanyId,
					ContentProviderId = nummer.ContentProviderId,
					Tjänst = nummer.EventDescr,
					Bolagsnamn = nummer.Name
				});

		}

		private static void MapAdmin()
		{
			Mapper.CreateMap<User, AnvändareRow>()
				.ConvertUsing(src => new AnvändareRow
				{
					UserId = src.UserID,
					AnvändarID = src.LoginName.ToString(),
					Namn = src.Name,
					OrgNr = src.Company.OrgNr,
					Bolagsnamn = src.Company.CompanyName
				});

			Mapper.CreateMap<CompanyInfo, BolagListRow>()
				.ConvertUsing(companyInfo =>
				{
					BolagListRow bolagListRow = new BolagListRow
					{
						CompanyId = companyInfo.CompanyId,
						OrgNr = companyInfo.OrgNr,
						Bolagsnamn = companyInfo.CompanyName
					};

					if (companyInfo.GroupInfo != null)
						bolagListRow.Koncern = companyInfo.GroupInfo.GroupName;

					return bolagListRow;
				});

			Mapper.CreateMap<CompanyInfo, BolagEditViewModel>()
				.ConvertUsing(companyInfo =>
				{
					BolagEditViewModel bolagEditViewModel = new BolagEditViewModel();

					// Simple fields
					bolagEditViewModel.CompanyId = companyInfo.CompanyId;
					bolagEditViewModel.OrgNr = companyInfo.OrgNr;
					bolagEditViewModel.Bolagsnamn = companyInfo.CompanyName;
					bolagEditViewModel.GroupId = companyInfo.GroupId;
					bolagEditViewModel.Land = companyInfo.Country;
					bolagEditViewModel.WebstyrningNyckel = companyInfo.PhoneKey;

					bolagEditViewModel.AnalysContactUserId = companyInfo.UserIdA;
					bolagEditViewModel.WebstyrningContactUserId = companyInfo.UserIdD;
					bolagEditViewModel.LevinfoContactUserId = companyInfo.UserIdCpa;

					bolagEditViewModel.nummerList = Mapper
						.Map<IEnumerable<AdvanceExtension>, List<NummerListRowModel>>(companyInfo.AdvanceExtensions);

					return bolagEditViewModel;
				});

			Mapper.CreateMap<AdvanceExtension, NummerListRowModel>()
				.ConvertUsing(advanceExtension => new NummerListRowModel
				{
					Id = advanceExtension.AdvanceExtID,
					Nummer = advanceExtension.Number,

					// Not all användare connected to an AdvanceExtension are connnected to the same company. Probably bad data...
					ConnectedAnvändareCount = advanceExtension.UserAdvanceNumbers.Count(i => i.User.CompanyId == i.AdvanceExtension.CompanyId)
				});

			Mapper.CreateMap<BolagNummer, NummerEditModel>()
				.ConvertUsing(bolagNummerGetResult =>
				{
					AdvanceExtension advanceExtension = bolagNummerGetResult.nummer;
					var nummerEditModel = new NummerEditModel();

					nummerEditModel.advanceExtId = advanceExtension.AdvanceExtID;
					nummerEditModel.companyId = advanceExtension.CompanyId;
					nummerEditModel.nummer = advanceExtension.Number;
					nummerEditModel.created = advanceExtension.CreationDate;
					nummerEditModel.changed = advanceExtension.ChangedDate;
					nummerEditModel.prenumereras = advanceExtension.Subscribed;
					nummerEditModel.bolagViewLevel = advanceExtension.AnalysisView;
					nummerEditModel.radata = advanceExtension.AnalysisRawdata;

					if (advanceExtension.ChangedByUser != null)
					{
						nummerEditModel.changedBy = advanceExtension.ChangedByUser.Name;
					}

					if (advanceExtension.CompanyInfo != null)
					{
						nummerEditModel.bolagsnamn = advanceExtension.CompanyInfo.CompanyName;
						nummerEditModel.orgNr = advanceExtension.CompanyInfo.OrgNr;
					}

					nummerEditModel.anvandare =
						Mapper.Map<List<NumberUser>, List<NummerUserListRowModel>>(bolagNummerGetResult.användare);

					return nummerEditModel;
				});

			Mapper.CreateMap<NummerEditModel, BolagNummer>()
				.ConvertUsing(nummerEditModel =>
				{
					var bolagNummer = new BolagNummer();
					bolagNummer.nummer = new AdvanceExtension
					{
						CompanyId = nummerEditModel.companyId,
						AdvanceExtID = nummerEditModel.advanceExtId,
						Number = nummerEditModel.nummer,
						CreationDate = nummerEditModel.created,
						ChangedDate = nummerEditModel.changed,
						Subscribed = nummerEditModel.prenumereras,
						AnalysisView = nummerEditModel.bolagViewLevel,
						AnalysisRawdata = nummerEditModel.radata
					};

					bolagNummer.användare =
						Mapper.Map<List<NummerUserListRowModel>, List<NumberUser>>(nummerEditModel.anvandare);

					return bolagNummer;
				});

			Mapper.CreateMap<NumberUser, NummerUserListRowModel>()
				.ConvertUsing(numberUser => new NummerUserListRowModel
				{
					userId = numberUser.UserId,
					advanceExtId = numberUser.AdvanceExtId,
					name = numberUser.Name,
					viewLevel = numberUser.ViewLevel,
					radata = numberUser.RawData,
					active = numberUser.Active
				});

			Mapper.CreateMap<NummerUserListRowModel, NumberUser>()
				.ConvertUsing(nummerUserListRowModel => new NumberUser
				{
					UserId = nummerUserListRowModel.userId,
					AdvanceExtId = nummerUserListRowModel.advanceExtId,
					Name = nummerUserListRowModel.name,
					ViewLevel = nummerUserListRowModel.viewLevel,
					RawData = nummerUserListRowModel.radata,
					Active = nummerUserListRowModel.active
				});

			Mapper.CreateMap<BolagEditViewModel, CompanyInfo>()
				.ConvertUsing(bolagEditViewModel => new CompanyInfo
				{
					CompanyId = bolagEditViewModel.CompanyId.GetValueOrDefault(),
					OrgNr = bolagEditViewModel.OrgNr,
					CompanyName = bolagEditViewModel.Bolagsnamn,
					GroupId = bolagEditViewModel.GroupId,
					Country = bolagEditViewModel.Land,
					PhoneKey = bolagEditViewModel.WebstyrningNyckel,
					UserIdA = bolagEditViewModel.AnalysContactUserId,
					UserIdD = bolagEditViewModel.WebstyrningContactUserId,
					UserIdCpa = bolagEditViewModel.LevinfoContactUserId
				});

			Mapper.CreateMap<User, Contact>()
				.ConvertUsing(user => new Contact
				{
					kontaktperson = user.Name,
					email = user.Email,
					telefon = user.TelNo
				});

			Mapper.CreateMap<ImmutableList<GroupInfo>, SelectList>()
				.ConvertUsing(koncerns => new SelectList(koncerns, "GroupId", "GroupName"));

			Mapper.CreateMap<ImmutableList<CompanyInfo>, SelectList>()
				.ConvertUsing(bolag => new SelectList(bolag, "CompanyId", "OrgNr"));

			Mapper.CreateMap<RedigeraAnvändareViewModel, AdministreraAnvändare>()
				.ReverseMap();

			Mapper.CreateMap<Koncern, GroupInfo>()
				.ConvertUsing(koncern => new GroupInfo
				{
					GroupName = koncern.Koncernnamn,
					GroupId = koncern.GroupId,
					GroupCode = koncern.KoncernId
				});

			Mapper.CreateMap<GroupInfo, Koncern>()
				.ConvertUsing(groupInfo => new Koncern
				{
					GroupId = groupInfo.GroupId,
					Koncernnamn = groupInfo.GroupName,
					KoncernId = groupInfo.GroupCode
				});

			Mapper.CreateMap<InnehållsleverantörRow, StaffInnehållslev>()
			   .ConvertUsing(innehållsLev => new StaffInnehållslev
				{
					ContentProviderId = innehållsLev.Id,
					CompanyId = innehållsLev.Bolagsnamn,
					Name = innehållsLev.Bolagsnamn,
					ContentProviderTfn = innehållsLev.Telefon
				});

			Mapper.CreateMap<StaffInnehållslev, InnehållsleverantörRow>()
				.ConvertUsing(StaffInnehållsLev => new InnehållsleverantörRow
				{
					Id = StaffInnehållsLev.ContentProviderId,
					OrgNr = StaffInnehållsLev.CompanyId,
					Bolagsnamn = StaffInnehållsLev.Name,
					Telefon = StaffInnehållsLev.ContentProviderTfn
				});

            Mapper.CreateMap<InnehållsleverantörViewModel, StaffInnehållslevEditCreate>()
				.ConvertUsing(lev => new StaffInnehållslevEditCreate
			{
				CompanyId = lev.CompanyId,
				Name = lev.Bolagsnamn,
				CoAddress = lev.CoAdress,
				Street = lev.Adress,
				PostalCode = lev.PostNr,
				City = lev.Ort,
				Country = lev.Land,
				MailAddress = lev.Epost,
				URL = lev.Webadress,
				VATNo = lev.VATNR,
				ValidFrom = lev.GiltigFrom,
				UpdateDate = lev.SenasteUppdaterad

			});

			Mapper.CreateMap<StaffInnehållslevEditCreate, InnehållsleverantörViewModel>()
                .ConvertUsing(lev => new InnehållsleverantörViewModel
				{
					CompanyId = lev.CompanyId,
					Bolagsnamn = lev.Name,
					CoAdress = lev.CoAddress,
					Adress = lev.Street,
					PostNr = lev.PostalCode,
					Ort = lev.City,
					Land = lev.Country,
					Epost = lev.MailAddress,
					Webadress = lev.URL,
					VATNR = lev.VATNo,
					GiltigFrom = lev.ValidFrom,
					SenasteUppdaterad = lev.UpdateDate
				});

			Mapper.CreateMap<User, InloggningsstatistikRow>()
				.ConvertUsing(användare => new InloggningsstatistikRow
				{
					Användare = användare.Name,
					Bolag = användare.Company.CompanyName,
					SenastInloggad = användare.LogonDate
				});

			Mapper.CreateMap<EjVerkställdaStyrningar, StaffEjVerkställdaStyrningar>()
				.ReverseMap();

			#region Loggar
			Mapper.CreateMap<AdminloggRow, SupportLog>()
				.ReverseMap();

			Mapper.CreateMap<ServiceloggRow, ServiceLog>()
				.ReverseMap();

			Mapper.CreateMap<StaffloggRow, STAFFlog>()
				.ReverseMap();

			Mapper.CreateMap<SystemloggRow, SystemLog>()
				.ReverseMap();

			Mapper.CreateMap<ProcessloggRow, ProcessLog>()
				.ReverseMap();

			#endregion

		}

		private static void MapShared()
		{
			Mapper.CreateMap<UserDetailsCore, UserDetails>();
		}
	}
}