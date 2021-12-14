const model = (movie, moviefromDb,getComment, users, otherToplist, filter =() => true) =>{
    const movieDetailsMap ={}
    //movie.foreach(m => movieDetailsMap[m.title] = m)
    
    const movieMap = {}
    //moviefromDb.foreach(mb => movieMap[mb.MovieID])
    
    const userMap ={}

    const otherMovieMap={}

    return {movie, moviefromDb,getComment, users, otherToplist}
}

export default model