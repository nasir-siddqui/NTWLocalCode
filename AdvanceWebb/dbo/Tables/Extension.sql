CREATE TABLE [dbo].[Extension] (
    [Extension] CHAR (5) NOT NULL,
    [AreaId]    INT      NOT NULL,
    CONSTRAINT [PK_tictac.Extension] PRIMARY KEY CLUSTERED ([Extension] ASC) WITH (FILLFACTOR = 90)
);

