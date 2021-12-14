const model = (movie, moviefromDb, users, filter =() => true) =>{
    const movieDetailsMap ={}
    //movie.foreach(m => movieDetailsMap[m.title] = m)
    
    const movieMap = {}
    //moviefromDb.foreach(mb => movieMap[mb.MovieID])
    
    const userMap ={}

    return {movie, moviefromDb, users}
}

export default model