using System.Data.Entity;

namespace Telia.NTW.Core.Entities
{
    class NtwContextInitializer : DropCreateDatabaseAlways<NtwCodeFirstContext>
    {
        protected override void Seed(NtwCodeFirstContext context)
        {
            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Analys",
                Action = "Index",
                HTML = @"
						<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelp-hidden"">
							<h3 class=""h3"">Fr&aring;gor och svar</h3>
									<ul class=""tsQuickHelp-list"">
												<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""157e91c2-c332-4012-bd3d-88bab82b40f0"" data-list-id=""0"">
													<span class=""tsSecondaryLink"">Vad är analys?</span>
												</li>
												<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""24271c7c-da9f-4f8a-afcb-ab816fa509be"" data-list-id=""0"">
													<span class=""tsSecondaryLink"">Kombinerad sökning</span>
												</li>
												<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""45d3f364-c0f6-4911-adcc-287c3fa0819b"" data-list-id=""0"">
													<span class=""tsSecondaryLink"">Exportering</span>
												</li>
									</ul>
						</div>
						<div class=""tsColumn-list-4"" data-toggle-target=""tsQuickHelp-hidden"">
							<h3 class=""h3"">Popul&auml;ra guider</h3>
									<ul class=""tsQuickHelp-list"">
												<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""77f2e098-2835-452a-81e0-00b8ea6c9651"" data-list-id=""0"">
													<span class=""tsSecondaryLink"">Grundläggande analys</span>
												</li>
												<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""14277399-6205-41d7-bdfc-ea0d0e78086c"" data-list-id=""0"">
													<span class=""tsSecondaryLink"">Avancerad analys</span>
												</li>
									</ul>
						</div>
					<div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
						<div class=""tscInfo-bar"">
							<ul class=""tscInfo-list"">
									<li class=""tscInfo-listItem"">
										<i class=""tsIcon-Telephone""></i>
										<p>90 400</p>
									</li>
							</ul>
								<p><strong>Nummerj&auml;nst</strong> X-XX</p>
						</div>
				</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "157e91c2-c332-4012-bd3d-88bab82b40f0",
                Content = "{ \"question\": \"Vad är analys?\", \"answer\": \"<p>Analys ger dig möjlighet att överblicka samtalen till dina nummer med avseende på tid och ursprung.</p> <p>Det finns tre typer av analys: <ul><li>Tidsdata - ger statistik över tidpunkter för när dina kunder ringt</li><li>Ursprungsdata - visar en totalbild över varifrån dina kunder ringer</li><li>Rådata - ger dig underlag för egen bearbetning</li></ul></p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "24271c7c-da9f-4f8a-afcb-ab816fa509be",
                Content = "{ \"question\": \"Kombinerad sök\", \"answer\": \"<p>En kombinerad sökning innebär att du har möjlighet att söka på de olika alternativ som finns tillgängliga. Det är dock inte obligatoriskt om inget annat anges. Du kan exempelvis välja ett abonnemang som finns tillgängliga, välja ett till och från datum och slutligen välja ett upptagningsområde.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "45d3f364-c0f6-4911-adcc-287c3fa0819b",
                Content = "{ \"question\": \"Exportera\", \"answer\": \"<p>u har möjlighet att exportera viss information i Analys genom att söka på en viss data och sedan använda dig utav exportknapparna. Det finns två typer av exporter:</p><p><ol type='1'><li>Rådata – exportera allt innehåll som rådata</li><li>Exportera till Excel – denna del exporterar en Excelfil med data och grafer för månad, dag, veckodag och timme</li></ol></p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "77f2e098-2835-452a-81e0-00b8ea6c9651",
                Content = "{ \"question\": \"Grundläggande analys\", \"answer\": \"<p>I analysformuläret finns följande fält tillgängliga för inmatning av data:</p> <p>Abonnemang – i denna automatisk kompletterande dropdownlista kan du antigen knappa in ett telefonnummer och utifrån det som du knappar in kommer matchade resultat att visas i listan. Du har även möjlighet att välja ett abonnemang i listan. <br><br><strong>OBS! När du har valt ett abonnemang så kommer du att få fram svarsställen som du kan välja.</strong></p> <p>Datum – det finns två datumväljare, från och till. Här har du möjligheten att sortera data på de datum du vill visa. Från datumet måsta vara tidigare än senare datumet.</p> <p>Svarsställe – här kan du via checkboxar filtrera ut data. Du kan välja svarsställen som det valda abonnemanget har och även upptagningsområden. Du kan välja flera alternativ.</p> <p>Slutligen kan du välja om du vill visa:</p> <ol><li>Tidsdata</li><li>Ursprungsdata - Ursprungsdata ger dig noggrann statistik över det geografiska ursprunget på alla samtal till dina nummer. Samtalen härleds till olika nummergrupper där alla samtal från telefonnummer med samma fem första siffror inklusive riktnumret har samlats. För varje geografiskt område summeras följande data: antal samtal, total samtalslängd, medelsamtalslängd samt samtalen procentuellt uppdelat på tre tidsintervall som du själv kan justera. Nummergrupperna kan brytas ner i enskilda samtal och då visas samtalslängd, exakt tidpunkt och typ av samtal för varje samtal</li><li>Rådata - Med hjälp av funktionen Rådata kan du på ett enkelt sätt exportera statistikunderlaget till annan källa. Du väljer om du vill se resultatet som Kalkylark eller Text. Väljer du att exportera som Kalkylark får du se resultatet uppdelat i kolumner, färger m.m. Väljer du att exportera som Text får du se resultatet i form av en semikolonseparerad text.</li></ol><p>Du behöver ha rätt behörighet för att kunna visa de olika delarna. För att läsa om behörigheter se ”Avancerad analys”.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "14277399-6205-41d7-bdfc-ea0d0e78086c",
                Content = "{ \"question\": \"Avancerad analys\", \"answer\": \"<p>Beroende av din behörighet finns det skillnader för vad du får och inte får se i Telia Analys. I Telia Analys finns behörigheterna Tidsdata, Ursprungsdata och Rådata tillgängliga.</p> <p>Man kan på ett enkelt sätt exportera över den visade informationen till en text-fil eller Excels kalkylark för egen bearbetning. Exporterar man till Excel kommer uppgifterna med även i form av grafer på egna flikar i kalkylarket. På det sättet kan man enkelt föra över dessa till tex. OH-bilder. Denna funktion är tillgänglig på samtliga nivåer.</p> <p><strong>Tidsdata</strong> - Om du endast innehar behörigheten Tidsdata finns det vissa begränsningar för dig. Du får då endast göra ditt urval på kategorierna 'Månad' och 'Upptagningsområde'. Vidare kan du bryta ned ditt urval till 'månad' och 'dag'. Lagringstid för denna behörighetsnivå är 3 månader tillbaka i tiden.</p><p><strong>Ursprungsdata</strong> - Om du innehar behörigheten Ursprungsdata gör du först ett urval på kategorierna 'Svarsställe', 'Månad' och 'Från upptagningsområde'. Sedan kan du bryta ned ditt urval geografiskt (baserat på den uppringandes riktnummer) 'Från upptagningsområde', 'Riktnummer', 'Nummergrupp' och 'Datum'. Lagringstid för denna behörighetsnivå är 15 månader tillbaka i tiden.</p><p><strong>Rådata</strong> - Rådata är en rådatafil med uppgifter om inkommande samtal som du själv bearbetar i Excel eller liknande. Vid behörighet Rådata får man automatiskt tillgång till Tidsdata.  Lagringstid för denna behörighetsnivå är 15 månader tillbaka i tiden.</p><p><strong>Koncern</strong> - Innehar du koncernrättighet har du även möjlighet att göra analys för andra bolag i koncernen.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Webstyrning",
                Action = "Index",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Webbstyrning</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""246c0377-4f3d-4610-8611-fce520263dba"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Vad är en Webbstyrning</span>
							</li>
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""9757aac7-b05e-4801-8c15-f2733ddb38df"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Vad är multistyrning</span>
							</li>
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""d655f74d-a88a-4ad1-a25c-0f366d61df78"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">När aktiveras styrningskön</span>
                            </li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om Webbstyrning</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "246c0377-4f3d-4610-8611-fce520263dba",
                Content = "{ \"question\": \"Vad är en webbstyrning\", \"answer\": \"<p>Huvudmodulen Direktstyrning, som vi nu kallar Webbstyrning, är där kundanvändaren jobbar. Det är här funktionalitet för att göra omstyrningar mellan olika dirigeringsalternativ finns. Det finns även möjlighet för kunden att se hur ett styrningsalternativ är uppbyggt i en grafisk trädstruktur.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "9757aac7-b05e-4801-8c15-f2733ddb38df",
                Content = "{ \"question\": \"Vad är en multistyrning\", \"answer\": \"<p>Här har man möjlighet att lägga upp, editera samt ta bort styrningsalternativ. Befintliga styrningsalternativ visas i en lista.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "d655f74d-a88a-4ad1-a25c-0f366d61df78",
                Content = "{ \"question\": \"När aktiveras styrningskön\", \"answer\": \"<p>Visar kölistan för lagda Multistyrningar. Härifrån kan användaren lägga upp nya, radera och förändra sina lagda köposter. En multistyrningskö aktiveras på det datum och klockslag som är satt för kön.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Webstyrning",
                Action = "Multistyrning",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Multistyrning</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""eea30116-09b3-40f4-bf1e-48c7f6790966"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Schemalägg multistyrning</span>
							</li>
                            <li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""fdd7b619-2cde-4c78-8183-13b54731a5b0"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Nytt multistyrningsalternativ</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om multistyrningar</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "eea30116-09b3-40f4-bf1e-48c7f6790966",
                Content = "{ \"question\": \"Schemalägg multistyrning\", \"answer\": \"<p>Här kan du schemalägga dina multistyrningsalternativ. Detaljerad information hittar du under sidan där du schemalägger en multistyrning.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "fdd7b619-2cde-4c78-8183-13b54731a5b0",
                Content = "{ \"question\": \"Nytt multistyrningsalternativ\", \"answer\": \"<p>Här skapar du ett nytt multistyrningsalternativ för ett/flera valda abonnemang. Du kan alltså styra flera abonnemang samtidigt här. Detaljerad information hittar du under sidan där du skapar en ny multistyrning.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Webstyrning",
                Action = "Multistyrningskö_Create",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Multistyrning</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""a4c7f7f2-0e41-4d62-a06a-e190c0043a36"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Schemalägg multistyrning</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om multistyrningar</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "a4c7f7f2-0e41-4d62-a06a-e190c0043a36",
                Content = "{ \"question\": \"Schemalägg multistyrning\", \"answer\": \"<p>För att schemalägga ett multistyrningsalternativ behöver du först välja ett multistyrningsalternativ i dropdown listan. I dropdown listan listas alla multistyrningar som har skapats. Sedan måste du välja en alternativknapp. Du kan antigen välja:</p><ol><li>Begärt datum – mata in datum och välj en tidpunkt</li><li>Så snart som möjligt – systemet kommer automatiskt att schemalägga multistyrningen så snart som möjligt</li></ol><p>När du är färdig trycker du på ”Skapa” för att skapa schemaläggningen.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Webstyrning",
                Action = "Multistyrning_Alternativ_Create",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Multistyrning</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
                            <li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""e5eae396-1b1c-46a0-9b22-024196388bfe"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Skapa ett multistyrningsalternativ</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om multistyrningar</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "e5eae396-1b1c-46a0-9b22-024196388bfe",
                Content = "{ \"question\": \"Hur du skapar ett multistyrningsalternativ\", \"answer\": \"<p>När du skapar ett nytt multistyrningsalternativ så behöver du:</p><ol><li>Ange ett namn på multistyrningen</li><li>Koppla ett befintligt abonnemang från dropdownlistan</li><li>Sedan trycka på ”Lägg till” för att spara</li></ol><p>Det som nu sker är att en rad läggs till med det valda abonnemanget och även ett styrningslaternativ för det valda abonnemanget. Du kan nu byta styrningsalternativ för det valda abonnemanget eller behålla det befintliga.</p><p>Du kan lägga till fler abonnemang eller ta bort ett tillagt abonnemang genom att trycka på ”X” till höger om styrningsalternativet. När du är färdig trycker du på ”Spara”. Om du vill avbryta utan att spara trycker du på ”Avbryt”.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Leverantörsinformation",
                Action = "Index",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Leverantörsinformation</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""f0e230de-35c7-4d25-9681-9149dd14ad3e"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Vad är leverantörsinformation</span>
							</li>
						</ul>
					</div>
					<div class=""tsColumn-list-4"" data-toggle-target=""tsQuickHelp-hidden"">
						<h3 class=""h3"">Guider</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""f5893594-c11d-41e1-ad4c-e0be5798fd34"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Telia 900 nummer</span>
							</li>
                            <li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""3a19e3c8-cca1-4302-afd7-91c3ea649f0b"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Innehållsleverantörer</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 200</p>
							</li>
						</ul>
						<p><strong>För frågor om Leverantörsinformation</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "f0e230de-35c7-4d25-9681-9149dd14ad3e",
                Content = "{ \"question\": \"Vad är leverantörsinformation\", \"answer\": \"<p>Här registreras information som ses på slutkunders faktura då de har ringt betalnummer d.v.s. nummer som börjar på 0900. En innehållsleverantör måste först registreras innan du kan gå vidare till Telia 900 nummer.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "f5893594-c11d-41e1-ad4c-e0be5798fd34",
                Content = "{ \"question\": \"Telia 900 nummer\", \"answer\": \"<p>Telia 900 nummer är en tjänst för att ta betalt för informations- och underhållningstjänster per telefon (även mobil). Detaljerad information hittar du under sidan där du skapar ett Telia 900 nummer.</p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "3a19e3c8-cca1-4302-afd7-91c3ea649f0b",
                Content = "{ \"question\": \"Innehållsleverantörer\", \"answer\": \"<p>En innehållsleverantör är en kund som skapas för att kunna registrera betalnummertjänster på. Detaljerad information hittar du under sidan där du skapar en innehållsleverantör.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Leverantörsinformation",
                Action = "Innehållsleverantör_Create",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Leverantörsinformation</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""521f6468-8fbc-4a5a-b493-bfc3547148c9"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Skapa innehållsleverantör</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 200</p>
							</li>
						</ul>
						<p><strong>För frågor om Leverantörsinformation</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "521f6468-8fbc-4a5a-b493-bfc3547148c9",
                Content = "{ \"question\": \"Skapa innehållsleverantör\", \"answer\": \"<p>För att kunna registrera betalnummer måste du först skapa en innehållsleverantör. För att skapa en innehållsleverantör behöver du fylla i formuläret nedan. Fält markerade med en asterisk (*) är obligatoriska. Om du vill registrera ett utländskt företag behöver du bocka för checkboxen för utländskt företag och då kommer det svenska fältet för organisationsnummer automatiskt att gråmarkeras. När ett utländskt företag registreras kommer ett fiktivt organisationsnummer att skapas och visas i tabellen.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Admin",
                Action = "Hantera",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Admin</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""ebf91cd9-2cec-40f5-9f92-c927aa54086b"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Hantera</span>
							</li>
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""4727112e-7198-4281-8b6d-f3539e682cac"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Roller</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om Admin</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "ebf91cd9-2cec-40f5-9f92-c927aa54086b",
                Content = "{ \"question\": \"Hantera\", \"answer\": \"<p>Under <strong>Koncern</strong> lägger Du upp de koncerner som har helt eller delvis tillgång till Telia Nummertjänster.</p><p>Under Bolag lägger Du upp de <strong>bolag</strong> som har tillgång till Telia Nummertjänster. För att Du skall kunna koppla bolaget mot en Koncern, måste koncernen vara upplagd. Detta gör du under <strong>Koncerner</strong>. För att sedan sätta en användare som kontaktperson måste du först skapa bolaget och sedan skapa en användare och koppla denne till bolaget och sedan gå in i bolaget igen och sätta användaren som kontaktperson.</p> <p>Under Användare lägger Du upp respektive användare, oavsett kategori, i Telia Nummertjänster. Förutsättning för att Du skall kunna lägga upp en användare i Telia Nummertjänster är att bolaget som användaren tillhör finns registrerad under <strong>Bolag</strong></p>\" }"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "4727112e-7198-4281-8b6d-f3539e682cac",
                Content = "{ \"question\": \"Roller\", \"answer\": \"<p>Det finns två typer av roller:</p> <p><ol>Kund – en kundroll kan ha följande rättigheter <ol><li>Analys</li> <li>Webbstyrning <ul>Läs</ul> <ul>Skriv</ul></li> <li>Koncernrättigheter</li> <li>Information om innehållsleverantörer</li></ol> Administratör</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Admin",
                Action = "Hantera_Bolag_Nummer_Edit",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Admin</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""298c14a8-6523-4bcc-9efb-2dd62753aa23"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Redigera nummer</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om Admin</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "298c14a8-6523-4bcc-9efb-2dd62753aa23",
                Content = "{ \"question\": \"Redigera nummer\", \"answer\": \"<p>På denna sida kan du redigera behörigheten för analys för det valda numret.</p><p>Det finns tre typer av behörigheter: <ol><li>Bara tidsdata</li><li>Tidsdata och geografisk data</li><li>Rådata</li></ol></p> <p>Behörigheten bygger på en hierarkisk nivå. Först måste du välja behörigheten för bolaget och sedan behörigheten för användaren. Alla användare för bolaget är listade och du kan välja behörigheten för användaren. Om du exempelvis har ”Bara tidsdata” behörighet på bolaget så är detta den enda nivå som du kan välja för användaren. Har du behörigheten ”Tidsdata och geografisk data”, så kan du välja båda behörigheterna för användaren. Du måste även aktivera behörigheten för användaren när du är klar. För att spara dina användningar måste du trycka på ”Spara”.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Admin",
                Action = "Meddelande",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Admin</h2>
					<div class=""tsColumn-list-2"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Vanliga frågor</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""171fd243-0220-4a03-9c95-60dab0277dc9"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Vad är meddelanden</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om Admin</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "171fd243-0220-4a03-9c95-60dab0277dc9",
                Content = "{ \"question\": \"Vad är meddelanden\", \"answer\": \"<p>Meddelanden används för att hantera meddelanden för användare på sidan. Du kan exempelvis välja ett specifikt meddelande för respektive del (Analys, Webbstyrning, Leverantörsinformation och Admin). Meddelanden kan exempelvis användas för att upplysa användaren om information.</p>\" }"
            });

