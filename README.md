# 🎮 Memory Recall Game
Created by **Sam Ashenafi**

## 🧠 Project Outline
**Memory Recall** is a two-player Arduino-based reflex and memory game. Each player tries to repeat LED sequences correctly. The game increases in difficulty and uses sound and graphics to enhance feedback.

## 📝 Description
- Players take turns repeating a flashing LED sequence.
- Buttons on the Arduino board are used to input the sequence.
- The game increases in speed and length of the sequence.
- Players have **2 lives**, and the game ends when one player runs out.
- Web-based p5.js graphics and Tone.js sound provide visual/audio feedback.
- Interaction occurs through **Web Serial API**.

## 🖼️ Project Images
![Wiring](https://github.com/user-attachments/assets/36e5f7de-7e82-494c-8f0b-3e99c4a08888)
![Game](https://github.com/user-attachments/assets/371e7e61-66d6-4c44-a4c6-3533cb2c6f90)

## 🎥 Video 
[Game Video](https://youtube.com/shorts/LLTMP6zUqBE))

## 💡 Components
- 4 pushbuttons wired to pins 10–13
- 4 LEDs wired to pins 2–5
- Buzzer wired to pin 6
- USB serial for browser-communication

## 🔊 Audio Design
- Each color has a unique tone matching Arduino output made with tone.js
- Wrong input = metal buzzer
- Correct input = success chime

## 🚀 Future Improvements
- Add a more where you just listen for audio instead of seeing the colors and hearing the audio
- Add difficulty modes or levels
- Replace serial monitor with OLED or LCD

## 👨‍💻 What I Used
- Arduino UNO R#
- p5.js
- Tone.js
- Web Serial API
