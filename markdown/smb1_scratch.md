


### Features

- Custom 3d printed SMB1 case
- esp-32-s3
- USB C port for MIDI devices/hosts
- USB C port for power sharing
- jumpers for later hacking


### Join a swarm:
- select `RX` (receive mode)
- if there is another SMB1 close by emitting a blue pulse, you can:
- 
-  join its swarm by scanning a qr code if they have it displayed
-  or
-  take your chances and join the first public transmission the board hears

#### connect your instrument:
- 📱 phone / tablet
- 🎛 synth/sampler (as USB MIDI *device*)
- 💻 PC,synth/sampler (as USB MIDI *host*)

#### 🔉 connect your speaker 
- (preferably a aux-input or low-latency bluetooth connection)

### Lead a swarm:
- select `TX` (transmit mode)
- select either:
-  `RX` (receive)
-  outputs MIDI clock, transport, and notes via the swarm 
-  or
-  `TX` (transmit) mode
-  generates MIDI clock, transport, and notes via the swarm
-  
- connect to the swarm


One unit becomes the **transmitter (`TX`)**, pulsing out tempo, position, and start/stop commands via MIDI clock.  
All other units become **receivers (`RX`)**, syncing wirelessly in real-time.

Before the ride, participants agree on a shared structure. Simple. Modular. Syncable.

| Section | Length | Notes |
|--------|--------|-------|
| Intro  | 8 bars | Fade in, ambient pads |
| Drop   | 16 bars | Kick in, sync bass |
| Bridge | 8 bars | Modulate |
| Loop   | 32 bars | Repeat & evolve |

Everyone brings their own gear: synths, smartphones, samplers, speakers—and plugs into the swarm.

---

## Features

### ⚙️ Default Mode
- Runs as USB **host** *or* USB **device**  
- Powered by:
	- Right USB port (connected device)  
	- Left USB port (battery or hub)

### 🔌 Powered Host Mode
- Everything in Default, **plus**:  
- Shares power from left USB port → connected gear  
> _(You can solder the jumper on the back of a Default SMB1 to enable this, but we can’t fully support modified units. Hack responsibly.)_

---

# Coming up

This summer, porchLogic will be cruising the PDX grid on electric wheels, syncing sound-nodes as a swarm. SMB1 is the signal.

Join the band: (discord link?)

Create your own swarm: (purchase link)

## How It Works

One SMB1 is designated as the transmitter `TX`, and the rest as receivers `RX`.
`RX` follows the MIDI clock, song-position, start/stop/continue of the `TX`.
Participants share a simple song structure before the ride, like:

(a table showing a simple song structure that participants can build into their own audio gear)


## Features

### Default
- runs in either USB *host* mode or USB *device* mode
- can be powered from either:
  - connected device on right USB port
  - connected battery/hub on left USB port

### Powered Host
- everything in Default plus:
- can share power from left USB port to connected device
(you are welcome to solder the jumper on the back of a Default SMB1, which makes this possible, but we cannot fully support user-modified boards)
