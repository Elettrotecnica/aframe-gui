AFRAME.registerComponent('gui-toggle', {
    schema: {
        on: {default: 'click'},
        text: {type: 'string', default: 'text'},
        active: {type: 'boolean', default: true},
        checked: {type: 'boolean', default: false},
        borderWidth: {type: 'number', default: 1},
        fontSize: {type: 'string', default: '150px'},
        fontFamily: {type: 'string', default: 'Arial'},
        fontColor: {type: 'string', default: key_grey_dark},
        borderColor: {type: 'string', default: key_grey},
        backgroundColor: {type: 'string', default: key_offwhite},
        hoverColor: {type: 'string', default: key_grey_light},
        activeColor: {type: 'string', default: key_orange},
        handleColor: {type: 'string', default: key_offwhite},
    },
    init: function() {

        var data = this.data;
        var el = this.el;
        var guiItem = el.getAttribute("gui-item");

        el.setAttribute('material', `shader: flat; depthTest:true;transparent: false; opacity: 1;  color: ${this.data.backgroundColor}; side:front;`);
        el.setAttribute('geometry', `primitive: plane; height: ${guiItem.height}; width: ${guiItem.height};`);

        var toggleBoxWidth = guiItem.height/1.75;
        var toggleBoxX = -guiItem.width*0.5 + guiItem.height/2;

        var toggleBox = document.createElement("a-box");

        toggleBox.setAttribute('width', toggleBoxWidth);
        toggleBox.setAttribute('height', guiItem.height*0.5);
        toggleBox.setAttribute('depth', '0.01');
        toggleBox.setAttribute('material', `color:${data.borderColor}; shader: flat;`);
        toggleBox.setAttribute('position', `${toggleBoxX} 0 0`);
        toggleBox.setAttribute('animation__color', `property: material.color; from: ${data.borderColor}; to:${data.activeColor}; dur:50; easing:easeInOutCubic; dir:alternate; startEvents: toggleAnimation`);
        el.appendChild(toggleBox);

        var toggleHandleWidth = guiItem.height/5;
        var toggleHandleXStart = -guiItem.height*0.5 + toggleHandleWidth*2;
        var toggleHandleXEnd = guiItem.height*0.5 - toggleHandleWidth*2;
        var toggleHandle = document.createElement("a-box");

        toggleHandle.setAttribute('width', `${toggleHandleWidth}`);
        toggleHandle.setAttribute('height', guiItem.height*0.4);
        toggleHandle.setAttribute('depth', '0.02');
        toggleHandle.setAttribute('material', `color:${data.handleColor}`);
        toggleHandle.setAttribute('position', `${toggleHandleXStart} 0 0.02`);
        toggleHandle.setAttribute('animation__position', `property: position; from: ${toggleHandleXStart} 0 0.02; to:${toggleHandleXEnd} 0 0.02; dur:50; easing:easeInOutCubic; dir:alternate; startEvents: toggleAnimation`);
        toggleBox.appendChild(toggleHandle);

        var labelWidth = guiItem.width - guiItem.height;
        var multiplier = 512; // POT conversion
        var canvasWidth = labelWidth*multiplier;
        var canvasHeight = guiItem.height*multiplier;

        var canvasContainer = document.createElement('div');
        canvasContainer.setAttribute('class', 'visuallyhidden');
        document.body.appendChild(canvasContainer);

        var labelCanvas = document.createElement("canvas");
        this.labelCanvas = labelCanvas;
        labelCanvas.className = "visuallyhidden";
        labelCanvas.setAttribute('width', canvasWidth);
        labelCanvas.setAttribute('height', canvasHeight);
        labelCanvas.id = getUniqueId('canvas');
        canvasContainer.appendChild(labelCanvas);

        var ctxLabel = this.ctxLabel = labelCanvas.getContext('2d');
        drawText(this.ctxLabel, this.labelCanvas, this.data.text, data.fontSize, data.fontFamily, this.data.fontColor, 1,'left','middle');

        var labelEntityX = guiItem.height*0.5 - guiItem.width*0.05;
        var labelEntity = document.createElement("a-entity");
        labelEntity.setAttribute('geometry', `primitive: plane; width: ${labelWidth}; height: ${guiItem.height/1.05};`);
        labelEntity.setAttribute('material', `shader: flat; src: #${labelCanvas.id}; transparent: true; opacity: 1;  color: ${this.data.backgroundColor}; side:front;`);
        labelEntity.setAttribute('position', `${labelEntityX} 0 0.02`);
        el.appendChild(labelEntity);

        this.updateToggle(data.active);

        el.addEventListener('mouseenter', function () {
            toggleHandle.setAttribute('material', 'color', data.hoverColor);
        });

        el.addEventListener('mouseleave', function () {
            toggleHandle.setAttribute('material', 'color', data.handleColor);
        });

        el.addEventListener("check", function (evt) {
            if(!data.checked){
              data.checked = true;
              toggleBox.emit('toggleAnimation');
              toggleHandle.emit('toggleAnimation');
            }
        });
        el.addEventListener("uncheck", function (evt) { // a
              if(data.checked){
                data.checked = false;
                toggleBox.emit('toggleAnimation');
                toggleHandle.emit('toggleAnimation');
              }
        });

        el.addEventListener(data.on, function (evt) {
            console.log('I was clicked at: ', evt.detail.intersection.point);
            data.checked = !data.checked;
            toggleBox.emit('toggleAnimation');
            toggleHandle.emit('toggleAnimation');
            var guiInteractable = el.getAttribute("gui-interactable");
            console.log("guiInteractable: "+guiInteractable);
            var clickActionFunctionName = guiInteractable.clickAction;
            console.log("clickActionFunctionName: "+clickActionFunctionName);
            // find object
            var clickActionFunction = window[clickActionFunctionName];
            //console.log("clickActionFunction: "+clickActionFunction);
            // is object a function?
            if (typeof clickActionFunction === "function") clickActionFunction();
});

    },
    update: function(){
        var data = this.data;
        this.updateToggle(data.active)
    },


    updateToggle: function(active){

        if(active){

        }else{
        }

    },
});

AFRAME.registerPrimitive( 'a-gui-toggle', {
    defaultComponents: {
        'gui-interactable': { },
        'gui-item': { type: 'toggle' },
        'gui-toggle': { }
    },
    mappings: {
        'onclick': 'gui-interactable.clickAction',
        'onhover': 'gui-interactable.hoverAction',
        'key-code': 'gui-interactable.keyCode',
        'width': 'gui-item.width',
        'height': 'gui-item.height',
        'margin': 'gui-item.margin',
        'on': 'gui-toggle.on',
        'active': 'gui-toggle.active',
        'checked': 'gui-toggle.checked',
        'value': 'gui-toggle.text',
        'font-color': 'gui-toggle.fontColor',
        'font-family': 'gui-toggle.fontFamily',
        'font-size': 'gui-toggle.fontSize',
        'border-width': 'gui-toggle.borderWidth',
        'border-color': 'gui-toggle.borderColor',
        'background-color': 'gui-toggle.backgroundColor',
        'hover-color': 'gui-toggle.hoverColor',
        'active-color': 'gui-toggle.activeColor',
        'handle-color': 'gui-toggle.handleColor'
    }
});
