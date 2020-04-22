/*** GLOBAL VARIABLES ***/
const inputReplique = document.getElementById("replik"),
      inputPersos = document.getElementById("persos"),
      inputAuthor = document.getElementById("input_author"),
      inputTitle = document.getElementById("input_title"),
      inputDidas = document.getElementById("didasc"),
      inputCheckDidas = document.getElementById("input_check_didas"),
      fieldPage = document.getElementById("page"),
      fieldInfos = document.getElementById("field_infos"),
      fieldDate = document.getElementById("field_date");
var SELECTIONRANGE, 
    CURRENTCHARACTER = 0, 
	SHOWFRAMES = false, 
	SHOWCHARMAP = false, 
	LINECOUNT = false,
	SCALE = 1, 
	LAYOUT = "inline_layout";

/*****************************************************************************/
/*********************** GENERAL FUNCTIONNAL FUNCTIONS ***********************/
const time = function() {
  var today = new Date(),
      date = [today.getFullYear(), ("0" + (today.getMonth() + 1)).slice(-2), ("0" + today.getDate()).slice(-2)].join("/"),
      time = [("0" + today.getHours()).slice(-2), ("0" + today.getMinutes()).slice(-2), ("0" + today.getSeconds()).slice(-2)].join(":");
  dateTime = date + " " + time;
  return dateTime;
},
info = function(texte) {
  fieldInfos.innerHTML = texte;
  fieldInfos.style.opacity = 1;
  fieldInfos.style.pointerEvents = "auto";
  setTimeout(function() {
    fieldInfos.style.opacity = 0;
	fieldInfos.style.pointerEvents = "none";
  }, 5000);
},
goFullScreen = function() {
  var b = document.documentElement;
  if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
    if (b.requestFullScreen) { b.requestFullScreen() } else 
    if (b.mozRequestFullScreen) { b.mozRequestFullScreen() } else 
    if (b.webkitRequestFullScreen) { b.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) } else
    if (b.msRequestFullscreen) { b.msRequestFullscreen() }
    document.getElementById("btnFullscreen").className = "fa-compress";
  } else {
    if (document.cancelFullScreen) { document.cancelFullScreen() } else 
    if (document.mozCancelFullScreen) { document.mozCancelFullScreen() } else
    if (document.webkitCancelFullScreen) { document.webkitCancelFullScreen() } else 
    if (document.msExitFullscreen) { document.msExitFullscreen() }
    document.getElementById("btnFullscreen").className = "fa-expand";
  }  
},
doZoom = function(x) {
  if (x == -1) {
    if (SCALE - 0.2 <= 0) {
      console.log("Trop petit!")
    } else {
      SCALE = SCALE - 0.1; 
      fieldPage.style.transform = "scale("+ SCALE +")";
    }; 
  }
  if (x == 1) {
    let availableWitdh = document.getElementsByClassName("right")[0].clientWidth,
        fieldPageWidth = fieldPage.offsetWidth;
			
    if ((fieldPageWidth*(SCALE + 0.1)) > availableWitdh) {
      console.log("Ca dépasse!")
    } else {
      SCALE = SCALE + 0.1; 
      fieldPage.style.transform = "scale("+ SCALE +")";
    };
  }
  if (x == 0) {SCALE = 1; fieldPage.style.transform = "scale(1)"}
},
dragElement = function(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.getElementsByClassName("draggableheader")[0].addEventListener("mousedown", dragMouseDown, false);
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.removeEventListener("mouseup", closeDragElement, false);
    document.removeEventListener("mousemove", elementDrag, false);
  }
};
dragElement(document.getElementsByClassName("draggable")[0]);
dragElement(document.getElementsByClassName("draggable")[1]);
/*********************** GENERAL FUNCTIONNAL FUNCTIONS ***********************/
/*****************************************************************************/


