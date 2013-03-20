var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");

WIDTH = c.width
HEIGHT = c.height
N_Q = 300

function print(message) {
    document.getElementById("t").innerHTML = message;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Charge(q, x, y, m) {
    this.q = q
    this.x = x
    this.y = y
    this.m = m
}

Charge.prototype.get_x = function(){
    return this.x
}

Charge.prototype.get_pos = function(){
    return [this.x, this.y]
}

Charge.prototype.set_pos = function(x, y){
    this.x = x
    this.y = y
}

Charge.prototype.get_q = function(){
    return this.q
}

Charge.prototype.set_q = function(q) {
    this.q = q
}

function get_dist(c1, c2) {
    c1xy = c1.get_pos()
    c2xy = c2.get_pos()
    d = Math.sqrt( Math.pow((c1xy[0] - c2xy[0]), 2) + Math.pow((c1xy[1] - c2xy[1]), 2) )
    return d
}

function get_force(q1, q2) {
    f = 50 * q1.get_q() * q2.get_q()
    if( get_dist(q1, q2) > 2 ) {
        f = f / Math.pow(get_dist(q1, q2), 2)
    } else {
        f = f / 50
    }
    return f
}

function update_charges(c_array) {
    for( var i = 0; i < c_array.length; i++ ){
        q1 = c_array[i]
        if(q1.m == 1) {
            fx = 0.0
            fy = 0.0
            for( var j = 0; j < c_array.length; j++ ){
                if (i != j) {
                    h = 1
                    g = 1
                    q2 = c_array[j]
                    f = get_force(q1, q2)
                    dx = (q1.x - q2.x)
                    dy = (q1.y - q2.y)
                    if( dx < 0 ) {
                        h = -1
                    }
                    if (dy < 0 ){
                        g = -1
                    }
                    theta = Math.atan(dy/dx)
                    fx += f * h * Math.cos(theta)
                    fy += f * g * Math.sin(theta)
                }
            }
            q1.set_pos(q1.x + fx, q1.y + fy)
        }
    }
}

function merge_charges(c_array){
    var to_del = new Array()
    for( var i = 0; i < c_array.length; i++ ) {
        for( var j = 0; j < c_array.length; j++ ) {
            if( i != j ) {
                if( get_dist( c_array[i], c_array[j] ) < 1 ) {
                    if ( (to_del.indexOf(i) === -1) && (to_del.indexOf(j) === -1) ) {
                        to_del.push(i)
                        to_del.push(j)
                    }
                }
            }
        }
    }
    for( var k = 0; k < to_del.length; k=k+2 ) {
        q1 = c_array[to_del[k]]
        q2 = c_array[to_del[k+1]]
        q1.set_q(0)
        q2.set_q(null)
    }
    for( var m = c_array.length-1; m >= 0; m-- ) {
        q = c_array[m]
        if( q.get_q() === null ) {
            c_array.splice(m, 1)
        }
    }
}
        
                        

function draw_charges(c_array){
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    for( var i = 0; i < c_array.length; i++) {
        var q = c_array[i]
        var qpos = q.get_pos()
        if (q.get_q() == -1) {
            ctx.fillStyle="#FF0000"
        } else if(q.get_q() == 1) {
            ctx.fillStyle="#0000FF"
        } else {
            ctx.fillStyle="#222222"
        }
        ctx.beginPath();
        ctx.arc(qpos[0], qpos[1], 4, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
    }
}

charges = new Array()

for( var k = 0; k < N_Q; k++ ){
    q = Math.pow(-1, getRandomInt(0,1) )
    x = getRandomInt(0,WIDTH)
    y = getRandomInt(0,HEIGHT)
    m = getRandomInt(0,1)
    charges.push( new Charge(q, x, y, 1) )
}

//charges.push( new Charge(1, 200, 200, 1) )
//charges.push( new Charge(-1, 250, 200, 1) )

function main() {
    
    update_charges(charges)
    merge_charges(charges)
    draw_charges(charges)
    
    setTimeout(function(){main()},1);
    
}
