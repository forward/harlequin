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
       useHsl = true,
       painter = "stripe",
       painters = {};
  
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
        
        var i = 0,
            col_count = 0;
        
        var query = (direction == "column") ? "thead th" :
                    (direction == "row") ? "tbody tr" : false;
                   
        if(query == false) return;
        
        $(query,table).each(function(){
          if($(this).attr("colspan") != undefined){
            var len = parseInt($(this).attr("colspan"));
            if($(this).hasClass(config.color_class)){
              for(var j = 0; j < len; j++){
                segments.push({
                      index: i+j,
                      sort: $(this).data("sort") || "low-to-high"
                });
              }
            }else{
              i += len;
            }
          }else{
            if($(this).hasClass(config.color_class)){
              segments.push({
                    index: i,
                    sort: $(this).data("sort") || "low-to-high"
              });
            }
          }
    
          i++;
           
        });
      }
    }
    
    // lets stripe some cells
    
    paintCells = function(direction){
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
                orig: element.text(),
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
              paintCell(cells[j],seg_min,seg_max,seg.sort);
          }
      }
    }
    
    paintCell = function(cell,min,max,sort){
      color = getColor(cell.value,min,max,sort);
      
      if(typeof painter == "object"){
        for(var i = 0, len = painter.length; i < len; i++){
          painters[painter[i]](cell,min,max,sort,color,config);
        }
      }else{
        painters[painter](cell,min,max,sort,color,config);
      }
    }
    
    // register function
    
    registerPainter = function(name,fn){
      if(typeof fn != "function") return;
      painters[name] = fn;
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
    
    
    // init functions
    
    reset = function(){
      segments = [];
      config = {};
    }  
    
    paint = function(npaint,table_id,direction,options){
        reset();
        
        table = $("#"+table_id);
        painter = npaint || "stripe"
        
        if(options != undefined){
          for(k in defaults){
            config[k] = (options[k] != undefined) ? options[k] : defaults[k];
          }
        }else{
          config = defaults;
        }
        
        populateCells(direction);
        paintCells(direction);
    }
    
    
    // boostrap a bit and then lets register some painter objects
    
    useHsl = testHsl();
    
    registerPainter("stripe",function(cell,min,max,sort,color){
      cell.el.css("background-color",color);
    });
    
    registerPainter("bar",function(cell,min,max,sort){
      
      var bar = document.createElement("span"),
          content = document.createElement("span");
      
      bar.innerHTML = cell.orig;
      bar.style.background = color;
      bar.style.width = Math.floor(((cell.value-min)/(max-min)) * 100) + "%"
      bar.style.display = "block";
      bar.style.top = bar.style.bottom = bar.style.left =  0;
      bar.style.position = "absolute";
      bar.style.zIndex = 0;
      bar.style.display = "block";
      bar.style.textAlign = "center";
      

      content.style.zIndex = 1;
      content.style.display = "inline-block";
      content.style.lineHeight = cell.el.height();
      
      
      cell.el[0].style.position = "relative";
      cell.el[0].style.display = "block;"
      cell.el[0].innerHTML = ""
      cell.el[0].appendChild(bar);
      cell.el[0].appendChild(content);
      
    });
    
    registerPainter("dot",function(cell,min,max,sort){
      
      var dot = document.createElement("span"),
          content = document.createElement("span");
      
      max_radius = Math.floor(cell.el.height() * 4),
      radius = Math.floor(((cell.value-min)/(max-min)) * max_radius) + 3;
      
          
      dot.innerHTML = cell.orig;
      dot.style.background = color;
      dot.style.display = "inline-block";
      dot.style.textAlign = "center";
      dot.style.width = dot.style.height = (radius) + "px";
      dot.style.borderRadius = dot.style.MozBorderRadius = dot.style.WebkitBorderRadius = "999px";
      dot.style.position = "absolute";
      dot.style.zIndex = 0;
      
      // calcute absolute positioning based on size of height and radius
      
      content.style.zIndex = 1;
      content.style.display = "inline-block";
      content.style.lineHeight = cell.el.height();
      

      cell.el[0].style.position = "relative";
      cell.el[0].innerHTML = ""
      cell.el[0].appendChild(dot);
      cell.el[0].appendChild(content);
    });
    
    // return object
    
    return {
      
        paint: paint,
        register: registerPainter,
      
        stripe: function(table_id,direction,options){
            paint("stripe",table_id,direction,options);
        },
        
        bar: function(table_id,direction,options){
            paint("bar",table_id,direction,options);
        }

    }
    
})();


