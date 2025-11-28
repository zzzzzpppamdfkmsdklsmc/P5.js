// ===== 과제3: 캐릭터에 '움직임 + 인터랙션 + 10초 GIF' 추가 =====
// (600×400 고정 / S: PNG 저장, R: 10초 GIF 녹화, D: 10초 자동 데모)
// 외부 리소스 사용 없음

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

// === 애니메이션 상태 ===
let t = 0;                 // 전역 타임스텝
let blinkT = 0;            // 깜빡임 타이머
let isWink = false;        // 마우스 누르면 윙크
let autoDemo = false;      // D키: 10초 자동 데모 모드
let demoStartFrame = 0;    // 자동 데모 시작 프레임
let recordFps = 12;        // GIF 프레임레이트 (용량 절약)
let recording = false;     // R키로 10초 녹화
let recordFramesLeft = 0;

function setup(){
  createCanvas(600, 400);
  pixelDensity(1);       // GIF 용량↓
  frameRate(recordFps);  // GIF와 동일하게 맞추면 파일 작아짐
  angleMode(DEGREES);
  noStroke();
}

function draw(){
  // === 시간 진행 ===
  t += 1 / recordFps;
  blinkT += 1 / recordFps;

  // === 자동 데모(10초 동안 다양한 조작을 순차 수행) ===
  if (autoDemo) {
    const elapsed = frameCount - demoStartFrame;
    // 0~120프레임(=10초@12fps) 동안 단계적으로 시연
    if (elapsed < 120) {
      // 0~30f: 고개 살짝 좌우, 눈 간격 좁히기
      if (elapsed < 30) {
        eyeGap = map(elapsed, 0, 30, 0.23, 0.19);
      }
      // 30~60f: 안경 토글, 미소 업(+ 시선 추적)
      else if (elapsed < 60) {
        hasGlasses = true;
      }
      // 60~90f: 모자/수염 토글
      else if (elapsed < 90) {
        hasHat = true;
        hasBeard = true;
      }
      // 90~120f: 귀걸이 + 얼굴 늘였다 줄이기
      else {
        hasEarrings = true;
        faceStretch = 1.05 + 0.05 * sin((elapsed-90)*6);
      }
    } else {
      // 데모 종료 시 원복
      autoDemo = false;
      hasHat = false; hasBeard = false; hasEarrings = false;
      faceStretch = 1.05; eyeGap = 0.23;
    }
  }

  // === 배경(은은한 패럴랙스 점) ===
  background('#f4f6f9');
  drawSoftDots();

  // === 중앙 레이아웃 ===
  const cx = width/2;
  const cy = height*0.52;
  const faceW = min(width, height) * 0.35;
  const faceH = faceW * faceStretch;

  // === 호흡 & 고개 기울기 ===
  const breathe = 1 + 0.02 * sin(t*120);         // 상체 살짝 커졌다/작아짐
  const tilt = 3 * sin(t*80);                    // 고개 좌우 흔들림
  push();
  translate(cx, cy);
  rotate(tilt);
  scale(1, breathe);

  // === 목/옷 ===
  drawShirt(0, faceH*0.7, faceW*1.4, faceH*0.9);
  drawNeck(0, faceH*0.35, faceW*0.28, faceH*0.28);

  // === 얼굴/그림자 ===
  drawFaceShadow(0, 0, faceW, faceH);
  drawFace(0, 0, faceW, faceH);

  // === 머리(살짝 위아래 출렁) ===
  push();
  translate(0, -faceH*0.01 * sin(t*100));
  drawHair(0, 0, faceW, faceH);
  pop();

  // === 눈썹(감정 표현: 미세 흔들림) ===
  drawBrows(0, 0, faceW, faceH);

  // === 눈(시선 추적 + 깜빡임 + 윙크) ===
  const mx = constrain(mouseX, 0, width);
  const my = constrain(mouseY, 0, height);
  drawEyes(0, 0, faceW, faceH, mx, my);

  // === 코/입(미소 강도: 마우스X + 호흡 연동) ===
  drawNose(0, 0, faceW, faceH);
  drawMouth(0, 0, faceW, faceH, mx);

  // === 액세서리(토글 가능) ===
  if(hasGlasses)  drawGlasses(0, 0, faceW, faceH);
  if(hasBeard)    drawBeard(0, 0, faceW, faceH);
  if(hasEarrings) drawEarrings(0, 0, faceW, faceH);
  if(hasHat)      drawHat(0, 0, faceW, faceH);

  pop(); // 전체 트랜스폼 복구

  // === GIF 녹화(10초) ===
  if (recording) {
    // saveGif는 p5.js 환경/교재에 포함된 확장 함수 기준.
    if (typeof saveGif === 'function') {
      if (recordFramesLeft === 10*recordFps) {
        // 첫 프레임에서 녹화 시작
        saveGif('caricature_10s', 10, {delay: 0, units: 'seconds'});
      }
      recordFramesLeft--;
      if (recordFramesLeft <= 0) {
        recording = false;
      }
    } else {
      // 환경에 saveGif가 없으면 자동 해제
      recording = false;
      // 콘솔 안내
      // console.warn('saveGif( )가 없는 환경입니다. 교재 안내 확장 모듈을 확인해주세요.');
    }
  }
}

