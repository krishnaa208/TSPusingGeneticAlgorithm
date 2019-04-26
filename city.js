class City {

    constructor(name, x, y, lon, lat) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.lon = lon;
        this.lat = lat;
        //console.log('[ '+this.name+', '+this.x+', '+this.y+']');
    }

    // draw(){
    //     stroke(255, 0, 255);
    //     fill(255, 0, 255, 200);
    //     ellipse(this.x, this.y, 5, 5);

    // }
    toString() {
        return '[ ' + this.name + ', ' + this.lon + ', ' + this.lat + ']';
    }

}