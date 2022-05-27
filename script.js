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
        types: [{
            description: 'Standard Vector Graphics file',
            accept: {'svg/plain': ['.svg']},
          }],
        suggestedName:'Animation.svg'
      });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();
    let file = "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'>"+"<style></style>"+document.getElementById("canvas").innerHTML+"</svg>";
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

    animate(name, attributename, value, time, repeat, begin ="0s"){
        let animate = document.createElement("animate");
        animate.setAttribute("id", name);
        animate.setAttribute("attributeName", attributename);
        animate.setAttribute("values", value);
        animate.setAttribute("dur", time);
        animate.setAttribute("repeactCount", repeat);
        animate.setAttribute("begin", begin);
        animate.setAttribute("restart", "always");

        // this.self.innerHTML += "<animate id = "+name+" attributeName = "+attributename+" values = "+value+" dur = "+time+" repeatCount = "+repeat+" begin = "+ begin +" restart = 'always' />";
    }

    move(name = "",x, y, time, repeat, begin = "0s"){
        this.animate("x", String(this.x+x), time, repeat, begin, name);
        this.animate("y", String(this.y+y), time, repeat, begin, name);
    }

    stroke(name, time, repeat, begin ="0s"){
        this.self.setAttribute("stroke-dasharray", this.self.getTotalLength());
        this.animate("stroke-dashoffset", String(this.self.getTotalLength())+";0", time, repeat, begin, name);
    }

    set(attributename, value, begin){
        this.self.innerHTML += "<set attributeName = "+attributename+" to = "+value+" begin = "+begin+"> </set>";
    }
}

class Circle extends Shape{
    constructor(name, radius, x, y){

        super();
        this.canvas = document.getElementById("canvas");
        
        // Initializing the properties
        
        this.name = name;
        this.radius = radius;
        this.x =x;
        this.y = y;
        this.bgcolor = "black";
        this.bdrcolor = "black";
        this.bdrsize = "1px"; //bdr stands for Border
        
        this.canvas.innerHTML += "<circle id='"+this.name+"' ,r = "+this.radius+" , cx = "+this.x+" , cy = "+ this.y + "></circle> "; // intializing the element
        this.self = document.getElementById(this.name);
    }
}

class Ellipse extends Shape{
    constructor(name, rx, ry, x, y){
        
        super();
        this.canvas = document.getElementById("canvas");

        // Initializing the properties
        
        this.name = name;
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        
        this.bdrcolor; //bdr stands for Border
        this.bdrsize; //bdr stands for Border
        this.bgcolor; //bg stands for Background

        this.canvas.innerHTML += "<ellipse id = "+this.name+" rx = "+this.rx+" ry = "+this.ry+"  cx = "+this.x+" cy = "+this.y+" ></ellipse>";
        this.self = document.getElementById(this.name);

    }
}

class Rectangle extends Shape{
    constructor(name, height, breadth, x, y){

        super();
        this.canvas = document.getElementById("canvas");
        
        // Initializing the properties
        
        this.name = name;
        this.height = height;
        this.breadth = breadth;
        this.x =x;
        this.y = y;
        this.bgcolor;
        this.bdrcolor; //bdr stands for Border
        this.bdrsize; //bdr stands for Border

        this.canvas.innerHTML += "<rect id = "+this.name+" x ="+ this.x +" y = "+this.y +" height = "+this.height+" width = "+this.breadth+" ></rect>";
        this.self = document.getElementById(this.name);
        
    }
    setRadius(r){
        this.rx = r;
        this.ry = r;
        this.self.setAttribute("rx", this.rx);
    }
}

class Polygon extends Shape{
    constructor(name, points){
        
        super();
        this.canvas = document.getElementById("canvas");

        // Initializing the properties
        
        this.name = name;
        this.points = points; 

        this.canvas.innerHTML += "<polygon id = "+this.name+"  points = '"+this.points+"' />";
        this.self = document.getElementById(this.name);

    }
}

class Polyline extends Shape{
    constructor(name, points){
        
        super();
        this.canvas = document.getElementById("canvas");

        // Initializing the properties
        
        this.name = name;
        this.points = points;

        this.canvas.innerHTML += "<polyline id = "+this.name+"  points = '"+this.points+"' />";
        this.self = document.getElementById(this.name);

    }
}

class Path extends Shape{
    constructor(name, path){
        
        super();
        this.canvas = document.getElementById("canvas");
        
        // Initializing the properties

        this.name = name;
        this.path = path;

        this.canvas.innerHTML += "<path id = "+this.name+" d = '"+this.path+"' ></path>";
        this.self = document.getElementById(this.name);

    }
}

class Text extends Shape{
    constructor(name, text, x, y){

        super();
        this.canvas = document.getElementById("canvas");

        // Initializing the properties

        this.name = name;
        this.text = text;

        this.canvas.innerHTML += "<text x = "+x+", y = "+y+", id = "+name+">"+this.text+"</text>";
        this.self = document.getElementById(this.name);
        
    }

    stroke( time, repeat, name, begin ="0s"){
        this.self.setAttribute("stroke-dasharray", this.self.getAttribute("font-size")*5);
        this.animate("stroke-dashoffset", String(this.self.getAttribute("font-size")*5)+";0", time, repeat, begin, name);
    }
}