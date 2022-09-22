/*
 * CODE FIRST
 */
PRINT N'Running Code First part.';

DECLARE @CurrentMigration [nvarchar](max)

IF object_id('[dbo].[__MigrationHistory]') IS NOT NULL
    SELECT @CurrentMigration =
        (SELECT TOP (1) 
        [Project1].[MigrationId] AS [MigrationId]
        FROM ( SELECT 
        [Extent1].[MigrationId] AS [MigrationId]
        FROM [dbo].[__MigrationHistory] AS [Extent1]
        WHERE [Extent1].[ContextKey] = N'Telia.NTW.Core.Migrations.Configuration'
        )  AS [Project1]
        ORDER BY [Project1].[MigrationId] DESC)

IF @CurrentMigration IS NULL
    SET @CurrentMigration = '0'

IF @CurrentMigration < '201409101329410_Initial'
BEGIN
    CREATE TABLE [dbo].[Meddelandes] (
        [Id] [int] NOT NULL IDENTITY,
        [Type] [int] NOT NULL,
        [From] [datetime] NOT NULL,
        [To] [datetime] NOT NULL,
        [Text] [nvarchar](max),
        CONSTRAINT [PK_dbo.Meddelandes] PRIMARY KEY ([Id])
    )
    CREATE TABLE [dbo].[QuickHelps] (
        [Controller] [nvarchar](128) NOT NULL,
        [Action] [nvarchar](128) NOT NULL,
        [HTML] [nvarchar](max),
        CONSTRAINT [PK_dbo.QuickHelps] PRIMARY KEY ([Controller], [Action])
    )
    CREATE TABLE [dbo].[QuickHelpEntries] (
        [Id] [nvarchar](128) NOT NULL,
        [Content] [nvarchar](max),
        CONSTRAINT [PK_dbo.QuickHelpEntries] PRIMARY KEY ([Id])
    )
    CREATE TABLE [dbo].[__MigrationHistory] (
        [MigrationId] [nvarchar](150) NOT NULL,
        [ContextKey] [nvarchar](300) NOT NULL,
        [Model] [varbinary](max) NOT NULL,
        [ProductVersion] [nvarchar](32) NOT NULL,
        CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY ([MigrationId], [ContextKey])
    )
    INSERT [dbo].[__MigrationHistory]([MigrationId], [ContextKey], [Model], [ProductVersion])
    VALUES (N'201409101329410_Initial', N'Telia.NTW.Core.Migrations.Configuration',  0x1F8B0800000000000400D559CD72DB3610BE77A6EFC0E1A99D7144CBBEB81E2A1957B61A4F2DD90DE5F40C912B9913006401D0959EAD873E525E210BFE0B1465D15294647CB100ECB78B6F17BB0BF0F37FFFBBEF968C5ACF206418F181DDEF9DDA16703F0A42BE18D8899ABFB9B0DFBDFDF927F726604BEB63B1EE5CAF43492E07F69352F1A5E348FF0918913D16FA2292D15CF5FC883924889CB3D3D3DF9C7EDF0184B011CBB2DC0F09572183F407FE1C46DC875825848EA300A8CCC771C64B51AD09612063E2C3C09E020D496F32FDBB378C04F46E104885206DEB0AC7D11C0FE8DCB608E791220A8DBD7C94E02911F18517E300A1D3550CB86E4EA8847C1397D5F25DF7737AA6F7E3548205949F4815B18E80FDF39C20C7147F15CD764920529832B4D2BB4E691CD863089064C203DCBEA9EE7248855EDACA73AF923EB18AD99332323080F4DF89354CA84A040C38244A107A623D24331AFA7FC26A1A7D023EE009A57533D1509C5B1BC0A10711C520D4EA03CC73E36F03DB72D6E51C53B014ABC9649BBAE5EAFCCCB626A89CCC2894515023C053B8A13F8083200A8207A21408AE3120E5B1A1DDD0A5F514DA7428D6F8CAA61ABAB7E38D44C40ABC6BB4688AC7A633C834DA1F0296AADC9712981E6C6B4C9677C017EA09638A2C6D6B142E21284672D4471E6236412125124389EB54A1B93560FF4A42FFD37BA0F16BE2B514FE26E18A990D730FA5204C82372EBFF2B333DF35C2EB6A5A7DD43FBBD8C9471D23A3B0F9D87ADF4FC777DF3C227146ACF60ACB14E1074CA5C773B40E6E4CBE47F375C23616CB2C7DDFCA11258BAA7FE8E0F98449A31AECEF76DC610082AE90917A855BE7730C6C06A2F0209F6335F84868823F4E1BDCAFAD7D20C85FB9B8DF2430A3AA7954B4CB48C84BA089FA37F5A2AE210DC6B041CB4993B9A3D64DCA203D501BFA97CA878D72DBD89A89532B2B0D98DADCAE28792A6887CA176C0AC292AFAAF375B2D6B768919D961ED91D933846EFD77AE67CC4F2B28679F8C6EBDE44B20CC3F1E5865EB2B4B6D4843D13598031AB4F6E00A35048856D0799117D5E86016B2CAB45470BD785A246009859AE62BF10D1FF172DCC4B1DAD09579139C2FD314C42E956A1B46B9B2DA9B8E7134AC486243A8C68C2785B22DE269DE5A1BA7C36B23B42D653D611B2910E364486055127E9340FACC9A7234D04D731F837FDED341C6E14343384760AB0EAF41F22BE5AD17608AF2DB26DECD67BC13AC7DB5AD176B4A2BBAB236DEE52B7A164BD5A1D231BF9FE3C9E25E983BA7D236417DFB7007C9DF452765B66ECA483477658A33E9A4B4AED659D34EAA19BD7A6971F961AC52A5B625B48D07318E842E5ADA402D6D30B7ADE3F7448C3949462C118DBA5394895F56736D6D20BE359EAFB792272A40CE8CEEF4447BF5D849AD7179F62BABE61D4DE6652057BBCC5046892DAEF2DE6F510B5B718FE4C84FF44C42F8C2C7FAD231DE4BDE5477AF12898685E49F77AD038186CFDBDE2AB7A6D43B938C6913D1851C67DFF605C9997D2E6EDE440F7CEAC70E0019FE9B39E195BCDCB435D4C37A929A73B68D9F5E2BA559F5E139A7BEB70BD6D9669D7A97F2572AF41868B0A427F33E2909ED40AB458A3DF388AA0C20DD72D2A961831370645301F932BA1C239F1154EFB2065FAD0943F7FDCB01904B7FC3E5171A2AEA40436A36BD779D7D9AE3FBDC3AFDBECDEC7FA973CC416D0CC5097947BFE7B12D2A0B47BD43C736D10FA44E4F516ADF294AEBB8B55893489F88E40397DD71003D7D57A0A2CA60826EFB9479EE135B63D4AB88305F15745B7D50EF2B223D66977AF43B21084C91CA392D75F3E1DFDE9F3ED177A77C2C62C1D0000 , N'6.1.1-30610')
END

