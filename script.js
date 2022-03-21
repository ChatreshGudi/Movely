function resetCanvas(){
    canvas = document.getElementById("canvas");
    canvas.innerHTML = "";
}

function resetAnimation(){
    document.querySelectorAll("animate").forEach(element => {
        element.beginElement();
    });
}

function run(){
    resetCanvas();
    document.getElementById("canvas").unpauseAnimations();
    code = document.getElementById("editor").value;
    console.log(code);
    console.log(document.getElementById("canvas"));
    usrCode = new Function(code);
    usrCode();
    resetAnimation();    
}

function stop(){
    canvas = document.getElementById("canvas");
    canvas.pauseAnimations();
}

async function saveSVG(){
    const newHandle = await window.showSaveFilePicker({
        suggestedName:'Animation.svg',
        types: [{
          description: 'SVG',
          accept: {
            'svg': ['.svg'],
          },
        }],
      });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();
    let file = "<svg>"+document.getElementById("canvas").innerHTML+"</svg>";
    console.log(file);
    // write our file
    await writableStream.write(file);

    // close the file and write the contents to disk.
    await writableStream.close();
}

//////////
// API //
////////
class Canvas{
    constructor (){
        this.background = "white";
        this.canvas = document.getElementById("canvas");
    }
    setBG(bgcolor){
        this.background = bgcolor;
        this.canvas.style["background"] = this.background;
    }
}

class Shape{
    constructor(id){
        this.canvas = document.getElementById("canvas");
        this.name = id;
        this.self = document.getElementById(id);
        this.bgcolor =  "black";
        this.bdrcolor = "black";
        this.bdrsize = "1px";
    }
    setBG(bgcolor){
        this.bgcolor = bgcolor;
        this.self.setAttribute("fill", this.bgcolor);
    }
    setBorder(bdrcolor, bdrsize){
        this.bdrcolor =bdrcolor;
        this.bdrsize = bdrsize;
        this.self.setAttribute("stroke", this.bdrcolor);
        this.self.setAttribute("stroke-width", this.bdrsize);
    }
    animate(attributename, value, time, repeat, begin ="0s", name){
        this.self.innerHTML += "<animate id = "+name+" attributeName = "+attributename+" values = "+value+" dur = "+time+" repeatCount = "+repeat+" begin = "+ begin +" restart = 'always' />";
    }
    move(x,y, time, repeat, begin = "0s", name = ""){
        this.animate("x", String(this.x+x), time, repeat, begin, name);
        this.animate("y", String(this.y+y), time, repeat, begin, name);

    }
    stroke( time, repeat, name, begin ="0s"){
        this.self.setAttribute("stroke-dasharray", this.self.getTotalLength());
        this.animate("stroke-dashoffset", String(this.self.getTotalLength())+";0", time, repeat, begin, name);
    }
    set(attributename, value, begin){
        this.self.innerHTML += "<set attributeName = "+attributename+" to = "+value+" begin = "+begin+"> </set>";
    }
}

class Circle extends Shape{
    constructor(radius, name, x, y){
        super();
        this.canvas = document.getElementById("canvas");

        this.name = name;
        // Initializing the properties

        this.radius = radius;
        this.x =x;
        this.y = y;
        this.canvas.innerHTML += "<circle id='"+this.name+"' ,r = "+this.radius+" , cx = "+this.x+" , cy = "+ this.y + "></circle> "; // intializing the element
        this.self = document.getElementById(this.name);
        this.bgcolor = "black";
        this.bdrcolor = "black";
        this.bdrsize = "1px"; //bdr stands for Border
    }
}

class Ellipse extends Shape{
    constructor(rx, ry, name, x, y){
        
        super();

        this.canvas = document.getElementById("canvas");

        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        this.name = name;

        this.bdrcolor;
        this.bdrsize;
        this.bgcolor;

        this.canvas.innerHTML += "<ellipse id = "+this.name+" rx = "+this.rx+" ry = "+this.ry+"  cx = "+this.x+" cy = "+this.y+" ></ellipse>";
        this.self = document.getElementById(this.name);
    }
}

class Rectangle extends Shape{
    constructor(height, breadth, name, x, y){
        super();
        this.canvas = document.getElementById("canvas");
        this.name = name;
        this.height = height;
        this.breadth = breadth;
        this.x =x;
        this.y = y;
        this.canvas.innerHTML += "<rect id = "+this.name+" x ="+ this.x +" y = "+this.y +" height = "+this.height+" width = "+this.breadth+" ></rect>";
        this.self = document.getElementById(this.name);
        this.bgcolor = "black";
        this.bdrcolor = "black";
        this.bdrsize = "1px";
        
    }
    setRadius(r){
        this.rx = r;
        this.ry = r;
        this.self.setAttribute("rx", this.rx);
    }
}

class Polygon extends Shape{
    constructor(points, name){
        
        super();
        this.canvas = document.getElementById("canvas");

        this.points = points;
        this.name = name;

        console.log(String(this.points));

        this.canvas.innerHTML += "<polygon id = "+this.name+"  points = '"+this.points+"' />";
        this.self = document.getElementById(this.name);
    }
}

class Polyline extends Shape{
    constructor(points, name){
        
        super();
        this.canvas = document.getElementById("canvas");

        this.points = points;
        this.name = name;

        console.log(String(this.points));

        this.canvas.innerHTML += "<polyline id = "+this.name+"  points = '"+this.points+"' />";
        this.self = document.getElementById(this.name);
    }
}

class Path extends Shape{
    constructor(name, path){
        
        super();
        this.canvas = document.getElementById("canvas");
        
        this.name = name;
        this.path = path;

        this.canvas.innerHTML += "<path id = "+this.name+" d = '"+this.path+"' ></path>";
        this.self = document.getElementById(this.name);
    }
}