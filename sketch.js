
var origin;
var colour;

var shapes;
var S;
var d2;
var s2;
var c2;
var found2;
var n;
var rayStep;
var angle;
var lastD;

var angleHMin;
var angleHMax;
var angleHDelta;

var angleVMin;
var angleVMax;
var angleVDelta;

var meetCondition;
var collideWith;
var collided;

var Xcoor;
var Ycoor;

var partialGraphic;

var contructionLines;
var drawCircles;
var shadowMode;

var vA;

var smallestDimension;
var clickNum;

var qual;
var pixMatrix;
var PXq;
var PYq;
var Dz;
var angles;

var mode;

var ld;
var space;
var left;
var right;
var keyDPlus;
var keyDMinus;
/*

var effectiveA;
var effectiveV;
*/
    
function setup() {
	W = window.innerWidth;
	H = window.innerHeight;
	canvas = createCanvas(W, H);
	
	origin = [width/2,height/2];
	
	colour = {red:color(191, 74, 74), blue:color(85, 152, 224), green:color(21, 212, 148), grey:color(138, 138, 138), darkgrey:color(68, 68, 68), lightblue:color(60, 204, 230), black:color(23, 23, 23), purple:color(194, 24, 194), yellow:color(235, 215, 0), white:color(255, 255, 255)};


	fill(54, 53, 54);
	textFont('Avenir',23);
	textAlign(CENTER,CENTER);
	text('~ CLICK ~',width/2,height/2);
	
	translate(origin[0], height-origin[1]);
	
	scale(1,-1);

	shapes = {'s':[]};

	n = 40;
	rayStep = 5;
	angle = 0;
	
	Dz = 700;
		
	angleMode(DEGREES);
	
	calcAngles();
	
	print(angleHMax);
	
	meetCondition = ['',0,0];
	collideWith = '';
	
	partialGraphic = [];
	
	contructionLines = false;
	drawCircles = true;
	shadowMode = false;

	createSphere(190,65,-5,55,colour.red);
	createSphere(168,-63,10,71,colour.green);
	createSphere(161,23,20,30,colour.blue);
	
	createSphere(72,156,5,49,colour.purple);
	createSphere(28,-76,-30,25,colour.lightblue);
	createSphere(119,106,-10,33,colour.yellow);
	
	vA = 0;
	
	clickNum = 0;
	
	strokeWeight(1);
	strokeCap(SQUARE);
	
	if (height<width){
	    smallestDimension = height;
    } else {
	    smallestDimension = width;
    }
	
	qual = 1;
	pixMatrix = [];
	for (var h=0; h<floor(height/qual); h+=1){
		pixMatrix.push([]);
		for (var w=0; w<floor(width/qual); w+=1){
			pixMatrix[h].push([0,colour.black]);
		}
	}
	
	Dz = (H/2)/tan((angleHMax-angleHMin)/2);
	
	
	mode = 'grid'; // 'dots' or 'grid' (grid is in developement...)
	
	space = false;
}

function calcAngles(){
	angleHMax = atan(width/(2*Dz));
	angleHMin = -angleHMax;
	angleHDelta = angleHMax/400;
	
	angleVMax = atan(height/(2*Dz));
	angleVMin = -angleVMax;
	angleVDelta = angleVMax/400;
/*
	effectiveA = atan(width/(2*sqrt(Dz * Dz + height * height / 4)));
	effectiveA = atan(height/(2*sqrt(Dz * Dz + width * width / 4)));
*/
}

function createSphere(X,Y,Z,R,C){
    shapes.s.push({x:X,y:Y,z:Z,r:R,c:C});
}


function condition(i,a,va){
    var X = d2[i]*cos(a) + Xcoor;
    var Y = d2[i]*sin(a) + Ycoor;
    var Z = d2[i]*sin(va);
    meetCondition = ['',a,va];
    if (X < -origin[0] || X > width-origin[0] || Y > height-origin[1] || Y < -origin[1]){
        meetCondition[0] = str(-1);
    }
    if (Z<-20){
        meetCondition[0] = str(-2);
// 		meetCondition[2] = -meetCondition[2]; 
		
    }
    if (meetCondition[0] === ''){
	    for (var j=0; j<shapes.s.length; j+=1){
	        if ((X-shapes.s[j].x)*(X-shapes.s[j].x) + (Y-shapes.s[j].y)*(Y-shapes.s[j].y) + (Z-shapes.s[j].z)*(Z-shapes.s[j].z)  < shapes.s[j].r*shapes.s[j].r){
	            meetCondition[0] = str(j);
	            break;
	        }
	    }
    }
    return meetCondition;
}

