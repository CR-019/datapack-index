---
title: 'Gradient Text Generator'
---

<FeatureHead
    title="Gradient Text Generator"
    authorName="LostPigYoo"
/>


# Introduction
This data pack uses transcoding between decimal and hexadecimal, character slicing, recursive operations, text component output, etc., and uses a high-versiondialogdialog interface to receive text and color information input by the player to achieve the generation of color gradient text.
In the dialog menu, the player needs to enter the text to be added to the gradient, the hexadecimal color code of the first character and the hexadecimal color code of the last character (the color code does not need to contain the "#" character), and select the output presentation mode.
The data pack has 4 built-in basic modes:
* **Send Chat**: Same as the multiplayer game chat message sent in the text box;
* **Title text**: Display text on the screen, the same as '/title ... title ...' command;
* **Send information**: Do not display the sender in the text box to send global information, the same as the '/tellraw ... ...' command;
* **Copy component**: A Json text component that can copy the entire gradient text after running, which can be used by developers in more scenarios (such as editing text to display entities, etc.)
If you need to use it in the game, please enter '/trigger SMTR' to open the dialog menu.