IF @CurrentMigration < '201409161419228_AddKoncernBolagAnvändare'
BEGIN
    CREATE TABLE [dbo].[Användare] (
        [TeliaId] [nvarchar](128) NOT NULL,
        [FullName] [nvarchar](max),
        [Email] [nvarchar](max),
        [Bolag_OrgNr] [nvarchar](128),
        CONSTRAINT [PK_dbo.Användare] PRIMARY KEY ([TeliaId])
    )
    CREATE INDEX [IX_Bolag_OrgNr] ON [dbo].[Användare]([Bolag_OrgNr])
    CREATE TABLE [dbo].[Bolags] (
        [OrgNr] [nvarchar](128) NOT NULL,
        [Name] [nvarchar](max),
        [Koncern_KoncernId] [nvarchar](128),
        CONSTRAINT [PK_dbo.Bolags] PRIMARY KEY ([OrgNr])
    )
    CREATE INDEX [IX_Koncern_KoncernId] ON [dbo].[Bolags]([Koncern_KoncernId])
    CREATE TABLE [dbo].[Koncerns] (
        [KoncernId] [nvarchar](128) NOT NULL,
        [Namn] [nvarchar](max),
        CONSTRAINT [PK_dbo.Koncerns] PRIMARY KEY ([KoncernId])
    )
    ALTER TABLE [dbo].[Användare] ADD CONSTRAINT [FK_dbo.Användare_dbo.Bolags_Bolag_OrgNr] FOREIGN KEY ([Bolag_OrgNr]) REFERENCES [dbo].[Bolags] ([OrgNr])
    ALTER TABLE [dbo].[Bolags] ADD CONSTRAINT [FK_dbo.Bolags_dbo.Koncerns_Koncern_KoncernId] FOREIGN KEY ([Koncern_KoncernId]) REFERENCES [dbo].[Koncerns] ([KoncernId])
    INSERT [dbo].[__MigrationHistory]([MigrationId], [ContextKey], [Model], [ProductVersion])
    VALUES (N'201409161419228_AddKoncernBolagAnvändare', N'Telia.NTW.Core.Migrations.Configuration',  0x1F8B0800000000000400D55BCD72DB3610BE77A6EFC0E1A9ED38A2EC5C528F948CE3D8AD2791ED5A72DA9B0726619913105409D095A6D3B7E95BF4D0431FA8AFD0057F4182E09F68C99D5C2C00FB61FFB0C02E37FFFEF5F7E4DDDA23C6130E98EBD3A979381A9B06A6B6EFB874393543FEF0EA8DF9EEEDD75F4DCE1C6F6D7C4ED7BD16EB8092B2A9F9C8F9EAD8B298FD883DC4469E6B073EF31FF8C8F63D0B39BE75341E7F6F1D1E5A18204CC0328CC94D48B9EBE1E807FC3CF5A98D573C4464E63B98B0641C66E611AA71893CCC56C8C6537381898B46978B9F47A77E80476700C45DCC4CE304C6819D39260FA68128F539E2C0ECF12DC3731EF874395FC100228BCD0AC3BA0744184E8438CE97B795677C24E4B172C214CA0E19F7BD8E8087AF13055965F25E6A363305820A230D6D84D4911AA7E6097DFAE74FEAA000C42F6F777C4A02B154ABE7514E7D60A4B30799678003897F07C669487818E029C5210F103930AEC37BE2DA1FF166E17FC1744A434264368151982B0CC0D075E0AF70C03737F821613E62EBC2310DAB486C95A933DA32612C1EB804B8B869CCD0FA13A64BFE08CE7FF4C634CEDD3576D291C4476EA90B2702887810C2CF4B601DDD139CCD5BB51B9FC372F157CDCEF067AB9DEB373AF3904B86DFE5123DB9CBC8394AFBBDF709821D6E308966D9A3BB8A8F9FE42377C9A2F3C0F76E7C52F0BE78EE6EEE87812DB4E36B162C50B0C4BCC8D7C4CADDBAD6D993FDBBFB7944B81717BF0A96974177074FC876EDDECFE3DA5AA7FB28AE8A8056BA5DEC2ED98ADCE70A138AC31567B7F2B66CEFEEFE9690EEC5E392BDFB845589740F9E4707F6BCD6869E61071E2A883ABDEED09C7A2FE6EE63E7DCC01794BF3EAA3096A4803907817EC014078863E71A710E2E223070A4C726C38A7D32C38A839DEB2B9EEA7A03432048F13E00470BD7EB0EB2F0B787C06BBE2F87FD2974ED2F3F62B2EAE3AF19F15EDC15B20378BF1382954BB172F9891DBF9BBB7AB8BCCDAE4359CAF3AEF7FD7131FBB4778F849960B3955B4608FFC350BA3B430BE786E0BB335B875EE5651987EF0B760E2FAE3C07EF60F9D063A5DB607BB383840E0EC8063422DF70457DCEB0778F83D482F4016E83CF8884F063ACE8BEB0F61A81FEB2C587AA026355C983278CF9B61BA942CE62B2976D71B733EA18B5CFDCFC1E4D92A11968C55D811EC07453F33B857F1D62FA349610B3076F11733C1A29924A52D50BAB648F3AEEF4A964CEA05CEC682FB736076D526607C1E3A3230E267269E62E97FCB7E8AC8A9782722E6E194E8E064B8E6359000139C7BCA2D2939FD40ACD288A28E224A22A10C9780375E6230A7D36D38020BFB6151079B201477A042930D25C5B94E4E2D243250B4A78923F94549CE7AED29ACAE4B67C333505814C86CC98CA4BAAE9D44B103ABB5945D15A88AD568A54C9EBE341BB882031AFF7FB7621A04995355A48EFCBECD0E7856E2BAE74A715714B53129FCCD06A05179554224F468C795C1F3F7D35EF5E33F6620CCB6615A5E38CDB6C2748EFD0129766C523C3C1E76EC0386448E81E89ABFDD4F194655288D31CB47423258AA9E64A8F5E4A22FE960ABEB505EC325CAECC7390CF83F752242AAE761E8538FA5C81080A7495E7539F841EADAD63D7E1E4856419281F6D8F94548A65986448C59858259D946D602946281D87B2595B195D77D2BBDBBB12A985A935743A9D26E55759A79585DC3A0CD5BA3ACBEEC92AFAEBA7BB5D34582D2CA3A5D4E9552A52CACAD5963D1B6C44151B2957E11E6D24BD878630931EAE85A5EA88750A2E5BA99B79E20CB31069A3910E6136AA1616426C34D28107BFC481DF893A7AFB17EF8A357F410E96BF9487F02F2D5A0BF7AAA1D56957AEF2C93AAE2B32EAD1D2BA9D8C545D7FAC4389AB7032463CF2F22C1E2734839ABD12B28BED3500CF135EB23A5AD977A2C1DD1BAC986A543CA1F294B2E54B292768F520121953555F40397D5435D3E3A6BEABB9B185A6324EBA3299A4892D996CFFD4AB650ADCC671A3BAD70513E5DCAC1EDA49F272BAD9D94DD414BC4B0E95D2B44F942A8CA1CBB5FBDB2386E9639516DC75F3966EE9DFF61E53237AB3AF28158AF2922CA065958A5245629254079A3BF9947241BCC43440FC27D711A582F98671EC8DC482D1FC57724ADC28CEA60B6688BA0F98F1B8986F1E8D0F8F4A7D802FA727CF62CC2115D595EAC6BC1E9FA286EA8CA34F28B01F51A07E96DAB2F12D05FEC643EB6F65B4CECD6D5B2115CE475964A5E47E01B9CB7A6AFE1E111F1B17BFDC49F407C655006E786C8C8D3FEAD4B5C557D2AA2F203BEB221BCC150673838AEBB0870915941D18B2FAE3DDCEDBB3863429ED61D23E1D563D54B6DD7779575C328D4D4C5DBB7FA4AEA668832DBA981C60896FD7C5D41F42EA627A0EC36B92FA17DE2B34D8B92AB6020D062B77FA3CABD52AD2F15D1CD9C11455EA941940577DDB390A997BD77E0B43F9A0DBA71304AC830311EF1001BD301E404EA09430AE0397DAEE0A9112DF6A7ED4E16A13EACC80CB331FF00A5311870BF275D8AFBE9090C197BCB1491BCFD1E3D2D2740D0E207FF3EED91CD3CB15DA1B469BAAB77682DAEFBAEA860D1582C17DA0BADD47FD64AE29C876EDE8897369B8E6EFC58D1F87ACE13A7EAAD0A32936443750157A32D98CDFBA57A86A977CBE79A396CD4455DB64D31D7669DB6C54BB9F58E356C8F6BC2D492593D7B51055C5BE2D1A6E74A20DDC76D492516D486ED59D344C5F915A9D839826FD6F5C08ABCC5DE610A2E648B15D8866D91AD1079B46D61247E992D2EB6A863982CC039D04DC7D403687691B33163523272DB267DE3D762EE855C857210791B1774F0A4D742238D7ED1F354F15799E5CADA2FF2B368408C0A62B92A72BFA3E748993F17DAEBE2E751022EA2799A5B0251719E67293215DFAB42550A2BEECB25A606F45008C5DD1397AC27D78BB65F8135E227B931659F520CD8628AA7DF2C145CB00792CC1C8E9E127F8B0E3ADDFFE07B1287EE4943E0000 , N'6.1.1-30610')
END

IF @CurrentMigration < '201410171347022_RemovedAnvändareBolagKoncern'
BEGIN
    IF object_id(N'[dbo].[FK_dbo.Bolags_dbo.Koncerns_Koncern_KoncernId]', N'F') IS NOT NULL
        ALTER TABLE [dbo].[Bolags] DROP CONSTRAINT [FK_dbo.Bolags_dbo.Koncerns_Koncern_KoncernId]
    IF object_id(N'[dbo].[FK_dbo.Användare_dbo.Bolags_Bolag_OrgNr]', N'F') IS NOT NULL
        ALTER TABLE [dbo].[Användare] DROP CONSTRAINT [FK_dbo.Användare_dbo.Bolags_Bolag_OrgNr]
    IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Bolag_OrgNr' AND object_id = object_id(N'[dbo].[Användare]', N'U'))
        DROP INDEX [IX_Bolag_OrgNr] ON [dbo].[Användare]
    IF EXISTS (SELECT name FROM sys.indexes WHERE name = N'IX_Koncern_KoncernId' AND object_id = object_id(N'[dbo].[Bolags]', N'U'))
        DROP INDEX [IX_Koncern_KoncernId] ON [dbo].[Bolags]
    DROP TABLE [dbo].[Användare]
    DROP TABLE [dbo].[Bolags]
    DROP TABLE [dbo].[Koncerns]
    INSERT [dbo].[__MigrationHistory]([MigrationId], [ContextKey], [Model], [ProductVersion])
    VALUES (N'201410171347022_RemovedAnvändareBolagKoncern', N'Telia.NTW.Core.Migrations.Configuration',  0x1F8B0800000000000400D559CD72E3360CBE77A6EFA0D1A99DC95AB673D966E4DD499DB89B699CA42B677BA625D8D12C49A92495DACFD6431FA9AF5050FFA62CC78ABDDEDDC92526810F20000220F4DF3FFFBAEF578C5ACF206418F1913DE8F56D0BB81F05215F8EEC442DDEBCB5DFBFFBF107F73A602BEB534177AEE99093CB91FDA4547CE138D27F0246648F85BE8864B4503D3F620E092267D8EFFFE20C060E20848D5896E57E4CB80A19A43FF0E738E23EC42A21741A054065BE8E3B5E8A6ADD110632263E8CEC19D090F4EE667FF6C69180DE3502A910A46D5DE23AAAE3015DD816E13C5244A1B2178F123C2522BEF4625C2074B68E01E916844AC80F715191EF7B9EFE509FC7A9180B283F912A621D0107E7B9811C93FD5566B64B03A209530BADF5A953338EEC29046864C2033CBE29EE624C85266DB573AFE23EB38ADDB332323080F4DF99354EA84A048C38244A107A663D24731AFABFC37A167D063EE209A575355151DCDB58C0A50711C520D4FA232C72E56F02DB7236F91C93B164ABF16487BAE1EA7C685B77289CCC299451503380A7F040BF01074114040F4429105C63406AC786744396965348D3A158B357B6D590BD1B6F222256E05DA14633BC369D4166D1E110B052E5B994C0F4605B53B2BA05BE544F185364655B93700541B192A33EF210B30932299118425CA70ACD9D01FB4712FA9F3F008D5F13AF25F3570957CC6C987B2805611A782BF9A59FDDF9AE115E17D3EAA3C1F0ED5E3EEA181985CEA796FB6136BDFDEA11893B627D5058A608DF612A3D9DA3757063F23D99AF13B6B55866E9FB464E285956FD4307CF274C1AD5E070B7E3090310748D16A957B84D7B4E81CD41141EE40BAC069F084DF047BF61FB0DDA0782F62B89074D0366A66A5E15ED3212F212E84EFD3D463F4C422155EA4E5D4C1AA6C34E2DB79ECC3DB6A95B86ED81DAD2C854CE6CD4DDC6194D9C5A7D69C0D4F6F645C973423B544EB02D1A4BC3552DB093F5C045AFECB434CBEE94C4318641AD79CE572C2FEB9CC76FBCEEDD24CB301C5F6E692A4B6D4B49D83C912518BBFA0AE7CEC7FE83CC89BE38E38035C8B685498BD10B898D4830F35EE5868245FF5F34352FF5B8265C65D5091E94615A4ACF0CA55EBB7449D93D9F5022B6A4D5714413C6DB52F32EEE2C33D5F9B395FD11B22EB38E90AD74D0213234883A71A70961833F5D6922B88E617FD3DF4EC3E14689334368AF00ABD2C031E2AB156D8FF0DAC1DB66DD7A7758B7F1AEE6B41DADE8F7EA48DBFBD65D2859F756C7C856BE3D8F67D9FAA86EDF0AD9C5F72D005F26BD94FD97193BE9E2891DD62894264929BD2C98466174F322F5F2A8A951B53212DB42033D8781AE58DE5A2A603D4DD0F3FEA2631AA6462908A6D8402D40AAAC63B387FDC1D018547D3B432347CA80EE3D393AF97B23D4767D7138D375AA519BD6A4020E98CE04A8923A6C3AF37A88DA74863F13E13F11F11323AB9FEB484799C07C4F3390C212CD47EA41238EA3C1D627185FD46B5BCAC529AEECD10C654C008E662BF399DA7CA61CE9019A150EBCE0737DD73365AB7D79AC17EA3631E5760729FBBE6077CAD334A179B60EEFDC6699769DFA7723F70A64B8AC20F457240EE94DAD400B1A3DF528820A0F5CD7A82031626E0A8A603E269742850BE22BDCF641CA74F4940F44AED91C821B7E9FA838519752029BD38D77BDEBEC969F3EE6377576EF63FD4B1EE308A866A84BCA3DFF35096950EA3D69DEB936087D23F27A8B5A794AD7DDE5BA44BA8BF89E40B9F9AE2006AEABF50C584C114CDE738F3CC36B747B94700B4BE2AF8B6EAB1DE465476C9ADDBD0AC9521026738C8A5F7F0B75F4C7D077FF03425F8C0C3E1D0000 , N'6.1.1-30610')
