CREATE TABLE [dbo].[FictiveOrgNr] (
    [Counter]      INT          NOT NULL,
    [ForeignOrgNr] VARCHAR (50) NOT NULL,
    [FictiveOrgNr] VARCHAR (10) NOT NULL,
    [SkapadDatum]  DATETIME     CONSTRAINT [DF_FictiveOrgNr_SkapadDatum] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_tableFictiveOrgNr] PRIMARY KEY CLUSTERED ([Counter] ASC) WITH (FILLFACTOR = 90),
    CONSTRAINT [IX_FictiveOrgNr] UNIQUE NONCLUSTERED ([Counter] ASC) WITH (FILLFACTOR = 90)
);

