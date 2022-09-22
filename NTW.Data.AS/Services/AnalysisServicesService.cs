using System;
using System.Collections.Generic;
using Microsoft.AnalysisServices.AdomdClient;
using Telia.NTW.Data.Analys.Aggregations;
using Telia.NTW.Data.Analys.Cubes;
using Telia.NTW.Data.Analys.Entities;
using Telia.NTW.Data.Analys.Enums;
using Telia.NTW.Data.Analys.Extensions;
using Telia.NTW.Data.Analys.Filters;


namespace Telia.NTW.Data.Analys.Services
{
    public class AnalysisServicesService
    {
		private static readonly log4net.ILog Log = log4net.LogManager.GetLogger(typeof(AnalysisServicesService));

        public AnalysisServicesService(string connectionString)
        {
            this.connectionString = connectionString;
        }

        private readonly string connectionString;     

        public Cube GetCube(DataFilter filter,AggregationLevel aggregationLevel)
        {
            var cube = new Cube();
            cube.AggregationLevel = aggregationLevel;
            cube.AggregationList = GetAggregationList(filter, aggregationLevel);

            return cube;
        }

        private int GetSamtalTotal(DataFilter filter)
        {
            using (AdomdConnection conn = new AdomdConnection(connectionString))
            {
                string mdx = String.Format(@"
                                           SELECT
                                            [Measures].[Total Calls] 
                                           ON COLUMNS
                                           FROM 
                                            [Advance Webb]  
                                            WHERE {0}
                                        ",
                                            filter.GetMdxTuple(includeSvarsställenAndUpptagningsområden: true)
                                        );
                conn.Open();
				Log.Debug("GetSamtalTotal: " + mdx);
                using (AdomdCommand cmd = new AdomdCommand(mdx, conn))
                {
                    CellSet cs = cmd.ExecuteCellSet();

                    int total;
                    if (!int.TryParse(cs.Cells[0].FormattedValue, out total))
                        total = 0;

                    return total;
                }
            }
        }

        private IEnumerable<Aggregation> GetAggregationList(DataFilter filter,AggregationLevel aggregationLevel)
        {
            int samtalTotalLevel = GetSamtalTotal(filter);
           
            using (AdomdConnection conn = new AdomdConnection(connectionString))
            {
                string mdx = String.Format(@"
                                      WITH 
                                      MEMBER [Measures].[Calls Low] AS Sum([Interv].[Interval Range].&[Low],[Measures].[Total Calls])
                                      MEMBER [Measures].[Calls Medium] AS Sum([Interv].[Interval Range].&[Medium],[Measures].[Total Calls])
                                      MEMBER [Measures].[Calls High] AS Sum([Interv].[Interval Range].&[High],[Measures].[Total Calls])
                                      MEMBER [Measures].[Calls Duration Average] AS  [Measures].[Call Duration]/[Measures].[Total Calls],format_string='#'
                                      SELECT 
                                      {{ 
                                        [Measures].[Total Calls],
                                        [Measures].[Calls Low],
										[Measures].[Calls Medium],
										[Measures].[Calls High],
										[Measures].[Calls Duration Average],
                                        [Measures].[Call Duration] 
                                      }} 
                                      ON COLUMNS,  
                                      {0} 
                                      ON ROWS 
                                      FROM 
                                        [Advance Webb]  
                                      WHERE {1}
                                    ",
                                        aggregationLevel.GetMdx(filter),
                                        filter.GetMdxTuple(includeSvarsställenAndUpptagningsområden: true)
                                    );
                conn.Open();
				Log.Debug("GetAggregationList: " + mdx);
                using (AdomdCommand cmd = new AdomdCommand(mdx, conn))
                {
                    CellSet cs = cmd.ExecuteCellSet();

                    Axis columns = cs.Axes[0];
                    
                    Axis rows = cs.Axes[1];
                    TupleCollection rowTuples = rows.Set.Tuples;

                    foreach (Position rowPos in rows.Positions)
                    {
                        int total=0;
                        int.TryParse(cs.Cells[columns.Positions[0].Ordinal, rowPos.Ordinal].FormattedValue, out total);
                        if (total==0)
                        { continue;
                        }
                        Aggregation aggr = new Aggregation();
                        aggr.Värde = rowTuples[rowPos.Ordinal].Members[0].Caption;
                        aggr.SamtalTotalLevel = samtalTotalLevel;

                        aggr.SamtalTotal = total;

                        int kort=0;
                        int.TryParse(cs.Cells[columns.Positions[1].Ordinal, rowPos.Ordinal].FormattedValue, out kort);
                        aggr.SamtalKort = kort;

                        int medium=0;
                        int.TryParse(cs.Cells[columns.Positions[2].Ordinal, rowPos.Ordinal].FormattedValue, out medium);
                        aggr.SamtalMedium = medium;

                        int lång=0;
                        int.TryParse(cs.Cells[columns.Positions[3].Ordinal, rowPos.Ordinal].FormattedValue, out lång);
                        aggr.SamtalLång = lång;

                        int tidMedel = int.Parse(cs.Cells[columns.Positions[4].Ordinal, rowPos.Ordinal].FormattedValue);
                        aggr.SamtalstidMedel = TimeSpan.FromSeconds((double)tidMedel);

                        int aggTotal = int.Parse(cs.Cells[columns.Positions[5].Ordinal, rowPos.Ordinal].FormattedValue);
                        aggr.SamtalstidTotal = TimeSpan.FromSeconds((double)aggTotal);

                        yield return aggr;
                    }
                }
            }
           
        }

