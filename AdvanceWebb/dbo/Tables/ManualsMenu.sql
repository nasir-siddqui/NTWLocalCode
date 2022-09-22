CREATE TABLE [dbo].[ManualsMenu] (
    [HeaderEng]     VARCHAR (50)  NOT NULL,
    [HeaderSwe]     VARCHAR (50)  NOT NULL,
    [HeaderEst]     VARCHAR (50)  NOT NULL,
    [HeaderPol]     VARCHAR (50)  NULL,
    [BelongsToID]   SMALLINT      NULL,
    [SortOrder]     SMALLINT      NULL,
    [ID]            SMALLINT      NOT NULL,
    [PageURL]       VARCHAR (300) NULL,
    [LevelID]       SMALLINT      NULL,
    [Active]        SMALLINT      NOT NULL,
    [SecurityLevel] SMALLINT      NOT NULL,
    [System]        VARCHAR (50)  NOT NULL,
    [ToolTipEng]    VARCHAR (50)  NOT NULL,
    [ToolTipSwe]    VARCHAR (50)  NOT NULL,
    [ToolTipEst]    VARCHAR (50)  NOT NULL,
    [ToolTipPol]    VARCHAR (50)  NULL
);

