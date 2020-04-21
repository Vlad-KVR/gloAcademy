'use strict';
const DomElement = function(selector,height,width,bg,fontSize,text){
    this.selector = selector;
    this.height = height;
    this.width = width;
    this.bg = bg;
    this.fontSize = fontSize;
    this.text = text;

};

DomElement.prototype.createElement = function(){
    let newElem;

    if(this.selector[0] === "."){
        newElem = document.createElement('div');
        newElem.classList.add(this.selector);
    } else if(this.selector[0] === '#'){
        newElem = document.createElement('p');
        newElem.id = this.selector;
    }

    newElem.style.cssText = `height: ${this.height};
        width: ${this.width};
        background-color: ${this.bg};
        font-size: ${this.fontSize};`;

    if(this.text !== undefined){
        newElem.innerHTML = this.text;
    } else{
        newElem.innerHTML = "Съешь же ещё этих мягких французских булок да выпей чаю";
    }

    document.body.append(newElem);
};

const elemDiv = new DomElement('#gaga','200px','600px','green','32px');
elemDiv.createElement();