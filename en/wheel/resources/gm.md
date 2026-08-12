---
name: gm
author:
    -
        name: gibbsly
        char: author
description: Floating point and trigonometric function math library
tags: [floating point numbers, trigonometric functions, mathematics]
version: 1.0.0
gameversion: [1.21~1.21.11]
aside: left
wheel: true
repo: gibbsly/gm
---

::: tip Translation notice
This page was translated with machine translation and may contain inaccuracies. If you can help improve it, please open an issue or submit a pull request.
:::

<InfoCard />

gm is a simple mathematics library that can perform calculations with floating point numbers and trigonometric functions.

## single input function

These functions require`{x:(number)}`as macro input. The output will be written to storage`gm:io` `out`, and will also be returned as an int.

### `gm:negate`

> Take a negative number.`x * -1`

### `gm:reciprocal`

> Take the reciprocal.`1 / x`

### `gm:square`

> Take the square.`x^2`

### `gm:sqrt`

> Take the prescription.`√x`

### `gm:sin`

> Take sine.`sin(x)`

### `gm:cos`

> Take the cosine.`cos(x)`

### `gm:tan`

> Take the tangent.`tan(x)`

At the same time, write the result of sin`storage gm._temp_:std var1`, the result of cos is written`storage gm._temp_:std var2`。

### `gm:arcsin`

> Take the inverse sine.`sin⁻¹(x)`

`-90 ≤ sin⁻¹(x) ≤ 90`, `-1 ≤ x ≤ 1`

### `gm:arccos`

> Take the inverse cosine.`cos⁻¹(x)`

`0 ≤ cos⁻¹(x) ≤ 180`, `-1 ≤ x ≤ 1`

### `gm:arctan`

> Take the inverse tangent.`tan⁻¹(x)`

`-90 ≤ tan⁻¹(x) ≤ 90`

### `gm:round`

> Round`round(x)`

Round to the nearest whole number.`0.5`Will be rounded up.

### `gm:floor`

> Round down.`floor(x)`

### `gm:ceil`

> Round up.`ceil(x)`

## double input function

These functions require two variables`{x:(number),y:(number)}`as macro input. The output will be written to storage`gm:io` `out`, and will also be returned as an int.

### `gm:add`

> Add up.`x + y`

### `gm:subtract`

> Subtract.`x - y`

### `gm:multiply`

> Multiply.`x * y`

### `gm:divide`

> Divide.

#### This function has two functions

like`x`is a numerical value

> beg`x / y`

like`x`for array

> beg`[0] / y, [1] / y, [2] / y`

Only the first three values ​​of x are used. The result will be stored as an array of output values. function will return the length of the array.

### `gm:modulo`

> Ask for surplus.`x % y`

y cannot be 0

### `gm:distance`

> Get`x`and`y`distance

x and y should be arrays rather than individual values. Any input that does not meet the criteria will cause the output to be 0.

### `gm:arctan2`

> `atan2(y, x)`

and`tan⁻¹(y/x)`Similar, but`-180 ≤ atan2(y, x) ≤ 180`. This function has an output range of 360° instead of 180°.
