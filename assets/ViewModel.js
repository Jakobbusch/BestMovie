
export default (el, init_model) => {
    let model = init_model

return {
    el,
    data:{
        movieTitle:'',
        movie: model.movie
    },
    
    
    
    methods:{
        async writeToConsole(){
                this.movie = [{Title: 'bubaboba', Released: '1997'},
                {Title: 'hasdas', Released: '1991'},
                {Title: 'fgdasda', Released: '1990'}]
            
                

    },
    async search(){
        if(this.movieTitle!=''){
            console.log("hello")
            const movie_res = await fetch('https://www.omdbapi.com/?apikey=8ea3b105&t='+this.movieTitle).then(res => res.json())
            this.movie = movie_res
            //console.log(this.movie.Released)
            console.log(this.movie)
            this.movieTitle = null;
        }
        
        
        
    },
    async addToFavourite(){
        if(this.movie.Title!=undefined){
            console.log(this.movie.Title + ' Added to favourites')
        }
        
    }

        
    }
    
}
}