function algorithm2(a,va){
    var definiteCollision = '';
    angles = [a,va];
    var bouce = 0;
    while ((definiteCollision==='-2' || !bouce) && bouce<2){
	    d2 = [0];
        s2 = [rayStep];
        c2 = [];
        found2 = false;
	    for (var i=0; i<n; i+=1){
	        collideWith = condition(i,angles[0],angles[1]);
	        angles = [collideWith[1],collideWith[2]];
	        if (collideWith[0]){
	            definiteCollision = collideWith[0];
	            found2 = true;
	            c2.push(1);
	            d2.push(d2[i]-s2[i]);
	            s2.push(s2[i]/2);
	        } else {
	            c2.push(0);
	            if (found2){
	                d2.push(d2[i]+s2[i]);
	                s2.push(s2[i]/2);
	            } else {
	                d2.push(d2[i]+s2[i]);
	                s2.push(s2[i]*1.1);
	            }
	        }
	    }
// 	    angles[1] = -angles[1];
	    bouce += 1;
    }
    return definiteCollision;
};


function findScene(va){
	var graphic = [];
    for (var a=angleHMin; a<angleHMax; a+=angleHDelta){
        d2 = [0];
        s2 = [rayStep];
        c2 = [];
        found2 = false;
        lastD = 0;
        
        collided = algorithm2(a,va);

        strokeWeight(2);
        for (var i=0; i<n; i+=1){
            if (c2[i]){
                lastD = d2[i];
                if (contructionLines){
                    stroke(51, 153, 184, 20 + 100*i/n);
                }
            } else {
                if (contructionLines){
                    stroke(184, 51, 73, 20 + 100*i/n);
                }
            }
            if (contructionLines){
                point(d2[i]*cos(a)+Xcoor,d2[i]*sin(a)+Ycoor);
            }
        }
        
                
        if (collided){
            if (parseInt(collided,10)>=0){
                graphic.push([lastD,shapes.s[parseInt(collided,10)].c]);
            } else {
	            if (parseInt(collided,10)===-1){
                	graphic.push([lastD,colour.lightblue]);
                } else if (parseInt(collided,10)===-2){
	                graphic.push([lastD,colour.grey]);
                }
            }
        } else {
	        graphic.push([false]);   
        }
        
    }
    
	return graphic;
}


function drawScene(){
    
    if (shadowMode){
        background(43, 43, 43);
    }
    
    strokeWeight(4);
    stroke(107, 107, 107);
    point(0,0);
    noFill();
    
    if (drawCircles){
        stroke(138, 138, 138,200);
        strokeWeight(1);
        for (var j=0; j<shapes.s.length; j+=1){
            ellipse(shapes.s[j].x,shapes.s[j].y,2*shapes.s[j].r,2*shapes.s[j].r);
        }
    }
        
    var Dist=0;
    var counter=0;
    
    
    if (shadowMode){
        stroke(196, 196, 196);
        fill(250, 250, 250);
        strokeWeight(1);
        beginShape();
        for (var a=angleMin; a<angleMax; a+=angleDelta){
            Dist = partialGraphic[counter][0];
            if (Dist){
            	vertex(Dist*cos(a)+Xcoor,Dist*sin(a)+Ycoor);
            }
            counter += 1;
        }
        endShape();
    }
    
    counter=0;
    for (var a=angleHMin; a<angleHMax; a+=angleHDelta){
        Dist = partialGraphic[counter][0];
        if (Dist){
	        strokeWeight(30/pow(Dist,1/3));
	        stroke(partialGraphic[counter][1]);
	        point(Dist*cos(a) + Xcoor,Dist*sin(a) + Ycoor);
        }
        counter += 1;
    }
    
    fill(255);
    strokeWeight(1);
    stroke(60, 204, 230);
    line(Xcoor, Ycoor,Xcoor + smallestDimension*cos(angleHMin), Ycoor+ smallestDimension*sin(angleHMin));
    line(Xcoor, Ycoor,Xcoor + smallestDimension*cos(angleHMax), Ycoor+ smallestDimension*sin(angleHMax));
    ellipse(Xcoor,Ycoor,8,8);

    
};

function ThreeToTwo(d,a,va,col){
	PXq = floor((-Dz*tan(a-(angleHMax+angleHMin)/2) + origin[0])/qual);
	PYq = floor((Dz*tan(va) + origin[1])/qual);
// 	print(PXq);
// 	print(PYq);
// alert('done');
  	if (PXq>0 && PYq>0 && pixMatrix.length>PYq && pixMatrix[PYq].length>PXq){
		var stored = pixMatrix[PYq][PXq][0];
		if (stored>d || stored === 0){
			pixMatrix[PYq][PXq] = [d,col];
		}
// 		alert('done');
	}
//   		}
//   	}
}


