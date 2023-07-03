

class Ball
{
    constructor(pos, radius)
    {
        this.pos = pos;
        this.radius = radius;
        this.vel = createVector();
        this.mass = 10;
    }
}

//all of these measurements are in meters
TABLE_WIDTH = 1.67;
TABLE_LENGTH = 3.1;
INNER_TABLE_WIDTH = 1.42;
INNER_TABLE_LENGTH = 2.84;
BALL_DIAMETER = 0.05715;

startingPositions = [
];

SCALE_FACTOR = 200;

WINDOW_WIDTH = TABLE_LENGTH * SCALE_FACTOR;
WINDOW_HEIGHT = TABLE_WIDTH * SCALE_FACTOR;

DRAG_FACTOR = 0.04;

ballRadius = BALL_DIAMETER * SCALE_FACTOR / 2;
numBalls = 16;
balls = [];

RESTITUTION = 0.7;
FRICTION = 0.9985;

mouseDownPos = createVector();
mouseUpPos = createVector();
mouseIsDragged;
ballColors;


function setup()
{
    mouseIsDragged = false;
    //hardcoded values for starting pool positions (in meters)
    startingPositions = [
        createVector(0,0),
        createVector(0, (BALL_DIAMETER)),
        createVector(0, (BALL_DIAMETER)*2),
        createVector(0, (BALL_DIAMETER)*3),
        createVector(0, (BALL_DIAMETER)*4),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2)+(BALL_DIAMETER)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2)+ (BALL_DIAMETER*2)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3), (BALL_DIAMETER/2) + (BALL_DIAMETER*3)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*2, (BALL_DIAMETER)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*2, (BALL_DIAMETER)+(BALL_DIAMETER)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*2, (BALL_DIAMETER)+ (BALL_DIAMETER*2)),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*3, (BALL_DIAMETER) + BALL_DIAMETER/2),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*3, (BALL_DIAMETER)+(BALL_DIAMETER) + BALL_DIAMETER/2),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*4, (BALL_DIAMETER) + BALL_DIAMETER),
        createVector((BALL_DIAMETER/2)*Math.sqrt(3)*4+1.42, (BALL_DIAMETER) + BALL_DIAMETER)
    ];
    //looping through and adding offset to get positions into right place on table
    for (var i = 0; i < startingPositions.length; i++)
    {  
        startingPositions[i].add(createVector(0.13 + 0.71 - ((BALL_DIAMETER/2)*Math.sqrt(3)*4), 0.125 + 0.71 - ((BALL_DIAMETER) + BALL_DIAMETER)));
    }

    ballColors = [];
    ballColors[0] = ballColors[8] = "#f0fb00";
    ballColors[1] = ballColors[9] = "#1500ff";
    ballColors[2] = ballColors[10] = "#ff0e00";
    ballColors[3] = ballColors[11] = "#70f";
    ballColors[4] = ballColors[12] = "#ff7000"
    ballColors[5] = ballColors[13] = "#00bd0b";
    ballColors[6] = ballColors[14] = "#8e0000";
    ballColors[7] = "#000000";
    ballColors[15] = "#ffffff";

    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    background(0);

    for (i = 0; i < numBalls; i++)
    {
        balls.push(new Ball(p5.Vector.mult(startingPositions[i], SCALE_FACTOR), ballRadius));
        console.log(balls[i].pos);
    }


}

function handleCollision(ball1, ball2, restitution)
{
    var dir = p5.Vector.sub(ball2.pos, ball1.pos);
    var dirLen = p5.Vector.mag(dir);
    
    if (dirLen == 0 || dirLen > ball1.radius + ball2.radius)
        return;

    dir.normalize();


    var corr = (ball1.radius + ball2.radius - dirLen) / 2.0;
    console.log(corr);
    ball2.pos.add(p5.Vector.mult(dir, corr));
    ball1.pos.add(p5.Vector.mult(dir, -corr));

    var v1 = p5.Vector.dot(ball1.vel, dir);
    var v2 = p5.Vector.dot(ball2.vel, dir);

    var m1 = ball1.mass;
    var m2 = ball2.mass;

    var newV1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * restitution) / (m1 + m2);
    var newV2 = (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * restitution) / (m1 + m2);

    ball1.vel.add(p5.Vector.mult(dir, newV1 - v1));
    ball2.vel.add(p5.Vector.mult(dir, newV2 - v2));
}

function handleWallCollision(ball)
{
    if (ball.pos.x/SCALE_FACTOR + BALL_DIAMETER/2 >= 2.97 || ball.pos.x/SCALE_FACTOR - BALL_DIAMETER/2 <= 0.13)
    {
        ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.y/SCALE_FACTOR + BALL_DIAMETER/2 >= 1.5525 || ball.pos.y/SCALE_FACTOR - BALL_DIAMETER/2 <= 0.125)
    {
        ball.vel.y = -ball.vel.y;
    }
}

function draw()
{
    background("#652102");
    rectMode(CENTER);
    fill("#00ff19");
    rect(WINDOW_WIDTH/2, WINDOW_HEIGHT/2, INNER_TABLE_LENGTH*SCALE_FACTOR, INNER_TABLE_WIDTH * SCALE_FACTOR);

    if (mouseIsDragged == true)
    {
        stroke(255);
        line(balls[15].pos.x, balls[15].pos.y, balls[15].pos.x + p5.Vector.sub(createVector(mouseX, mouseY), mouseDownPos).x, balls[15].pos.y + p5.Vector.sub(createVector(mouseX, mouseY), mouseDownPos).y);
        stroke(0);
    }
    

    for (var i = 0; i < numBalls; i++)
    {
        balls[i].vel.mult(FRICTION);
        balls[i].pos.add(balls[i].vel);
        
        for (var j = i + 1; j < numBalls; j++)
        {
            handleCollision(balls[i], balls[j], RESTITUTION);
        }

        handleWallCollision(balls[i]);
    }

    for (var i = 0; i < numBalls; i++)
    {
        fill(ballColors[i]);

        circle(balls[i].pos.x, balls[i].pos.y, balls[i].radius*2);

        if (i >= 8 && i <= 14)
        {
            fill(255);
            arc(balls[i].pos.x, balls[i].pos.y, balls[i].radius*2, balls[i].radius*2, 0.5, PI-0.5, OPEN);
            arc(balls[i].pos.x, balls[i].pos.y, balls[i].radius*2, balls[i].radius*2, 0.5+PI, PI*2-0.5, OPEN);
        }
    }
}



function mousePressed()
{
    mouseDownPos = createVector(mouseX, mouseY);
    mouseIsDragged = true;
}

function mouseReleased()
{
    mouseIsDragged = false;

    mouseUpPos = createVector(mouseX, mouseY);

    newVel = p5.Vector.sub(mouseDownPos, mouseUpPos);

    balls[15].vel = p5.Vector.mult(newVel, DRAG_FACTOR);
}