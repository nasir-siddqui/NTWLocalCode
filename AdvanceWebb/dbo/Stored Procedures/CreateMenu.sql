


CREATE PROCEDURE CreateMenu AS

SET NOCOUNT ON

if exists (select * from sysobjects where id = object_id(N'[dbo].[MenuSystem]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
drop table [dbo].[MenuSystem]

Select Top 0 *,0 as SortID Into MenuSystem from Menu

DECLARE @ID1 int
DECLARE @ID2 int
DECLARE @ID3 int
DECLARE @ID4 int
DECLARE @ID5 int
DECLARE @SortID int

Select @SortID = 0

DECLARE MenuCursor1 CURSOR FOR SELECT ID FROM menu WHERE Active=1 AND LevelID=1 AND BelongsToID=0 Order By SortOrder 
OPEN MenuCursor1 
FETCH NEXT FROM MenuCursor1 INTO @ID1 
WHILE (@@FETCH_STATUS <> -1) 
BEGIN 
	Select @SortID = @SortID + 1
	Insert Into MenuSystem Select *,@SortID From menu Where ID = @ID1 

	/* Nivå 2 */
	DECLARE MenuCursor2 CURSOR FOR SELECT ID FROM menu WHERE Active=1 AND LevelID=2 AND BelongsToID=@ID1 Order By SortOrder 
	OPEN MenuCursor2 
	FETCH NEXT FROM MenuCursor2 INTO @ID2 
	WHILE (@@FETCH_STATUS <> -1) 
	BEGIN 
		Select @SortID = @SortID + 1
		Insert Into MenuSystem Select *,@SortID From menu Where ID = @ID2 

		/* Nivå 3 */
		DECLARE MenuCursor3 CURSOR FOR SELECT ID FROM menu WHERE Active=1 AND LevelID=3 AND BelongsToID=@ID2 Order By SortOrder 
		OPEN MenuCursor3 
		FETCH NEXT FROM MenuCursor3 INTO @ID3 
		WHILE (@@FETCH_STATUS <> -1) 
		BEGIN 
			Select @SortID = @SortID + 1
			Insert Into MenuSystem Select *,@SortID From menu Where ID = @ID3 

			/* Nivå 4 */
			DECLARE MenuCursor4 CURSOR FOR SELECT ID FROM menu WHERE Active=1 AND LevelID=4 AND BelongsToID=@ID3 Order By SortOrder 
			OPEN MenuCursor4 
			FETCH NEXT FROM MenuCursor4 INTO @ID4 
			WHILE (@@FETCH_STATUS <> -1) 
			BEGIN 
				Select @SortID = @SortID + 1
				Insert Into MenuSystem Select *,@SortID From menu Where ID = @ID4 

				-- Nivå 5
				DECLARE MenuCursor5 CURSOR FOR SELECT ID FROM menu WHERE Active=1 AND LevelID=5 AND BelongsToID=@ID4 Order By SortOrder 
				OPEN MenuCursor5 
				FETCH NEXT FROM MenuCursor5 INTO @ID5 
				WHILE (@@FETCH_STATUS <> -1) 
				BEGIN 
					Select @SortID = @SortID + 1
					Insert Into MenuSystem Select *,@SortID From menu Where ID = @ID5 
					FETCH NEXT FROM MenuCursor5 INTO @ID5
				END 
				CLOSE MenuCursor5
				DEALLOCATE MenuCursor5

				FETCH NEXT FROM MenuCursor4 INTO @ID4
			END 
			CLOSE MenuCursor4
			DEALLOCATE MenuCursor4

			FETCH NEXT FROM MenuCursor3 INTO @ID3
		END 
		CLOSE MenuCursor3
		DEALLOCATE MenuCursor3

		FETCH NEXT FROM MenuCursor2 INTO @ID2
	END 
	CLOSE MenuCursor2
	DEALLOCATE MenuCursor2

	FETCH NEXT FROM MenuCursor1 INTO @ID1
END 
CLOSE MenuCursor1 
DEALLOCATE MenuCursor1 






