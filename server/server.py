from aiohttp import web
import socketio
import asyncio
from pynput import keyboard
import random
import string


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


async def emulate_nfc_tag():
    generated_id = id_generator()
    print("sending out nfc id", generated_id)
    await sio.send(generated_id)


def on_press(key):
    if key == keyboard.Key.shift:
        # Create a coroutine
        coro = emulate_nfc_tag()
        # Submit the coroutine to a given loop
        asyncio.run_coroutine_threadsafe(coro, loop)
        # asyncio.run(emulate_nfc_tag())
    if key == keyboard.Key.esc:
        # Stop listener
        return False


@sio.event
def connect(sid, environ):
    print("*****CONNECT****** ", sid)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # set up keyboard listener
    listener = keyboard.Listener(on_press=on_press)
    listener.start()
    # set up aiohttp - like run_app, but non-blocking
    runner = web.AppRunner(app)
    loop.run_until_complete(runner.setup())
    site = web.TCPSite(runner)
    loop.run_until_complete(site.start())

    loop.run_forever()