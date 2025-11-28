function setup() {
  createCanvas(600, 400);   // 캔버스 크기 600x400
  rectMode(CENTER);         
  noLoop();                 // 한 번만 그리기
}

function draw() {
  background(245);

  // ===== 타일 배경 =====
  let tile = 100;  // 타일 크기 줄임
  for (let y = tile/2; y < height; y += tile) {
    for (let x = tile/2; x < width; x += tile) {
      // 색상 팔레트
      const palette = [
        color(255, 204, 0),
        color(0, 160, 220),
        color(240, 80, 100),
        color('#2A9D8F')
      ];
      let c = random(palette);

      // 사각형
      noStroke();
      fill(c);
      rect(x, y, tile*0.9, tile*0.9, 10);

      // 원
      stroke(255);
      strokeWeight(3);
      fill(255, 255, 255, 40);
      ellipse(x, y, tile*0.55, tile*0.55);

      // 삼각형 그림자
      noStroke();
      fill(0, 0, 0, 35);
      triangle(
        x - tile*0.45, y + tile*0.45,
        x + tile*0.45, y + tile*0.45,
        x + tile*0.45, y - tile*0.45
      );
    }
  }

  // ===== 전경 요소 =====
  stroke(20);
  strokeWeight(5);
  line(0, height*0.5, width, height*0.5);

  noStroke();
  fill('#222222');
  triangle(80, 320, 200, 220, 260, 360);

  fill('#F25F5C');
  ellipse(480, 120, 120, 120);

  noFill();
  stroke('#2A9D8F');
  strokeWeight(8);
  rect(480, 300, 120, 120, 15);
}

// 키보드 's' 누르면 PNG 저장
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('myArtwork', 'png');  // "myArtwork.png" 파일 저장
  }
}