END

/*
 * NULLABLE COLUMNS
 */
PRINT N'Making some columns nullable.';
ALTER TABLE GroupInfo ALTER COLUMN GroupCode VARCHAR(25)
ALTER TABLE [Users] ALTER COLUMN [Password] VARCHAR(50)
ALTER TABLE [Users] ALTER COLUMN [Security] VARCHAR(10)
ALTER TABLE [CompanyInfo] ALTER COLUMN SamRefKod varchar(10)
ALTER TABLE [CompanyInfo] ALTER COLUMN [Date] varchar(12)
ALTER TABLE [CompanyInfo] ALTER COLUMN ActiveVIP bit
ALTER TABLE [CompanyInfo] ALTER COLUMN ActiveStat bit
ALTER TABLE [CompanyInfo] ALTER COLUMN [New] bit
ALTER TABLE [CompanyInfo] ALTER COLUMN ExtendedMulti bit
ALTER TABLE [CompanyInfo] ALTER COLUMN UserIdCpa int

/*
 * CLEAN NON EXISTENT REFERENCES
 */
PRINT N'Cleaning non existent references.';
 -- AdvanceExtension ChangedBy
UPDATE AdvanceExtension
SET ChangedBy = NULL
WHERE ChangedBy NOT IN (SELECT UserId FROM [Users])

-- CompanyInfo ChangedBy
UPDATE CompanyInfo
SET ChangedBy = NULL
WHERE ChangedBy NOT IN (SELECT UserID FROM [Users])

-- CompanyInfo Contacts (UserIdA, UserIdD, UserIdCpa)
UPDATE
	CompanyInfo
SET
	UserIdA = NULL
WHERE
	UserIdA NOT IN (SELECT UserID FROM [Users])
	
UPDATE
	CompanyInfo
SET
	UserIdD = NULL
WHERE
	UserIdD NOT IN (SELECT UserID FROM [Users])
	
UPDATE
	CompanyInfo
SET
	UserIdCpa = NULL
WHERE
	UserIdCpa NOT IN (SELECT UserID FROM [Users])

-- AdvanceExtension CompanyId 
UPDATE [AdvanceExtension]
SET CompanyId = NULL
WHERE
	CompanyId = 0
	OR CompanyId NOT IN (SELECT CompanyId FROM CompanyInfo)

-- UserAdvanceNumbers ChangedBy
UPDATE UserAdvanceNumbers
SET ChangedBy = NULL
WHERE ChangedBy NOT IN (SELECT UserID FROM [Users])

/*
 * FROM SCHEMA COMPARE
 */
 PRINT N'Running script from schema compare.';

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;

GO

PRINT N'Dropping [dbo].[FK_AnswerExtension_AdvanceExtension]...';


GO
ALTER TABLE [dbo].[AnswerExtension] DROP CONSTRAINT [FK_AnswerExtension_AdvanceExtension];


GO
PRINT N'Dropping [dbo].[FK_Bookmarks_Users]...';


GO
ALTER TABLE [dbo].[Bookmarks] DROP CONSTRAINT [FK_Bookmarks_Users];


GO
PRINT N'Dropping [dbo].[FK_Webb_Users_Org_Webb_Users_Koncern]...';


GO
ALTER TABLE [dbo].[CompanyInfo] DROP CONSTRAINT [FK_Webb_Users_Org_Webb_Users_Koncern];


GO
PRINT N'Dropping [dbo].[FK_UserAdvanceNumbers_Webb_Users_Login]...';


GO
ALTER TABLE [dbo].[UserAdvanceNumbers] DROP CONSTRAINT [FK_UserAdvanceNumbers_Webb_Users_Login];


GO
PRINT N'Dropping [dbo].[FK_UserSettings_Webb_Users_Login]...';


GO
ALTER TABLE [dbo].[UserSettings] DROP CONSTRAINT [FK_UserSettings_Webb_Users_Login];


GO
PRINT N'Dropping [dbo].[FK_Webb_Users_Login_Webb_Users_Org]...';


GO
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [FK_Webb_Users_Login_Webb_Users_Org];


GO
PRINT N'Dropping [dbo].[Advance_Applikation_BACKUP]...';


GO
DROP TABLE [dbo].[Advance_Applikation_BACKUP];


GO
PRINT N'Dropping [dbo].[advanceextension_20051012]...';


GO
DROP TABLE [dbo].[advanceextension_20051012];


GO
PRINT N'Dropping [dbo].[answerextension_20051012]...';


GO
DROP TABLE [dbo].[answerextension_20051012];


GO
PRINT N'Dropping [dbo].[callstatistic_20051012]...';


GO
DROP TABLE [dbo].[callstatistic_20051012];


GO
PRINT N'Dropping [dbo].[CompanyInfo_071130]...';


GO
DROP TABLE [dbo].[CompanyInfo_071130];


GO
PRINT N'Dropping [dbo].[CompanyInfo_080201]...';


GO
DROP TABLE [dbo].[CompanyInfo_080201];


GO
PRINT N'Dropping [dbo].[CompanyInfo_080401]...';


GO
DROP TABLE [dbo].[CompanyInfo_080401];


GO
PRINT N'Dropping [dbo].[companyinfo_haja]...';


GO
DROP TABLE [dbo].[companyinfo_haja];


GO
PRINT N'Dropping [dbo].[Extension_20040220]...';


GO
DROP TABLE [dbo].[Extension_20040220];


GO
PRINT N'Dropping [dbo].[help20061010]...';


GO
DROP TABLE [dbo].[help20061010];


GO
PRINT N'Dropping [dbo].[menu_050627]...';


GO
DROP TABLE [dbo].[menu_050627];


GO
PRINT N'Dropping [dbo].[Menu_20060111]...';


GO
DROP TABLE [dbo].[Menu_20060111];


GO
PRINT N'Dropping [dbo].[Menu_Backup2005_12_28]...';


GO
DROP TABLE [dbo].[Menu_Backup2005_12_28];


GO
PRINT N'Dropping [dbo].[MenuSystem_20060111]...';


GO
DROP TABLE [dbo].[MenuSystem_20060111];


GO
PRINT N'Dropping [dbo].[MenuSystem_OLD]...';


GO
DROP TABLE [dbo].[MenuSystem_OLD];


GO
PRINT N'Dropping [dbo].[StaffBolag_080201]...';


GO
DROP TABLE [dbo].[StaffBolag_080201];


GO
PRINT N'Dropping [dbo].[StaffBolag_080401]...';


GO
DROP TABLE [dbo].[StaffBolag_080401];


GO
PRINT N'Dropping [dbo].[StaffBolag_080501]...';


GO
DROP TABLE [dbo].[StaffBolag_080501];


GO
PRINT N'Dropping [dbo].[StaffBolag_haja]...';


GO
DROP TABLE [dbo].[StaffBolag_haja];


GO
PRINT N'Dropping [dbo].[systemsupport_20070125]...';


GO
DROP TABLE [dbo].[systemsupport_20070125];


GO
PRINT N'Dropping [dbo].[users_20041101]...';


GO
DROP TABLE [dbo].[users_20041101];


GO
PRINT N'Dropping [dbo].[users_20041102]...';


GO
DROP TABLE [dbo].[users_20041102];


GO
PRINT N'Altering [dbo].[Users]...';


GO
ALTER TABLE [dbo].[Users]
    ADD [LogonDate] DATETIME NULL;


GO
PRINT N'Creating [dbo].[CompanyInfosInRoles]...';


GO
CREATE TABLE [dbo].[CompanyInfosInRoles] (
    [CompanyInfoId] INT NOT NULL,
    [RoleId]        INT NOT NULL,
    CONSTRAINT [PK_CompanyInfosInRoles] PRIMARY KEY CLUSTERED ([CompanyInfoId] ASC, [RoleId] ASC)
);


GO
PRINT N'Creating [dbo].[IncludedRole]...';


GO
CREATE TABLE [dbo].[IncludedRole] (
    [BaseRoleId]     INT NOT NULL,
    [IncludedRoleId] INT NOT NULL
);


GO
PRINT N'Creating [dbo].[Role]...';


GO
CREATE TABLE [dbo].[Role] (
    [Id]              INT            NOT NULL,
    [Name]            VARCHAR (256)  NOT NULL,
    [Description]     NVARCHAR (256) NULL,
    [ApplicationRole] BIT            NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [dbo].[UsersInRoles]...';


GO
CREATE TABLE [dbo].[UsersInRoles] (
    [UserId] INT NOT NULL,
    [RoleId] INT NOT NULL,
    CONSTRAINT [PK_UsersInRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC)
);


GO
PRINT N'Creating [dbo].[FK_AnswerExtension_AdvanceExtension]...';


GO
ALTER TABLE [dbo].[AnswerExtension] WITH NOCHECK
    ADD CONSTRAINT [FK_AnswerExtension_AdvanceExtension] FOREIGN KEY ([AdvanceExtId]) REFERENCES [dbo].[AdvanceExtension] ([AdvanceExtID]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_Bookmarks_Users]...';


GO
ALTER TABLE [dbo].[Bookmarks] WITH NOCHECK
    ADD CONSTRAINT [FK_Bookmarks_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_Webb_Users_Org_Webb_Users_Koncern]...';


GO
ALTER TABLE [dbo].[CompanyInfo] WITH NOCHECK
    ADD CONSTRAINT [FK_Webb_Users_Org_Webb_Users_Koncern] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[GroupInfo] ([GroupId]) ON DELETE SET NULL;


GO
PRINT N'Creating [dbo].[FK_UserAdvanceNumbers_Webb_Users_Login]...';


GO
ALTER TABLE [dbo].[UserAdvanceNumbers] WITH NOCHECK
    ADD CONSTRAINT [FK_UserAdvanceNumbers_Webb_Users_Login] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_UserSettings_Webb_Users_Login]...';


GO
ALTER TABLE [dbo].[UserSettings] WITH NOCHECK
    ADD CONSTRAINT [FK_UserSettings_Webb_Users_Login] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_CompanyInfosInRoles_CompanyInfo]...';


