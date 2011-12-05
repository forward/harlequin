$(document).ready(function(){
  
    Harlequin.stripe("columns","column");
    
    Harlequin.stripe("rows","row");
    
    Harlequin.stripe("both","both");
    
    Harlequin.stripe("reverse","both");
    
    Harlequin.stripe("custom","column",{
      color_class: "harlequin",
      start_hue: 120,
      end_hue: 240,
      sat: 80,
      lightness: 60
    });
    
    
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
    
    Harlequin.stripe("colspan","column");
    
    Harlequin.bar("bar","both");
    

    
});