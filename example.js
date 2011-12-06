$(document).ready(function(){
  
    // 1) Just paint by columns
    Harlequin.stripe("columns","column");
    
    // 2) Paint by row
    Harlequin.stripe("rows","row");
    
    // 3) use the whole grid to determine value
    Harlequin.stripe("both","both");
    
    // 4) Same as above but with 'data-sort' set to high-to-low on the table
    Harlequin.stripe("reverse","both");
    
    // 5) Customise the table with options
    Harlequin.stripe("custom","column",{
      color_class: "harlequin",
      start_hue: 120,
      end_hue: 240,
      sat: 80,
      lightness: 60
    });
    
    // 6) Custom colours
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
    
    // 7) Lets try combining colspans and columns
    Harlequin.stripe("colspan","column");
    
    // 8) Bar painter style!
    Harlequin.bar("bar","both");
    
    // 9) Lets write a custom painter
    Harlequin.register("mypainter",function(cell,min,max,sort,color,options){
      /*
        Params:
        
        cell : {
          el : this table cell, as a jQuery object,
          orig : original text value of the cell,
          value: parsed value of the cell,
        },
        min : smallest value in the range,
        max : largets value in the range,
        sort : sort order ("high-to-low" or "low-to-high"),
        color : the color calculated by the internal function,
        options: the options object as specified by the user earlier if at all
      */
      var size = Math.floor(((cell.value-min)/(max-min)) * 14) + 12;
      var grey = 200 - Math.floor(((cell.value-min)/(max-min)) * 200);
      cell.el.css("font-size",size+"px")
             .css("color","rgb("+grey+","+grey+","+grey+")")
             .css("border-bottom","1px solid "+color);
      
    });
    
    Harlequin.paint("mypainter","custompainter","row");
    
    // 10) Now lets show you how to do multiple painters at once
    Harlequin.paint(["stripe","mypainter"],"multiplepainters","row");
    
    // additional stuff to make toggling seem for fun
    $("section .code").click(function(){
      $(this).parents("section").find("pre").toggle();
      $(this).toggleClass("showing");
    });
    
});