GO
ALTER TABLE [dbo].[CompanyInfosInRoles] WITH NOCHECK
    ADD CONSTRAINT [FK_CompanyInfosInRoles_CompanyInfo] FOREIGN KEY ([CompanyInfoId]) REFERENCES [dbo].[CompanyInfo] ([CompanyId]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_CompanyInfosInRoles_Role]...';


GO
ALTER TABLE [dbo].[CompanyInfosInRoles] WITH NOCHECK
    ADD CONSTRAINT [FK_CompanyInfosInRoles_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]);


GO
PRINT N'Creating [dbo].[FK_IncludedRole_BaseRole]...';


GO
ALTER TABLE [dbo].[IncludedRole] WITH NOCHECK
    ADD CONSTRAINT [FK_IncludedRole_BaseRole] FOREIGN KEY ([BaseRoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_IncludedRole_IncludedRole]...';


GO
ALTER TABLE [dbo].[IncludedRole] WITH NOCHECK
    ADD CONSTRAINT [FK_IncludedRole_IncludedRole] FOREIGN KEY ([IncludedRoleId]) REFERENCES [dbo].[Role] ([Id]);


GO
PRINT N'Creating [dbo].[FK_UsersInRoles_Role]...';


GO
ALTER TABLE [dbo].[UsersInRoles] WITH NOCHECK
    ADD CONSTRAINT [FK_UsersInRoles_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_UsersInRoles_Users]...';


GO
ALTER TABLE [dbo].[UsersInRoles] WITH NOCHECK
    ADD CONSTRAINT [FK_UsersInRoles_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE;


GO
PRINT N'Creating [dbo].[FK_AdvanceExtension_ChangedBy]...';


GO
ALTER TABLE [dbo].[AdvanceExtension] WITH NOCHECK
    ADD CONSTRAINT [FK_AdvanceExtension_ChangedBy] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE SET NULL;


GO
PRINT N'Creating [dbo].[FK_AdvanceExtension_CompanyInfo]...';


GO
ALTER TABLE [dbo].[AdvanceExtension] WITH NOCHECK
    ADD CONSTRAINT [FK_AdvanceExtension_CompanyInfo] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[CompanyInfo] ([CompanyId]) ON DELETE SET NULL;


GO
PRINT N'Creating [dbo].[FK_CompanyInfo_ChangedByUser]...';


GO
ALTER TABLE [dbo].[CompanyInfo] WITH NOCHECK
    ADD CONSTRAINT [FK_CompanyInfo_ChangedByUser] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE SET NULL;


GO
PRINT N'Creating [dbo].[FK_CompanyInfo_ContactAnalys]...';


GO
ALTER TABLE [dbo].[CompanyInfo] WITH NOCHECK
    ADD CONSTRAINT [FK_CompanyInfo_ContactAnalys] FOREIGN KEY ([UserIdA]) REFERENCES [dbo].[Users] ([UserID]);


GO
PRINT N'Creating [dbo].[FK_CompanyInfo_ContactLeverantörsinformation]...';


GO
ALTER TABLE [dbo].[CompanyInfo] WITH NOCHECK
    ADD CONSTRAINT [FK_CompanyInfo_ContactLeverantörsinformation] FOREIGN KEY ([UserIdCpa]) REFERENCES [dbo].[Users] ([UserID]);


GO
PRINT N'Creating [dbo].[FK_CompanyInfo_ContactWebstyrning]...';


GO
ALTER TABLE [dbo].[CompanyInfo] WITH NOCHECK
    ADD CONSTRAINT [FK_CompanyInfo_ContactWebstyrning] FOREIGN KEY ([UserIdD]) REFERENCES [dbo].[Users] ([UserID]);


GO
PRINT N'Creating [dbo].[FK_GroupInfo_ChangedBy]...';


GO
ALTER TABLE [dbo].[GroupInfo] WITH NOCHECK
    ADD CONSTRAINT [FK_GroupInfo_ChangedBy] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE SET NULL;


GO
PRINT N'Creating [dbo].[FK_UserAdvanceNumbers_ChangedByUser]...';


GO
ALTER TABLE [dbo].[UserAdvanceNumbers] WITH NOCHECK
    ADD CONSTRAINT [FK_UserAdvanceNumbers_ChangedByUser] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]);


GO
PRINT N'Creating [dbo].[FK_User_ChangedByUser]...';


GO
ALTER TABLE [dbo].[Users] WITH NOCHECK
    ADD CONSTRAINT [FK_User_ChangedByUser] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]);


GO
PRINT N'Refreshing [dbo].[vCompanyInfo]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vCompanyInfo]';


GO
PRINT N'Refreshing [dbo].[vCompanyInfo_20051228]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vCompanyInfo_20051228]';


GO
PRINT N'Refreshing [dbo].[vGroupCompany]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vGroupCompany]';


GO
PRINT N'Altering [dbo].[vNumberUsers]...';


GO
ALTER VIEW dbo.vNumberUsers
AS
SELECT DISTINCT 
                      U.UserID, U.Name, UAN.AnalysisView, UAN.AnalysisRawData, AE.AdvanceExtID, AE.Number, U.CompanyId, CAST(CASE WHEN UAN.UserID IS NOT NULL 
                      THEN 1 ELSE 0 END AS BIT) AS Active
FROM         dbo.UserAdvanceNumbers AS UAN RIGHT OUTER JOIN
                      dbo.AdvanceExtension AS AE ON UAN.AdvanceExtId = AE.AdvanceExtID RIGHT OUTER JOIN
                      dbo.[Users] AS U ON UAN.UserID = U.UserID
GO
PRINT N'Refreshing [dbo].[vStaffLog]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vStaffLog]';


GO
PRINT N'Refreshing [dbo].[vSupportLog]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vSupportLog]';


GO
PRINT N'Refreshing [dbo].[vUserAdvanceNumbers]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vUserAdvanceNumbers]';


GO
PRINT N'Refreshing [dbo].[vUserInfo]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vUserInfo]';


GO
PRINT N'Refreshing [dbo].[vUserInfo_20051228]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vUserInfo_20051228]';


GO
PRINT N'Refreshing [dbo].[vUserWithCompany]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[vUserWithCompany]';


GO
PRINT N'Altering [cube].[Interv]...';


GO


ALTER view [cube].[Interv] AS 

SELECT 
	--CAST(1 AS smallint) AS [IntervalId]
	--,CAST(1 AS int) AS [Interval]
	--,CAST('' AS varchar(10)) AS [Text]


	[IntervalId]
	,[Interval]
	,[Text]
	,CASE
		WHEN Interval <= 60 THEN 'Low'
		WHEN Interval > 60 AND Interval <= 300 THEN 'Medium'
		WHEN Interval > 300 THEN 'High'
		END AS IntervalRange
  FROM [dbo].[Interval]
GO
PRINT N'Altering [cube].[Time]...';


GO




ALTER view [cube].[Time] AS

SELECT
	CAST(REPLACE(REPLACE(CONVERT(char(13),dateTime,120),'-',''),' ','') AS int) As DateTimeId,
	YEAR(dateTime) As Year,
	CAST(Year(dateTime) as CHAR(4)) As YearName,
	MONTH(dateTime) As MonthNumberOfYear,
	CASE 
		WHEN MONTH(dateTime) =  1 THEN 'Januari'
		WHEN MONTH(dateTime) =  2 THEN 'Februari'
		WHEN MONTH(dateTime) =  3 THEN 'Mars'
		WHEN MONTH(dateTime) =  4 THEN 'April'
		WHEN MONTH(dateTime) =  5 THEN 'Maj'
		WHEN MONTH(dateTime) =  6 THEN 'Juni'
		WHEN MONTH(dateTime) =  7 THEN 'Juli'
		WHEN MONTH(dateTime) =  8 THEN 'Augusti'
		WHEN MONTH(dateTime) =  9 THEN 'September'
		WHEN MONTH(dateTime) =  10 THEN 'Oktober'
		WHEN MONTH(dateTime) =  11 THEN 'November'
		WHEN MONTH(dateTime) =  12 THEN 'December'
      END As MonthName,
     CAST(REPLACE(CONVERT(char(10),dateTime,120),'-','') As int) As DateId,
     CONVERT(char(10),dateTime,120) As DateName,  
     DATEPART(dd, dateTime) as DayNumberOfMonth,
     DATEPART(dy, dateTime) As DayNumberOfYear,
     DATEPART(hh, dateTime) as HourNumberOfDay,
	 DATEPART(wk, dateTime) As WeekNumberOfYear,
     DATEPART(dw, dateTime) as WeekDayNumber,
     CASE 
		WHEN DATEPART(dw, dateTime) =  1 THEN 'Söndag'
		WHEN DATEPART(dw, dateTime) =  2 THEN 'Måndag'
		WHEN DATEPART(dw, dateTime) =  3 THEN 'Tisdag'
		WHEN DATEPART(dw, dateTime) =  4 THEN 'Onsdag'
		WHEN DATEPART(dw, dateTime) =  5 THEN 'Torsdag'
		WHEN DATEPART(dw, dateTime) =  6 THEN 'Fredag'
		WHEN DATEPART(dw, dateTime) =  7 THEN 'Lördag'
      END As WeekDayName
FROM
	dbo.TimeDimension
GO
PRINT N'Altering [dbo].[vCallData]...';


GO



ALTER VIEW [dbo].[vCallData]
AS
SELECT     dbo.AnswerExtension.Number AS AnswerExtension,dbo.CallData.CallDateTime, dbo.CallData.Extension, CONVERT(char(11), dbo.CallData.CallDateTime, 121) AS CallDate, 
                      RIGHT('0' + CAST(DATEPART(hh, dbo.CallData.CallDateTime) AS varchar), 2) + ':' + RIGHT('0' + CAST(DATEPART(mi, dbo.CallData.CallDateTime) 
                      AS varchar), 2) + ':' + RIGHT('0' + CAST(DATEPART(ss, dbo.CallData.CallDateTime) AS varchar), 2) AS CallTime, dbo.CallData.CallDuration, 
                      dbo.CallType.CallType, dbo.AreaCode.AreaCode AS area,dbo.AreaCode.Area As Ort, dbo.Region.Region, dbo.AdvanceExtension.AdvanceExtID, 
                      dbo.AnswerExtension.AnswerExtID
FROM         dbo.AdvanceExtension INNER JOIN
                      dbo.AnswerExtension ON dbo.AdvanceExtension.AdvanceExtID = dbo.AnswerExtension.AdvanceExtId INNER JOIN
                      dbo.CallData ON dbo.AnswerExtension.AnswerExtID = dbo.CallData.AnswerExtId INNER JOIN
                      dbo.CallType ON dbo.CallData.CallTypeID = dbo.CallType.ID INNER JOIN
                      dbo.AreaCode ON dbo.CallData.AreaCode = dbo.AreaCode.AreaCode INNER JOIN
                      dbo.Region ON dbo.AreaCode.RegionId = dbo.Region.RegionId
