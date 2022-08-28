from pynput import keyboard
import asyncio
import random
import string


def id_generator(size=8, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


# array of 8 ids
ids = [id_generator(), id_generator(), id_generator(), id_generator(),
       id_generator(), id_generator(), id_generator(), id_generator()]


async def emulate_nfc_tag(sio):
    # send out random id
    await sio.send(random.choice(ids))
    print("sending out nfc id")


def on_press(key, sio, loop):
    if key == keyboard.Key.shift:
        # Create a coroutine
        coro = emulate_nfc_tag(sio)
        # Submit the coroutine to a given loop
        asyncio.run_coroutine_threadsafe(coro, loop)
    if key == keyboard.Key.esc:
        # Stop listener
        return False


def initialize_keyboard_listener(sio, loop):
    listener = keyboard.Listener(
        on_press=lambda event: on_press(event, sio=sio, loop=loop))
    # listener = keyboard.Listener(on_press=on_press())
    listener.start()