function formPixMatrix(v){
	var counter = 0;
	for (var a=angleHMin; a<angleHMax; a+=angleHDelta){
        Dist = partialGraphic[counter][0];
        if (Dist){
	        if (mode==='dots'){
		        strokeWeight(20/pow(Dist,1/3));
		        stroke(red(partialGraphic[counter][1]),green(partialGraphic[counter][1]),blue(partialGraphic[counter][1]),10000/Dist+50);
		        point(-width*tan(a-(angleHMax+angleHMin)/2),height*tan(v));
	        } else if (mode==='grid') {
				ThreeToTwo(Dist,a,v,partialGraphic[counter][1]);
			}
// 	        point(-width/2 * (a/120),height/2 * (v/20));
        }
        counter += 1;
    }
}

function cleanUp(){
	var newPixMatrix = pixMatrix;
	for (var h=0; h<pixMatrix.length; h+=1){
		for (var w=0; w<pixMatrix[h].length; w+=1){
			if (pixMatrix[h][w][0] === 0 && w>0 && w<pixMatrix[h].length-1){
				if (pixMatrix[h][w+1][0]){
					newPixMatrix[h][w] = pixMatrix[h][w+1];
				}
				if (pixMatrix[h][w-1][0]){
					newPixMatrix[h][w] = pixMatrix[h][w-1];
				}
				
			}
		}
	}
	for (var h=0; h<pixMatrix.length; h+=1){
		for (var w=0; w<pixMatrix[h].length; w+=1){
			if (newPixMatrix[h][w][0] === 0 && h>0 && h<pixMatrix.length-1){
				if (newPixMatrix[h+1][w][0]){
					newPixMatrix[h][w] = newPixMatrix[h+1][w];
				}
				if (newPixMatrix[h-1][w][0]){
					newPixMatrix[h][w] = newPixMatrix[h-1][w];
				}
				
			}
		}
	}
	return newPixMatrix;
}

function drawScene2(){
    noStroke();
    for (var i=0; i<0; i+=1){
	    pixMatrix = cleanUp();
    }
	for (var h=0; h<pixMatrix.length; h+=1){
		for (var w=0; w<pixMatrix[h].length; w+=1){
			if (pixMatrix[h][w][0]){
				ld = pow(1.00025,-sq(0));
				fill(red(pixMatrix[h][w][1])*ld,green(pixMatrix[h][w][1])*ld,blue(pixMatrix[h][w][1])*ld,255 * pow(1.00015,-sq(pixMatrix[h][w][0])));
				rect(w*qual - origin[0],h*qual - origin[1],qual,qual);
			}
		}
	}
}

function keyPressed(){
	if (keyCode===32){
		space = true;
	} else if (keyCode===37){
		left = true;
	} else if (keyCode ===39){
		right = true;
	}
	if (keyCode===187){
		keyDPlus = true;
	}
	if (keyCode===189){
		keyDMinus = true;
	}
}
function keyReleased(){
	space = false;
	left = false;
	right = false;
	keyDPlus = false;
	keyDMinus = false;
}

function mouseClicked(){
    if (height<width){
	    smallestDimension = height;
    } else {
	    smallestDimension = width;
    }
/*
		if (clickNum%2 === 0){
			background(colour.white);
	    Xcoor = mouseX-origin[0];
	    Ycoor = origin[1]-mouseY;
		partialGraphic = findScene(vA);
		drawScene();
	} else {
		background(colour.black);
		drawScene2(vA);
	}
*/
	if (space){
		
		background(colour.black);
		if (mode==='grid'){
			pixMatrix = [];
			for (var h=0; h<floor(height/qual); h+=1){
				pixMatrix.push([]);
				for (var w=0; w<floor(width/qual); w+=1){
					pixMatrix[h].push([0,colour.black]);
				}
			}
// 			print(pixMatrix);
		}
		for (var va=angleVMin; va<angleVMax; va+=angleVDelta){
			partialGraphic = findScene(va);
			formPixMatrix(va);
	    }
	    if (mode === 'grid'){
// 		    print(pixMatrix);
		    drawScene2();
		    print(pixMatrix);
	    }
	} else {
		if (left) {
			angleHMin += 5;
			angleHMax +=5;
		} else if (right){
			angleHMin -= 5;
			angleHMax -=5;
		}
		
		if (keyDPlus) {
			Dz += 10;
			calcAngles();
		} else if (keyDMinus){
			Dz -= 10;
			calcAngles();
		}
		background(colour.white);
	    Xcoor = mouseX-origin[0];
	    Ycoor = origin[1]-mouseY;
		partialGraphic = findScene(vA);
		drawScene();
    }
};

window.onresize = function() {
  resizeCanvas(windowWidth, windowHeight);
  W = windowWidth;
  H = windowHeight
};


// Other functions down here