GO
PRINT N'Creating [dbo].[vNumberUsers].[MS_DiagramPane1]...';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane1', @value = N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[46] 4[27] 2[6] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "AE"
            Begin Extent = 
               Top = 307
               Left = 349
               Bottom = 469
               Right = 520
            End
            DisplayFlags = 280
            TopColumn = 4
         End
         Begin Table = "U"
            Begin Extent = 
               Top = 23
               Left = 352
               Bottom = 285
               Right = 527
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "UAN"
            Begin Extent = 
               Top = 170
               Left = 34
               Bottom = 353
               Right = 206
            End
            DisplayFlags = 280
            TopColumn = 3
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1635
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vNumberUsers';


GO
PRINT N'Creating [dbo].[vNumberUsers].[MS_DiagramPaneCount]...';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 1, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vNumberUsers';


GO
PRINT N'Refreshing [dbo].[AdvanceStats]...';


GO
SET QUOTED_IDENTIFIER ON;

SET ANSI_NULLS OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[AdvanceStats]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Refreshing [dbo].[spApplicationStats]...';


GO
SET QUOTED_IDENTIFIER ON;

SET ANSI_NULLS OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[spApplicationStats]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Refreshing [dbo].[spGetUserAdvanceNumbers]...';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[spGetUserAdvanceNumbers]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Refreshing [dbo].[UserAdmin]...';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[UserAdmin]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Refreshing [dbo].[userStatistics1day]...';


GO
SET QUOTED_IDENTIFIER ON;

SET ANSI_NULLS OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[userStatistics1day]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Refreshing [dbo].[userStatistics20min]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[userStatistics20min]';


GO
PRINT N'Refreshing [dbo].[userStatistics30days]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[userStatistics30days]';


GO
PRINT N'Refreshing [dbo].[VIP_Select_UserPermissions]...';


GO
SET ANSI_NULLS ON;

SET QUOTED_IDENTIFIER OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[VIP_Select_UserPermissions]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Refreshing [dbo].[VIP_Select_UserPermissions_EditUser]...';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER OFF;


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[VIP_Select_UserPermissions_EditUser]';


GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON;


GO
PRINT N'Checking existing data against newly created constraints';


GO
ALTER TABLE [dbo].[AnswerExtension] WITH CHECK CHECK CONSTRAINT [FK_AnswerExtension_AdvanceExtension];

ALTER TABLE [dbo].[Bookmarks] WITH CHECK CHECK CONSTRAINT [FK_Bookmarks_Users];

ALTER TABLE [dbo].[CompanyInfo] WITH CHECK CHECK CONSTRAINT [FK_Webb_Users_Org_Webb_Users_Koncern];

ALTER TABLE [dbo].[UserAdvanceNumbers] WITH CHECK CHECK CONSTRAINT [FK_UserAdvanceNumbers_Webb_Users_Login];

ALTER TABLE [dbo].[UserSettings] WITH CHECK CHECK CONSTRAINT [FK_UserSettings_Webb_Users_Login];

ALTER TABLE [dbo].[CompanyInfosInRoles] WITH CHECK CHECK CONSTRAINT [FK_CompanyInfosInRoles_CompanyInfo];

ALTER TABLE [dbo].[CompanyInfosInRoles] WITH CHECK CHECK CONSTRAINT [FK_CompanyInfosInRoles_Role];

ALTER TABLE [dbo].[IncludedRole] WITH CHECK CHECK CONSTRAINT [FK_IncludedRole_BaseRole];

ALTER TABLE [dbo].[IncludedRole] WITH CHECK CHECK CONSTRAINT [FK_IncludedRole_IncludedRole];

ALTER TABLE [dbo].[UsersInRoles] WITH CHECK CHECK CONSTRAINT [FK_UsersInRoles_Role];

ALTER TABLE [dbo].[UsersInRoles] WITH CHECK CHECK CONSTRAINT [FK_UsersInRoles_Users];

ALTER TABLE [dbo].[AdvanceExtension] WITH CHECK CHECK CONSTRAINT [FK_AdvanceExtension_ChangedBy];

ALTER TABLE [dbo].[AdvanceExtension] WITH CHECK CHECK CONSTRAINT [FK_AdvanceExtension_CompanyInfo];

ALTER TABLE [dbo].[CompanyInfo] WITH CHECK CHECK CONSTRAINT [FK_CompanyInfo_ChangedByUser];

ALTER TABLE [dbo].[CompanyInfo] WITH CHECK CHECK CONSTRAINT [FK_CompanyInfo_ContactAnalys];

ALTER TABLE [dbo].[CompanyInfo] WITH CHECK CHECK CONSTRAINT [FK_CompanyInfo_ContactLeverantörsinformation];

ALTER TABLE [dbo].[CompanyInfo] WITH CHECK CHECK CONSTRAINT [FK_CompanyInfo_ContactWebstyrning];

ALTER TABLE [dbo].[GroupInfo] WITH CHECK CHECK CONSTRAINT [FK_GroupInfo_ChangedBy];

ALTER TABLE [dbo].[UserAdvanceNumbers] WITH CHECK CHECK CONSTRAINT [FK_UserAdvanceNumbers_ChangedByUser];

ALTER TABLE [dbo].[Users] WITH CHECK CHECK CONSTRAINT [FK_User_ChangedByUser];


GO

PRINT N'Altering [dbo].[vCompanyInfo]...';


GO
ALTER VIEW dbo.vCompanyInfo
AS
SELECT     CI.CompanyName, CI.OrgNr, CI.Country, GI.GroupName, GI.GroupCode, CI.EDI, CI.PhoneKey, CI.ActiveVIP, CI.ActiveStat, CI.ActiveCpa, CI.CreationDate, 
                      CI.ChangedDate, CI.New, CI.CompanyId, CI.ExtendedMulti, UA.Name AS NameA, UA.TelNo AS TelNoA, UA.Email AS EmailA, Ud.Name AS nameD,
                      Ud.Email AS EmailD, Ud.TelNo AS TelNoD, CI.ChangedBy, 
		 UC.Name as NameC, UC.Email AS EmailC, UC.TelNo AS TelNoC,
		CI.UserIdA, CI.UserIdD, CI.UserIdCpa
FROM         dbo.CompanyInfo CI LEFT OUTER JOIN
                      dbo.[Users] UA ON CI.UserIdA = UA.UserID LEFT OUTER JOIN
                      dbo.GroupInfo GI ON CI.GroupId = GI.GroupId LEFT OUTER JOIN
                      dbo.[Users] Ud ON CI.UserIdD = Ud.UserID LEFT OUTER JOIN
		dbo.[Users] UC on CI.UserIdCpa = UC.UserID
GO
PRINT N'Altering [dbo].[vUserInfo]...';


GO
ALTER VIEW dbo.vUserInfo
AS
SELECT     U.UserID, U.CompanyId, U.Security, US.NoOfRecords, US.Expmenu, CI.CompanyName, GI.GroupName, U.Eno, U.LoginName, U.Password, GI.GroupId, 
                      GI.GroupCode, CI.OrgNr, U.Email, U.TelNo, U.Note, U.Name, US.LogonDate, U.ProdStod, U.CreationDate, U.ChangedDate, CI.ExtendedMulti, 
                      CI.ActiveVIP, CI.ActiveStat, CI.ActiveCpa, CI.PhoneKey, ChangingUser.Name AS ChangedByName, ContactAUser.Name AS ContactAName, 
                      ContactAUser.Email AS ContactAEmail, ContactAUser.TelNo AS ContactATelNo, ContactDUser.Name AS ContactDName, 
                      ContactDUser.Email AS ContactDEmail, ContactDUser.TelNo AS ContactDTelNo, CI.UserIdA, CI.UserIdD,
	ContactCUser.Name as ContactCName, ContactCUser.Email as ContactCEmail, ContactCUser.TelNo as ContactCTelNo, CI.UserIdCpa as UserIdC
FROM         dbo.[Users] U LEFT OUTER JOIN
                      dbo.UserSettings US ON U.UserID = US.UserId INNER JOIN
                      dbo.CompanyInfo CI ON U.CompanyId = CI.CompanyId LEFT OUTER JOIN
                      dbo.[Users] ContactAUser ON CI.UserIdA = ContactAUser.UserID LEFT OUTER JOIN
                      dbo.[Users] ContactDUser ON CI.UserIdD = ContactDUser.UserID LEFT OUTER JOIN

	dbo.[Users] ContactCUser ON CI.UserIdCpa = ContactCUser.UserID LEFT OUTER JOIN

                      dbo.[Users] ChangingUser ON U.ChangedBy = ChangingUser.UserID LEFT OUTER JOIN
                      dbo.GroupInfo GI ON CI.GroupId = GI.GroupId
GO
PRINT N'Update complete.';


GO

/*
 * REMOVE DUMMY KONCERN CONNECTIONS
 */
PRINT N'Removing dummy CompanyInfo.GroupId connections (GroupId = 4).';
UPDATE CompanyInfo
	SET GroupId = NULL
	WHERE GroupId = 4

/*
 * INSERT ROLES
 */
PRINT N'Inserting Roles into table Role.';

MERGE INTO [Role] AS Target 
USING (VALUES
	(1,	'Kund',							NULL,	NULL),
	(2,	'Säljare',						NULL,	NULL),
	(3,	'Administratör',				NULL,	NULL),
	(4,	'Koncernrättigheter',			NULL,	NULL),
	(5,	'Analys',						NULL,	1),
	(6, 'Webbstyrning',					NULL,	1),
	(7, 'Webbstyrning_Write',			NULL,	1),
	(8, 'Webbstyrning_Multistyrning',	NULL,	1),
	(9,	'Leverantörsinformation',		NULL,	1)
) 
AS Source (Id, Name, [Description], ApplicationRole) 
ON Target.Id = Source.Id

-- update matched rows 
WHEN MATCHED THEN
UPDATE SET
	Name = Source.Name,
	[Description] = Source.[Description],
	ApplicationRole = Source.ApplicationRole

--insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (Id, Name, [Description], ApplicationRole) 
VALUES (Id, Name, [Description], ApplicationRole)

--delete rows that are in the target but not the source 
WHEN NOT MATCHED BY SOURCE THEN 
DELETE
;

/*
 * MIGRATING USER ROLES
 */
PRINT N'Migrating User Roles';

 -- Webbstyrning läsbehörighet
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 6
FROM [Users]
WHERE SUBSTRING([Security], 1, 1) = 3