            context.QuickHelp.Add(new QuickHelp
            {
                Controller = "Admin",
                Action = "SkapaMeddelande",
                HTML = @"<h2 class=""tsQuickHelp-heading h2"">Hjälp direkt - Admin</h2>
					<div class=""tsColumn-list-4"" data-toggle-target=""tsQuickHelper-hidden"">
						<h3 class=""h3"">Guider</h3>
						<ul class=""tsQuickHelp-list"">
							<li class=""tsQuickHelp-list-item secondaryToggleListItem"" data-id=""1de54460-446b-45c4-b64c-f66237a3a325"" data-list-id=""1"">
								<span class=""tsSecondaryLink"">Skapa ett meddelande</span>
							</li>
						</ul>
					</div>
                    <div class=""tsExpandableWrapper"" style=""display: none;""><div class=""tsExpandable-arrowDown""></div><div id=""dataContainer""></div></div>
					<div class=""tscInfo-bar"">
						<ul class=""tscInfo-list"">
							<li class=""tscInfo-listItem"">
								<i class=""tsIcon-Telephone""></i>
								<p>90 400</p>
							</li>
						</ul>
						<p><strong>För frågor om Admin</strong> X-XX</p>
					</div>"
            });

            context.QuickHelpEntry.Add(new QuickHelpEntry
            {
                Id = "1de54460-446b-45c4-b64c-f66237a3a325",
                Content = "{ \"question\": \"Skapa ett meddelande\", \"answer\": \"<p>Du kan välja att skapa ”Info” eller ”Panic” meddelanden. Skillnaden mellan dessa är färgerna som visas. ”Info” är blå och ”Panic” är röd orange. Du måste sedan välja mellan vilka datum meddelandet skall visas, skriva in ett meddelande och du har även möjlighet att begränsa meddelandet för roller.</p><p>När du är färdig trycker du på spara för att spara ditt meddelande.</p>\" }"
            });

