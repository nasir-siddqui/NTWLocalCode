CREATE TABLE [dbo].[AreaCode] (
    [AreaCode] VARCHAR (10) NOT NULL,
    [Area]     VARCHAR (50) NOT NULL,
    [RegionId] SMALLINT     NOT NULL,
    [AreaId]   INT          IDENTITY (1, 1) NOT NULL,
    CONSTRAINT [PK_AreaCode] PRIMARY KEY NONCLUSTERED ([AreaCode] ASC) WITH (FILLFACTOR = 90),
    CONSTRAINT [FK_AreaCode_Region] FOREIGN KEY ([RegionId]) REFERENCES [dbo].[Region] ([RegionId])
);


GO
CREATE UNIQUE CLUSTERED INDEX [AreaCode]
    ON [dbo].[AreaCode]([AreaCode] ASC) WITH (FILLFACTOR = 90);


GO
CREATE NONCLUSTERED INDEX [RegionCode]
    ON [dbo].[AreaCode]([RegionId] ASC) WITH (FILLFACTOR = 90);