-- Webbstyrning läs/skriv
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 7
FROM [Users]
WHERE SUBSTRING([Security], 1, 1) IN (5, 7) -- Osäker på vad 7 innebär. Endast 22 användare. Kanske gammalt...

-- Multistyrning
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT [Users].UserId, 8
FROM
	[Users]
	LEFT JOIN CompanyInfo ON [Users].CompanyId = CompanyInfo.CompanyId
WHERE
	SUBSTRING([Users].[Security], 1, 1) <> 0
	AND (
		CompanyInfo.CompanyId IS NULL
		OR CompanyInfo.ExtendedMulti = 1
	)

-- Leverantörsinformation
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 9
FROM [Users]
WHERE SUBSTRING([Security], 3, 1) = 1

-- Säljare
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 2
FROM [Users]
WHERE SUBSTRING([Security], 5, 1) = 1

-- Administratör
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 3
FROM [Users]
WHERE SUBSTRING([Security], 5, 1) = 5

-- Analys
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 5
FROM [Users]
WHERE
	SUBSTRING([Security], 7, 1) <> 0
	OR SUBSTRING([Security], 9, 1) <> 0
	
-- Koncernbehörighet
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 4
FROM [Users]
WHERE SUBSTRING([Security], 8, 1) = 2

/*
 * INSERTING QUICK HELP
 */
PRINT N'Inserting QuickHelps and QuickHelpEntries';

INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'Hantera', N'
					<h2 class="tsQuickHelp-heading h2" data-toggle-target="tsQuickHelp-hidden">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="ebf91cd9-2cec-40f5-9f92-c927aa54086b" data-list-id="1">
								<span class="tsSecondaryLink">Hantera</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="4727112e-7198-4281-8b6d-f3539e682cac" data-list-id="1">
								<span class="tsSecondaryLink">Roller</span>
							</li>
						</ul>
					</div>
					<div class="tsColumn-list-4" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Guider</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="a56c535f-e97e-4719-ad6f-933ff4972a52" data-list-id="1">
								<span class="tsSecondaryLink">Skapa ett meddelande</span>
							</li>
						</ul>
					</div>
					<div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'Hantera_Användare_Create', N'
					<h2 class="tsQuickHelp-heading h2" data-toggle-target="tsQuickHelp-hidden">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-4" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Guider</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="fdb0b557-1162-476f-ae1f-847da85ba579" data-list-id="1">
								<span class="tsSecondaryLink">Skapa en användare</span>
							</li>
						</ul>
					</div>
					<div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')

INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'Hantera_Användare_Edit', N'
					<h2 class="tsQuickHelp-heading h2" data-toggle-target="tsQuickHelp-hidden">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-4" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Guider</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="e5fe87f3-c1fe-4de8-ae78-f980b367c9f9" data-list-id="1">
								<span class="tsSecondaryLink">Redigera en användare</span>
							</li>
						</ul>
					</div>
					<div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')

INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'Hantera_Bolag_Edit', N'
					<h2 class="tsQuickHelp-heading h2" data-toggle-target="tsQuickHelp-hidden">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="240fbdae-6b4f-455d-af5e-23c571ffacf8" data-list-id="1">
								<span class="tsSecondaryLink">Kontaktpersoner</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="01f7cec6-ea4f-46ad-b9b6-d5fccc58fa2b" data-list-id="1">
								<span class="tsSecondaryLink">Nummer</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="8627ec7a-dd33-4937-abec-80702855dd4d" data-list-id="1">
								<span class="tsSecondaryLink">Webbstyrning nyckel</span>
							</li>
						</ul>
					</div>
					<div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'Hantera_Bolag_Nummer_Edit', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="298c14a8-6523-4bcc-9efb-2dd62753aa23" data-list-id="1">
								<span class="tsSecondaryLink">Redigera nummer</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="50e8509a-328f-454f-8a3b-5923e6f1bf06" data-list-id="1">
								<span class="tsSecondaryLink">Prenumerera</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'Meddelande', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="171fd243-0220-4a03-9c95-60dab0277dc9" data-list-id="1">
								<span class="tsSecondaryLink">Vad är meddelanden</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Admin', N'SkapaMeddelande', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Admin</h2>
					<div class="tsColumn-list-4" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Guider</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="1de54460-446b-45c4-b64c-f66237a3a325" data-list-id="1">
								<span class="tsSecondaryLink">Skapa ett meddelande</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Analys', N'Index', N'
						<div class="tsColumn-list-2" data-toggle-target="tsQuickHelp-hidden">
							<h3 class="h3">Fr&aring;gor och svar</h3>
									<ul class="tsQuickHelp-list">
												<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="157e91c2-c332-4012-bd3d-88bab82b40f0" data-list-id="0">
													<span class="tsSecondaryLink">Vad är analys?</span>
												</li>
												<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="24271c7c-da9f-4f8a-afcb-ab816fa509be" data-list-id="0">
													<span class="tsSecondaryLink">Kombinerad sökning</span>
												</li>
												<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="45d3f364-c0f6-4911-adcc-287c3fa0819b" data-list-id="0">
													<span class="tsSecondaryLink">Exportering</span>
												</li>
									</ul>
						</div>
						<div class="tsColumn-list-4" data-toggle-target="tsQuickHelp-hidden">
							<h3 class="h3">Popul&auml;ra guider</h3>
									<ul class="tsQuickHelp-list">
												<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="77f2e098-2835-452a-81e0-00b8ea6c9651" data-list-id="0">
													<span class="tsSecondaryLink">Grundläggande analys</span>
												</li>
												<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="14277399-6205-41d7-bdfc-ea0d0e78086c" data-list-id="0">
													<span class="tsSecondaryLink">Avancerad analys</span>
												</li>
									</ul>
						</div>
					<div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
						<div class="tscInfo-bar">
							<ul class="tscInfo-list">
									<li class="tscInfo-listItem">
										<i class="tsIcon-Telephone"></i>
										<p>90 400</p>
									</li>
							</ul>
								<p><strong>Nummerj&auml;nst</strong> X-XX</p>
						</div>
				</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Leverantörsinformation', N'Index', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Leverantörsinformation</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="f0e230de-35c7-4d25-9681-9149dd14ad3e" data-list-id="1">
								<span class="tsSecondaryLink">Vad är leverantörsinformation</span>
							</li>
						</ul>
					</div>
					<div class="tsColumn-list-4" data-toggle-target="tsQuickHelp-hidden">
						<h3 class="h3">Guider</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="f5893594-c11d-41e1-ad4c-e0be5798fd34" data-list-id="1">
								<span class="tsSecondaryLink">Telia 900 nummer</span>
							</li>
                            <li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="3a19e3c8-cca1-4302-afd7-91c3ea649f0b" data-list-id="1">
								<span class="tsSecondaryLink">Innehållsleverantörer</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>020-900944</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Leverantörsinformation', N'Innehållsleverantör_Create', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Leverantörsinformation</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="521f6468-8fbc-4a5a-b493-bfc3547148c9" data-list-id="1">
								<span class="tsSecondaryLink">Skapa innehållsleverantör</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Webstyrning', N'Index', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Webbstyrning</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="246c0377-4f3d-4610-8611-fce520263dba" data-list-id="1">
								<span class="tsSecondaryLink">Vad är en Webbstyrning</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="9757aac7-b05e-4801-8c15-f2733ddb38df" data-list-id="1">
								<span class="tsSecondaryLink">Vad är multistyrning</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="d655f74d-a88a-4ad1-a25c-0f366d61df78" data-list-id="1">
								<span class="tsSecondaryLink">När aktiveras styrningskön</span>
                            </li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="81e15038-dc24-472a-961b-65b0aa465981" data-list-id="1">
								<span class="tsSecondaryLink">Hantera abonnemang</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Webstyrning', N'Webstyrning_Abonnemang', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Webbstyrning</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="cae33bb4-22cc-4f50-b25d-0c8d112dc192" data-list-id="1">
								<span class="tsSecondaryLink">Logg</span>
							</li>
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="e13ebc38-c423-4ed2-b30c-87639f3efcfe" data-list-id="1">
								<span class="tsSecondaryLink">Hantera abonnemang</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Webstyrning', N'Multistyrning', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Multistyrning</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="eea30116-09b3-40f4-bf1e-48c7f6790966" data-list-id="1">
								<span class="tsSecondaryLink">Schemalägg multistyrning</span>
							</li>
                            <li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="fdd7b619-2cde-4c78-8183-13b54731a5b0" data-list-id="1">
								<span class="tsSecondaryLink">Nytt multistyrningsalternativ</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Webstyrning', N'Multistyrning_Alternativ_Create', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Multistyrning</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
                            <li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="e5eae396-1b1c-46a0-9b22-024196388bfe" data-list-id="1">
								<span class="tsSecondaryLink">Skapa ett multistyrningsalternativ</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')
