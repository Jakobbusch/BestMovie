API: request format incl. Key: https://www.omdbapi.com/?apikey=8ea3b105&t=[movieTitle]

Sql query for other users toplist: 
select * from Users WHERE `List 1 likes` =(select MAX(`List 1 likes`) from Users)