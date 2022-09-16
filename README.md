## What ?
This repository contains the code for an interactive installation displayed at Accenture Song Designs Fair(tm) 2022. 
Participants were able to interact with a bust by putting their badges (which contained a NFC sticker) into it's mouth. There, a Raspberry Pi equipped with a NFC reader would trigger a change in the animation displayed on a large beamer. IT WAS AWESOME 🔥🔥🔥

## How?
### Hardware (not needed to check it out)
Microcontroller: https://www.raspberrypi.com/products/raspberry-pi-4-model-b/

NFC Reader: https://www.waveshare.com/pn532-nfc-hat.htm

### Backend
The `server` folder contains the backend code, written in python. Here we do 3 things:

 - Establish the connection to the NFC HAT
 - Serve the content within `client/dist`
 - Use socket-io to inform the frontend whenever an NFC tag has been detected, by sending over that tags UID.

### Frontend
Found in the `client` folder.

Based on React & Typescript. Bundled with Vite. Made cool with P5.js

##  How to run
1. In the `client` folder run `npm i`, then `npm run build`
2. In the `server` folder, install the packages needed with `pip3 install -r requirements.txt` (ideally within a venv)
3. In the `server` folder run `python3 server.py` and navigate to $YOUR_LOCAL_IP:8080
4. Since you are probably running this on a mac/windows machine, keyboard simulation will be activated since the NFC HAT is not available. Press `shift` to send out an ID from the backend and marvel at the changes you see in the frontend. 
5. Alternatively, press `D` to open the debug menu and play with the modifiers. Press `c` to clear local storage and reset everything.
