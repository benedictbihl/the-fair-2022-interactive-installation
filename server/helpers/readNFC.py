import RPi.GPIO as GPIO
import asyncio

# local imports
from pn532 import *
from helpers.emulateNFCWithKeyboard import initialize_keyboard_listener


def nfc_setup(sio, loop):
    try:
        pn532 = PN532_UART(debug=False, reset=20)
        if not pn532:
            print(
                "Could not find PN532 board, starting keyboard emulation. press shift to send out nfc id")
            initialize_keyboard_listener(sio, loop)

        ic, ver, rev, support = pn532.get_firmware_version()
        print('Found PN532 with firmware version: {0}.{1}'.format(ver, rev))

        # Configure PN532 to communicate with MiFare cards
        pn532.SAM_configuration()

        print('Waiting for RFID/NFC card...')
        coro = readNFC(sio, pn532)
        # Submit the coroutine to a given loop
        asyncio.run_coroutine_threadsafe(coro, loop)

    except Exception as e:
        print(e)
    finally:
        GPIO.cleanup()


async def readNFC(sio, pn532):
    while True:
        # Check if a card is available to read
        await asyncio.sleep(0.5)
        uid = pn532.read_passive_target(timeout=1)
        print('.', end="")
        # Try again if no card is available.
        if uid is None:
            continue
        print('Found card with UID:', [hex(i) for i in uid])
        await sio.send([hex(i) for i in uid])
