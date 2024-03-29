
// Editor Code

var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.session.setMode("ace/mode/javascript");
editor.setFontSize(17);



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
    code = document.getElementById("editor").innerText;
    console.log(code);
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
    
    // write our file
    await writableStream.write(file);

    // close the file and write the contents to disk.
    await writableStream.close();
}

async function saveJS(){
    const newHandle = await window.showSaveFilePicker({
        types: [{
            description: 'Javascript file',
            accept: {'js/plain': ['.js']},
          }],
        suggestedName:'Animation.js'
      });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();
    let file = document.getElementById("editor").value;
    
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
        this.bgcolor;
        this.bdrcolor;
        this.bdrsize;
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
        let animate = document.createElementNS("http://www.w3.org/2000/svg","animate");
        animate.setAttribute("id", name);
        animate.setAttributeNS(null,"attributeName", attributename);
        animate.setAttribute("values", value);
        animate.setAttribute("dur", time);
        animate.setAttributeNS(null,"repeatCount", repeat);
        animate.setAttribute("begin", begin);
        animate.setAttribute("restart", "always");
        this.self.appendChild(animate);
    }

    move(name = "",x, y, time, repeat, begin = "0s"){
        this.animate("x", String(this.x+x), time, repeat, begin, name);
        this.animate("y", String(this.y+y), time, repeat, begin, name);
    }

    stroke(name, time, repeat, begin ="0s"){
        this.self.setAttribute("stroke-dasharray", this.self.getTotalLength());
        this.animate("stroke-dashoffset", String(this.self.getTotalLength())+";0", time, repeat, begin, name);
    }

    set(attributename, value, begin="0s"){
        // let set = document.createElementNS("http://www.w3.org/2000/svg", "set");
        // set.setAttributeNS(null, "attributeName", attributename);
        // set.setAttribute("to", value);
        // set.setAttribute("begin", begin);
        // this.self.appendChild(set);
        this.self.innerHTML += "<set attributeName = "+attributename+" to = "+value+" begin = "+begin+"> </set>";
    }

    setRotation(angle){
        this.self.setAttribute('transform', 'rotate('+angle+')')
    }

    rotate(name, fromAngle, fromPointX, fromPointY, toAngle, toPointX, toPointY, time, repeat, begin = "0s"){
        console.log(fromAngle.toString()+fromPointX.toString()+fromPointY.toString(),  toAngle.toString()+toPointX.toString()+toPointY.toString());
        this.transform(name, "transform", "rotate", fromAngle.toString()+" "+fromPointX.toString()+" "+fromPointY.toString(), toAngle.toString()+" "+toPointX.toString()+" "+toPointY.toString(), time, repeat, begin);
    }
    simpleRotate(name, beginAngle, endAngle, pointX, pointY, time, repeat, begin="0s"){
        this.rotate(name, beginAngle, pointX, pointY, endAngle, pointX, pointY, time, repeat, begin);
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
        
        this.self = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.self.setAttribute("id", this.name);
        this.self.setAttribute("r", this.radius);
        this.self.setAttribute("cx", this.x);
        this.self.setAttribute("cy", this.y);
        this.canvas.appendChild(this.self);

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

        this.self = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        this.self.setAttribute("id", this.name);
        this.self.setAttribute("rx", this.rx);
        this.self.setAttribute("ry", this.ry);
        this.self.setAttribute("cx", this.x);
        this.self.setAttribute("cy", this.y);

        this.canvas.appendChild(this.self);

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

        this.self = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.self.setAttribute("id", name);
        this.self.setAttribute("x", this.x);
        this.self.setAttribute("y", this.y);
        this.self.setAttribute("height", this.height);
        this.self.setAttribute("width", this.breadth);

        this.canvas.appendChild(this.self);
        
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

        this.self = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        this.self.setAttribute("id", this.name);
        this.self.setAttribute("points", this.points);

        this.canvas.appendChild(this.self);

    }
}

class Polyline extends Shape{
    constructor(name, points){
        
        super();
        this.canvas = document.getElementById("canvas");

        // Initializing the properties
        
        this.name = name;
        this.points = points;

        this.self = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        this.self.setAttribute("id", this.name);
        this.self.setAttribute("points", this.points);

        this.canvas.appendChild(this.self);

    }
}

class Path extends Shape{
    constructor(name, path){
        
        super();
        this.canvas = document.getElementById("canvas");
        
        // Initializing the properties

        this.name = name;
        this.path = path;

        this.self = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.self.setAttribute("id", this.name);
        this.self.setAttribute("d", this.path);

        this.canvas.appendChild(this.self);

    }
}

class Text extends Shape{
    constructor(name, text, x, y){

        super();
        this.canvas = document.getElementById("canvas");

        // Initializing the properties

        this.name = name;
        this.text = text;
        this.x = x;
        this.y = y;
        
        this.self = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.self.setAttribute("id", this.name);
        this.self.setAttribute("x", this.y);
        this.self.setAttribute("x", this.y);
        this.self.innerHTML = this.text;

        this.canvas.appendChild(this.self);
        
    }

    stroke( time, repeat, name, begin ="0s"){
        this.self.setAttribute("stroke-dasharray", this.self.getAttribute("font-size")*5);
        this.animate("stroke-dashoffset", String(this.self.getAttribute("font-size")*5)+";0", time, repeat, begin, name);
    }
}