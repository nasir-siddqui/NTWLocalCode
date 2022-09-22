-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[CheckNumbers]
AS
BEGIN
	
	-- ServiceId = 301		-- 020
	UPDATE [importCallStatistics].[TransactionData] 
	SET ToBeExported = 1
	WHERE ServiceId = 301
	AND CallType IN (
		54,						-- Lokalsamtal
		56,						-- Sverigesamtal
		61,						-- NTM Telia
		62,						-- GSM Telia
		63,						-- GSM Comviq
		64,						-- GSM Europolitan
		67,						-- Via Tele2
		83,						-- Angränsande
		265,					-- mob, GTS Sverige
		266,					-- mob, Banverket telenät
		267,					-- mob, Sense Communications
		268 					-- mob, Tele1 Europé
	)

	-- ServiceId = 302			-- Freephone, ank
	UPDATE [importCallStatistics].[TransactionData]
	SET ToBeExported = 1, ANumber = '', AOperator = '1998'
	WHERE ServiceId = 302
	AND LEFT(ANumber, 2) = 'A5'
	AND CallType NOT IN (
		68,						-- Utlandssamtal
		69
	)

	-- ServiceId = 304			-- 800 - Advance Universal Freephone (ank.)
	UPDATE [importCallStatistics].[TransactionData] 
	SET ToBeExported = 1, ANumber = '', AOperator = '1998'
	WHERE ServiceId = 304
	AND LEFT(ANumber, 2) = 'A5'
	AND CallType NOT IN (
		68,						-- Utlandssamtal
		69
	)

	-- ServiceId = 306			-- 900
	UPDATE [importCallStatistics].[TransactionData]  
	SET ToBeExported = 1
	WHERE ServiceId = 306
	AND CallType IN (
		72,						-- Förmedlad avgift (0900)
		73,						-- Förmedlad avgift (0939)
		74						-- Förmedlad avgift (0944)
	)

	-- ServiceId = 307			-- 900
	UPDATE [importCallStatistics].[TransactionData]  
	SET ToBeExported = 1, AOperator = CASE WHEN AreaCode = '00' THEN '1998' ELSE AOperator END
	WHERE ServiceId = 307
	AND CallType IN (
		57,						-- Sverigesamtal
		61,						-- NTM Telia
		62,						-- GSM Telia
		63,						-- GSM Comviq
		64,						-- GSM Europolitan
		67,						-- Via Tele2
		68						-- Utlandssamtal
	)

	-- ServiceId = 311			-- Mint, calltypes ej klara
	UPDATE [importCallStatistics].[TransactionData]  
	SET ToBeExported = 1
	WHERE ServiceId = 311

	-- ServiceId = 312			-- Mint, calltypes ej klara
	UPDATE [importCallStatistics].[TransactionData]  
	SET ToBeExported = 1
	WHERE ServiceId = 312

	-- 303 - Advance Freephone (avg.)
	-- 305 - Advance Universal Freephone (avg.)
	-- 308 - 077, delad taxa
	-- 309 - 0718-8xxxx
	-- 310 - Betalsamtal (071, 072)

	-- ServiceId = 313			-- Lokalnummer
	UPDATE [importCallStatistics].[TransactionData]  
	SET ToBeExported = 1
	WHERE ServiceId = 313

	-- ServiceId = 314			-- Lokalnummer
	UPDATE [importCallStatistics].[TransactionData]  
	SET ToBeExported = 1
	WHERE ServiceId = 314

	-- Ta bort nummer vi ej ska ha med i exporten
	UPDATE [importCallStatistics].[TransactionData] 
	SET ToBeExported = 0
	WHERE BNumber IN ('12123')

	-- Putsa nummren så att det ser bra ut
	UPDATE [importCallStatistics].[TransactionData] 
	SET AreaCode = '00',		-- 1998 = utländsk operatör
		AreaId = 268,			-- 1998 = utländsk operatör
		ANumber = '+' + ANumber
	WHERE AOperator = '1998'

	UPDATE [importCallStatistics].[TransactionData] 
	SET AreaCode = '99',		-- 1999 = okänd operatör
		AreaId = 269			-- 1999 = okänd operatör
	WHERE AOperator = '1999'
	AND AreaCode <> '99'

	UPDATE [importCallStatistics].[TransactionData] 
	SET ANumber = 'Okänt'
	WHERE AreaCode = '99'

	UPDATE [importCallStatistics].[TransactionData] 
	SET ANumber = '0' + ANumber
	WHERE AreaCode <> '99'
	AND LEFT(ANumber, 1) <> '+'

	UPDATE [importCallStatistics].[TransactionData] 
	SET CNumber = SUBSTRING(CNumber, 2, LEN(CNumber))
	WHERE LEFT(CNumber, 1) = 'D'

	UPDATE [importCallStatistics].[TransactionData] 
	SET CNumber = 'Talsvar'
	WHERE LEFT(CNumber, 1) = 'F'

END