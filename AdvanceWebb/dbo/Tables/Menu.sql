CREATE TABLE [dbo].[Menu] (
    [HeaderSwe]     VARCHAR (50)  COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [BelongsToID]   SMALLINT      NULL,
    [SortOrder]     SMALLINT      NULL,
    [ID]            SMALLINT      NOT NULL,
    [PageURL]       VARCHAR (300) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
    [LevelID]       SMALLINT      NULL,
    [Active]        SMALLINT      NOT NULL,
    [SecurityLevel] SMALLINT      NOT NULL,
    [System]        VARCHAR (50)  COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
    [ToolTipSwe]    VARCHAR (50)  COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
);

