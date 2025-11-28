// ===== 사용자 설정(600×400 고정 + S키 PNG 저장) =====
let skinTone   = [237, 209, 180];
let hairColor  = [30, 25, 20];
let eyeColor   = [45, 95, 145];
let shirtColor = [75, 110, 230];

let hasGlasses = true;
let hasHat = false;
let hasEarrings = false;
let hasBeard = false;

let faceStretch = 1.05;  // 얼굴 세로 비율
let eyeGap = 0.23;       // 눈 간격(얼굴 폭 대비)

function setup(){
  createCanvas(600, 400);
  pixelDensity(1);
  angleMode(DEGREES);
  noStroke();
}

function draw(){
  background('#f4f6f9');

  // 중앙 배치
  const cx = width/2;
  const cy = height*0.52;
  const faceW = min(width, height) * 0.35;
  const faceH = faceW * faceStretch;

  drawShirt(cx, cy + faceH*0.7, faceW*1.4, faceH*0.9);
  drawNeck(cx, cy + faceH*0.35, faceW*0.28, faceH*0.28);

  drawFaceShadow(cx, cy, faceW, faceH);
  drawFace(cx, cy, faceW, faceH);
  drawHair(cx, cy, faceW, faceH);     // ★ 머리 위치 조정(붙임)
  drawBrows(cx, cy, faceW, faceH);
  drawEyes(cx, cy, faceW, faceH);     // ★ 눈 확대
  drawNose(cx, cy, faceW, faceH);
  drawMouth(cx, cy, faceW, faceH);

  if(hasGlasses)  drawGlasses(cx, cy, faceW, faceH);
  if(hasBeard)    drawBeard(cx, cy, faceW, faceH);
  if(hasEarrings) drawEarrings(cx, cy, faceW, faceH);
  if(hasHat)      drawHat(cx, cy, faceW, faceH);
}

// ===== 파츠 함수들 =====
function drawShirt(x, y, w, h){
  fill(shirtColor); rectMode(CENTER); rect(x, y, w, h, 20);
  // 카라
  fill(255);
  triangle(x-20, y-h*0.4, x, y-h*0.2, x-60, y-h*0.15);
  triangle(x+20, y-h*0.4, x, y-h*0.2, x+60, y-h*0.15);
}

function drawNeck(x, y, w, h){
  fill(skinTone); rectMode(CENTER); rect(x, y, w, h, 14);
}

function drawFaceShadow(x, y, w, h){
  fill(0, 0, 0, 15); ellipse(x, y + h*0.1, w*0.95, h*0.95);
}

function drawFace(x, y, w, h){
  fill(skinTone); ellipse(x, y, w, h);
  // 볼터치
  fill(255, 120, 120, 35);
  ellipse(x - w*0.22, y + h*0.06, w*0.22, h*0.12);
  ellipse(x + w*0.22, y + h*0.06, w*0.22, h*0.12);
}

// ★ 머리: y-offset을 낮춰 얼굴에 붙임, 옆머리도 맞춤
function drawHair(x, y, w, h){
  fill(hairColor);
  // 앞머리(기존 y - h*0.28 → y - h*0.18)
  arc(x, y - h*0.18, w*1.05, h*0.9, 200, 340, CHORD);
  // 옆머리
  ellipse(x - w*0.43, y - h*0.02, w*0.22, h*0.56);
  ellipse(x + w*0.43, y - h*0.02, w*0.22, h*0.56);
}

function drawBrows(x, y, w, h){
  fill(40, 30, 20);
  rectMode(CENTER);
  rect(x - w*eyeGap, y - h*0.12, w*0.24, h*0.045, 10);
  rect(x + w*eyeGap, y - h*0.12, w*0.24, h*0.045, 10);
}

// ★ 눈 크게: eyeR 비율 확대 및 각 요소 스케일 조정
function drawEyes(x, y, w, h){
  const eyeY   = y - h*0.02;
  const eyeR   = w*0.15;     // 0.11 → 0.15
  const pupilR = eyeR*0.45;  // 동공 확대

  // 시선 추적
  const look = createVector(mouseX - x, mouseY - eyeY);
  look.limit(eyeR*0.25);

  // 흰자
  fill(255);
  ellipse(x - w*eyeGap, eyeY, eyeR*1.25, eyeR);
  ellipse(x + w*eyeGap, eyeY, eyeR*1.25, eyeR);

  // 홍채
  fill(eyeColor);
  ellipse(x - w*eyeGap + look.x, eyeY + look.y*0.6, eyeR*0.85);
  ellipse(x + w*eyeGap + look.x, eyeY + look.y*0.6, eyeR*0.85);

  // 동공
  fill(20);
  ellipse(x - w*eyeGap + look.x, eyeY + look.y*0.6, pupilR);
  ellipse(x + w*eyeGap + look.x, eyeY + look.y*0.6, pupilR);

  // 하이라이트
  fill(255, 220);
  ellipse(x - w*eyeGap + look.x - pupilR*0.22, eyeY + look.y*0.45, pupilR*0.42);
  ellipse(x + w*eyeGap + look.x - pupilR*0.22, eyeY + look.y*0.45, pupilR*0.42);
}