// ===== 배경: 은은한 점패턴(움직임) =====
function drawSoftDots(){
  noStroke();
  for (let i=0; i<14; i++){
    let px = (i*57 + (t*20)%60) % (width+60) - 30;
    let py = 60 + (i*23 + sin((t*40)+i*13)*20) % (height-120);
    fill(0, 0, 0, 8);
    circle(px, py, 24 + 6*sin(i*17 + t*60));
  }
}

// ===== 파츠 함수들 =====
function drawShirt(x, y, w, h){
  push();
  translate(x, y);
  fill(shirtColor); rectMode(CENTER); rect(0, 0, w, h, 20);
  // 카라
  fill(255);
  triangle(-20, -h*0.4, 0, -h*0.2, -60, -h*0.15);
  triangle( 20, -h*0.4, 0, -h*0.2,  60, -h*0.15);
  pop();
}

function drawNeck(x, y, w, h){
  push();
  translate(x, y);
  fill(skinTone); rectMode(CENTER); rect(0, 0, w, h, 14);
  pop();
}

function drawFaceShadow(x, y, w, h){
  push();
  translate(x, y);
  fill(0, 0, 0, 15); ellipse(0, h*0.1, w*0.95, h*0.95);
  pop();
}

function drawFace(x, y, w, h){
  push();
  translate(x, y);
  fill(skinTone); ellipse(0, 0, w, h);
  // 볼터치
  fill(255, 120, 120, 35);
  ellipse(-w*0.22, h*0.06, w*0.22, h*0.12);
  ellipse( w*0.22, h*0.06, w*0.22, h*0.12);
  pop();
}

// 머리: 살짝 낮춰서 붙이고, 옆머리 포함
function drawHair(x, y, w, h){
  push();
  translate(x, y);
  fill(hairColor);
  // 앞머리
  arc(0, -h*0.18, w*1.05, h*0.9, 200, 340, CHORD);
  // 옆머리(살짝 숨쉬듯 상하)
  let sideLift = h*0.01*sin(t*90);
  ellipse(-w*0.43, -h*0.02 + sideLift, w*0.22, h*0.56);
  ellipse( w*0.43, -h*0.02 + sideLift, w*0.22, h*0.56);
  pop();
}

function drawBrows(x, y, w, h){
  push();
  translate(x, y);
  fill(40, 30, 20);
  rectMode(CENTER);
  // 감정: 미세 흔들림
  let dy = h*0.005*sin(t*200);
  rect(-w*eyeGap, -h*0.12 + dy, w*0.24, h*0.045, 10);
  rect( w*eyeGap, -h*0.12 + dy, w*0.24, h*0.045, 10);
  pop();
}

// 눈: 시선추적 + 깜빡임 + 마우스다운 윙크
function drawEyes(x, y, w, h, mx, my){
  push();
  translate(x, y);

  const eyeY   = - h*0.02;
  const eyeR   = w*0.15;
  const pupilR = eyeR*0.45;

  // 시선 추적(부드럽게 제한)
  const look = createVector(mx - (width/2), my - (height*0.52));
  look.limit(eyeR*0.25);

  // 깜빡임 주기: 랜덤스러운 간격(2~4초)
  let blink = 1;
  if (blinkT > 2 + (noise(t)*2)) {
    // 3~5프레임 정도 급히 닫았다 열기
    const phase = (frameCount % 6);
    blink = (phase < 3) ? map(phase, 0, 2, 1, 0.05) : map(phase, 3, 5, 0.05, 1);
    if (phase === 5) blinkT = 0;
  }

  // 윙크(마우스 눌렀을 때 왼쪽 눈만 잠깐)
  let winkL = isWink ? 0.05 : 1;

  // 흰자
  fill(255);
  ellipse(-w*eyeGap, eyeY, eyeR*1.25, eyeR*blink*winkL);
  ellipse( w*eyeGap, eyeY, eyeR*1.25, eyeR*blink);

  // 홍채
  fill(eyeColor);
  ellipse(-w*eyeGap + look.x, eyeY + look.y*0.6, eyeR*0.85*winkL, eyeR*0.85*blink*winkL);
  ellipse( w*eyeGap + look.x, eyeY + look.y*0.6, eyeR*0.85,       eyeR*0.85*blink);

  // 동공
  fill(20);
  ellipse(-w*eyeGap + look.x, eyeY + look.y*0.6, pupilR*winkL, pupilR*blink*winkL);
  ellipse( w*eyeGap + look.x, eyeY + look.y*0.6, pupilR,        pupilR*blink);

  // 하이라이트
  fill(255, 220);
  ellipse(-w*eyeGap + look.x - pupilR*0.22, eyeY + look.y*0.45, pupilR*0.42*winkL, pupilR*0.42*blink*winkL);
  ellipse( w*eyeGap + look.x - pupilR*0.22, eyeY + look.y*0.45, pupilR*0.42,        pupilR*0.42*blink);

  pop();
}

