using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.IO;
using System.Web;
using System.Web.Mvc;
using Telia.NTW.Core.Entities;
using Telia.NTW.Web.ViewModel.Analys;
using OfficeOpenXml;
using OfficeOpenXml.Drawing.Chart;
using Telia.NTW.Web.Helpers;

namespace Telia.NTW.Web.ActionResults
{
    public class AnalysExcelActionResult : FileResult
    {
        ExcelPackage pck;
        AnalysViewModel viewModel;
        string userName;
        private const string Tidsdata = "Tidsdata";
        private string filterTyp;

        public AnalysExcelActionResult(AnalysViewModel viewModel, string fileDownloadName, string userName, string filterTyp)
            : base("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        {
            pck = new ExcelPackage();
            this.viewModel = viewModel;
            FileDownloadName = fileDownloadName;
            this.userName = userName;
            this.filterTyp = filterTyp;
        }

        public void CreateSpreadsheet(AnalysViewModel viewModel, string userName, ExcelPackage pck)
        {
            ExcelWorksheet[] sheets = new ExcelWorksheet[] { };
            ExcelWorksheet[] sheetsGraphs = new ExcelWorksheet[] { };

            switch (filterTyp)
            {
                case "Tidsdata":
                    ExcelWorksheet wsMånad = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsMånad.Name = "Månad"; //Setting Sheet's name
                    ExcelWorksheet wsMånadGraf = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsMånadGraf.Name = "Graf-Månad"; //Setting Sheet's name

                    ExcelWorksheet wsDag = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsDag.Name = "Dag"; //Setting Sheet's name
                    ExcelWorksheet wsDagGraf = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsDagGraf.Name = "Graf-Dag"; //Setting Sheet's name

                    ExcelWorksheet wsVeckodag = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsVeckodag.Name = "Veckodag"; //Setting Sheet's name
                    ExcelWorksheet wsVeckodagGraf = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsVeckodagGraf.Name = "Graf-Veckodag"; //Setting Sheet's name

                    ExcelWorksheet wsTimme = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsTimme.Name = "Timme"; //Setting Sheet's name
                    ExcelWorksheet wsTimmeGraf = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsTimmeGraf.Name = "Graf-Timme"; //Setting Sheet's name

                    sheets = new ExcelWorksheet[] { wsMånad, wsDag, wsVeckodag, wsTimme };
                    sheetsGraphs = new ExcelWorksheet[] { wsMånadGraf, wsDagGraf, wsVeckodagGraf, wsTimmeGraf };
                    break;
                case "Ursprungsdata":
                    ExcelWorksheet wsUpptagningsområde = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsUpptagningsområde.Name = "Upptagningsområde"; //Setting Sheet's name

                    ExcelWorksheet wsOrt = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsOrt.Name = "Ort"; //Setting Sheet's name

                    ExcelWorksheet wsNummergrupp = pck.Workbook.Worksheets.Add("Telia Excel-export");
                    wsNummergrupp.Name = "Nummergrupp"; //Setting Sheet's name

                    sheets = new ExcelWorksheet[] { wsUpptagningsområde, wsOrt, wsNummergrupp };
                    break;
            }

            //TODO: Fixa Telia loggan

            int counter = 0;
            foreach (ExcelWorksheet ws in sheets)
            {
                ws.Cells.Style.Font.Size = 11; //Default font size for whole sheet
                ws.Cells.Style.Font.Name = "Calibri"; //Default Font name for whole sheet
                ws.View.ShowGridLines = false;

                ws.Cells["A1"].Value = string.Format("Inloggad som {0} {1} {2}", CookieHelper.GetUserDisplayName(), CookieHelper.GetUserDetails().Bolagsnamn, CookieHelper.GetUserDetails().BolagOrgNr);
                ws.Cells["A1"].Style.Font.Bold = true;
                ws.Cells["A1"].Style.Font.Size = 14; //Default font size for whole sheet
                ws.Cells[1, 1, 1, 4].Merge = true;

                var fill = ws.Cells["A3:H3"].Style.Fill;
                fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);

                if (filterTyp == Tidsdata)
                    ExcelData_Add(ws, viewModel, sheetsGraphs[counter]);
                else
                    ExcelData_Add(ws, viewModel, null);

                ws.Column(1).Width = 20;
                ws.Row(1).Height = 20;
                ws.Column(2).AutoFit();
                ws.Column(3).AutoFit();

                counter++;
            }
        }

