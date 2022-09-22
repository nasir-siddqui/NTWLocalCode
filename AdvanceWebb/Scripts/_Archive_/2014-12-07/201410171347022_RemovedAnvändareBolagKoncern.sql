﻿USE AdvanceWebb

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

