// memory_game_p5js: lives system, synth pitch match to Arduino buzzer tones, and no timer

let sequence = [];
let difficulty = 3;
let userInput = [];
let turn = 0; // 0: Player 1, 1: Player 2
let gameState = "welcome";
let awaitingInput = false;
let feedbackText = "";
let leds = ["green", "yellow", "blue", "red"]; // Updated to match left-to-right order
let ledBlinkStates = [false, false, false, false];

let synths = [];
let correctChime, wrongBuzzer;
let port, reader, writer;

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.lives = 2;
  }
}

let players = [new Player("Player 1"), new Player("Player 2")];

function setup() {
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textSize(24);
  noStroke();
}

function draw() {
  background("#111");
  fill("#e0e0ff");
  textFont("Courier New");
  textSize(28);

  if (gameState === "welcome") {
    text("Memory Match\nPress SPACE to Start", width / 2, height / 2);
    return;
  }

  if (gameState === "ready") {
    text(players[turn].name + " - Get Ready...", width / 2, 40);
  } else if (gameState === "play") {
    text(players[turn].name + "'s Turn", width / 2, 40);
    text("Score: P1 " + players[0].score + " | P2 " + players[1].score, width / 2, height - 30);
    text("Lives: P1 " + players[0].lives + " | P2 " + players[1].lives, width / 2, 70);
    if (feedbackText) {
      textSize(22);
      text(feedbackText, width / 2, height / 2 + 100);
    }
  } else if (gameState === "gameover") {
    let winner = players[0].lives > 0 ? "Player 1 Wins!" : "Player 2 Wins!";
    text("Game Over\n" + winner + "\nPress SPACE to try again", width / 2, height / 2);
    return;
  }

  drawLEDs();
}

function drawLEDs() {
  let colors = ["green", "yellow", "blue", "red"];
  for (let i = 0; i < 4; i++) {
    fill(ledBlinkStates[i] ? 255 : colors[i]);
    ellipse(320 + i * 320, height / 2, 100);
  }
}

function keyPressed() {
  if (key === ' ') {
    if (Tone.context.state !== 'running') {
      Tone.start().then(() => {
        setupAudio();
        initiateStart();
      });
    } else {
      if (synths.length === 0) setupAudio();
      initiateStart();
    }
  }
}

function setupAudio() {
  let freqs = [262, 330, 392, 523]; // C4, E4, G4, C5 (green to red)
  synths = freqs.map(f => {
    let s = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.01, release: 0.2 }
    }).toDestination();
    s.frequency.value = f;
    return s;
  });
  correctChime = new Tone.MembraneSynth().toDestination();
  wrongBuzzer = new Tone.MetalSynth().toDestination();
}

function initiateStart() {
  gameState = "ready";
  feedbackText = "";
  setTimeout(() => {
    generateSequence();
    playSequence();
  }, 2000);
}

function generateSequence() {
  sequence = [];
  for (let i = 0; i < difficulty; i++) {
    let r;
    do {
      r = floor(random(0, 4));
    } while (turn === 1 && r === sequence[i - 1]);
    sequence.push(r);
  }
  userInput = [];
}

async function playSequence() {
  gameState = "ready";
  for (let i = 0; i < sequence.length; i++) {
    let idx = sequence[i];
    await blinkLED(idx);
    await sleep(300);
  }
  gameState = "play";
  awaitingInput = true;
}

async function blinkLED(index) {
  ledBlinkStates[index] = true;
  synths[index].triggerAttackRelease("C4", "8n");
  if (writer) writer.write(new TextEncoder().encode("LED:" + index + "\n"));
  redraw();
  await sleep(300);
  ledBlinkStates[index] = false;
  redraw();
}

function handleSerialInput(input) {
  let idx = parseInt(input);
  if (!awaitingInput || isNaN(idx)) return;

  feedbackText = leds[idx];
  userInput.push(idx);
  blinkLED(idx);

  if (idx !== sequence[userInput.length - 1]) {
    awaitingInput = false;
    feedbackText = "Wrong!";
    wrongBuzzer.triggerAttackRelease("C2", "16n");
    players[turn].lives--;

    if (players[turn].lives <= 0) {
      gameState = "gameover";
      return;
    }

    setTimeout(() => {
      turn = (turn + 1) % 2;
      initiateStart();
    }, 1500);
    return;
  }

  if (userInput.length === sequence.length) {
    awaitingInput = false;
    feedbackText = "Correct!";
    correctChime.triggerAttackRelease("C4", "8n");
    players[turn].score++;
    difficulty++;
    setTimeout(() => {
      turn = (turn + 1) % 2;
      initiateStart();
    }, 1500);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectSerial() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });
  writer = port.writable.getWriter();
  const decoder = new TextDecoderStream();
  port.readable.pipeTo(decoder.writable);
  reader = decoder.readable.getReader();
  readSerial();
}

async function readSerial() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) handleSerialInput(value.trim());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("button");
  btn.textContent = "Connect to Arduino";
  btn.onclick = connectSerial;
  document.body.appendChild(btn);
});