            /*
			var danir = new Koncern
			{
				KoncernId = "Danir",
				Namn = "Danir"
			};

			context.Koncern.Add(danir);

			var sigmaitm = new Bolag
			{
				OrgNr = "570947-0304",
				Name = "Sigm IT&M",
				Koncern = danir
			};

			context.Bolag.Add(sigmaitm);

			context.Bolag.Add(new Bolag
			{
				OrgNr = "570947-0483",
				Name = "Sigm Technology",
				Koncern = danir
			});

			context.Bolag.Add(new Bolag
			{
				OrgNr = "570947-4938",
				Name = "Maverick",
				Koncern = danir
			});

			context.Användare.Add(new Användare
			{
				TeliaId = "48389289",
				FullName = "John Doe",
				Email = "noreply@sigma.se",
				Bolag = sigmaitm
			});

			context.Användare.Add(new Användare
			{
				TeliaId = "38298373",
				FullName = "Jane Doe",
				Email = "noreply@sigma.se",
				Bolag = sigmaitm
			});
            */
            context.SaveChanges();


            // Add roles

            //WebSecurity.InitializeDatabaseConnection("DefaultConnection",
            //	"UserProfile", "UserId", "UserName", autoCreateTables: true);

            //var roles = (SimpleRoleProvider)Roles.Provider;
            //var membership = (SimpleMembershipProvider)Membership.Provider;

            //if (!roles.RoleExists("Admin"))
            //{
            //	roles.CreateRole("Admin");
            //}
            //if (membership.GetUser("sallen", false) == null)
            //{
            //	membership.CreateUserAndAccount("sallen", "imalittleteapot");
            //}
            //if (!roles.GetRolesForUser("sallen").Contains("Admin"))
            //{
            //	roles.AddUsersToRoles(new[] { "sallen" }, new[] { "admin" });
            //}

        }
    }
}
