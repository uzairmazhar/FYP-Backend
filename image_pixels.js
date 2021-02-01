var pixels = require('get-pixels')

pixels("./public/images/Screenshot (9).png", function(err, pixels){
    if(err){
        console.log("Error was found")
    }
    console.log("Pixels values of the image are ", pixels.data);
    for(var i=0;i<pixels.data.length;i++){
        if(pixels.data[i]%2==0)
            pixels.data[i]=pixels.data[i]+1
        else
            pixels.data[i]=pixels.data[i]-1    
    }
    console.log("Pixels values after stegnography are ", pixels.data);
    
})