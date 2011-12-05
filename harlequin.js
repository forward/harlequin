/**
 *    Harlequin.js
 *    Highlighting for data tables
 *
 *    @author       Forward (http://forwardtechnology.co.uk)
 *    @contributors Luke Williams (http://www.red-root.com)
 *    @version      0.2
*/

Harlequin = (function(){
    
   var table = null,
       segments = [],
       useHsl = true;
  
   // config options
       
   var config = {},
       defaults = {
        color_class: "color",
        start_hue: 0,
        end_hue: 120,
        sat: 90,
        lightness: 70,
        colors: null,
      }
      
    // fix for webkit bug on nth-child and descendents
    // until we don't need jQuery anymore or a find a better fix
    $.expr[":"].harlequin = function() {
        return true;
    };

    
    // lets find some cells
    
    populateCells = function(direction){
      
      if(direction == "both"){
        segments.push({
          index: -1,
          sort: table.data("sort") || "low-to-high"
        });
      }else{
        
        var i = 0;
        
        var query = (direction == "column") ? "thead th" :
                    (direction == "row") ? "tbody tr" : false;
                   
        if(query == false) return;
        
          $(query,table).each(function(){
            if($(this).hasClass(config.color_class)){
                  segments.push({
                      index: i,
                      sort: $(this).data("sort") || "low-to-high"
                  });
            }
             i++;
             
          });
      }
    }
    
    // lets stripe some cells
    
    stripeCells = function(direction){
      for(i = 0, len = segments.length; i < len; i++){
          
          var seg = segments[i],
              seg_index = seg.index
              seg_max = null,
              seg_min = null,
              cells = [];
              
          var query = (direction == "column") ? "tbody tr td:nth-child("+(seg_index+1)+")" : 
                      (direction == "row") ? "tbody tr:nth-child("+(seg_index+1)+") td:harlequin" :
                      (direction == "both") ? "tbody td" : false;
          
          if(query == false) return;
        
          
          $(query,table).each(function(){
            
            var element = $(this);
            var new_cell = {
                value: parseFloat(element.text().replace(",","")),
                el: element    
            }
                
            if(new_cell.value.length < 1){
                return true;   
            }
                    
            if(seg_min == null){
               seg_min = new_cell.value   
            }else if(new_cell.value < seg_min){
               seg_min = new_cell.value          
            }
                
            if(seg_max == null){
               seg_max = new_cell.value   
            }else if(new_cell.value > seg_max){
               seg_max = new_cell.value          
            }
          
            
            cells.push(new_cell);
          });
          
          
          for(j = 0, jlen = cells.length; j < jlen; j++){
               cells[j].el.css("background-color",getColor(cells[j].value,seg_min,seg_max,seg.sort));
          }
      }
    }
    
    // color functions
        
    getColor = function(value,min,max,sort){
        var color;
        if(config.colors != null && typeof config.colors == "object"){
          
          var len = config.colors.length,
              index = Math.floor(((value-min)/(max-min)) * len) - 1;
              
          if(index == -1) index = 0;
                        
          color = config.colors[index];

        }else{
      
          var range = config.end_hue - config.start_hue;
          if(sort == "high-to-low"){
              var hue = Math.ceil(config.end_hue - (((value - min)/(max-min)) * range));
          }else{
              var hue = Math.ceil(config.start_hue + (((value - min)/(max-min)) * range));
          }
          
          if(min == max) hue = Math.ceil(range/2);
        
          color = "hsl("+hue+","+config.sat+"%,"+config.lightness+"%)";
        
          if(!useHsl){
            color = hsl2hex(hue,config.sat,config.lightness);
          }
        
        
        }
        
        
        return color;
    }  
    
    testHsl = function(){
      var el = document.createElement("harlequin");
      el.style.cssText = "background-color:hsla(120,40%,100%,.5)";
      return !!~('' + el.style.backgroundColor).indexOf("rgba") || !!~('' + el.style.backgroundColor).indexOf("hsla");
    }
    
    useHsl = testHsl();

    
    hsl2hex = function(h,s,l){
        h = (h % 360) / 360;
        s = s/100;
        l = l/100;

        if(s == 0){
             l = Math.round(l * 255)
             return { r: l, g: l, b: l  };  
        }

        var m2 = l >= 0.5 ? ((l+s)-(l*s)) : l*(1+s);
        var m1 = (2 * l) - m2;

        return '#'+ ( Math.round(hue(h - 1/3) * 255) | Math.round(hue(h) * 255) << 8 | Math.round(hue(h + 1/3) * 255) << 16 ).toString(16)

        function hue(h) {
                h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
                if      (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
                else if (h * 2 < 1) return m2;
                else if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
                else                return m1;
        }
    }
    
    
    // init function   
    
    start = function(table_id,direction,options){
        table = $("#"+table_id);
        segments = [];
        config = {}
        
        if(options != undefined){
          for(k in defaults){
            config[k] = (options[k] != undefined) ? options[k] : defaults[k];
          }
        }else{
          config = defaults;
        }
        
        populateCells(direction);
        stripeCells(direction);
    }
    
    return {
        stripe: function(table_id,direction,options){
            start(table_id,direction,options);
        }  
    }
    
})();