/*****************************************************************************/
/************************ SELECTION / RANGE FUNCTIONS ************************/
var fnClipboard = function() {
  var STEPS, UNDO = [], REDO = [], UNDO_RANGE = [], REDO_RANGE = [], ELEM;
  const SelCE = function(a,b,c) {
    let d = document.createRange(), 
        e = window.getSelection();
    d.setStart(a.firstChild, b),
    d.setEnd(a.firstChild, c),
    e.removeAllRanges(),
    e.addRange(d);
  },
  CarCE = function(a) {
  let b = 0;
  if ("undefined" !== typeof window.getSelection) {
      let c = window.getSelection().getRangeAt(0), 
	      d = c.toString().length, 
		  e = c.cloneRange();
      e.selectNodeContents(a),
      e.setEnd(c.endContainer, c.endOffset),
      b = e.toString().length - d;
      if (d != 0) return [a, b, b + d];
    }
    return [a,b,b]
  };
  this.update = function() {
    UNDO.length < STEPS || UNDO.pop();
    UNDO.unshift(ELEM.innerHTML);
    if (window.getSelection) {
	  let sel = window.getSelection();
	  if (sel.getRangeAt && sel.rangeCount) {
	    UNDO_RANGE.length < STEPS || UNDO_RANGE.pop();
	    let a = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode;	  
	    UNDO_RANGE.unshift(CarCE(a));
	  }
    }
	console.log("clipboard updated")
  },
  this.undo = function() { 
    if (1 == UNDO.length) return !1;
    REDO.length < STEPS || UNDO.pop();
    REDO.unshift(UNDO[0]);
    UNDO.shift();
    if (UNDO[0]) ELEM.innerHTML = UNDO[0];
    REDO_RANGE.length < STEPS || UNDO_RANGE.pop();
    REDO_RANGE.unshift(UNDO_RANGE[0]);
    UNDO_RANGE.shift();
    UNDO_RANGE[0] && SelCE(UNDO_RANGE[0][0], UNDO_RANGE[0][1], UNDO_RANGE[0][1]);
  },
  this.redo = function() {
    if (0 == REDO.length) return !1;
    if (REDO[0]) ELEM.innerHTML = REDO[0];
    UNDO.length < STEPS || UNDO.pop();
    UNDO.unshift(REDO[0]);
    REDO.shift();
    UNDO_RANGE[0] && SelCE(UNDO_RANGE[0][0], UNDO_RANGE[0][1]+1, UNDO_RANGE[0][1]+1);  
    UNDO_RANGE.length < STEPS || UNDO_RANGE.pop();
    UNDO_RANGE.unshift(REDO_RANGE[0]);
    REDO_RANGE.shift();
  },
  this.init = function(a,b) {
    STEPS = (b) ? (b + 1) : 11;
    ELEM = a;
    ELEM.addEventListener ? ELEM.addEventListener("input",clipboard.update,!1) : ELEM.attachEvent && ELEM.attachEvent("oninput",clipboard.update);
    UNDO.unshift(ELEM.innerHTML);
    UNDO_RANGE.unshift([ELEM,0,0]);
  }
}, 
clipboard = new fnClipboard, 
getHTMLOfSelection = function() {
  var range;
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    return range.htmlText;
  }
  else if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      return div.innerHTML;
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
},
caretParent = function(){
  var par = SELECTIONRANGE.commonAncestorContainer;
  if (par.nodeType == 3) par = par.parentNode;
  while (/^[ibu]|strike|strong|em|su[pb]$/i.test(par.tagName)) {
	par = par.parentNode;
  }
  return par;
},
selectAll = function(a,collap) {
  if (window.getSelection) {
    var sel = window.getSelection(),       
        range = document.createRange();
    range.selectNodeContents(a);
	if (undefined !== collap) range.collapse(collap);
    sel.removeAllRanges();
    sel.addRange(range);
  }
},
setSelection = function() {
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      SELECTIONRANGE = sel.getRangeAt(0);
    }
  } 
};
clipboard.init(fieldPage, 10);
/************************ SELECTION / RANGE FUNCTIONS ************************/
/*****************************************************************************/


/*****************************************************************************/
/************************* ADD THEATER LINE FUNCTIONS ************************/
const insertText = function(txt) {
  var par = caretParent(),
      r1 = par.closest(".line, .didas-bl, .title, .act, .scene, .charlist");
  if (r1) SELECTIONRANGE.setStartAfter(r1), SELECTIONRANGE.setEndAfter(r1); 
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(SELECTIONRANGE);
  command("insertHTML", txt);
  setSelection();
},
addLineDirect = function () {
  var line = document.createElement("div"),
      par = caretParent(),
	  r1 = par.closest(".line, .didas, .didas-bl, .title, .act, .scene, .charlist"),
	  charac = characterSet();

  line.setAttribute("class", "line"); 
  line.innerHTML = "<span class=\"perso\">"+ charac +"</span><span>.</span><span> – </span><span class=\"repliq\">Texte de réplique</span>"
  if (r1) SELECTIONRANGE.setStartAfter(r1), SELECTIONRANGE.setEndAfter(r1); 
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(SELECTIONRANGE);
  SELECTIONRANGE.insertNode(line);
  clipboard.update();
  selectAll(line.getElementsByClassName("perso")[0]);
},
addLine = function() {
  if (inputReplique.value !== "") {
    if (inputCheckDidas.checked == true) {
      insertText("<span class=\"didas\">" + inputReplique.value + "</span>");
      cleanLineInputs();
    } else if (inputPersos.length == 0) {
      info("Créez d'abord un personnage puis sélectionnez-le dans la liste")
    } else if (inputPersos.selectedIndex == -1) {
      info("Sélectionnez d'abord le personnage qui s'exprime")
    } else if (inputDidas.value) {
      insertText("<div class=\"line\"><span class=\"perso\">" +
      inputPersos.options[inputPersos.selectedIndex].text 
        + "</span><span class=\"didas\"><span>, </span><span>(</span>"
        + inputDidas.value
        + "<span>)</span></span><span>.</span><span> – </span><span class=\"repliq\">"
        + inputReplique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class=\"didas\">(").replace("}", ")</span>")
        + "</span></div>");	 
      clipboard.update()	 		
      cleanLineInputs();
    } else {
      insertText("<div class=\"line\"><span class=\"perso\">"
        + inputPersos.options[inputPersos.selectedIndex].text
        + "</span><span>.</span><span> – </span><span class=\"repliq\">"
        + inputReplique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class=\"didas\">(").replace("}", ")</span>")
        + "</span></div>");
      clipboard.update()	 
      cleanLineInputs();
    }
  } else {
    info("Vous n'avez pas entré de texte à ajouter")
  }
};
/************************* ADD THEATER LINE FUNCTIONS ************************/
/*****************************************************************************/