        private void ExcelData_Add(ExcelWorksheet ws, AnalysViewModel viewModel, ExcelWorksheet wsGraf)
        {
            ws.Cells["A3"].Value = ws.Name;
            ws.Cells["B3"].Value = "Andel av samtal";
            ws.Cells["C3"].Value = "Antal samtal";
            ws.Cells["D3"].Value = "Kort(%)";
            ws.Cells["E3"].Value = "Mellan(%)";
            ws.Cells["F3"].Value = "Lång(%)";
            ws.Cells["G3"].Value = "Medel(s)";
            ws.Cells["H3"].Value = "Total(s)";
            ws.Cells["A3:H3"].Style.Font.Bold = true;

            int rowNumber = 3;

            var dataList = viewModel.DataViewModel.CubeList.ToList();

            //List<AnalysCube> analysCubeList = new List<AnalysCube>();
            AnalysCube analysCube = null;

            switch (filterTyp)
            {
                case "Tidsdata":
                    analysCube = GetTidsData(ws.Name, dataList);
                    break;
                case "Ursprungsdata":
                    analysCube = GetUrsprungsdata(ws.Name, dataList);
                    break;
            }

            foreach (var cubeRow in analysCube.AggregationList)
            {
                rowNumber++;

                if (rowNumber % 2 != 0)
                {
                    var fillOdds = ws.Cells["A" + rowNumber + ":" + "H" + rowNumber].Style.Fill;
                    fillOdds.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    fillOdds.BackgroundColor.SetColor(System.Drawing.Color.MediumPurple);
                }

                ws.Cells["A" + rowNumber].Value = cubeRow.Värde;
                ws.Cells["B" + rowNumber].Value = cubeRow.SamtalTotalLevelPercentage;
                ws.Cells["C" + rowNumber].Value = cubeRow.SamtalTotal;
                ws.Cells["D" + rowNumber].Value = double.Parse(cubeRow.SamtalKortPercentage.TrimEnd(new[] { '%' }));
                ws.Cells["E" + rowNumber].Value = double.Parse(cubeRow.SamtalMediumPercentage.TrimEnd(new[] { '%' }));
                ws.Cells["F" + rowNumber].Value = double.Parse(cubeRow.SamtalLångPercentage.TrimEnd(new[] { '%' }));
                TimeSpan ts = TimeSpan.Parse(cubeRow.SamtalstidTotal.ToString());
                ws.Cells["G" + rowNumber].Value = Convert.ToInt32(ts.TotalSeconds / cubeRow.SamtalTotal);
                ws.Cells["H" + rowNumber].Value = ts.TotalSeconds;
            }
            if (filterTyp == Tidsdata)
            {
                RitaGrafTotAntalSamtal(wsGraf, ws.Cells[ExcelRange.GetAddress(3, 3, rowNumber, 3)], ws.Cells[ExcelRange.GetAddress(3, 1, rowNumber, 1)]);
                RitaGrafIntervall(wsGraf, ws.Cells[ExcelRange.GetAddress(3, 6, rowNumber, 6)], ws.Cells[ExcelRange.GetAddress(3, 1, rowNumber, 1)], ws.Cells[ExcelRange.GetAddress(3, 5, rowNumber, 5)], ws.Cells[ExcelRange.GetAddress(3, 1, rowNumber, 1)], ws.Cells[ExcelRange.GetAddress(3, 4, rowNumber, 4)], ws.Cells[ExcelRange.GetAddress(3, 1, rowNumber, 1)]);
                RitaGrafMedelsamtalLängd(wsGraf, ws.Cells[ExcelRange.GetAddress(3, 7, rowNumber, 7)], ws.Cells[ExcelRange.GetAddress(3, 1, rowNumber, 1)]);
                RitaGrafTotSamtalLängd(wsGraf, ws.Cells[ExcelRange.GetAddress(3, 8, rowNumber, 8)], ws.Cells[ExcelRange.GetAddress(3, 1, rowNumber, 1)]);
            }

            ws.Cells["A" + (rowNumber + 3)].Value = string.Format("Copyright © {0} TeliaSonera Sverige AB", DateTime.Now.Year);
            ws.Cells["A" + (rowNumber + 3)].Style.Font.Size = 12;
            ws.Cells["A" + (rowNumber + 3)].Style.Font.Bold = true;
            //ws.Cells[(rowNumber + 3), 1, (rowNumber + 3), 2].Merge = true; //Merge columns start and end range
            ws.Cells[(rowNumber + 3), 1, (rowNumber + 3), 3].Merge = true;
        }

