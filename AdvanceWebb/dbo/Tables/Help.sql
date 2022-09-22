CREATE TABLE [dbo].[Help] (
    [ID]        INT           NOT NULL,
    [HeaderSwe] VARCHAR (255) NOT NULL,
    [TextSwe]   TEXT          NOT NULL,
    [HeaderEng] VARCHAR (255) NOT NULL,
    [TextEng]   TEXT          NOT NULL,
    [HeaderEst] VARCHAR (255) NULL,
    [TextEst]   TEXT          NULL,
    [HeaderPol] VARCHAR (255) NULL,
    [TextPol]   TEXT          NULL,
    [PageURL]   VARCHAR (300) NULL,
    [Used]      BIT           NULL,
    [ManualId]  VARCHAR (4)   NULL
);