function drawNose(x, y, w, h){
  fill(skinTone[0]-10, skinTone[1]-10, skinTone[2]-10);
  triangle(x, y - h*0.02, x - w*0.04, y + h*0.16, x + w*0.04, y + h*0.16);
  fill(0,0,0,20); ellipse(x, y + h*0.18, w*0.18, h*0.05);
}

function drawMouth(x, y, w, h){
  const smile = map(mouseX, 0, width, 5, 22);
  fill(185, 45, 70);
  arc(x, y + h*0.27, w*0.3, h*0.16, 0, 180, CHORD);
  noFill(); stroke(185, 45, 70, 90); strokeWeight(2);
  arc(x, y + h*0.27 - 2, w*0.32, h*0.14 + smile*0.2, 15, 165);
  noStroke();
}

function drawGlasses(x, y, w, h){
  const r = w*0.17;         // 안경 테도 살짝 키움
  const yPos = y - h*0.03;
  noFill(); stroke(20, 20, 25, 220); strokeWeight(4);
  ellipse(x - w*eyeGap, yPos, r*1.3, r);
  ellipse(x + w*eyeGap, yPos, r*1.3, r);
  line(x - w*eyeGap + r*0.65, yPos, x + w*eyeGap - r*0.65, yPos);
  // 다리
  line(x - w*eyeGap - r*0.65, yPos, x - w*eyeGap - r*1.2, yPos - 8);
  line(x + w*eyeGap + r*0.65, yPos, x + w*eyeGap + r*1.2, yPos - 8);
  noStroke();
}

function drawBeard(x, y, w, h){
  fill(hairColor, 220);
  arc(x, y + h*0.28, w*0.42, h*0.30, 200, 340, CHORD);
  rectMode(CENTER);
  rect(x, y + h*0.23, w*0.18, h*0.035, 10);
}

function drawEarrings(x, y, w, h){
  fill(250, 210, 60);
  circle(x - w*0.5, y + h*0.05, w*0.06);
  circle(x + w*0.5, y + h*0.05, w*0.06);
}

function drawHat(x, y, w, h){
  fill(25, 35, 75);
  arc(x, y - h*0.42, w*1.15, h*0.22, 0, 180, CHORD);
  rectMode(CENTER);
  rect(x, y - h*0.58, w*0.62, h*0.3, 18);
}

// ===== 키보드 조작 =====
function keyPressed(){
  if(key==='G'||key==='g') hasGlasses = !hasGlasses;
  if(key==='H'||key==='h') hasHat = !hasHat;
  if(key==='E'||key==='e') hasEarrings = !hasEarrings;
  if(key==='B'||key==='b') hasBeard = !hasBeard;

  if(keyCode===UP_ARROW)    faceStretch = constrain(faceStretch + 0.03, 0.85, 1.35);
  if(keyCode===DOWN_ARROW)  faceStretch = constrain(faceStretch - 0.03, 0.85, 1.35);
  if(keyCode===LEFT_ARROW)  eyeGap = constrain(eyeGap - 0.01, 0.16, 0.32);
  if(keyCode===RIGHT_ARROW) eyeGap = constrain(eyeGap + 0.01, 0.16, 0.32);

  // 프리셋
  if(key==='1'){ skinTone=[244,210,190]; hairColor=[25,20,15]; }
  if(key==='2'){ skinTone=[229,195,160]; hairColor=[50,30,20]; }
  if(key==='3'){ skinTone=[209,170,130]; hairColor=[20,20,25]; }
  if(key==='4'){ skinTone=[188,148,110]; hairColor=[15,12,10]; }
  if(key==='5'){ skinTone=[165,120,85];  hairColor=[60,40,25]; }

  // PNG 저장
  if(key==='S'||key==='s') saveCanvas('caricature_600x400','png');
}