        public IEnumerable<Upptagningsområde> GetUpptagningsområdeList(DataFilter filter)
        {
            using (AdomdConnection conn = new AdomdConnection(connectionString))
            {
                string mdx = String.Format(@"
                                        WITH
                                        MEMBER [Measures].[Id] AS [Geographic].[Region Id].CurrentMember.Properties(""KEY"")
                                        SELECT 
                                            [Measures].[Id] ON COLUMNS,
                                            NONEMPTY(ORDER([Geographic].[Region Id].Children,[Geographic].[Region Id].CurrentMember.Name,ASC),[Measures].[Total Calls]) ON ROWS
                                        FROM 
                                            [Advance Webb]
                                        WHERE {0}
                                        ",
                                         filter.GetMdxTuple(includeSvarsställenAndUpptagningsområden: false)
                                        );
                conn.Open();
				Log.Debug("GetUpptagningsområdeList: " + mdx);
                using (AdomdCommand cmd = new AdomdCommand(mdx, conn))
                {
                    CellSet cs = cmd.ExecuteCellSet();

                    Axis columns = cs.Axes[0];
                   
                    Axis rows = cs.Axes[1];
                    TupleCollection rowTuples = rows.Set.Tuples;

                    foreach (Position rowPos in rows.Positions)
                    {

                        string namn = rowTuples[rowPos.Ordinal].Members[0].Caption;
                        int id = int.Parse(cs.Cells[columns.Positions[0].Ordinal, rowPos.Ordinal].FormattedValue); 

                        yield return new Upptagningsområde(id, namn);
                    }
                }
            }
        }

        public IEnumerable<Svarsställe> GetSvarsställeList(DataFilter filter)
        { 
            using (AdomdConnection conn = new AdomdConnection(connectionString))
            {
                string mdx = String.Format(@"
                                        WITH 
                                        MEMBER [Measures].[Id] AS [Numbers].[Answer Ext ID].CurrentMember.Properties(""KEY"")
                                        SELECT 
                                           [Measures].[Id] ON COLUMNS,
                                           NONEMPTY(ORDER([Numbers].[Answer Ext ID].[Answer Ext ID],[Numbers].[Answer Ext ID].CurrentMember.Name,ASC),[Measures].[Total Calls]) ON ROWS
                                        FROM 
                                            [Advance Webb]
                                         WHERE {0}
                                        ",
                                         filter.GetMdxTuple(includeSvarsställenAndUpptagningsområden: false)
                                        );
                conn.Open();
				Log.Debug("GetSvarsställeList: " + mdx);
                using (AdomdCommand cmd = new AdomdCommand(mdx, conn))
                {
                    CellSet cs = cmd.ExecuteCellSet();

                    Axis columns = cs.Axes[0];
                                        
                    Axis rows = cs.Axes[1];
                    TupleCollection rowTuples = rows.Set.Tuples;

                    foreach (Position rowPos in rows.Positions)
                    {
                        string namn = rowTuples[rowPos.Ordinal].Members[0].Caption;
                        int id = int.Parse(cs.Cells[columns.Positions[0].Ordinal, rowPos.Ordinal].FormattedValue); 

                        yield return new Svarsställe(id, namn);
                    }
                }
            }
        }

    }
}