/*****************************************************************************/
/***************************** INSERTION FUNCTIONS ***************************/
const insertDidasMenu = function() {
  if (inputCheckDidas.checked) {
    inputCheckDidas.checked = true;
    inputDidas.style.visibility = "hidden";
    inputReplique.placeholder = "Texte de didascalie";
    info("Prêt. Tapez votre texte dans le menu de gauche et validez.")
  } else {
	inputCheckDidas.checked = false;
	inputDidas.style.visibility = "visible";
	inputReplique.placeholder = "Texte de réplique";
  }
  inputReplique.select();
},
insertDidasDirect = function() {
  insertText("<div class=\"didas-bl\">Entrez votre bloc de didascalie</div>");
  selectAll(caretParent())
},
insertCharlist = function() {
  if (inputPersos.length == 0) {
    info("Ajoutez d'abord des personnages dans la liste de gauche,<br/>puis sélectionnez-les avant de les ajouter à la page.")
  } else if (inputPersos.selectedIndex == -1) {
    info("Vous n'avez pas sélectionné de personnage dans la liste de gauche")
  } else {
    var chars = characterGetSel(), lst = [];
    for (let i = 0; i < chars.length; i++) {
      lst.push(" " + chars[i].text)
    }
    insertText("<div class=\"charlist\">" + lst + "</div>");
  }
},
insertAct = function() {
  var rep = prompt("Entrez le numéro de l'acte (caratères de 0 à 9 et M D C L X V I), ou un texte libre.");
  if (rep) {
	if (/^([0-9]+|[MCDVLXI]+)$/.test(rep)) {
      insertText("<h2 class=\"act\">Acte " + rep + "</h2>");
	} else {
      insertText("<h2 class=\"act\">" + rep + "</h2>");
	}
  }
},
insertScene = function() {
  var rep = prompt("Entrez le numéro de la scène (caractères 0 - 9), ou un texte libre.");
  if (rep) {
	if (/^[0-9]+$/.test(rep)) {
      insertText("<h3 class=\"scene\">Scène " + rep + "</h3>");
	} else {
      insertText("<h3 class=\"scene\">" + rep + "</h3>");
	}
  }
},
insertTitle = function() {
  if (inputTitle.value) {
    insertText("<h1 class=\"title\">" + inputTitle.value + "</h1>");
  } else {
    var rep = prompt("Quel est le nom de l'oeuvre ?");
    if (rep) {
      inputTitle.value = rep;
      insertText("<h1 class=\"title\">" + rep + "</h1>");
    }
  }
};
/***************************** INSERTION FUNCTIONS ***************************/
/*****************************************************************************/


/*****************************************************************************/
/******************************* FILE FUNCTIONS ******************************/
/*	
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.computedStyleToInlineStyle = mod.exports;
  }
})(this, function (module) {
  "use strict";

  var each = Array.prototype.forEach;


  function computedStyleToInlineStyle(element) {
    var _context2;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!element) {
      throw new Error("No element specified.");
    }

    if (options.recursive) {
      var _context;

      (_context = element.children, each).call(_context, function (child) {
        computedStyleToInlineStyle(child, options);
      });
    }
    var computedStyle = getComputedStyle(element);
    (_context2 = options.properties || computedStyle, each).call(_context2, function (property) {
      element.style[property] = computedStyle.getPropertyValue(property);
    });
  }

  module.exports = computedStyleToInlineStyle;
});*/


