CREATE TABLE [dbo].[Advance_IntresseAnm] (
    [Id]              INT           IDENTITY (1, 1) NOT NULL,
    [Foretag]         VARCHAR (50)  NOT NULL,
    [OrgNr]           CHAR (11)     NULL,
    [KNamn]           VARCHAR (50)  NULL,
    [Gatuadr]         VARCHAR (50)  NULL,
    [Postnr]          CHAR (8)      NULL,
    [PostAdr]         VARCHAR (50)  NULL,
    [TelNr]           VARCHAR (20)  NULL,
    [MobilNr]         VARCHAR (20)  NULL,
    [MailAdr]         VARCHAR (50)  NULL,
    [Datum]           VARCHAR (20)  NOT NULL,
    [Applikation]     VARCHAR (50)  NOT NULL,
    [BehandladDatum]  DATETIME      NULL,
    [BehandladUserId] INT           NULL,
    [Ovr]             VARCHAR (500) NULL,
    CONSTRAINT [PK_Advance_IntresseAnm] PRIMARY KEY NONCLUSTERED ([Id] ASC) WITH (FILLFACTOR = 90) ON [PRIMARY]
) ON [ADMIN];

