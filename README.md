# porchlogic.com
website

## TODO:

How can I make an open-source software that is built to connect to a certain type of private key-signed nodes, and I provide my node for optional connection (where I will broadcast my )

should I sell as kits, or as a closed product?

How can I make the simplest crypto system that can be built into my esp32 boards, where, if you own one, you can sign events that others broadcast (and vica versa), onto a blockchain that is auditable publicly?

### Build SMB1 page

We are building a simple Javascript web page that allows you to interactively build flexbox layouts.

Let's start by making a blank page 


Generate a simple, clean, minimal web page that is an interactive flexbox layout builder. Only use html/css/vanilla javascript. It starts with a blank page, and when you hover over the page, a "+" button appears, which adds a new child flexbox. Each flexbox always has this button to add a new child flexbox. When a flexbox is selected, a panel on the right allows you to select the various settings of flexbox, and the interactive display updates accordingly.


This is great! Ok, now for some changes/additions.

We need more settings/properties (should we just call them properties moving forward?) to edit for the flexboxes that will allow us to fine tune the layout. We need every css property available that is involved in layouts, like width, height, margin, padding, etc. (there will of course need to be value fields for properties like width). We also need a basic way to put content in the boxes, like a background color, and text (h1,h2,p,etc.). I think that should cover it for now and allow us to use this tool to make full layouts. Oh, and if the way you programed this allows it to easily have a html and css "output" box under the properties panel, where you can copy the code of what we build, that would be perfect.





In general, can you make it so that, instead of adding inline styling to the elements, we instead give each flexbox a id, which gets added to the <style> in the head? So, when we add a flexbox, I think its id style should have no properties, and then we fill it out as properties are edited in the UI (so the dropdowns should have a blank option that it defaults to).

I guess, in general, I'm just thinking about how this can be made so that the actual html and css of the editor area IS the html and css that we output (minus any UI).

Aside from that overall change, here a couple other things I noticed (which maybe will be fixed by implementing the architectural change above)

- It seems that the flex directions are reversed of what they normally are?
- Also, when I add just one child flexbox to a parent, and give the child a width of 100%, it seems to make it actually 50% of the parent's width.
- the properties panel should have a min-width of 350px
- we need more properties, like aspect-ratio, overflow, align-content, flex item properties. In other words, please make a list of all the css properties having to do with layout and add them. It would also be great if the UI could be a bit more organized, like separated into appropriate sections

Ok, I know that's a lot. We can break this into multiple stages if you need to.


I'm wondering if we can change it so that each added flexbox gets a c

Ok, let's talk for a bit without changing any code.

I'm wondering if it's possible to, instead of applying the css property changes to the element's inline style, we give each new box its own id or class, so that it has dedicated css?...Is it not possible with javascript to edit the <style> part of the html?

## SMB1 Product page description

- plugs into any device that is a usb midi device or host


# /smb1/quick-ref


## development

for generating the css from the scss
`npx tailwindcss -i ./styles.scss -o ./styles.css --watch`


# Site generation

Generate a concept for a single-page website for "Porch Logic"

The color palette is neon gray,green,blue,white,yellow (with some hot pink sometimes)

The theme/vibe is cyberpunk, electronic, clean

The top hero section should be a "poster" that is like a band poster advertising a show.

Then there are some socials buttons for discord, youtube, and "shop" (which just scrolls down to the shop section)

Then there is a short text blurb describing what porchlogic is doing.

Then there is the product section, which introduces and details the "SMB1", which is a credit-card sized esp32 device that connects to phones, tablets, and audio equipment, and syncs them all wirelessly. (so, a group of people each have a SMB1, connect it to their instrument, then play synchronized music together as they ride their personal electric vehicles around the city)

The product section should be sleek and appealing to the audio/tech geek crowd. It should include typical product descriptions, features, etc. And a choice between two different versions to buy.

Then there should be a section that gives a brief tutorial on how to use the device.

Then a section that shows a standard music song format that the group can program into their gear, so that the mobile performance is cohesive.