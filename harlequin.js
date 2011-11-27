Harlequin = (function(){
    
   var table = null,
       segments = [],
       useHsl = null;
  
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
                      (direction == "row") ? "tbody tr:nth-child("+(seg_index+1)+") td" :
                      (direction == "both") ? "tbody td" : false;
          
          if(query == false) return;
          
          $(query,table).each(function(){
            
            var element = $(this);
            var new_cell = {
                value: parseFloat(element.text()),
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
          
          if(table.attr("id") == "rows"){
            //console.log(query);
            //console.log($(query,table));
          }
          
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
        
          color = "hsl("+hue+","+config.sat+"%,"+config.lightness+"%)";
        
          if(!useHsl){
            // convert to RGB
          }
        
        
        }
        // console.log(color);
        return color;
    }  
    
    testHsl = function(){
      var el = document.createElement("harlequin");
      el.style.cssText = "background-color:hsla(120,40%,100%,.5)";
      useHsl = !!~('' + el.style.backgroundColor).indexOf("rgba") || !!~('' + el.style.backgroundColor).indexOf("hsla");
    }
    
    
    // init function   
    
    start = function(table_id,direction,options){
        table = $("#"+table_id);
        segments = [];
        config = {}
        testHsl();
        
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


