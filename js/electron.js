// objects

const PRAD = 10;
const SRAD = 5;
const COULOMB_CONST = 1 / (4 * Math.PI);
const DPI = window.devicePixelRatio * 96;

class Vector2
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }
}

class Electron
{
    constructor(x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge;
    }

    draw()
    {
        ctx.fillStyle = (this.charge > 0) ? "#0000FF" : "#FF0000";
		console.log(this.charge);
        ctx.beginPath();
        ctx.arc(this.x, this.y, PRAD, 0, 2 * Math.PI);
        ctx.fill();
    }

    isInside(x, y)
    {
        //console.log("xmin: " + (this.x - PRAD) + " / xmax: " + (this.x + PRAD) + " / x: " + (x));
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
        this.vec = [];
    }

    draw()
    {
        ctx.fillStyle = "#FFFF00";
        ctx.strokeStyle = "#FF0000";

		// Draw vector line
		let Vx = this.x;
		let Vy = this.y;
		for(const v of this.vec)
		{
		    Vx += v.x;
		    Vy += v.y;
		}

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(Vx, Vy);
		ctx.stroke();

		//console.log('drawing line from (' + this.x + ',' + this.y + ') to (' + Vx + ', ' + this.y + ')');

		
		// Draw vector head
		// Really proud of this
		if(this.distance(Vx, Vy) > 3)
		{
			ctx.translate(Vx, Vy);
			ctx.rotate( Math.atan2(Vy - this.y, Vx - this.x) + (Math.PI / 4));
			ctx.strokeRect(-2, -2, 4, 4);
		}


		ctx.setTransform(1, 0, 0, 1, 0, 0);

		// Draw Circle
		ctx.beginPath();
        ctx.arc(this.x, this.y, SRAD, 0, 2 * Math.PI);
        ctx.fill();	
    }

    distance(x, y)
    {
        x -= this.x;
        y -= this.y;
        return Math.sqrt(x*x + y*y);
    }

    calculate(index)
    {
        if(this.vec[index] == undefined) this.vec[index] = new Vector2();
		let dist = this.distance(pList[index].x, pList[index].y) / DPI;
		let magnitude = (pList[index].charge / (dist * dist));

		this.vec[index].x = ((pList[index].x - this.x) / dist) * magnitude;
		this.vec[index].y = ((pList[index].y - this.y) / dist) * magnitude;
    }

	clear()
	{
		this.vec = [];
	}

}

// func

var dragging = undefined;

var pList = [];
var sList = [];

function redraw()
{
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
	for(const s of sList)
		s.draw();
    for(const p of pList)
        p.draw();
}

function getClickElementIndex(x, y)
{
    for(let i = 0; i < pList.length; i++)
        if(pList[i].isInside(x, y)) return i;
    return undefined;
}

function createElectron(x, y, charge)
{
    let ind = pList.length;
    pList[ind] = new Electron( x, y, charge );
    for(const s of sList)
        s.calculate(ind);
    redraw();
}

function fillSensors()
{
	const between = 100;

	const originX = Math.trunc( (canvas.width - (Math.trunc(canvas.width / between) * between)) / 2 );
	const originY = Math.trunc( (canvas.height - (Math.trunc(canvas.height / between) * between)) / 2 );

console.log(originX);

	for(let i = originX; i < canvas.width; i += between)
	{
		for(let j = originY; j < canvas.height; j += between)
		{
			sList[sList.length] = new Sensor(i, j);
		}
	}
}

// js events

function Resized()
{
    canvas.width = canvas.offsetHeight;
	canvas.height = canvas.offsetHeight;
	redraw();
}

function MouseDown()
{
	console.log(event.x + ", " + event.y);
	if(event.which == 2)
	{
		pList = [];
		for(const s of sList)
			s.clear();
            redraw();
		return;
	}
    dragging = getClickElementIndex(event.x, event.y);
	if(dragging == undefined)
	{
		createElectron(event.x, event.y, event.which == 1 ? -1 : 1);
	}
}

function MouseUp()
{
    dragging = undefined;
}

function MouseMoved()
{
    if(dragging != undefined)
    {
        pList[dragging].setPos(event.x, event.y);
        for(const s of sList)
            s.calculate(dragging);
        redraw();
    }
}

// init code

const canvas = document.getElementById('mainCanvas');

canvas.addEventListener('contextmenu', (e) => {
	e.preventDefault();
    return false;
})

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d');
ctx.lineWidth = 7;
ctx.lineCap = 'round';
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

//sList[sList.length] = new Sensor( canvas.width / 2, canvas.height / 2 - 100 );
//sList[sList.length] = new Sensor( canvas.width / 4, canvas.height / 2 + 100 );
//sList[sList.length] = new Sensor( canvas.width - canvas.width / 4, canvas.height / 2 - 100 );
//sList[sList.length] = new Sensor( canvas.width / 2, canvas.height / 2 + 100 );
//sList[sList.length] = new Sensor( canvas.width / 4, canvas.height / 2 - 100 );
//sList[sList.length] = new Sensor( canvas.width - canvas.width / 4, canvas.height / 2 + 100 );
//sList[sList.length] = new Sensor( canvas.width / 2, canvas.height / 2 );

fillSensors();

redraw();