        private AnalysCube GetUrsprungsdata(string name, List<AnalysCube> dataList)
        {
            switch (name)
            {
                case "Upptagningsområde":
                    return dataList[0];
                case "Ort":
                    return dataList[1];
                case "Nummergrupp":
                    return dataList[2];
                default:
                    Console.WriteLine("Default case FillUrsprungsdataList");
                    return null;
            }
        }

        private AnalysCube GetTidsData(string name, List<AnalysCube> dataList)
        {
            switch (name)
            {
                case "Månad":
                    return dataList[0];
                case "Dag":
                    return dataList[1];
                case "Veckodag":
                    return dataList[2];
                case "Timme":
                    return dataList[3];
                default:
                    Console.WriteLine("Default case FillTidsdataList");
                    return null;
            }
        }

        private void RitaGrafTotAntalSamtal(ExcelWorksheet ws, ExcelRange r1, ExcelRange r2)
        {
            string name = ws.Name + " - Totalt antal samtal";
            var chart = ws.Drawings.AddChart(name, eChartType.BarStacked) as ExcelBarChart;
            chart.SetPosition(2, 0, 1, 0);
            chart.SetSize(800, 600);
            var serie = chart.Series.Add(r1, r2);
            chart.Legend.Add();
            chart.DataLabel.ShowValue = true;
            chart.Series.Chart.Name = "Samtal";

            serie.Header = "Antal samtal";

            chart.Title.Text = "Totalt antal samtal per månad";
            chart.YAxis.Title.Text = "Antal samtal";

            switch (ws.Name)
            {
                case "Graf-Månad":
                    chart.XAxis.Title.Text = "Månad";
                    break;
                case "Graf-Dag":
                    chart.XAxis.Title.Text = "Dag";
                    chart.SetSize(800, 7200);
                    break;
                case "Graf-Veckodag":
                    chart.XAxis.Title.Text = "Veckodag";
                    break;
                case "Graf-Timme":
                    chart.XAxis.Title.Text = "Timme";
                    break;
                default:
                    chart.XAxis.Title.Text = string.Empty;
                    chart.YAxis.Title.Text = string.Empty;
                    break;
            }
        }

        private void RitaGrafIntervall(ExcelWorksheet ws, ExcelRange r1, ExcelRange r2, ExcelRange r3, ExcelRange r4, ExcelRange r5, ExcelRange r6)
        {
            string name = ws.Name + "- Intervall (%) per månad";
            var chart = ws.Drawings.AddChart(name, eChartType.BarStacked) as ExcelBarChart;
            chart.SetPosition(2, 0, 12, 0);
            chart.SetSize(800, 600);

            var serie1 = chart.Series.Add(r5, r6);
            var serie2 = chart.Series.Add(r3, r4);
            var serie3 = chart.Series.Add(r1, r2);

            serie1.Header = "Kort";
            serie2.Header = "Mellan";
            serie3.Header = "Lång";

            chart.Legend.Add();
            chart.DataLabel.ShowValue = true;
            chart.Series.Chart.Name = "Samtal";

            chart.Title.Text = "Intervall % per månad";
            chart.YAxis.Title.Text = "Intervall %";

            switch (ws.Name)
            {
                case "Graf-Månad":
                    chart.XAxis.Title.Text = "Månad";
                    break;
                case "Graf-Dag":
                    chart.XAxis.Title.Text = "Dag";
                    chart.SetSize(800, 7200);
                    break;
                case "Graf-Veckodag":
                    chart.XAxis.Title.Text = "Veckodag";
                    break;
                case "Graf-Timme":
                    chart.XAxis.Title.Text = "Timme";
                    break;
                default:
                    chart.XAxis.Title.Text = string.Empty;
                    chart.YAxis.Title.Text = string.Empty;
                    break;
            }

        }

