# Harlequin.js (beta) 

[demo here](http://redroot.github.com/harlequin/)

Harlequin is a utility for applying color highlighting to HTML data tables, useful for showing the distribution of data. You can do this by column, by row, or across the whole table. Examples are available on the index.html page.

Version: 0.2

Tested in FF, Chrome and Safari (latest) so far

## Prerequisites

* jQuery 1.3+ (This is only temporary, I will be decoupling this soon)
* Appropriate markup. Column headers must be `th` elements in a `thead`, the data to stripe must in `td` elements inside a `tbody`. 

## Basic Usage

The basic usage for Harlequin is:

    Harlequin.stripe("table_id","direction")
    
The first parameter being the id of the table you wish to stripe, the second being the direction you wish to stripe:

* __column__: This will colour cells according to the data in each column.
* __row__: This will colour cells according to the data in each row.
* __both__: This will colour cells according to the data across the table
  
Harlequin will only stripe segments with the configurable class `color` on a specific element depending on the direction.

For __column__, this class must be applied to the `th` element at the top of each column:

        <thead>
          <tr>
            <th class="color">Cost</th>
            <th class="color">Profic</th>
            <th>Label</th>
            ...
          </tr>
        </thead>
        
For __row__, this class must be on the `tr` element:

        <tbody>
          <tr class="color">...</tr>
          <tr class="color">...</tr>
          ...
        </tbody>

For __both__, this setting isn't necessary

## Configuration

Harlequin provides a number of methods to configure how the data is coloured.

### Sorting

Harlequin will colour between two hues, which are set to red (0 as the start hue) and green (120 as the end hue) by default, and will colour with lower values being red and higher values being green, or __low-to-high__ (start to end). For any direction to can reverse this order with the data attribute __data-sort__ set to __high-to-low__, the element requiring this dependent on the direction:

* __column__: The `th` element at the top of each column, e.g. `<th class="color" data-sort="high-to-low">`
* __row__: The `tr` element for each row, e.g. `<tr class="color" data-sort="high-to-low">`
* __both__: The `table` element itself, e.g. `<table id="mytable" data-sort="high-to-low">`

### Options

An options object can can be passed as a third parameter to the `Harlequin.stripe` function call, allowing you to configure the display further.

        Harlequin.stripe("mytable","column"{
          color_class: "color" // the class Harlequin will look for when colouring, default 'color'
          start_hue: 0, // the start hue, 0-360, defaults to 0 (red)
          end_hue: 120, // the end hue, 0-360, defaults to 120 (green)
          sat: 90, // the saturation of the hue, 0-100, defaults to 90
          lightness: 70, // the lightness of the colour, 0-100, defaults to 70
          colors: null // an array of hex colours, start to end, to colour by, defaults to null
        })
        
Most of these are straightforward, but here is an example of specifying an array of colours, in order, start to end:

        Harlequin.stripe("colors","column",{
          colors:  [
            "#f8696b",
            "#f97c6f",
            "#fa8f73",
            "#fba176",
            "#fcb47a",
            "#fec67d",
            "#ffd981",
            "#ffeb84",
            "#e8e482",
            "#d2de81",
            "#bcd780",
            "#a5d17e",
            "#8fca7d",
            "#79c47c",
            "#63be7b"
          ]
        });
        
Keep in mind by setting an arrow of colours you will be ignoring all the HSL configuration and the sort-order will not apply. To reverse the colours, simply reverse the elements in the array.

## To-Do

* Test with col-span element
* Decouple jQuery
* Build a less strict mode, without the need for thead and tbody (more prone to weird results mayhaps :/)

## Changelog

* __0.2__: Added fallback to set hex value is HSL is not supported

## License

Copyright (c) 2011- Luke Williams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.