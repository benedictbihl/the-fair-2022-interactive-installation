import asyncio
import socketio
from aiohttp import web

from helpers.readNFC import nfc_setup


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


@sio.event
def connect(sid, environ):
    print("CONNECTED TO CLIENT ", sid)


@sio.event
def disconnect(sid):
    print('DISCONNECTED FROM CLIENT ', sid)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # set up aiohttp - like run_app, but non-blocking
    runner = web.AppRunner(app)
    loop.run_until_complete(runner.setup())
    site = web.TCPSite(runner)
    loop.run_until_complete(site.start())
    # set up nfc board (or keyboard emulation if no board is found)
    nfc_setup(sio, loop)

    loop.run_forever()
