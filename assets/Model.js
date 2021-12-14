const model = (movie, moviefromDb,getComment, filter =() => true) =>{
    const movieDetailsMap ={}
    //movie.foreach(m => movieDetailsMap[m.title] = m)
    
    const movieMap = {}
    //moviefromDb.foreach(mb => movieMap[mb.MovieID])
    

    return {movie, moviefromDb, getComment}
}

export default model