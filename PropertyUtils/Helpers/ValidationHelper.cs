using System;

namespace Sigma.Utils.Helpers
{
	public class ValidationHelper
	{
		public const string TextValidation = "^[a-zA-Z0-9åäöÅÄÖæøÆØ,.!? @_-]*$";
		public const string TextValidationErrorMessage = "Du har använt dig utav otillåtna tecken, v.g. försök igen.";
		public const string OrgNrValidation = @"^\d{6}-?\d{4}$";
		public const string OrgNrValidationErrorMessage = "Organisationsnummer har fel format.";
		public const string PhoneNumberValidation = "^[0-9- ]*$";
		public const string PhoneNumberValidationErrorMessage = "Felaktigt format.";
		public const string NumberValidation = "^[0-9]*$";
		public const string NumberValidationErrorMessage = "Endast siffror är tillåtna.";
		public const string ShortDateTimeValidation = @"^(|\d{4}-\d{2}-\d{2})$";
		public const string ShortDateTimeValidationErrorMessage = "Felaktigt datum format";

		public int PersonnummerKontrollsiffraCalculate(string personnummer)
		{
			int totalSiffra = 0;
			string kontrollSiffra; //Sätter kontrollsiffra till string så att jag ska kunna köra en substring på den 

			int raknaKontrollSiffra = 0;

			//Kontroll av kontrollsiffran enligt 21algoritm 
			for (int i = 0; i <= 8; i++)
			{   //Deklarerar valSiffra
				int valSiffra;

				//hämtar ut en siffra ur personnumret. Från första siffran till sista.
				valSiffra = Convert.ToInt32(personnummer.Substring(i, 1)); //Gör om första tecknet till en siffra

				/*If-villkor kollar om i är jämnt eller inte (pga algoritmen)
				 *Var och varannat tal i personnumret ska multipliceras med 2 och 1.
				 */
				if (i % 2 == 0)
				{
					//Om i är ett jämnt nummer, ska det multipliceras med 2.
					valSiffra = valSiffra * 2;

					// Om talet är två-siffrigt efter multiplikation sker detta:
					if (valSiffra >= 10)
					{
						int valSiffra1;
						int valSiffra2;
						String sub = Convert.ToString(valSiffra);
						valSiffra1 = Convert.ToInt32(sub.Substring(0, 1)); //tar ut första siffran i talet
						valSiffra2 = Convert.ToInt32(sub.Substring(1, 1)); //tar ut andra siffran i talet
						valSiffra = valSiffra1 + valSiffra2; //De två siffrorna läggs ihop
					}

				}
				else
				{
					// Händer inget, då algoritmen säger att varannat tal ska multipliceras med 1
				}

				//Allt läggs ihop i en klumpsumma.        
				totalSiffra = totalSiffra + valSiffra;

				//Sätter kontrollsiffra = totalsiffra och string
				kontrollSiffra = totalSiffra.ToString();
				//Tar sista värdet från kontrollsiffra
				kontrollSiffra = kontrollSiffra.Substring(kontrollSiffra.Length - 1, 1);
				//Konverterar den till int för att kunna göra metoden nedan
				raknaKontrollSiffra = Convert.ToInt32(kontrollSiffra);
				//Tar min kontrollsiffra -10 och får ut min kontrollsiffra till --> raknaKontrollSiffra
				raknaKontrollSiffra = 10 - raknaKontrollSiffra;
			}

			return raknaKontrollSiffra;
		}
	}
}
