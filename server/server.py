import RPi.GPIO as GPIO

from aiohttp import web
import socketio
import asyncio
from pynput import keyboard
import random
import string


from pn532 import *


async def index(request):
    """Serve the client-side application."""
    with open('../client/dist/index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

sio = socketio.AsyncServer(
    cors_allowed_origins='*',
    async_mode='aiohttp')
app = web.Application()
sio.attach(app)
app.router.add_static('/assets', '../client/dist/assets')
app.router.add_get('/', index)


def id_generator(size=3, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


# async def emulate_nfc_tag():
#     generated_id = id_generator()
#     print("sending out nfc id", generated_id)
#     await sio.send(generated_id)


# def on_press(key):
#     if key == keyboard.Key.shift:
#         # Create a coroutine
#         coro = emulate_nfc_tag()
#         # Submit the coroutine to a given loop
#         asyncio.run_coroutine_threadsafe(coro, loop)
#         # asyncio.run(emulate_nfc_tag())
#     if key == keyboard.Key.esc:
#         # Stop listener
#         return False


@sio.event
def connect(sid, environ):
    print("*****CONNECT****** ", sid)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


def nfc_setup():
    try:
        pn532 = PN532_UART(debug=False, reset=20)

        ic, ver, rev, support = pn532.get_firmware_version()
        print('Found PN532 with firmware version: {0}.{1}'.format(ver, rev))

        # Configure PN532 to communicate with MiFare cards
        pn532.SAM_configuration()

        print('Waiting for RFID/NFC card...')
        coro = readNFC(pn532)
        # Submit the coroutine to a given loop
        asyncio.run_coroutine_threadsafe(coro, loop)
        # asyncio.ensure_future(readNFC(pn532))

    except Exception as e:
        print(e)
    finally:
        GPIO.cleanup()


async def readNFC(pn532):
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


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # # set up keyboard listener
    # listener = keyboard.Listener(on_press=on_press)
    # listener.start()
    # set up aiohttp - like run_app, but non-blocking
    runner = web.AppRunner(app)
    loop.run_until_complete(runner.setup())
    site = web.TCPSite(runner)
    loop.run_until_complete(site.start())
    nfc_setup()

    loop.run_forever()
