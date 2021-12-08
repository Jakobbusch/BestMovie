import {ajax} from 'https://dev.jspm.io/rxjs@6/_esm2015/ajax'
import {interval, of, merge} from 'https://dev.jspm.io/rxjs@6/_esm2015'
import {filter, map, concatMap,share,mergeScan} from 'https://dev.jspm.io/rxjs@6/_esm2015/operators'

export default (el, init_model) => {
    let model = init_model
    

return {
    el,
    data:{
        movieTitle:'',
        movie: model.movie,
    },
    
   
    methods:{
        async writeToConsole(){
                console.log("Hello my friend")
                this.movie = [{title: 'bubaboba', year: '1997'},
                {title: 'hasdas', year: '1991'},
                {title: 'fgdasda', year: '1990'}]
        },


    }
    
}
}