function drawNose(x, y, w, h){
  push();
  translate(x, y);
  fill(skinTone[0]-10, skinTone[1]-10, skinTone[2]-10);
  triangle(0, -h*0.02, -w*0.04, h*0.16, w*0.04, h*0.16);
  fill(0,0,0,20); ellipse(0, h*0.18, w*0.18, h*0.05);
  pop();
}

function drawMouth(x, y, w, h, mx){
  push();
  translate(x, y);
  // 미소 강도: 마우스 X(좌→우) + 호흡 보정
  const baseSmile = map(mx, 0, width, 5, 22) + 3*sin(t*80);
  fill(185, 45, 70);
  arc(0, h*0.27, w*0.3, h*0.16, 0, 180, CHORD);
  noFill(); stroke(185, 45, 70, 90); strokeWeight(2);
  arc(0, h*0.27 - 2, w*0.32, h*0.14 + baseSmile*0.2, 15, 165);
  noStroke();
  pop();
}

function drawGlasses(x, y, w, h){
  push();
  translate(x, y);
  const r = w*0.17;
  const yPos = - h*0.03 + 2*sin(t*160); // 가볍게 흔들림
  noFill(); stroke(20, 20, 25, 220); strokeWeight(4);
  ellipse(-w*eyeGap, yPos, r*1.3, r);
  ellipse( w*eyeGap, yPos, r*1.3, r);
  line(-w*eyeGap + r*0.65, yPos, w*eyeGap - r*0.65, yPos);
  // 다리
  line(-w*eyeGap - r*0.65, yPos, -w*eyeGap - r*1.2, yPos - 8);
  line( w*eyeGap + r*0.65, yPos,  w*eyeGap + r*1.2, yPos - 8);
  noStroke();
  pop();
}

function drawBeard(x, y, w, h){
  push();
  translate(x, y);
  fill(hairColor, 220);
  arc(0, h*0.28, w*0.42, h*0.30, 200, 340, CHORD);
  rectMode(CENTER);
  rect(0, h*0.23, w*0.18, h*0.035, 10);
  pop();
}

function drawEarrings(x, y, w, h){
  push();
  translate(x, y);
  fill(250, 210, 60);
  circle(-w*0.5, h*0.05, w*0.06);
  circle( w*0.5, h*0.05, w*0.06);
  pop();
}

function drawHat(x, y, w, h){
  push();
  translate(x, y);
  fill(25, 35, 75);
  // 살짝 위아래로 튀는 느낌
  const bob = -h*0.42 + h*0.01*sin(t*120);
  arc(0, bob, w*1.15, h*0.22, 0, 180, CHORD);
  rectMode(CENTER);
  rect(0, bob - h*0.16, w*0.62, h*0.3, 18);
  pop();
}

// ===== 마우스/키보드 인터랙션 =====
function mousePressed(){
  // 클릭 시 왼쪽 눈만 윙크 (짧게)
  isWink = true;
}
function mouseReleased(){
  isWink = false;
}

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

  // 10초 GIF 녹화 (R): 교재의 saveGif( ) 사용
  if(key==='R'||key==='r'){
    recording = true;
    recordFramesLeft = 10*recordFps;
  }

  // 10초 자동 데모(D): 다양한 인터랙션을 순차 시연 → 바로 GIF 녹화하면 과제 제출 컷 쉽게 제작
  if(key==='D'||key==='d'){
    autoDemo = true;
    demoStartFrame = frameCount;
  }
}