const isItEmpty = function() {
  var a = fieldPage.textContent.trim(),
      b = inputPersos.length > 0,
      c = inputAuthor.value,
      d = inputTitle.value;
  return (a || b || c || d) ? false : true;
},
clearAllInputs = function() {
  fieldDate.innerHTML = inputTitle.value = inputAuthor.value = fieldPage.innerHTML = "";
  inputPersos.length = 0;
  inputPersos.size = 8;
},
closeFile = function() {
  if (!isItEmpty()) {
    var r = confirm("Voulez-vous enregistrer votre fichier en cours avant de le fermer ?");
    if (r) saveFile(); clearAllInputs();
  }
},
newFile = function() {
  if (!isItEmpty()) {
      var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en créer un nouveau ?");
      if (r) saveFile(); clearAllInputs();
    }
},
fileName = function() {
  return (inputTitle.value !== "") ? (inputTitle.value.replace(/[\/:"~*?<>|]+/g, "").replace(/\s/g, "_") + "_" + time().replace(/([0-9]{4})\/([0-9]{2})\/([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g, "$1-$2-$3_$4h$5")) : "Sans_titre_" + time().replace(/([0-9]{4})\/([0-9]{2})\/([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g, "$1-$2-$3_$4h$5");
}
saveFile = function() {
  if (isItEmpty()) {
    info("Rien à enregistrer !");
    return false
  }
  var charList = [];
  for (let i = 0; i < inputPersos.length; i++) {
    charList.push(inputPersos.options[i].text);
  }
  var entry = time() + "|" + inputTitle.value + "|" + inputAuthor.value  + "|" + LAYOUT + "\n" + charList + "\n" + fieldPage.innerHTML,
      textToBLOB = new Blob([entry], { type: "text/plain" }),
      newLink = document.createElement("a");
  newLink.download = fileName()+".fmp";
  if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textToBLOB);
  } else {
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
  }
  newLink.click();
  fieldDate.innerText = "Enregistré le : " + time();
  fieldDate.style.visibility = "visible";
},
openFile = function() {
  if (!isItEmpty()) {
    var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en ouvrir un nouveau ?");
    if (r) saveFile(); clearAllInputs();
  }
  var getFile = function() {
    if (/.fmp$/.test(file.value)) {
      var reader, txt = "";
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
      } else {
        info("The File APIs are not fully supported by your browser.");
        return false;
      }
      if (this.files && this.files[0]) {
        reader.onload = function(e) {
          txt = e.target.result;
          var firstLine = txt.split("\n")[0],
              secondLine = txt.split("\n")[1],
              charList = secondLine.split(","),
              charLength = charList.length;
          for (let j = 0; j < charLength; j++) {
            var opt = document.createElement("option");
            opt.appendChild(document.createTextNode(charList[j]));
            inputPersos.appendChild(opt);
          }
          inputPersos.size = (inputPersos.options.length >= 8) ? charLength : 8;
          fieldDate.innerText = "Enregistré le : " + firstLine.split("|")[0];
		  fieldDate.style.visibility = "visible";
          inputTitle.value = firstLine.split("|")[1];
          inputAuthor.value = firstLine.split("|")[2];
          switchLayout(firstLine.split("|")[3]);
          var newnew = txt.split("\n")
          newnew = newnew.splice(2, newnew.length).join("\n");
          document.getElementById("page").innerHTML = newnew;
		  clipboard.update();
        };
        reader.readAsText(this.files[0]);
      }
      document.body.removeChild(this);
    } else {
      info("Le fichier doit être au format .FMP")
    }
  },
  file = document.createElement("input");
  file.setAttribute("type", "file");
  file.setAttribute("id", "btnFileOpen");
  file.onchange = getFile;
  file.style.display = "none";
  document.body.appendChild(file);
  file.click();
},
printFile = function() {
  if (!fieldPage.textContent.trim()) {
    info("Document vide : rien à imprimer.");
    return false
  }

	var contents = document.getElementById("page").innerHTML;
	var frame1 = document.createElement('iframe');
	frame1.name = "frame1";
	frame1.style.position = "absolute";
	frame1.style.top = "0";
	frame1.style.witdh = "21cm";
	frame1.style.height = "29.7cm";
	document.body.appendChild(frame1);
	var frameDoc = (frame1.contentWindow) ? frame1.contentWindow : (frame1.contentDocument.document) ? frame1.contentDocument.document : frame1.contentDocument;
	frameDoc.document.open();
	frameDoc.document.write("<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"utf-8\"><title>" + inputTitle.value + "</title><link rel=\"stylesheet\" href=\"css/style.css\" type=\"text/css\" /></head><body class=\""+LAYOUT+".css\">" + fieldPage.innerHTML + "</body></html>");
	frameDoc.document.close();
	setTimeout(function () {
		window.frames["frame1"].focus();
		window.frames["frame1"].print();
		//document.body.removeChild(frame1);
	}, 500);
	return false;
},
toInlineStyle = function(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!element) {
    throw new Error("No element specified.");
  }
  var _context2,
      each = Array.prototype.forEach,
      computedStyle = getComputedStyle(element);
  (_context2 = options.properties || computedStyle, each).call(_context2, function (property) {
    element.style[property] = computedStyle.getPropertyValue(property);
  });
},
handleCopy = function(e) {
  e.preventDefault();
  var cloned = fieldPage.cloneNode(true),
      allTextBlocks = cloned.querySelectorAll(".title, .act, .scene, .didas-bl, .line, .perso, .repliq, .didas"),
      allSpans = cloned.querySelectorAll("span:not([class])");
  cloned.style.position = "absolute";
  cloned.style.top = "-100%";
  cloned.style.left = "-100%";
  cloned.style.whiteSpace = "pre-line";
  document.body.appendChild(cloned);

  for (var i = 0 ; i < allTextBlocks.length ; i++) {
    toInlineStyle(allTextBlocks[i], {
      properties: ["display", "margin-top","margin-left","margin-right","margin-bottom", "text-align", "font-variant","font-variant-caps","text-transform","font-style","color","text-align","padding-top","padding-right","padding-bottom","padding-left","font-weight","font-size","width","max-width","white-space","text-decoration","font-family"]
    });
  }
  for (var j = 0 ; j < allSpans.length ; j++) {
    if (getComputedStyle(allSpans[j]).getPropertyValue("display") == "none") {
      allSpans[j].innerHTML = "";
    }
  }

  //selectAll(cloned)
  var selected = getHTMLOfSelection();
  e.clipboardData.setData("text/html", selected);
  //document.execCommand("copy");
  //cloned.remove();
},
handlePaste = function(e) {
  var value = (window.clipboardData) ? window.clipboardData.getData('text') : e.clipboardData.getData('text/plain');
  
  if (!value) {
    window.setTimeout(function() {
      var el = e.target,
          value = el.innerText.replace(/[ ]+/g," ").replace(/(\n+\s+\n+)|(\n\n+)/g,"\n\n").replace(/\n/g, '<br/>');
      el.innerHTML = value;
    }, 16);
	clipboard.update();
    return false;
  }
  e.preventDefault();
  var texta = document.createElement("textarea");
	  texta.value = value;
  value = texta.value;
  value = value.trim()
  value = value.replace(/[ ]+/g," ").replace(/(\n+\s+\n+)|(\n\n+)/g,"\n\n");
  if (document.selection) {
    if (document.documentMode === 8) {
      value = value.replace(/\n/g, '<br>');
    }
    document.selection.createRange().pasteHTML(value);
  } else {
    document.execCommand("insertText", false, value);
  }
  clipboard.update();
}
/******************************* FILE FUNCTIONS ******************************/
/*****************************************************************************/


