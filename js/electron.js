const canvas = document.getElementById('mainCanvas');
Resized();
const ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

const PRAD = 10;
const SRAD = 5;

class Electron
{
    constructor(x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge > 0;
    }

    draw()
    {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, PRAD, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "#00FFF0";
        ctx.fillRect(this.x - 2*PRAD, this.y - 2*PRAD, PRAD*2, PRAD*2);
    }

    isInside(x, y)
    {
        console.log("xmin: " + (this.x - PRAD) + " / xmax: " + (this.x + PRAD) + " / x: " + (x));
        return ( x >= this.x - PRAD && x <= this.x + PRAD
            && y >= this.y - PRAD && y <= this.y + PRAD );
    }

    setPos(x, y)
    {
        this.x = x;
        this.y = y;
    }

}

class Sensor
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    draw()
    {
        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.arc(this.x, this.y, SRAD, 0, 2 * Math.PI);
        ctx.fill();
    }

    distance(p)
    {
        dx = p.x - this.x;
        dy = p.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

}

var dragging = undefined;

var pList = [];
var sList = [];

sList[sList.length] = new Sensor( canvas.width / 2, canvas.height / 2 );

pList[pList.length] = new Electron( 400, 200, -1 );
//pList[pList.length] = new Electron(250, 400);

redraw();

function redraw()
{
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(const p of pList)
        p.draw();
    for(const s of sList)
        s.draw();
}

function getClickElement(x, y)
{
    for(const p of pList)
        if(p.isInside(x, y)) return p;
    return undefined;
}

function Resized()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function MouseDown()
{
    dragging = getClickElement(event.x, event.y);
}

function MouseUp()
{
    dragging = undefined;
}

function MouseMoved()
{
    if(dragging != undefined)
    {
        dragging.setPos(event.x, event.y);
        redraw();
    }
}