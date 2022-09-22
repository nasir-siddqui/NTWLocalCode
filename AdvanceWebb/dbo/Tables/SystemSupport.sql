CREATE TABLE [dbo].[SystemSupport] (
    [SuppId]    INT          IDENTITY (1, 1) NOT NULL,
    [Area]      VARCHAR (50) NULL,
    [Fieldtype] VARCHAR (50) NULL,
    [TextValue] TEXT         NULL
) ON [ADMIN];

