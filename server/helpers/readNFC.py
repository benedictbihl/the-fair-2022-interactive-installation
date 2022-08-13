from helpers.emulateNFCWithKeyboard import initialize_keyboard_listener
import asyncio
import platform


def is_raspberry_pi() -> bool:
    return platform.machine() in ('armv7l', 'armv6l')


if is_raspberry_pi():
    import RPi.GPIO as GPIO
    from pn532 import *


def nfc_setup(sio, loop):
    try:
        if not is_raspberry_pi():
            print(
                "Could not find PN532 board, starting keyboard emulation. press shift to send out nfc id")
            initialize_keyboard_listener(sio, loop)

        pn532 = PN532_UART(debug=False, reset=20)

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
        if is_raspberry_pi():
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
