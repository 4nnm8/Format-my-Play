const inputReplique = document.getElementById("replik"),
      inputPersos = document.getElementById("persos"),
      inputAuthor = document.getElementById("input_author"),
      inputTitle = document.getElementById("input_title"),
      inputDidas = document.getElementById("didasc"),
      inputCheckDidas = document.getElementById("input_check_didas"),
      fieldPage = document.getElementById("page"),
      fieldSummary = document.getElementById("tdm"),
      fieldInfos = document.getElementById("field_infos"),
      fieldDate = document.getElementById("field_date"),
      elemStyle = document.getElementById("theme");

var SELECTIONRANGE, CURRENTCHARACTER = 0, SHOWFRAMES = false, SHOWCHARMAP = false;

const command = function(a,b){
  document.execCommand(a, false, b)
},
isItEmpty = function() {
  var one = fieldPage.textContent.trim(),
      two = inputPersos.length > 0,
      thr = inputAuthor.value,
      fou = inputTitle.value;
  return (one || two || thr || fou) ? false : true;
},
clearAllInputs = function() {
  fieldDate.innerHTML = inputTitle.value = inputAuthor.value = fieldPage.innerHTML = inputDidas.value = inputReplique.value = "";
  inputDidas.style.visibility = "visible";
  inputReplique.placeholder = "Texte de réplique";
  inputPersos.length = 0;
  inputPersos.size = 8;
  inputCheckDidas.checked = false;
},
cleanLineInputs = function() {
  inputDidas.value = inputReplique.value = "";
  inputDidas.style.visibility = "visible";
  inputReplique.placeholder = "Texte de réplique";
  inputPersos.selectedIndex = -1;
  inputPersos.focus();
  inputCheckDidas.checked = false;
},
time = function() {
  var today = new Date(),
      date = [today.getFullYear(), ("0" + (today.getMonth() + 1)).slice(-2), ("0" + today.getDate()).slice(-2)].join("/"),
      time = [("0" + today.getHours()).slice(-2), ("0" + today.getMinutes()).slice(-2), ("0" + today.getSeconds()).slice(-2)].join(":")
  dateTime = date + " " + time;
  return dateTime;
},
info = function(texte) {
  fieldInfos.innerHTML = texte;
  setTimeout(function() {
    fieldInfos.style.opacity = 1
  }, 0);
  setTimeout(function() {
    fieldInfos.style.opacity = 0
  }, 7000);
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
setSelection = function() {
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      SELECTIONRANGE = sel.getRangeAt(0);
    }
  } 
},
caretParent = function(){
  var par = SELECTIONRANGE.commonAncestorContainer;
  return (par.nodeType == 3) ? par.parentNode : par;
},
selectAll = function(a) {
  sel = window.getSelection();        
  range = document.createRange();
  range.selectNodeContents(a);
  sel.removeAllRanges();
  sel.addRange(range);
},
addLineDirect = function () {
  var block1 = document.createElement("div"),
      block2 = document.createElement("span"),
      text2 = document.createTextNode("Personnage"),
    //space = document.createTextNode("\u00a0"),
      block3 = document.createElement("span"),
      text3 = document.createTextNode("Texte de réplique."),
      par = caretParent(),
      r1 = par.closest(".line, .didas, .display_title, .display_act, .display_scene, .char_list");
  block2.appendChild(text2); 
  block3.appendChild(text3);
  if (r1) SELECTIONRANGE.setStartAfter(r1), SELECTIONRANGE.setEndAfter(r1); 
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(SELECTIONRANGE);
  block1.appendChild(block2); 
//block1.appendChild(space);
  block1.appendChild(block3);
  block1.setAttribute("class", "line"); 
  block2.setAttribute("class", "perso"); 
  block3.setAttribute("class", "repliq");  
  SELECTIONRANGE.insertNode(block1);
  selectAll(block2);
},
insertText = function(texte) {
  var par = caretParent(),
      r1 = par.closest(".line, .didas, .didas, .display_title, .display_act, .display_scene, .display_char, .perso, .perso-d");
  if (r1) SELECTIONRANGE.setStartAfter(r1), SELECTIONRANGE.setEndAfter(r1); 
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(SELECTIONRANGE);
  command("insertHTML", texte);
  setSelection();
},
addLine = function() {
  if (inputReplique.value !== "") {
    if (inputCheckDidas.checked == true) {
      insertText("<p class=\"didas\">" + inputReplique.value + "</p>");
      cleanLineInputs();
    } else if (inputPersos.length == 0) {
      info("Créez d'abord un personnage puis sélectionnez-le dans la liste")
    } else if (inputPersos.selectedIndex == -1) {
      info("Sélectionnez d'abord le personnage qui s'exprime")
    } else if (inputDidas.value) {
      insertText("<div class=\"line\"><span class=\"perso-d\">" +
      inputPersos.options[inputPersos.selectedIndex].text 
        + "</span><span class=\"didas\">"
        + inputDidas.value
        + "</span><span class=\"repliq\">"
        + inputReplique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class=\"didas\">(").replace("}", ")</span>")
        + "</span></div>");	  
      cleanLineInputs();   
    } else {
      insertText("<div class=\"line\"><span class=\"perso\">"
        + inputPersos.options[inputPersos.selectedIndex].text
        + "</span><span class=\"repliq\">"
        + inputReplique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class=\"didas\">(").replace("}", ")</span>")
        + "</span></div>");
      cleanLineInputs();
    }
  } else {
    info("Vous n'avez pas entré de texte à ajouter")
  }
},
getSelectCharacters = function() {
  var result = [], options = inputPersos && inputPersos.options, l = options.length;
  for (let i = 0 ; i < l; i++) {
    if (options[i].selected) result.push(options[i]);
  }
  return result;
},
characterAdd = function() {
  var rep = prompt("Comment s'appelle votre personnage ?"),
      opt = document.createElement("option");
  if (rep) {
    rep = rep.toLocaleLowerCase("fr-FR").replace(",","");
    rep = rep.charAt(0).toUpperCase() + rep.slice(1);
    opt.appendChild(document.createTextNode(rep));
    inputPersos.appendChild(opt);
    inputPersos.size = (inputPersos.options.length > 8) ? inputPersos.options.length : 8;
  }
},
characterRemove = function() {
  var nb = getSelectCharacters(), nbl = nb.length;
  if (inputPersos.length == 0) {
    info("Aucun personnage à supprimer dans la liste !")
  } else if (nbl > 1) {
    for (let i = 0; i < nbl; i++) {
      nb[i].remove();
    }
  } else if (nbl == 1) {
    inputPersos.options[inputPersos.selectedIndex].remove();
  } else {
    info("Vous n'avez pas sélectionné de personnage à supprimer")
  }
  inputPersos.size = (inputPersos.options.length > 8) ? inputPersos.options.length : 8;
},
characterClear = function() {
  if (inputPersos.length == 0) {
    info("Aucun personnage à supprimer.")
  } else {
    var r = confirm("Voulez-vous vraiment supprimer tous les personnages ?");
    if (r) inputPersos.options.length = 0;
    inputPersos.size = 8;
  }
},
insertDidasMenu = function() {
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
  insertText("<div class=\"didas\">Entrez votre bloc de didascalie</div>");
  selectAll(caretParent())
},
insertCharlist = function() {
  if (inputPersos.length == 0) {
    info("Ajoutez d'abord des personnages dans la liste de gauche,<br/>puis sélectionnez-les avant de les ajouter à la page.")
  } else if (inputPersos.selectedIndex == -1) {
    info("Vous n'avez pas sélectionné de personnage dans la liste de gauche")
  } else {
    var chars = getSelectCharacters(), lst = [];
    for (let i = 0; i < chars.length; i++) {
      lst.push(" " + chars[i].text)
    }
    insertText("<div class=\"display_char\">" + lst + "</div>");
  }
},
insertAct = function() {
  var rep = prompt("Entrez le numéro de l'acte (caratères de 0 à 9 et M D C L X V I), ou un texte libre.");
  if (rep) {
	if (/^([0-9]+|[MCDVLXI]+)$/.test(rep)) {
      insertText("<h2 class=\"display_act\">Acte " + rep + "</h2>");
	} else {
      insertText("<h2 class=\"display_act\">" + rep + "</h2>");
	}
  }
},
insertScene = function() {
  var rep = prompt("Entrez le numéro de la scène (caractères 0 - 9), ou un texte libre.");
  if (rep) {
	if (/^[0-9]+$/.test(rep)) {
      insertText("<h3 class=\"display_scene\">Scène " + rep + "</h3>");
	} else {
      insertText("<h3 class=\"display_scene\">" + rep + "</h3>");
	}
  }
},
insertTitle = function() {
  if (inputTitle.value) {
    insertText("<h1 class=\"display_title\">" + inputTitle.value + "</h1>");
  } else {
    var rep = prompt("Quel est le nom de l'oeuvre ?");
    if (rep) {
      inputTitle.value = rep;
      insertText("<h1 class=\"display_title\">" + rep + "</h1>");
    }
  }
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
	return (inputTitle.value !== "") ? (inputTitle.value.replace(/[\/:"~*?<>|]+/g, "").replace(/\s/g, "_")) : "Sans_titre_" + time().replace(/([0-9]{4})\/([0-9]{2})\/([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g, "$1-$2-$3_$4h$5");
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
  var entry = time() + ";" + inputTitle.value + ";" + inputAuthor.value + "\n" + charList + "\n" + fieldPage.innerHTML,
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
          fieldDate.innerText = "Enregistré le : " + firstLine.split(";")[0];
		  fieldDate.style.visibility = "visible";
          inputTitle.value = firstLine.split(";")[1];
          inputAuthor.value = firstLine.split(";")[2];
          var newnew = txt.split("\n")
          newnew = newnew.splice(2, newnew.length).join("\n")
          document.getElementById("page").innerHTML = newnew;
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
  var height = window.innerHeight,
      width = height*0.7,
      paper = window.open("_blank", "PRINT", "height="+height+",width="+width),
      cssFile = elemStyle.href.replace(/.+\/([a-z_]+.css$)/,"$1");
  /*https://ann-mb.github.io/Format-my-Play/*/
  paper.document.write("<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"utf-8\"><title>" + inputTitle.value + 
  "</title><link rel=\"stylesheet\" href=\"css/" + cssFile + "\" type=\"text/css\" /></head><body>" + fieldPage.innerHTML + "</body></html>");
  paper.document.close(); 
  paper.focus();
  paper.print();
  return true;
},
saveDiv = function() {
  var doc = new jsPDF(),
	  cssFile = elemStyle.href.replace(/.+\/([a-z_]+.css$)/,"$1");
  doc.addHTML("<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"utf-8\"><title>" + 
  inputTitle + "</title><link rel=\"stylesheet\" href=\"css/" + cssFile +
  "\" type=\"text/css\" /></head><body>" + fieldPage.innerHTML + "</body></html>");
  doc.save(fileName()+".pdf");
},
wordCounter = function() {
  var num = fieldPage.innerText.match(/[a-zà-öù-ÿœ-]+/gi);
  if (num) document.getElementById("wordCounter").innerText = "Compteur de mots : " + num.length
}, 
whichChar = function(dir) {
  var lgt = getSelectCharacters().length;
  "up" == dir && (0 == CURRENTCHARACTER ? CURRENTCHARACTER = lgt - 1 : CURRENTCHARACTER--);
  "down" == dir && (CURRENTCHARACTER == lgt - 1 ? CURRENTCHARACTER = 0 : CURRENTCHARACTER++);
  caretParent().innerHTML = getSelectCharacters()[CURRENTCHARACTER].text
  selectAll(caretParent())
},
switchFrames = function() {
  if (!SHOWFRAMES) { 
    fieldPage.className = "frames";
	document.getElementById("btnShowFrames").innerText = "Ne plus délimiter les zones de texte"
	SHOWFRAMES = true;
  } else {
    fieldPage.className = "";
	document.getElementById("btnShowFrames").innerText = "Délimiter les zones de texte"
	SHOWFRAMES = false;	  
  }
},
switchCharmap = function() {
  if (!SHOWCHARMAP) { 
    document.getElementsByClassName("draggable")[1].style.visibility = "visible";
	document.getElementById("btnShowCharmap").innerText = "Cacher les caractères spéciaux";
	SHOWCHARMAP = true;
  } else {
    document.getElementsByClassName("draggable")[1].style.visibility = "hidden";
	document.getElementById("btnShowCharmap").innerText = "Caractères spéciaux";
	SHOWCHARMAP = false;	  
  }
},
dragElement = function(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.getElementsByClassName("draggableheader")[0].addEventListener("mousedown", dragMouseDown, false);

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
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

window.addEventListener("load", clearAllInputs, fieldPage.focus(), setSelection());

window.addEventListener("beforeunload", function(e) {
  if (!isItEmpty()) {
    var a = "Vous vous apprêtez à quitter cette page alors qu'un travail est en cours, voulez-vous le sauvegarder ?";
    e.returnValue = a;
    return a;
  }
});

inputPersos.addEventListener("change",function(){ CURRENTCHARACTER = 0 },false);

fieldPage.addEventListener("keyup", function() { setSelection(); wordCounter() }, false);

inputReplique.addEventListener("keypress", function(e) {
    if (e.keyCode == 13 && e.shiftKey) {
        e.preventDefault();
		addLine();
    }
}, false);

document.getElementById("btnFileOpen").addEventListener("click", openFile, false);

document.addEventListener("keyup", function(){
  var par = caretParent(),
      reg = /\s\(([a-zà-öù-ÿœ\s',.:!?-]+)\)$/gi
  if (par.className == "perso" && reg.test(par.innerHTML)) {
    par.className = "perso-d";
	
	var cont = par.innerHTML.match(reg)[0].replace(reg,"$1");
	
	par.innerHTML = par.innerHTML.replace(reg,"")

	var ladida = document.createElement("span"),
	
        texte = document.createTextNode(cont);
		
	ladida.appendChild(texte);
	
	ladida.setAttribute("class", "didas"); 
	
    par.parentNode.insertBefore(ladida, par.parentNode.getElementsByClassName("repliq")[0]);
	
    selectAll(ladida.nextSibling);    
	
	console.log(texte)
  }
}, false);

document.addEventListener("keydown", function(e) {
  var par = caretParent();
  if (!e.shiftKey && 13 == e.keyCode) command("DefaultParagraphSeparator","br");
  if (e.shiftKey && 13 == e.keyCode) e.preventDefault(), addLineDirect();  
  if (9 == e.keyCode && par.className == "perso") {
    e.preventDefault();
    selectAll(par.nextElementSibling);
  } else if (9 == e.keyCode && !par.closest("#page")) { /* CHECK THIS */
    e.preventDefault();
  }
  if ("perso" == par.className && 0 < getSelectCharacters().length && SELECTIONRANGE.startOffset !== SELECTIONRANGE.endOffset) {
    if (38 == e.keyCode) e.preventDefault(), whichChar("up");
    if (40 == e.keyCode) e.preventDefault(), whichChar("down");
  }
}, false);

document.addEventListener("click", function(e) {
  var f = e.target;
  switch (f.id) {
    case "btnFileNew" : newFile(); break;
  //case "btnFileOpen" : openFile(); break;
    case "btnFileSave" : saveFile(); break;
    case "btnFileClose" : closeFile(); break;
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
    case "btnMepInline" : elemStyle.href = "css/mep_inline.css"; break;
    case "btnMepClassic" : elemStyle.href = "css/mep_classic.css"; break;
    case "btnMepScreenplay" : elemStyle.href = "css/mep_screenplay.css"; break;
	case "btnShowCharmap" :  switchCharmap() ; break;
	case "btnShowFrames" : switchFrames(); break;
    case "btnAddText" : addLine(); break;
    case "input_check_didas" : insertDidasMenu(); break;
    case "field_infos" : fieldInfos.style.opacity = 0; break;
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
    case "btnIndent" : command("indent"); break;
    case "btnOutdent" : command("outdent"); break;
    case "btnUndo" : command("undo"); break;
    case "btnRedo" : command("redo"); break;
    case "btnRemoveFormat" : command("removeFormat"); break;
	case "btnFullscreen" : goFullScreen(); break;
    default : void(0);
  }
  if (f.closest(".draggable.dos")) command("insertHTML",f.innerText), fieldPage.focus();
  if (f.closest("#page")) setSelection();
  e.stopPropagation();
},false);


dragElement(document.getElementsByClassName("draggable")[0]);
dragElement(document.getElementsByClassName("draggable")[1]);


var TREE,
createTree = function() {
    TREE = document.createTreeWalker(fieldPage, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (!node.parentNode.nodeName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/i) && 0 < node.nodeValue.trim().length) return NodeFilter.FILTER_ACCEPT;
    }
  }, false);
}, toCSS = function(a) {

    var sheets = document.styleSheets, o = [];
    a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.matches(rules[r].selectorText)) {
                o.push(rules[r].cssText);
            }
        }
    }
    return o;
}


function go() {
	createTree();
	for (; TREE.nextNode();) {
      setTimeout((function(currentNode) {
       
	    console.log(toCSS(currentNode))
	   
      }(TREE.currentNode)), 0);
    }
}