INSERT [dbo].[QuickHelps] ([Controller], [Action], [HTML]) VALUES (N'Webstyrning', N'Multistyrningskö_Create', N'<h2 class="tsQuickHelp-heading h2">Hjälp direkt - Multistyrning</h2>
					<div class="tsColumn-list-2" data-toggle-target="tsQuickHelper-hidden">
						<h3 class="h3">Vanliga frågor</h3>
						<ul class="tsQuickHelp-list">
							<li class="tsQuickHelp-list-item secondaryToggleListItem" data-id="a4c7f7f2-0e41-4d62-a06a-e190c0043a36" data-list-id="1">
								<span class="tsSecondaryLink">Schemalägg multistyrning</span>
							</li>
						</ul>
					</div>
                    <div class="tsExpandableWrapper" style="display: none;"><div class="tsExpandable-arrowDown"></div><div id="dataContainer"></div></div>
					<div class="tscInfo-bar">
						<ul class="tscInfo-list">
							<li class="tscInfo-listItem">
								<i class="tsIcon-Telephone"></i>
								<p>90 400</p>
							</li>
						</ul>
					</div>')

/****** Object:  Table [dbo].[QuickHelpEntries]    Script Date: 11/14/2014 14:19:42 ******/
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'14277399-6205-41d7-bdfc-ea0d0e78086c', N'{ "question": "Avancerad analys", "answer": "<p>Beroende av din behörighet finns det skillnader för vad du får och inte får se i Telia Analys. I Telia Analys finns behörigheterna Tidsdata, Ursprungsdata och Rådata tillgängliga.</p> <p>Man kan på ett enkelt sätt exportera över den visade informationen till en text-fil eller Excels kalkylark för egen bearbetning. Exporterar man till Excel kommer uppgifterna med även i form av grafer på egna flikar i kalkylarket. På det sättet kan man enkelt föra över dessa till tex. OH-bilder. Denna funktion är tillgänglig på samtliga nivåer.</p> <p><strong>Tidsdata</strong> - Om du endast innehar behörigheten Tidsdata finns det vissa begränsningar för dig. Du får då endast göra ditt urval på kategorierna ''Månad'' och ''Upptagningsområde''. Vidare kan du bryta ned ditt urval till ''månad'' och ''dag''. Lagringstid för denna behörighetsnivå är 3 månader tillbaka i tiden.</p><p><strong>Ursprungsdata</strong> - Om du innehar behörigheten Ursprungsdata gör du först ett urval på kategorierna ''Svarsställe'', ''Månad'' och ''Från upptagningsområde''. Sedan kan du bryta ned ditt urval geografiskt (baserat på den uppringandes riktnummer) ''Från upptagningsområde'', ''Riktnummer'', ''Nummergrupp'' och ''Datum''. Lagringstid för denna behörighetsnivå är 15 månader tillbaka i tiden.</p><p><strong>Rådata</strong> - Rådata är en rådatafil med uppgifter om inkommande samtal som du själv bearbetar i Excel eller liknande. Vid behörighet Rådata får man automatiskt tillgång till Tidsdata.  Lagringstid för denna behörighetsnivå är 15 månader tillbaka i tiden.</p><p><strong>Koncern</strong> - Innehar du koncernrättighet har du även möjlighet att göra analys för andra bolag i koncernen.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'157e91c2-c332-4012-bd3d-88bab82b40f0', N'{ "question": "Vad är analys?", "answer": "<p>Analys ger dig möjlighet att överblicka samtalen till dina nummer med avseende på tid och ursprung.</p> <p>Det finns tre typer av analys: <ul><li>Tidsdata - ger statistik över tidpunkter för när dina kunder ringt</li><li>Ursprungsdata - visar en totalbild över varifrån dina kunder ringer</li><li>Rådata - ger dig underlag för egen bearbetning</li></ul></p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'171fd243-0220-4a03-9c95-60dab0277dc9', N'{ "question": "Vad är meddelanden", "answer": "<p>Meddelanden används för att hantera meddelanden för användare på sidan. Du kan exempelvis välja ett specifikt meddelande för respektive del (Analys, Webbstyrning, Leverantörsinformation och Admin). Meddelanden kan exempelvis användas för att upplysa användaren om information.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'1de54460-446b-45c4-b64c-f66237a3a325', N'{ "question": "Skapa ett meddelande", "answer": "<p>Du kan välja att skapa ”Info” eller ”Panic” meddelanden. Skillnaden mellan dessa är färgerna som visas. ”Info” är blå och ”Panic” är röd orange. Du måste sedan välja mellan vilka datum meddelandet skall visas, skriva in ett meddelande och du har även möjlighet att begränsa meddelandet för roller.</p><p>När du är färdig trycker du på spara för att spara ditt meddelande.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'24271c7c-da9f-4f8a-afcb-ab816fa509be', N'{ "question": "Kombinerad sök", "answer": "<p>En kombinerad sökning innebär att du har möjlighet att söka på de olika alternativ som finns tillgängliga. Det är dock inte obligatoriskt om inget annat anges. Du kan exempelvis välja ett abonnemang som finns tillgängliga, välja ett till och från datum och slutligen välja ett upptagningsområde.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'246c0377-4f3d-4610-8611-fce520263dba', N'{ "question": "Vad är en webbstyrning", "answer": "<p>Huvudmodulen Direktstyrning, som vi nu kallar Webbstyrning, är där kundanvändaren jobbar. Det är här funktionalitet för att göra omstyrningar mellan olika dirigeringsalternativ finns. Det finns även möjlighet för kunden att se hur ett styrningsalternativ är uppbyggt i en grafisk trädstruktur.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'298c14a8-6523-4bcc-9efb-2dd62753aa23', N'{ "question": "Redigera nummer", "answer": "<p>På denna sida kan du redigera behörigheten för analys för det valda numret.</p><p>Det finns tre typer av behörigheter: <ol><li>Bara tidsdata</li><li>Tidsdata och geografisk data</li><li>Rådata</li></ol></p> <p>Behörigheten bygger på en hierarkisk nivå. Först måste du välja behörigheten för bolaget och sedan behörigheten för användaren. Alla användare för bolaget är listade och du kan välja behörigheten för användaren. Om du exempelvis har ”Bara tidsdata” behörighet på bolaget så är detta den enda nivå som du kan välja för användaren. Har du behörigheten ”Tidsdata och geografisk data”, så kan du välja båda behörigheterna för användaren. Du måste även aktivera behörigheten för användaren när du är klar. För att spara dina användningar måste du trycka på ”Spara”.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'3a19e3c8-cca1-4302-afd7-91c3ea649f0b', N'{ "question": "Innehållsleverantörer", "answer": "<p>En innehållsleverantör är en kund som skapas för att kunna registrera betalnummertjänster på. Detaljerad information hittar du under sidan där du skapar en innehållsleverantör.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'45d3f364-c0f6-4911-adcc-287c3fa0819b', N'{ "question": "Exportera", "answer": "<p>Du har möjlighet att exportera viss information i Analys genom att söka på en viss data och sedan använda dig utav exportknapparna. Datan som exporteras baseras på de sökfilter som har applicerats och inte det som visas i webb-vyn. Det finns två typer av exporter:</p><p><ol type=''1''><li>Rådata – exportera allt innehåll som rådata</li><li>Exportera till Excel – denna del exporterar en Excelfil med data och grafer för månad, dag, veckodag och timme</li></ol></p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'4727112e-7198-4281-8b6d-f3539e682cac', N'{ "question": "Roller", "answer": "<p>Det finns tre typer av roller:</p> <p><ol>Kund – en kundroll kan ha följande rättigheter <ol><li>Analys</li> <li>Webbstyrning <ul>Läs</ul> <ul>Skriv</ul></li> <li>Koncernrättigheter</li> <li>Information om innehållsleverantörer</li></ol> Säljare <br> Administratör</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'521f6468-8fbc-4a5a-b493-bfc3547148c9', N'{ "question": "Skapa innehållsleverantör", "answer": "<p>För att kunna registrera betalnummer måste du först skapa en innehållsleverantör. För att skapa en innehållsleverantör behöver du fylla i formuläret nedan. Fält markerade med en asterisk (*) är obligatoriska. Om du vill registrera ett utländskt företag behöver du bocka för checkboxen för utländskt företag och då kommer det svenska fältet för organisationsnummer automatiskt att gråmarkeras. När ett utländskt företag registreras kommer ett fiktivt organisationsnummer att skapas och visas i tabellen.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'77f2e098-2835-452a-81e0-00b8ea6c9651', N'{ "question": "Grundläggande analys", "answer": "<p>I analysformuläret finns följande fält tillgängliga för inmatning av data:</p> <p>Abonnemang – i denna automatisk kompletterande dropdownlista kan du antigen knappa in ett telefonnummer och utifrån det som du knappar in kommer matchade resultat att visas i listan. Du har även möjlighet att välja ett abonnemang i listan. <br><br><strong>OBS! När du har valt ett abonnemang så kommer du att få fram svarsställen som du kan välja.</strong></p> <p>Datum – det finns två datumväljare, från och till. Här har du möjligheten att sortera data på de datum du vill visa. Från datumet måsta vara tidigare än senare datumet.</p> <p>Svarsställe – här kan du via checkboxar filtrera ut data. Du kan välja svarsställen som det valda abonnemanget har och även upptagningsområden. Du kan välja flera alternativ.</p> <p>Slutligen kan du välja om du vill visa:</p> <ol><li>Tidsdata</li><li>Ursprungsdata - Ursprungsdata ger dig noggrann statistik över det geografiska ursprunget på alla samtal till dina nummer. Samtalen härleds till olika nummergrupper där alla samtal från telefonnummer med samma fem första siffror inklusive riktnumret har samlats. För varje geografiskt område summeras följande data: antal samtal, total samtalslängd, medelsamtalslängd samt samtalen procentuellt uppdelat på tre tidsintervall som du själv kan justera. Nummergrupperna kan brytas ner i enskilda samtal och då visas samtalslängd, exakt tidpunkt och typ av samtal för varje samtal</li><li>Rådata - Med hjälp av funktionen Rådata kan du på ett enkelt sätt exportera statistikunderlaget till annan källa. Du väljer om du vill se resultatet som Kalkylark eller Text. Väljer du att exportera som Kalkylark får du se resultatet uppdelat i kolumner, färger m.m. Väljer du att exportera som Text får du se resultatet i form av en semikolonseparerad text.</li></ol><p>Du behöver ha rätt behörighet för att kunna visa de olika delarna. För att läsa om behörigheter se ”Avancerad analys”.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'9757aac7-b05e-4801-8c15-f2733ddb38df', N'{ "question": "Vad är en multistyrning", "answer": "<p>Här har man möjlighet att lägga upp, editera samt ta bort styrningsalternativ. Befintliga styrningsalternativ visas i en lista.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'a4c7f7f2-0e41-4d62-a06a-e190c0043a36', N'{ "question": "Schemalägg multistyrning", "answer": "<p>För att schemalägga ett multistyrningsalternativ behöver du först välja ett multistyrningsalternativ i dropdown listan. I dropdown listan listas alla multistyrningar som har skapats. Sedan måste du välja en alternativknapp. Du kan antigen välja:</p><ol><li>Begärt datum – mata in datum och välj en tidpunkt</li><li>Så snart som möjligt – systemet kommer automatiskt att schemalägga multistyrningen så snart som möjligt</li></ol><p>När du är färdig trycker du på ”Skapa” för att skapa schemaläggningen.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'd655f74d-a88a-4ad1-a25c-0f366d61df78', N'{ "question": "När aktiveras styrningskön", "answer": "<p>Visar kölistan för lagda Multistyrningar. Härifrån kan användaren lägga upp nya, radera och förändra sina lagda köposter. En multistyrningskö aktiveras på det datum och klockslag som är satt för kön.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'e5eae396-1b1c-46a0-9b22-024196388bfe', N'{ "question": "Hur du skapar ett multistyrningsalternativ", "answer": "<p>När du skapar ett nytt multistyrningsalternativ så behöver du:</p><ol><li>Ange ett namn på multistyrningen</li><li>Koppla ett befintligt abonnemang från dropdownlistan</li><li>Sedan trycka på ”Lägg till” för att spara</li></ol><p>Det som nu sker är att en rad läggs till med det valda abonnemanget och även ett styrningslaternativ för det valda abonnemanget. Du kan nu byta styrningsalternativ för det valda abonnemanget eller behålla det befintliga.</p><p>Du kan lägga till fler abonnemang eller ta bort ett tillagt abonnemang genom att trycka på ”X” till höger om styrningsalternativet. När du är färdig trycker du på ”Spara”. Om du vill avbryta utan att spara trycker du på ”Avbryt”.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'ebf91cd9-2cec-40f5-9f92-c927aa54086b', N'{ "question": "Hantera", "answer": "<p>Under <strong>Koncern</strong> lägger Du upp de koncerner som har helt eller delvis tillgång till Telia Nummertjänster.</p><p>Under Bolag lägger Du upp de <strong>bolag</strong> som har tillgång till Telia Nummertjänster. För att Du skall kunna koppla bolaget mot en Koncern, måste koncernen vara upplagd. Detta gör du under <strong>Koncerner</strong>. För att sedan sätta en användare som kontaktperson måste du först skapa bolaget och sedan skapa en användare och koppla denne till bolaget och sedan gå in i bolaget igen och sätta användaren som kontaktperson.</p> <p>Under Användare lägger Du upp respektive användare, oavsett kategori, i Telia Nummertjänster. Förutsättning för att Du skall kunna lägga upp en användare i Telia Nummertjänster är att bolaget som användaren tillhör finns registrerad under <strong>Bolag</strong></p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'eea30116-09b3-40f4-bf1e-48c7f6790966', N'{ "question": "Schemalägg multistyrning", "answer": "<p>Här kan du schemalägga dina multistyrningsalternativ. Detaljerad information hittar du under sidan där du schemalägger en multistyrning.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'f0e230de-35c7-4d25-9681-9149dd14ad3e', N'{ "question": "Vad är leverantörsinformation", "answer": "<p>Här registreras information som ses på slutkunders faktura då de har ringt betalnummer d.v.s. nummer som börjar på 0900. En innehållsleverantör måste först registreras innan du kan gå vidare till Telia 900 nummer.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'f5893594-c11d-41e1-ad4c-e0be5798fd34', N'{ "question": "Telia 900 nummer", "answer": "<p>Telia 900 nummer är en tjänst för att ta betalt för informations- och underhållningstjänster per telefon (även mobil). Detaljerad information hittar du under sidan där du redigerar ett Telia 900 nummer.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'fdd7b619-2cde-4c78-8183-13b54731a5b0', N'{ "question": "Nytt multistyrningsalternativ", "answer": "<p>Här skapar du ett nytt multistyrningsalternativ för ett/flera valda abonnemang. Du kan alltså styra flera abonnemang samtidigt här. Detaljerad information hittar du under sidan där du skapar en ny multistyrning.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'a56c535f-e97e-4719-ad6f-933ff4972a52', N'{ "question": "Nytt multistyrningsalternativ", "answer": "<p>Du kan i sökrutan nedan söka efter information, du kan bl.a. söka efter ett bolag och då kommer en tabell att visas med all info som har med sökordet att göra.</p><p>Du kan endast söka på ett värde, du kan därför exempelvis inte söka på bolagsnamn och organisationsnummer. Om du vill visa all data så markerar du endast sökrutan och trycker på Enter. OBS! att hämta all data och ladda tabellerna kan ta upp till 30 sekunder.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'cae33bb4-22cc-4f50-b25d-0c8d112dc192', N'{ "question": "Logg", "answer": "<p>På denna sida kan du se vilka förändringar som gjorts i styrningskön, den senaste tiden.</p><p><ul><li>Registrerad: Datum då styrningen registrerades</li><li>Begärt: Önskad tidpunkt för aktivering</li><li>Verkställd: Datum då styrningen verkställdes</li><li>Styrning: Det styrningsalternativ som förändringen gällde</li><li>Händelse: Den typ av förändring som genomfördes</li><li>Användare: Den som genomförde förändringen</li>SMS id: Löpnummer i databas</li><li>Info: information om händelsen</li></ul></p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'240fbdae-6b4f-455d-af5e-23c571ffacf8', N'{ "question": "Kontaktpersoner", "answer": "<p>En kontaktperson är en person som administratören sätter upp som kontakt för analys, webbstyrning och leverantörsinformation. Dropdownlistan visar personer som är listade under bolaget. För att lista en användare under ett bolag behöver ni antigen skapa en ny användare eller redigera en befintlig. Om dropdownlistan är tom beror detta på att ingen person är listad för det valda bolaget.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'01f7cec6-ea4f-46ad-b9b6-d5fccc58fa2b', N'{ "question": "Nummer", "answer": "<p>Här listas alla abonnemang som bolaget har. Du kan antigen lägga till ett nytt nummer eller redigera ett befintligt nummer i denna vy.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'8627ec7a-dd33-4937-abec-80702855dd4d', N'{ "question": "Nummer", "answer": "<p>Denna nyckel används av kunden när de ringer in och vill ha hjälp med webbstyrning. Nyckeln används som bekräftelse för att visa att personen som behöver hjälp kan bekräfta behörigheten</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'50e8509a-328f-454f-8a3b-5923e6f1bf06', N'{ "question": "Kontaktpersoner", "answer": "<p>Prenumerera innebär att systemet sparar samtalshistorik 15 månader bakåt i tiden. För dom som inte prenumererar så sparas endast 3 månaders historik.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'fdb0b557-1162-476f-ae1f-847da85ba579', N'{ "question": "Skapa en användare", "answer": "<p>I denn vy skapar du en ny anvädnare. Följande fält ser du i denna vy. <ul><li>AnvändarID*: här kan du välja ett användar id för användaren</li><li>Namn*: personens namn (för- och efternamn)</li><li>OrgNr: Ange/välj det organisationsnummer som personer tillhör och tryck på hämta för att hämta bolagsnamnet.<li>Telefon*: personens telefonnummer.</li><li>Email*: personens epostadress</li><Notering: noteringar för användaren</li><Roll: här väljer du rollen för användaren. har du valt bolaget Telia Admin Säljare kommer rollerna Administratör och Säljare att visas. Har du valt ett kundbolag kommer rollen Kund att visas med följande behörigheter som kan väljas: analys, webbstyrning, webbstyrning skriv, webbstyrning multistyrning och leverantörsinformation./</li></ul> Fält markerade med * är obligatoriska och formuläret kommer inte att valideras om dessa inte är ifyllda.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'e5fe87f3-c1fe-4de8-ae78-f980b367c9f9', N'{ "question": "Redigera en användare", "answer": "<p>I denn vy redigerar du en anvädnare, de fält som tidigare fyllts i har värden i fälten. Vyn har följande fält: <ul><li>AnvändarID*: här kan du välja ett användar id för användaren</li><li>Namn*: personens namn (för- och efternamn)</li><li>OrgNr: Ange/välj det organisationsnummer som personer tillhör och tryck på hämta för att hämta bolagsnamnet.<li>Telefon*: personens telefonnummer.</li><li>Email*: personens epostadress</li><Notering: noteringar för användaren</li><Roll: här väljer du rollen för användaren. har du valt bolaget Telia Admin Säljare kommer rollerna Administratör och Säljare att visas. Har du valt ett kundbolag kommer rollen Kund att visas med följande behörigheter som kan väljas: analys, webbstyrning, webbstyrning skriv, webbstyrning multistyrning och leverantörsinformation./</li></ul> Fält markerade med * är obligatoriska och formuläret kommer inte att valideras om dessa inte är ifyllda.</p>" }')
INSERT [dbo].[QuickHelpEntries] ([Id], [Content]) VALUES (N'e13ebc38-c423-4ed2-b30c-87639f3efcfe', N'{ "question": "Hantera abonnemang", "answer": "<p>I denna vy kan du hantera det valda abonnemanget. I tabellen nedan kan du se följande kolumner. <ul><li>Styrningskö - Visar kölistan för lagda Multistyrningar. Härifrån kan användaren lägga upp nya, radera och förändra sina lagda köposter. En multistyrningskö aktiveras på det datum och klockslag som är satt för kön.</li><li>Styrningsalternativ - visar alla styrningsalternativ som är skapade för abonnemanget</li><li>Svarsställen - här visas alla upplagda svarställen för abonnemanget samt en beskrivande text</li><li>Logg - en logg som visar information. Se hjälptexten för logg för mer information om logg.</li></ul></p>" }')

/*
 * MIGRATING USER LOGON DATES
 */
PRINT N'Migrating User Logon Dates';

UPDATE [Users]
SET LogonDate = UserSettings.LogonDate
FROM [Users]
INNER JOIN UserSettings
	ON [Users].UserId = UserSettings.UserId

/*
 * MIGRATE COMPANYINFO ROLES
 */
PRINT N'Migrating CompanyInfo Roles';

INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 5
FROM
	CompanyInfo
WHERE
	ActiveStat = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 6
FROM
	CompanyInfo
WHERE
	[ActiveVIP] = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 7
FROM
	CompanyInfo
WHERE
	[ActiveVIP] = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 8
FROM
	CompanyInfo
WHERE
	[ExtendedMulti] = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 9
FROM
	CompanyInfo
WHERE
	[ActiveCpa] = 1

/*
 * INCLUDED ROLES
 */
PRINT N'Inserting IncludedRoles';

-- Reference Data for Status
MERGE INTO [IncludedRole] AS Target 
USING (VALUES
	-- Webbstyrning
	(7,	6),
	(8,	7)
) 
AS Source (BaseRoleId, IncludedRoleId) 
ON Target.BaseRoleId = Source.BaseRoleId
	AND Target.IncludedRoleId = Source.IncludedRoleId

--insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (BaseRoleId, IncludedRoleId) 
VALUES (BaseRoleId, IncludedRoleId)

--delete rows that are in the target but not the source 
WHEN NOT MATCHED BY SOURCE THEN 
DELETE
;

/*
 * Add Role Administratör to Admin Company
 */
PRINT N'Adding role Administratör to admin company (999999-9999)';

INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT CompanyInfo.CompanyId, 3
FROM CompanyInfo
WHERE CompanyInfo.OrgNr = '999999-9999'

/*
 * Adding Kund role to all customer companies
 */
PRINT N'Adding role Kund to all non admin users';

Insert into [UsersInRoles] (UserId, RoleId)
Select distinct UI.UserId, 1
FROM [Users] AS U
Left JOIN [UsersInRoles] AS UI
	ON UI.UserId = U.UserID
LEFT JOIN CompanyInfo
	ON U.CompanyId = CompanyInfo.CompanyId
WHERE
	(
		CompanyInfo.OrgNr <> '999999-9999'
		OR CompanyInfo.OrgNr IS NULL)
	AND Ui.UserId Not in (Select UserId From UsersInRoles Where RoleId = 1)
	AND UI.UserId IS NOT NULL

/*
 * Migrating Admin Users in Test Company to Admin Company
 */
PRINT N'Migrating Admin Users in Test Company to Admin Company';
UPDATE Users
SET CompanyId = (SELECT CompanyId FROM CompanyInfo WHERE OrgNr = '999999-9999')
FROM Users
INNER JOIN CompanyInfo
	ON Users.CompanyId = CompanyInfo.CompanyId
WHERE
	CompanyInfo.OrgNr = '100000-1000'