/*****************************************************************************/
/**************************** CHARACTERS FUNCTIONS ***************************/
const characterGetSel = function() {
  return inputPersos.querySelectorAll('option:checked');
},
characterSwitch = function(dir) {
  var lgt = characterGetSel().length;
  "up" == dir && (0 == CURRENTCHARACTER ? CURRENTCHARACTER = lgt - 1 : CURRENTCHARACTER--);
  "down" == dir && (CURRENTCHARACTER == lgt - 1 ? CURRENTCHARACTER = 0 : CURRENTCHARACTER++);
  caretParent().innerHTML = characterGetSel()[CURRENTCHARACTER].text;
  selectAll(caretParent());
  clipboard.update();
},
characterSet = function() {
  var cl = characterGetSel().length,  
      charac;
  if (cl == 0) {
	charac = "Personnage"  
  } else if (cl == 2) {
	0 == CURRENTCHARACTER ? (charac=characterGetSel()[0].text, CURRENTCHARACTER=1) : (charac=characterGetSel()[1].text, CURRENTCHARACTER=0);
  } else {
	charac = characterGetSel()[CURRENTCHARACTER].text
  }
  return charac
},
characterAdd = function() {
  var rep = prompt("Comment s'appelle votre personnage ?");
  if (rep) {
	let opt = document.createElement("option");
    rep = rep.toLocaleLowerCase("fr-FR").replace(",","");
    rep = rep.charAt(0).toUpperCase() + rep.slice(1);
    opt.text = rep;
    inputPersos.appendChild(opt);
    inputPersos.size = (inputPersos.length > 8) ? inputPersos.length : 8;
  }
},
characterRemove = function() {
  var nb = characterGetSel(), 
      nbl = nb.length;
  if (nbl > 0) {
    for (let i = 0; i < nbl; i++) nb[i].remove();
  } else if (inputPersos.length == 0) {
    info("Aucun personnage à supprimer dans la liste !")
  } else {
    info("Vous n'avez pas sélectionné de personnage à supprimer")
  }
  inputPersos.size = (inputPersos.length > 8) ? inputPersos.length : 8;
},
characterClear = function() {
  if (inputPersos.length == 0) {
    info("Aucun personnage à supprimer.")
  } else {
    var r = confirm("Voulez-vous vraiment supprimer tous les personnages ?");
    if (r) inputPersos.length = 0, inputPersos.size = 8;
  }
},
characterRename = function(){
  var old = this.options[this.selectedIndex].text,
      rep = prompt("Corrigez maintenant le nom du personnage :", old);
  if (rep) {
    rep = rep.toLocaleLowerCase("fr-FR").replace(",","");
    rep = rep.charAt(0).toUpperCase() + rep.slice(1);
    this.options[this.selectedIndex].text = rep;
    var conf = confirm("Voulez-vous remplacer le nom du personnage dans tout le document ?");
    if (conf) {
      var persos = fieldPage.querySelectorAll(".perso");
      for (var i = 0 ; i < persos.length ; i++) persos[i].innerHTML = persos[i].innerHTML.replace(old,rep);
    }
  }
};
inputPersos.addEventListener("dblclick", characterRename, false); 
inputPersos.addEventListener("change", function(){ CURRENTCHARACTER = 0 },false);
/**************************** CHARACTERS FUNCTIONS ***************************/
/*****************************************************************************/