        private void RitaGrafMedelsamtalLängd(ExcelWorksheet ws, ExcelRange r1, ExcelRange r2)
        {
            if (ws.Name == "Graf-Dag")
                return;

            string name = ws.Name + " - Medelsamtalslängd";
            var chart = ws.Drawings.AddChart(name, eChartType.BarStacked) as ExcelBarChart;
            chart.SetPosition(34, 0, 1, 0);
            chart.SetSize(800, 600);
            var serie = chart.Series.Add(r1, r2);
            chart.Legend.Add();
            chart.DataLabel.ShowValue = true;
            chart.Series.Chart.Name = "Samtal";

            serie.Header = "Medelsamtalslängd (sek)";

            chart.Title.Text = "Medelsamtalslängd (sek) per månad";
            chart.YAxis.Title.Text = "Medelsamtalslängd (sek)";

            switch (ws.Name)
            {
                case "Graf-Månad":
                    chart.XAxis.Title.Text = "Månad";
                    break;
                case "Graf-Dag":
                    chart.XAxis.Title.Text = "Dag";
                    chart.SetSize(800, 7200);
                    break;
                case "Graf-Veckodag":
                    chart.XAxis.Title.Text = "Veckodag";
                    break;
                case "Graf-Timme":
                    chart.XAxis.Title.Text = "Timme";
                    break;
                default:
                    chart.XAxis.Title.Text = string.Empty;
                    chart.YAxis.Title.Text = string.Empty;
                    break;
            }
        }

        private void RitaGrafTotSamtalLängd(ExcelWorksheet ws, ExcelRange r1, ExcelRange r2)
        {
            if (ws.Name == "Graf-Dag")
                return;

            string name = ws.Name + " - Samtalslängd";
            var chart = ws.Drawings.AddChart(name, eChartType.BarStacked) as ExcelBarChart;
            chart.SetPosition(34, 0, 12, 0);
            chart.SetSize(800, 600);
            var serie = chart.Series.Add(r1, r2);
            chart.Legend.Add();
            chart.DataLabel.ShowValue = true;
            chart.Series.Chart.Name = "Samtal";


            serie.Header = "Total samtalslängd (sek)";

            chart.Title.Text = "Total samtalslängd (sek) per Månad";
            chart.YAxis.Title.Text = "Total samtalslängd (sek)";

            switch (ws.Name)
            {
                case "Graf-Månad":
                    chart.XAxis.Title.Text = "Månad";
                    break;
                case "Graf-Dag":
                    chart.XAxis.Title.Text = "Dag";
                    chart.SetSize(800, 7200);
                    break;
                case "Graf-Veckodag":
                    chart.XAxis.Title.Text = "Veckodag";
                    break;
                case "Graf-Timme":
                    chart.XAxis.Title.Text = "Timme";
                    break;
                default:
                    chart.XAxis.Title.Text = string.Empty;
                    chart.YAxis.Title.Text = string.Empty;
                    break;
            }
        }

        private void ExcelBild_Add(ExcelWorksheet ws, int columnIndex, int rowIndex, string filePath)
        {
            //How to Add a Image using EP Plus
            System.Drawing.Bitmap image = new System.Drawing.Bitmap(filePath);


            OfficeOpenXml.Drawing.ExcelPicture picture = null;
            if (image != null)
            {
                picture = ws.Drawings.AddPicture("pic" + rowIndex.ToString() + columnIndex.ToString(), image);
                picture.From.Column = columnIndex;
                picture.From.Row = rowIndex;
                picture.SetSize(33);
                //picture.SetSize(118, 11);
                picture.SetPosition(3, 20);
            }
        }


        protected override void WriteFile(HttpResponseBase response)
        {
            CreateSpreadsheet(viewModel, userName, pck);
            response.BinaryWrite(pck.GetAsByteArray());
        }

    }
}
