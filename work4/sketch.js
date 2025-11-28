let tile = 100;
let basePalette = [];

function setup() {
  createCanvas(600, 400);   
  rectMode(CENTER);

  // HSB 모드로 전환 
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(30);            
  noCursor();               

  // 기존 팔레트를 HSB 기반으로 재구성 
  basePalette = [
    color(50, 95, 100),    // 노랑 계열
    color(200, 90, 90),    // 파랑 계열
    color(350, 80, 95),    // 핑크/레드 계열
    color(170, 65, 70)     // 청록 계열
  ];
}

function draw() {
  // ===== 배경 색상 서서히 변화  =====
  let t = millis() * 0.0002;          
  let bgHue = (t * 60) % 360;         
  background(bgHue, 10, 95);          

  // ===== 타일 배경  =====
  for (let y = tile / 2; y < height; y += tile) {
    for (let x = tile / 2; x < width; x += tile) {

      // 각 타일별 시간 오프셋 
      let timeOffset = frameCount * 0.03 + (x + y) * 0.01;
      let wave = sin(timeOffset);      // -1 ~ 1

      // 색상 팔레트에서 두 색을 골라 lerpColor
      let idxA = int((x / tile + y / tile) % basePalette.length);
      let idxB = (idxA + 1) % basePalette.length;
      let cA = basePalette[idxA];
      let cB = basePalette[idxB];
      let lerpAmt = (wave + 1) / 2;    // 0~1

      let tileColor = lerpColor(cA, cB, lerpAmt);

      // 사각형 크기도  변화
      let baseSize = tile * 0.9;
      let sizePulse = baseSize * (0.85 + 0.15 * cos(timeOffset * 1.3));

      // 사각형
      noStroke();
      fill(tileColor);
      let offsetX = sin(timeOffset * 0.7) * 4;
      let offsetY = cos(timeOffset * 0.5) * 4;
      rect(x + offsetX, y + offsetY, sizePulse, sizePulse, 10);

      // 원 
      let circleBase = tile * 0.55;
      let circleSize = circleBase * (0.8 + 0.2 * sin(timeOffset * 1.7));
      stroke(0, 0, 100, 90);          
      strokeWeight(3);
      fill(0, 0, 100, 15 + 20 * lerpAmt);
      ellipse(x + offsetX, y + offsetY, circleSize, circleSize);

      // 삼각형 그림자 
      noStroke();
      fill(0, 0, 0, 20 + 15 * lerpAmt);   // 타일마다 살짝 다른 진하기
      let shadowSize = tile * (0.9 + 0.1 * wave);
      triangle(
        x - shadowSize * 0.45 + offsetX,
        y + shadowSize * 0.45 + offsetY,
        x + shadowSize * 0.45 + offsetX,
        y + shadowSize * 0.45 + offsetY,
        x + shadowSize * 0.45 + offsetX,
        y - shadowSize * 0.45 + offsetY
      );
    }
  }

  // 1) 중앙 라인: 위아래로 흔들리는 파형
  stroke(220, 10, 20, 90); // 어두운 톤
  strokeWeight(5);

  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let wave = sin(frameCount * 0.05 + x * 0.03);
    let y = height * 0.5 + wave * 10;  // 중앙 기준으로 10픽셀 진폭
    vertex(x, y);
  }
  endShape();

  // 2) 왼쪽 삼각형: 위아래 움직이며, 색 변함
  let triOffsetY = sin(frameCount * 0.04) * 20;
  let triHue = (200 + sin(frameCount * 0.03) * 40 + 360) % 360;

  noStroke();
  fill(triHue, 40, 20 + 40 * ((sin(frameCount * 0.03) + 1) / 2)); // 짙은 회색~색감

  triangle(
    80, 320 + triOffsetY,
    200, 220 + triOffsetY,
    260, 360 + triOffsetY
  );

  // 3) 오른쪽 원: 타원 궤도로 돌면서 크기 변화
  let angle = frameCount * 0.03;
  let cx = 480 + cos(angle) * 30;
  let cy = 120 + sin(angle * 1.3) * 20;

  let radiusBase = 120;
  let radiusAnim = radiusBase * (0.8 + 0.2 * sin(angle * 2));

  // 색상도 HSB에서 천천히 회전
  let circleHue = (20 + frameCount * 0.5) % 360;
  fill(circleHue, 80, 95);
  noStroke();
  ellipse(cx, cy, radiusAnim, radiusAnim);

  // 4) 오른쪽 사각형: 크기 변동, 테두리 색 그라데이션
  let rectPulse = 120 * (0.9 + 0.15 * sin(frameCount * 0.06));

  let borderC1 = color(160, 70, 80);
  let borderC2 = color(190, 30, 100);
  let borderAmt = (sin(frameCount * 0.04) + 1) / 2;
  let borderColor = lerpColor(borderC1, borderC2, borderAmt);

  noFill();
  stroke(borderColor);
  strokeWeight(8);
  rect(480, 300, rectPulse, rectPulse, 15);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('myArtwork', 'png');  
  }

  if (key === 'g' || key === 'G') {
    saveGif('myArtwork_anim', 10);
  }
}