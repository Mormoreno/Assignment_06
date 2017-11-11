var myData;
var astronauts = [];
var spriteTerra;
var spriteAstronauta;
var spriteAsteroide;
var spriteSfondo;
var spriteBandiere=[];
var deltaMouseX;
var deltaMouseY;
var scritta;
var testoScritta;
var testoScrittaDefault="DRAG ASTRONAUTS!";


var mouseLasciato=false;
var mousePremuto=false;

function preload() {
	myData = loadJSON("./assets/peopleinspace.json");
	spriteSfondo=loadImage("./assets/spriteSfondo.png");
	spriteTerra=loadImage("./assets/spriteTerra.png");
	spriteAstronauta=loadImage("./assets/spriteAstronauta.png");
	spriteBandiere[0]=loadImage("./assets/flagItalia.png");
	spriteBandiere[1]=loadImage("./assets/flagRussia.png");
	spriteBandiere[2]=loadImage("./assets/flagUSA.png");
}

function setup() {

		frameRate(60);
	createCanvas(500, 500);
	textFont("Electrolize");
	
	for (var i = 0; i < myData.people.length; i++) {
		var astroData=myData.people[i];

		var myAstronaut = new Astronaut(astroData.name,astroData.country,i);
		astronauts.push(myAstronaut);
	}
	testoScritta=testoScrittaDefault;
}

function draw() {
	image(spriteSfondo, 0, 0, 500, 500);
	drawEarth();
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(30);
	scritta=text(testoScritta,width/2,100);


	for (var i = 0; i < astronauts.length; i++) {
		var astro = astronauts[i];
		astro.display();
	}


	if(mouseLasciato)
	print("Lasciato");

	if(mousePremuto)
	print("Premuto");




	if(!mouseIsPressed)
	{
		if(mouseLasciato)
		mouseLasciato=false;
	}
	if(mousePremuto)
	mousePremuto=false;



}

function drawEarth()
{
	var raggioTerra=80;
	push();
	translate(width/2,height/2);
	rotate(frameCount*.01);
	image(spriteTerra,-raggioTerra/2,-raggioTerra/2,raggioTerra,raggioTerra);
	pop();
}

function Astronaut(name,country,id) {

	this.id=id;
	this.rotazione=random(360);
	this.velocitaMax=15;
	this.radius=40;
	this.radiusBadiera=10;
	this.name=name;
	this.country=country;
	this.modificatoreRotazione=1;
	this.velocitaRotazione=1;

	this.x=random(this.radius, width-this.radius);
	this.y=random(this.radius, height-this.radius);

	this.frizione=0.005;
	this.velocitaX=random(-4,4);
	this.velocitaY=random(-4,4);

	this.preso=false;
	
	

	this.display = function() {

		this.cantPick=false;
		for(var i=0;i<astronauts.length;i++)
		{
			if(i!=id)
			if(astronauts[i].preso)
			this.cantPick=true;
		}


		if(mousePremuto)
		{
			
			if(dist(this.x,this.y,mouseX,mouseY)< this.radius && !this.cantPick)
			this.preso=true;
		}
		
		if(this.preso && mouseIsPressed)
		{
			testoScritta=this.name;
			this.velocitaRotazione=0;
			this.velocitaX=0;
			this.velocitaY=0;
			this.x=mouseX;
			this.y=mouseY;
		}
		
		else
		if(this.preso && mouseLasciato)
		{
			testoScritta=testoScrittaDefault;
			this.velocitaRotazione=10;
			this.preso=false;
			this.velocitaX=deltaMouseX;
			this.velocitaY=deltaMouseY;
		
		}
		
		this.x+=this.velocitaX;
		this.y+=this.velocitaY;

		//Collisione
		/*for(var i=0;i<astronauts.length;i++)
		{
			if(i!=id)
			if(dist(this.x,this.y,astronauts[i].x,astronauts[i].y)<this.radius*1.5)
				{
					this.velocitaX*=-1;
					this.velocitaY*=-1;
				}
		}*/

		//Gravita
		this.modificatoreGravita=1000;
		if(dist(this.x,this.y,width/2,height/2)<200)
		{
			this.velocitaX-=(this.x-width/2)/this.modificatoreGravita;
			this.velocitaY-=(this.y-height/2)/this.modificatoreGravita;
		}

		if(this.x>width-this.radius || this.x<this.radius)
		{
			this.velocitaX*=-1;
			this.modificatoreRotazione*=-1;
		}
		if(this.y>height-this.radius || this.y<this.radius)
		{
			this.velocitaY*=-1;
			this.modificatoreRotazione*=-1;
		}

		if(this.velocitaX>0)
		this.velocitaX-=this.frizione;
		else
		if(this.velocitaX<0)
		this.velocitaX+=this.frizione;

		if(this.velocitaY>0)
		this.velocitaY-=this.frizione;
		else
		if(this.velocitaY<0)
		this.velocitaY+=this.frizione;

		if(this.velocitaRotazione>0.2)
		this.velocitaRotazione-=this.frizione;

		this.velocitaX=constrain(this.velocitaX, -this.velocitaMax, this.velocitaMax);
		this.velocitaY=constrain(this.velocitaY, -this.velocitaMax, this.velocitaMax);

		this.rotazione+=this.velocitaRotazione;

		push();
		translate(this.x,this.y);
		
		rotate(this.rotazione*0.01);
		image(spriteAstronauta,-this.radius,-this.radius,this.radius*2,this.radius*2);
		var spriteBandiera;
		switch(this.country)
		{
			case "italy":spriteBandiera=spriteBandiere[0];
					break;
			case "russia":spriteBandiera=spriteBandiere[1];
				break;

			case "usa":spriteBandiera=spriteBandiere[2];
			break;
			default:spriteBandiera=spriteBandiere[0];
		}
		image(spriteBandiera,-this.radiusBadiera,-this.radiusBadiera-18,this.radiusBadiera*2,this.radiusBadiera*2);
		
		pop();
	}


}

function mousePressed()
{
	mousePremuto=true;
}

function mouseReleased()
{
mouseLasciato=true;

deltaMouseX=mouseX-pmouseX;
deltaMouseY=mouseY-pmouseY;



}