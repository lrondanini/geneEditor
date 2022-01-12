
/* used by ColorPicker below */
class CustomColorPanel {
    constructor(left, top, onChangeCallback) {

        this.onChangeCallback = onChangeCallback;

        let pnl = document.createElement("div");

        pnl.style.position = "absolute";
        pnl.style.zIndex = "99999";
        pnl.style.border = "1px solid #e1e1e1";
        pnl.style.borderRadius = "2px";
        pnl.style.backgroundColor = "#f9f9f9";
        pnl.style.padding = "4px";
        pnl.style.left = left;  
        pnl.style.top = top;
        pnl.setAttribute('tabindex', '3333');


        pnl.addEventListener("blur", function() {
          this.parentNode.removeChild(this);       
        });

        this.canvas = document.createElement("canvas");

        this.width = 200;
        this.height = 140;

        this.canvas.width = this.width;  
        this.canvas.height = this.height;
        this.canvas.style.cursor = "pointer";
        //Get context 
        this.context = this.canvas.getContext("2d");
        //Circle 
        this.pickerCircle = { x: 10, y: 10, width: 7, height: 7 };
        
        this.draw();

        pnl.appendChild(this.canvas);


        this.previewbox = document.createElement("div");
        this.previewbox.style.width = "200px";
        this.previewbox.style.height = "14px";
        this.previewbox.style.backgroundColor = "rgba(0,0,0,0)";

        pnl.appendChild(this.previewbox);

        this.listenForEvents();

        document.body.appendChild(pnl);

        pnl.focus(); //focus after appending!!!

        this.panel = pnl;
    }
  
    draw() {
        this.build();
    }
  
    build() {
        let gradient = this.context.createLinearGradient(0, 0, this.width, 0);

        //Color Stops
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        //Fill it
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);
        
        //Apply black and white 
        gradient = this.context.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);
        
        //Circle 
        this.context.beginPath();
        this.context.arc(this.pickerCircle.x, this.pickerCircle.y, this.pickerCircle.width, 0, Math.PI * 2);
        this.context.strokeStyle = "#ffffff";
        this.context.stroke();
        this.context.closePath();
      
    }
    
    listenForEvents() {
      
        const onMouseMove = (e) => {
            let coord = this.canvas.getBoundingClientRect();
            let currentX = e.clientX - coord.left;
            let currentY = e.clientY - coord.top;
            this.pickerCircle.x = currentX;
            this.pickerCircle.y = currentY;
            this.previewbox.style.backgroundColor = this.getPickedColor();
            this.draw();
        }
        
        
        //Register 
        this.canvas.addEventListener("mousemove", onMouseMove);

        this.canvas.addEventListener("click", () => this.SelectColor());
    }
  
    getPickedColor() {
        let imageData = this.context.getImageData(this.pickerCircle.x, this.pickerCircle.y, 1, 1);
        return "#"+this.fullColorHex(imageData.data[0], imageData.data[1], imageData.data[2]);
    }
    
    SelectColor() {
        try {
          this.panel.parentNode.removeChild(this.panel);       
        } catch(err) {

        }
        
        this.onChangeCallback(this.getPickedColor());
    }

    rgbToHex(rgb) { 
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
           hex = "0" + hex;
        }
        return hex;
    }
    
    fullColorHex(r,g,b) {   
        var red = this.rgbToHex(r);
        var green = this.rgbToHex(g);
        var blue = this.rgbToHex(b);
        return red+green+blue;
    };
  
}



export default class ColorPicker {