/*****************************************************************************/
/************************** NOT CLASSIFIED FUNCTIONS *************************/


const command = function(a,b){
  document.execCommand(a, false, b);
},
cleanLineInputs = function() {
  inputDidas.value = inputReplique.value = "";
  inputDidas.style.visibility = "visible";
  inputReplique.placeholder = "Texte de réplique";
  inputPersos.selectedIndex = -1;
  inputPersos.focus();
  inputCheckDidas.checked = false;
},
switchFrames = function() {
  if (!SHOWFRAMES) { 
    fieldPage.classList.add("frames");
	document.getElementById("btnShowFrames").innerText = "Ne plus délimiter les zones de texte"
	SHOWFRAMES = true;
  } else {
    fieldPage.classList.remove("frames");
	document.getElementById("btnShowFrames").innerText = "Délimiter les zones de texte"
	SHOWFRAMES = false;	  
  }
},
switchCharmap = function() {
  if (!SHOWCHARMAP) { 
    document.getElementsByClassName("draggable")[1].style.visibility = "visible";
	document.getElementById("btnShowCharmap").innerText = "Cacher menu caractères spéciaux";
	SHOWCHARMAP = true;
  } else {
    document.getElementsByClassName("draggable")[1].style.visibility = "hidden";
	document.getElementById("btnShowCharmap").innerText = "Menu caractères spéciaux";
	SHOWCHARMAP = false;	  
  }
},
switchLinenum = function() {
  if (!LINECOUNT) { 
    fieldPage.classList.add("count");
	document.getElementById("btnShowLinenum").innerText = "Cacher la numérotation des répliques"
	LINECOUNT = true;
  } else {
    fieldPage.classList.remove("count");
	document.getElementById("btnShowLinenum").innerText = "Répliques numérotées"
	LINECOUNT = false;	  
  }
},
switchLayout = function(a) {
  fieldPage.className = fieldPage.className.replace(/[a-z]+_layout/,a);
  LAYOUT = a;
  clipboard.update();
},
defineSelected = function(clas,tag) {
  var par = caretParent();

  if ((!par.closest(".act,.scene,.title,.didas-bl,.line,.charlist") && par.closest("#page") && /act|scene|title|didas-bl|line|charlist/i.test(clas)) || (!par.closest(".perso, .repliq, .didas") && par.closest(".line") && /perso|repliq/i.test(clas)) || (!par.closest(".didas") & par.closest(".repliq") && "didas" == clas)) {
	var newPar = document.createElement(tag);
    newPar.className = clas;
	newPar.innerText = SELECTIONRANGE.toString();
	SELECTIONRANGE.deleteContents();
	SELECTIONRANGE.insertNode(newPar);
	clipboard.update();
  } else {
	info("Problème de hiérarchisation des paragraphes.<br/>Allez dans « Affichage » puis « Délimitation zones de texte » pour vous aider.")
  }
},
didasSetFunc = function(a,b) {
  var cont = a.innerHTML.match(b)[0].replace(b,"$1"),
      dida = document.createElement("span");
  a.innerHTML = a.innerHTML.replace(b,"");
  dida.setAttribute("class", "didas");
  dida.innerHTML = "<span>, </span><span>(</span>"+cont+"<span>)</span>"
  a.parentNode.insertBefore(dida, a.parentNode.getElementsByClassName("repliq")[0].previousSibling.previousSibling);
  selectAll(dida.parentNode.getElementsByClassName("repliq")[0]);
  clipboard.update();
},
didasSetInt = function(a,b) {
  a.innerHTML = a.innerHTML.replace(b,"<span class=\"didas\">($1)</span>"); /* caret position incorrect */
  clipboard.update();
};
/************************** NOT CLASSIFIED FUNCTIONS *************************/
/*****************************************************************************/


