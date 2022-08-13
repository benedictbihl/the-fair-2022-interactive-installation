from pynput import keyboard
import asyncio
import random
import string


def id_generator(size=3, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


async def emulate_nfc_tag(sio):
    generated_id = id_generator()
    print("sending out nfc id", generated_id)
    await sio.send(generated_id)


def on_press(key, sio, loop):
    if key == keyboard.Key.shift:
        # Create a coroutine
        coro = emulate_nfc_tag(sio)
        # Submit the coroutine to a given loop
        asyncio.run_coroutine_threadsafe(coro, loop)
        # asyncio.run(emulate_nfc_tag())
    if key == keyboard.Key.esc:
        # Stop listener
        return False


def initialize_keyboard_listener(sio, loop):
    listener = keyboard.Listener(
        on_press=lambda event: on_press(event, sio=sio, loop=loop))
    # listener = keyboard.Listener(on_press=on_press())
    listener.start()
