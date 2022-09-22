CREATE TABLE [dbo].[Region] (
    [SortOrder] SMALLINT     NULL,
    [RegionId]  SMALLINT     IDENTITY (1, 1) NOT NULL,
    [Region]    VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Region] PRIMARY KEY CLUSTERED ([RegionId] ASC) WITH (FILLFACTOR = 90)
);


GO
CREATE STATISTICS [Statistic_Region]
    ON [dbo].[Region]([Region], [RegionId]);