    constructor(top, left, callBack, addToLeft=0, addToTop=0, selectedColor=undefined, keepOnAfterSelection=false, preserveFocus=false) {
        this.top = top;
        this.left = left;
        this.callBack = callBack;
        this.preserveFocus = preserveFocus;
        this.keepOnAfterSelection = keepOnAfterSelection;

        this.addToLeft = addToLeft;
        this.addToTop = addToTop;

        this.selectedColor = this._parseSelectedColor(selectedColor);

        this.usedCustomColors = [];
        if(typeof(Storage) !== "undefined") {
            this.usedCustomColors = JSON.parse(localStorage.getItem("usedCustomColors"));
            if(this.usedCustomColors == undefined) {
                this.usedCustomColors = [];
            }
        }

        this._showColorPalette();
    }

    //rgba to hex
    _parseSelectedColor(c) {
        let res = c;
        if(c!=undefined) {
            if(c.toLowerCase().indexOf("rgb")>-1) {
                c = c.toLowerCase();
                let tmp = c.split("(")[1].split(")")[0].split(",");
                let red = this._rgbToHex(tmp[0].split(' ').join(''));
                let green = this._rgbToHex(tmp[1].split(' ').join(''));
                let blue = this._rgbToHex(tmp[2].split(' ').join(''));
                res = "#"+red+green+blue;
            } 
        }        
        return res;
    }