/*****************************************************************************/
/************************** GLOBAL EVENT LISTENERS ***************************/
window.addEventListener("load", function() {
  /*clearAllInputs();*/ fieldPage.focus(); setSelection();
}, false);

window.addEventListener("beforeunload", function(e) {
  if (!isItEmpty()) {
    var a = "Vous vous apprêtez à quitter cette page alors qu'un travail est en cours, voulez-vous le sauvegarder ?";
    e.returnValue = a;
    return a;
  }
});

inputReplique.addEventListener("keypress", function(e) {
  13 == (e.keyCode || e.which) && e.shiftKey && (e.preventDefault(), addLine(), setSelection());
}, false);

document.getElementById("btnFileOpen").addEventListener("click", openFile, false);

fieldPage.addEventListener("keyup", function(){
  var par = caretParent(),
      reg = /\s\(([a-zà-öù-ÿœ\s',.:!?-]+)\)$/gi,
	  reg2 = /\{([a-zà-öù-ÿœ\s',.:!?-]+)\}/gi;
	  
  if (par.className == "perso" && reg.test(par.innerHTML)) didasSetFunc(par,reg);
  if (par.className == "repliq" && reg2.test(par.innerHTML)) didasSetInt(par,reg2);
  setSelection();
}, false);

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey) {
	var prevent = true, key = e.keyCode || e.which;
	switch(key) {
      case 54: case 109: doZoom(-1); break;
      case 61: case 107: doZoom(1); break;
      case 96: case 48: doZoom(0); break;
	  case 78: newFile();break;
	  case 79: openFile();break;
	  case 80: printFile();break;
	  case 83: saveFile();break;
	  case 66: case 71: command("bold");break;
	  case 73: command("italic");break;
	  case 85: command("underline");break;
	  case 76: command("justifyLeft");break;
	  case 69: command("justifyCenter");break;
	  case 82: command("justifyRight");break;
	  case 74: command("justifyFull");break;
	  case 90: clipboard.undo() ;break;
	  case 89: clipboard.redo() ;break;
	  default: prevent = false;
    }
	prevent && e.preventDefault();
  }
}, false);


fieldPage.addEventListener("keydown", function(e) {
  var par = caretParent(),
      key = e.keyCode || e.which;

  13 == key && (e.shiftKey ? (e.preventDefault(), addLineDirect()) : command("DefaultParagraphSeparator", "br"));

  if ("perso" == par.className && 0 < characterGetSel().length && SELECTIONRANGE.startOffset !== SELECTIONRANGE.endOffset) {
    38 == key && (e.preventDefault(), characterSwitch("up"));
    40 == key && (e.preventDefault(), characterSwitch("down"));
  }

  if (9 == key) {
    e.preventDefault();
    if (e.shiftKey) {
      if (par.className == "perso") {
        if (par.parentNode.previousElementSibling.className == "line") {
          selectAll(par.parentNode.previousElementSibling.getElementsByClassName("repliq")[0],false);
        } else {
          selectAll(par.parentNode.previousElementSibling,false);
        }
      } else if (par.className == "didas" && par.parentNode.className == "line") {
        selectAll(par.parentNode.getElementsByClassName("perso")[0],false)
      } else if (par.className == "repliq") {
        if (par.parentNode.getElementsByClassName("didas")[0] && par.parentNode.getElementsByClassName("didas")[0].parentNode.className !== "repliq") {
          selectAll(par.parentNode.getElementsByClassName("didas")[0],false)
        } else {
          selectAll(par.parentNode.getElementsByClassName("perso")[0],false)
        }
      } else if (/line|title|act|scene|charlist|didas-bl/.test(par.className)) {
        if (par.previousElementSibling.className == "line") {
          selectAll(par.previousElementSibling.getElementsByClassName("repliq")[0],false);
        } else {
          selectAll(par.previousElementSibling,false);
        }
      }
    } else {
      if (par.className == "perso") {
        if (par.parentNode.getElementsByClassName("didas")[0] && par.parentNode.getElementsByClassName("didas")[0].parentNode.className !== "repliq") {
          selectAll(par.parentNode.getElementsByClassName("didas")[0], true);
        } else selectAll(par.parentNode.getElementsByClassName("repliq")[0], true);
      } else if (par.className == "didas" && par.parentNode.className == "line") {
        selectAll(par.parentNode.getElementsByClassName("repliq")[0], true);
      } else if (par.className == "repliq") {
        if (par.parentNode.nextElementSibling.className == "line") {
          selectAll(par.parentNode.nextElementSibling.getElementsByClassName("perso")[0], true);
        } else selectAll(par.parentNode.nextElementSibling, true);
      } else if (/^line|title|act|scene|charlist|didas-bl$/.test(par.className)) {
        if (par.nextElementSibling.className == "line") {
          selectAll(par.nextElementSibling.getElementsByClassName("perso")[0], true);
        } else selectAll(par.nextElementSibling, true);
      }
    }
  }

}, false);
document.addEventListener("click", function(e) {
  var f = e.target;
  switch (f.id) {
    case "btnFileNew" : newFile(); break;
  //case "btnFileOpen" : openFile(); break;
    case "btnFileSave" : saveFile(); break;
    case "btnFileClose" : closeFile(); break;
	case "btnFileCopy" : copyAll(e); break;
    case "btnFilePrint" : printFile(); break;
	case "btnFilePDF" : saveDiv(); break;
    case "btnCharAdd" : characterAdd(); break;
    case "btnCharRemove" : characterRemove(); break;
    case "btnCharClear" : characterClear(); break;
    case "btnInsCharlist" : insertCharlist(); break;
    case "btnInsAct" : insertAct(); break;
    case "btnInsScene" :  insertScene(); break;
    case "btnInsTitle" : insertTitle(); break;
    case "btnInsDidas" : insertDidasDirect(); break;
    case "btnMepInline" : switchLayout("inline_layout") ; break;
    case "btnMepClassic" : switchLayout("classic_layout"); break;
    case "btnMepScreenplay" : switchLayout("screenplay_layout"); break;
	case "btnShowCharmap" :  switchCharmap() ; break;
	case "btnShowFrames" : switchFrames(); break;
	case "btnShowLinenum" : switchLinenum(); break;
    case "btnAddText" : addLine(); break;
    case "input_check_didas" : insertDidasMenu(); break;
    case "field_infos" : fieldInfos.style.opacity = 0; fieldInfos.style.pointerEvents = "none"; break;
    case "btnBold" : command("bold"); break;
    case "btnItalic" : command("italic"); break;
    case "btnUnderline" : command("underline"); break;
    case "btnStrike" : command("strikeThrough"); break;
	case "btnSubscript" : command("subscript"); break;
	case "btnSuperscript" : command("superscript"); break;
    case "btnHR" : command("insertHorizontalRule"); break;
    case "btnAlignLeft" : command("justifyLeft"); break;
    case "btnAlignCenter" : command("justifyCenter"); break;
    case "btnAlignRight" : command("justifyRight"); break;
    case "btnAlignJustify" : command("justifyFull"); break;
    case "btnUndo" : clipboard.undo(); break;
    case "btnRedo" : clipboard.redo(); break;
    case "btnRemoveFormat" : command("removeFormat"); break;
	case "btnFullscreen" : goFullScreen(); break;
    case "btnDefTitle" : defineSelected("title","h1");break;
    case "btnDefAct" : defineSelected("act","h2");break;
    case "btnDefScene" : defineSelected("scene","h3");break;
    case "btnDefDidasBl" : defineSelected("didas-bl","div");break;
	case "btnDefDidasInt" : defineSelected("didas","span");break;
    case "btnDefCharlist" : defineSelected("charlist","div");break;
    case "btnDefLine" : defineSelected("line","div");break;
    case "btnDefPerso" : defineSelected("perso","span");break;
    case "btnDefRépliq" : defineSelected("repliq","span");break;
	case "btnZoomIn" : doZoom(1);break;
	case "btnZoomOut" : doZoom(-1);break;
    default : void(0);
  }
  if (f.closest(".draggable.dos")) command("insertHTML",f.innerText);
  ("perso" == f.className && 0 < characterGetSel().length) && selectAll(f);
  (f.closest("#page")) && setSelection();
  e.stopPropagation();
},false);

//fieldPage.addEventListener("copy", function(e) { handleCopy(e) },false);
fieldPage.addEventListener("paste", function(e){handlePaste(e)},false);
/****************************** EVENT LISTENERS ******************************/
/*****************************************************************************/