    _rgbToHex(rgb) { 
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
           hex = "0" + hex;
        }
        return hex;
    }
    

    _showColorPalette() {
        let _self = this;
        let pnl = document.createElement("div");

        pnl.style.position = "absolute";
        pnl.style.zIndex = "99999";
        pnl.style.border = "1px solid #e1e1e1";
        pnl.style.borderRadius = "2px";
        pnl.style.backgroundColor = "#f9f9f9";
        pnl.style.padding = "4px 4px 0px 0px";
        pnl.setAttribute('tabindex', '123');

        pnl.style.left = this.left + parseInt(this.addToLeft) +"px"; //-80
        pnl.style.top = parseInt(this.addToTop) + this.top + "px";//+6
        
        let blackRow = ["#000000","#39434d","#666666","#999999","#b7b7b7","#cccccc","#d9d9d9","#efefef","#ffffff","TRANSPARENT"];

        let rows = [];

        rows.push(["#dfb9b1","#eecdcd","#f8e5d0","#fdf2d0","#dce9d5","#d3dfe2","#ccdaf5","#d2e1f1","#d8d2e7","#e6d2db"]);
        rows.push(["#d08270","#de9c9b","#f2cca2","#fbe5a3","#bcd5ac","#a9c3c8","#a9c2f0","#a6c4e5","#b2a8d2","#cea8bc"]);
        rows.push(["#bd4b31","#d16d6a","#ecb476","#ffefa1","#9dc284","#80a4ad","#779ee5","#7ba7d7","#8b7ebe","#b87f9e"]);
        rows.push(["#982a15","#bb261a","#da944b","#eac251","#78a55a","#53808c","#4a79d1","#4f85c1","#6351a2","#9b5378"]);
        rows.push(["#7a2817","#8c1a11","#a96324","#b89130","#48742c","#264e5b","#2657c5","#24538f","#312071","#6b2346"]);

        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.marginTop = "2px";
        row.style.marginBottom = "6px";
        blackRow.forEach(function(c) {
            let cell = _self._getDomCell_colorPicker(c, pnl);
            row.appendChild(cell);
        });

        pnl.appendChild(row);

        rows.forEach(function(r) {
            row = document.createElement("div");
            row.style.display = "flex";
            r.forEach(function(c) {
                let cell = _self._getDomCell_colorPicker(c, pnl);
                row.appendChild(cell);
            });
            pnl.appendChild(row);
        });

        let customizeBtn = document.createElement("div");
        customizeBtn.style.display = "flex";
        customizeBtn.style.justifyContent = "center";
        customizeBtn.style.alignItems = "center";
        customizeBtn.style.cursor = "pointer";
        customizeBtn.style.fontFamily = "Arial";
        customizeBtn.style.padding = "2px 4px 2px 4px";
        customizeBtn.style.fontSize = "14px";
        customizeBtn.style.color = "#999999";
        customizeBtn.textContent = "Custom";

        customizeBtn.addEventListener("mouseover", function() {
            this.style.color = "#30b7e8";
        });

        customizeBtn.addEventListener("mouseout", function() {
            this.style.color = "#999999";
        });

        customizeBtn.addEventListener("click", function() {
            _self.pnl.style.display = "none";
            _self.ShowCustomPanel();
        });

        pnl.appendChild(customizeBtn);


        //used custom colors
        if(this.usedCustomColors.length > 0) {
            let ccRow = document.createElement("div");
            ccRow.style.display = "flex";
            ccRow.style.marginTop = "2px";
            ccRow.style.marginBottom = "0px";
            this.usedCustomColors.forEach(function(c) {
                let cell = _self._getDomCell_colorPicker(c, pnl);
                ccRow.appendChild(cell);
            });
            pnl.appendChild(ccRow);
        } else {
            //looks better with:
            customizeBtn.style.padding = "2px 4px 4px 4px";
        }



        pnl.addEventListener("blur", function() {
            if(!_self.keepOnAfterSelection) {
                //if we are not keeping it alive....it will be removed on click
                //otherwise....here on blur
                this.parentNode.removeChild(this);
            }
        });

        document.body.appendChild(pnl);
        pnl.focus(); //focus after appending!!!

        this.pnl = pnl;    
    }

    _getDomCell_colorPicker(color) {
        let _self = this;
        let c = color;
        let currentColor = this.selectedColor;
        let cell = undefined;

        if(color == "TRANSPARENT") {
            cell = document.createElement("canvas");
            cell.width = 13;
            cell.height = 13;
              
            cell.style.border = "2px solid #ffffff";
            cell.style.margin = "0px 0px 4px 4px ";
            cell.style.borderRadius = "2px";

            var ctx = cell.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, cell.width, cell.height);

            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 13);
            ctx.lineTo(13, 0);
            ctx.stroke();

        } else {
            cell = document.createElement("div");
            cell.style.width = "13px";
            cell.style.height = "13px";
            cell.style.backgroundColor = c;
            cell.style.margin = "0px 0px 4px 4px ";
            cell.style.borderRadius = "2px";

            if(currentColor == c) {
                cell.style.border = "2px solid #30b7e8";
            } else {
                cell.style.border = "2px solid "+c;
            }
        }

        cell.addEventListener("mouseover", function() {
            this.style.cursor = "pointer";
            this.style.border = "2px solid #30b7e8";
        });

        cell.addEventListener("mouseout", function() {
            if(c!=currentColor) {
                if(c=="TRANSPARENT") {
                    this.style.border = "2px solid #ffffff";
                } else {
                    this.style.border = "2px solid "+c;
                }
            } else {
                this.style.border = "2px solid #30b7e8";
            }   
          
        });

        cell.addEventListener("click", function() {
            _self.callBack(c);
            if(!_self.keepOnAfterSelection) {
                try {
                    _self.pnl.parentNode.removeChild(_self.pnl);          
                } catch(error) {
                    //node may be already be removed by blur
                }
              
            }     
        });

        if(this.preserveFocus) {
            cell.addEventListener("mousedown", function(e) {
              //preserve focus
              e.preventDefault();
            });
        }
        

        return cell;
    }       

    ShowCustomPanel() {    
        let _self = this;
        let ccPnl = new CustomColorPanel(this.pnl.style.left, this.pnl.style.top, function(c) {

            if(_self.usedCustomColors.indexOf(c) < 0) {
                _self.usedCustomColors.push(c);
                if(_self.usedCustomColors.length>10) {
                    _self.usedCustomColors.shift();
                }
                localStorage.setItem("usedCustomColors", JSON.stringify(_self.usedCustomColors));
            }

            _self.callBack(c);
            if(_self.pnl.parentNode === null) {
              
            } else {
              _self.pnl.parentNode.removeChild(_self.pnl);  
            }           
        });
    }

}



