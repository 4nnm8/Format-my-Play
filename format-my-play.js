const input_replique = document.getElementById("replik"),
      input_persos = document.getElementById("persos"),
      input_author = document.getElementById("input_author"),
      input_title = document.getElementById("input_title"),
      input_didascalie = document.getElementById("didasc"),
	  checkbox_didasc = document.getElementById("checkbox_didasc"),
	  field_page = document.getElementById("page"),
      field_tdm = document.getElementById("tdm"),
      field_status = document.getElementById("status"),
	  field_date = document.getElementById("field_date"),
	  elem_theme = document.getElementById("theme");
	  
var selectionRange, current_char = 0,

CMD = function(a,b){
	document.execCommand(a, false, b)
},
isItEmpty = function() {
    var one = field_page.textContent.trim(),
        two = input_persos.length > 0,
        thr = input_author.value,
        fou = input_title.value;
	return (one || two || thr || fou) ? false : true;
},
clearAll = function() {
    field_date.innerHTML = input_title.value = input_author.value = field_page.innerHTML = input_didascalie.value = input_replique.value = "";
    input_persos.length = 0;
    input_persos.size = 8;
	checkbox_didasc.checked = false;
},
cleanLineInputs = function() {
	input_didascalie.value = '';
	input_replique.value = '';
	input_persos.selectedIndex = -1;
	input_persos.focus();
	checkbox_didasc.checked = false;
},
time = function() {
    var today = new Date(),
        date = [today.getFullYear(), ('0' + (today.getMonth() + 1)).slice(-2), ('0' + today.getDate()).slice(-2)].join('/'),
        time = [('0' + today.getHours()).slice(-2), ('0' + today.getMinutes()).slice(-2), ('0' + today.getSeconds()).slice(-2)].join(':')
    dateTime = date + ' ' + time;
    return dateTime;
},
info = function(texte) {
    field_status.innerHTML = texte;
    setTimeout(function() {
        field_status.style.opacity = 1
    }, 0);
	setTimeout(function() {
        field_status.style.opacity = 0
    }, 7000);
},
goFullScreen = function() {
  var b = document.documentElement;
  if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
    if (b.requestFullScreen) { b.requestFullScreen() } else 
	if (b.mozRequestFullScreen) { b.mozRequestFullScreen() } else 
	if (b.webkitRequestFullScreen) { b.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) } else
	if (b.msRequestFullscreen) { b.msRequestFullscreen() }
    document.getElementById("btnFullscreen").className("fa-compress");
  } else {
    if (document.cancelFullScreen) { document.cancelFullScreen() } else 
	if (document.mozCancelFullScreen) { document.mozCancelFullScreen() } else
	if (document.webkitCancelFullScreen) { document.webkitCancelFullScreen() } else 
	if (document.msExitFullscreen) { document.msExitFullscreen() }
    document.getElementById("btnFullscreen").className("fa-expand");
  }  
},
setSelection = function() {
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      selectionRange = sel.getRangeAt(0);
    }
  } 
},
caretParent = function(){
	var par = selectionRange.commonAncestorContainer;
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
	var	block1 = document.createElement("div"),
		block2 = document.createElement("span"),
		text2 = document.createTextNode("Personnage"),
		block3 = document.createElement("span"),
		text3 = document.createTextNode("Texte de réplique."),
		par = caretParent(),
		r1 = par.closest(".line, .didas-f, .didas-b, .title_display, .act_display, .scene_display, .char_display");
	block2.appendChild(text2); 
	block3.appendChild(text3);
	if (r1) selectionRange.setStartAfter(r1), selectionRange.setEndAfter(r1); 
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(selectionRange);
	block1.appendChild(block2); 
	block1.appendChild(block3);
	block1.setAttribute("class", "line"); 
	block2.setAttribute("class", "perso"); 
	block3.setAttribute("class", "repliq");	
	selectionRange.insertNode(block1);
	selectAll(block2);
},
insertText = function(texte) {
	var par = caretParent(),
		r1 = par.closest(".line, .didas-f, .didas-b, .title_display, .act_display, .scene_display, .char_display");
	if (r1) selectionRange.setStartAfter(r1), selectionRange.setEndAfter(r1); 
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(selectionRange);
	CMD("insertHTML", texte);
	setSelection();
},
addLine = function() {
	if (input_replique.value !== "") {
		if (checkbox_didasc.checked == true) {
			insertText("<div class='didas-b'>" + input_replique.value + "</div>");
			cleanLineInputs();
		} else if (input_persos.length == 0) {
			info("Créez d'abord un personnage puis sélectionnez-le dans la liste")
		} else if (input_persos.selectedIndex == -1) {
			info("Sélectionnez d'abord le personnage qui s'exprime")
		} else if (input_didascalie.value) {
			insertText("<div class='line'><span class='perso-d'>" +
				input_persos.options[input_persos.selectedIndex].text +
				"<span class='didas'>" +
				input_didascalie.value +
				"</span></span> <span class='repliq'>" +
				input_replique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class='didas'>(").replace("}", ")</span>") +
				"</span></div>");
			cleanLineInputs();	
		} else {
			insertText("<div class='line'><span class='perso'>" +
				input_persos.options[input_persos.selectedIndex].text +
				"</span><span class='repliq'>" +
				input_replique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class='didas'>(").replace("}", ")</span>") +
				"</span></div>");
			cleanLineInputs();
		}

	} else {
		info("Vous n'avez pas entré de texte à ajouter")
    }
},
getSelectCharacters = function() {
    var result = [],
        options = input_persos && input_persos.options;

    for (let i = 0, iLen = options.length ; i < iLen; i++) {
        if (options[i].selected) result.push(options[i]);
    }
    return result;
},
character_add = function() {
    var rep = prompt("Comment s'appelle votre personnage ?"),
        opt = document.createElement('option');
    if (rep) {
		rep = rep.toLocaleLowerCase("fr-FR");
		rep = rep.charAt(0).toUpperCase() + rep.slice(1);
		opt.appendChild(document.createTextNode(rep));
        input_persos.appendChild(opt);
        if (input_persos.options.length > 8) input_persos.size = input_persos.options.length;
    }
},
character_remove = function() {
    var nb = getSelectCharacters(),
        nbl = nb.length;

    if (input_persos.length == 0) {
        info('Aucun personnage à supprimer dans la liste !')
    } else if (nbl > 1) {
        for (let i = 0; i < nbl; i++) {
            nb[i].remove();
        }
    } else if (nbl == 1) {
        input_persos.options[input_persos.selectedIndex].remove();
    } else {
        info("Vous n'avez pas sélectionné de personnage à supprimer")
    }
	if (input_persos.options.length > 8) input_persos.size = input_persos.options.length;
},
character_clear = function() {
    if (input_persos.length == 0) {
        info('Aucun personnage à supprimer.')
    } else {
        var r = confirm("Voulez-vous vraiment supprimer tous les personnages ?");
        if (r) input_persos.options.length = 0;
    }
},
insert_didas = function() {
	checkbox_didasc.checked = true;
	input_replique.select();
	info("Prêt. Tapez votre texte dans le menu de gauche et validez.")
},
insert_charlist = function() {
    if (input_persos.length == 0) {
        info("Ajoutez d'abord des personnages dans la liste de gauche,<br/>puis sélectionnez-les avant de les ajouter à la page.")
    } else if (input_persos.selectedIndex == -1) {
        info("Vous n'avez pas sélectionné de personnage dans la liste de gauche")
    } else {
        var chars = getSelectCharacters(),
            lst = [];
        for (let i = 0; i < chars.length; i++) {
            lst.push(" " + chars[i].text)
        }
		insertText("<div class='char_display'>" + lst + "</div>");
    }
},
insert_act = function() {
    var rep = prompt("Quel est le numéro de l'acte ?");
    if (/^([0-9]+|[MCDVLXI]+)$/.test(rep)) {
		insertText("<h2 class='act_display'>Acte " + rep + "</h2>");
    } else if (rep) {
        info("Seuls les caractères suivants sont autorisés :<br/><br/>0 1 2 3 4 5 6 7 8 9 M D C L X V I")
    }
},
insert_scene = function() {
    var rep = prompt("Quel est le numéro de la scène ?");
    if (/^[0-9]+$/.test(rep)) {
		insertText("<h3 class='scene_display'>Scène " + rep + "</h3>");
    } else if (rep) {
        info("Merci d'entrer uniquement des chiffres arabes (0 - 9)")
    }
},
insert_title = function() {
    if (input_title.value) {
		insertText("<h1 class='title_display'>" + input_title.value + "</h1>");
    } else {
        var rep = prompt("Quel est le nom de l'oeuvre ?");
		if (rep) {
			input_title.value = rep;
			insertText("<h1 class='title_display'>" + rep + "</h1>");
		}
    }
},
closeFile = function() {
    if (!isItEmpty()) {
        var r = confirm("Voulez-vous enregistrer votre fichier en cours avant de le fermer ?");
        if (r) saveFile(); clearAll();
    }
},
newFile = function() {
    if (!isItEmpty()) {
        var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en créer un nouveau ?");
        if (r) saveFile(); clearAll();
    }
},
saveFile = function() {
    if (isItEmpty()) {
        info("Rien à enregistrer !");
        return false
    }
    var perso_list = [];
    for (let i = 0; i < input_persos.length; i++) {
        perso_list.push(input_persos.options[i].text);
    }
    var entry = time() +
        ";" +
        input_title.value +
        ";" +
        input_author.value +
        "\n" +
        perso_list +
        "\n" +
        field_page.innerHTML,
		textToBLOB = new Blob([entry], { type: 'text/plain' }),
		sFileName = ((input_title.value !== "") ? (input_title.value.replace(/[\/:"~*?<>|]+/g, '').replace(/\s/g, "_")) : "Sans_titre") + '_' +
        time().replace(/([0-9]{4})\/([0-9]{2})\/([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g, "$1-$2-$3_$4h$5") + '.fmp',
		newLink = document.createElement("a");
    newLink.download = sFileName;
    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    } else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
    field_date.innerHTML = "Date du fichier : "+time();
},
openFile = function() {
	if (!isItEmpty()) {
        var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en ouvrir un nouveau ?");
        if (r) saveFile(); clearAll();
    }
	var getFile = function() {
		if (/.fmp$/.test(fichier.value)) {
			var reader, txt = "";
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				reader = new FileReader();
			} else {
				info('The File APIs are not fully supported by your browser. Fallback required.');
				return false;
			}
			if (this.files && this.files[0]) {
				reader.onload = function(e) {
					txt = e.target.result;
					var firstLine = txt.split('\n')[0],
						secondLine = txt.split('\n')[1],
						char_list = secondLine.split(';'),
						char_lgt = char_list.length;
				input_persos.size = char_lgt;
				for (let j = 0; j < char_lgt; j++) {
					var opt = document.createElement('option');
					opt.appendChild(document.createTextNode(char_list[j]));
					input_persos.appendChild(opt);
				}
				field_date.innerHTML = "Date du fichier : " + firstLine.split(';')[0];
				input_title.value = firstLine.split(';')[1];
				input_author.value = firstLine.split(';')[2];
				var newnew = txt.split('\n')
				newnew = newnew.splice(2, newnew.length).join("\n")
				document.getElementById('page').innerHTML = newnew;
				};
				reader.readAsText(this.files[0]);
			}
					document.body.removeChild(this);
		} else {
			info("Le fichier doit être au format .FMP")
		}
	},
	fichier = document.createElement('input');
    fichier.setAttribute('type', "file");
    fichier.setAttribute('id', "btnOpenFile");
    fichier.onchange = getFile;
    fichier.style.display = 'none';
    document.body.appendChild(fichier);
    fichier.click();
},
printFile = function() {
	var height = window.innerHeight,
		width = height*0.7,
		paper = window.open('_blank', 'PRINT', 'height='+height+',width='+width),
	    cssfile = elem_theme.href.replace(/.+\/([a-z_]+.css$)/,"$1");
    paper.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>' 
	+ input_title 
	+ '</title><link rel="stylesheet" href="' 
	+ 'https://ann-mb.github.io/Format-my-Play/' + cssfile
	+ '" type="text/css"  /></head><body style="padding:1.5cm">' 
	+ field_page.innerHTML 
	+ '</body></html>');
    paper.document.close(); 
    paper.focus();
    paper.print();
    return true;
};

input_persos.addEventListener("change",function(){ current_char = 0 },false);

window.addEventListener("load", clearAll, field_page.focus(), setSelection());

window.addEventListener("beforeunload", function(e) {
    if (!isItEmpty()) {
        var a = "Vous vous apprêtez à quitter cette page alors qu'un travail est en cours, voulez-vous le sauvegarder ?";
        e.returnValue = a;
        return a;
    }
});

field_page.addEventListener("keyup", setSelection, false);

input_replique.addEventListener("keypress", function(e) {
    if (e.keyCode == 13 && e.shiftKey) {
        e.preventDefault();
		addLine();
    }
}, false);

document.addEventListener("keyup", function(){
	var par = caretParent();
	if (par.className == "perso" && /\([a-z]+\)$/.test(par.innerHTML)) {
		par.className = "perso-d";
		par.innerHTML = par.innerHTML.replace(/ \(/,"<span class='didas'>").replace(/\)/,"</span>");
		selectAll(par.nextElementSibling)
	}
}, false);

var whichChar = function(dir) {
	var lgt = getSelectCharacters().length;
	"up" == dir && (0 == current_char ? current_char = lgt - 1 : current_char--);
	"down" == dir && (current_char == lgt - 1 ? current_char = 0 : current_char++);
	caretParent().innerHTML = getSelectCharacters()[current_char].text
	selectAll(caretParent())
}

document.addEventListener("keydown", function(e) {
	var par = caretParent();
	if (!e.shiftKey && 13 == e.keyCode)	CMD("DefaultParagraphSeparator","br");
	if (e.shiftKey && 13 == e.keyCode) e.preventDefault(), addLineDirect();  
	if (9 == e.keyCode && par.className == "perso") {
		e.preventDefault();
		selectAll(par.nextElementSibling);
	} else if (9 == e.keyCode) {
		e.preventDefault();
	}
	if ("perso" == par.className && 0 < getSelectCharacters().length) {
	
		if (38 == e.keyCode) e.preventDefault(), whichChar('up');
		if (40 == e.keyCode) e.preventDefault(), whichChar('down');
			
		
	}
}, false);

document.getElementById("btnOpenFile").addEventListener("click", openFile, false);

document.addEventListener("click", function(e) {
	var f = e.target;
	switch (f.id) {
		case "btnNewFile" : newFile(); break;
		//case "btnOpenFile" : openFile(); break;
		case "btnSaveFile" : saveFile(); break;
		case "btnCloseFile" : closeFile(); break;
		case "btnPrintFile" : printFile(); break;
		case "btnAddPerso" : character_add(); break;
		case "btnRemovePerso" : character_remove(); break;
		case "btnClearPerso" : character_clear(); break;
		case "btnInsCharList" : insert_charlist(); break;
		case "btnInsAct" : insert_act(); break;
		case "btnInsScene" : insert_scene(); break;
		case "btnInsTitle" : insert_title(); break;
		case "btnInsDidas" : insert_didas(); break;
		case "btnMepInline" : elem_theme.href = "mep_inline.css"; break;
		case "btnMepClassic" : elem_theme.href = "mep_classic.css"; break;
		case "btnMepScreenplay" : elem_theme.href = "mep_screenplay.css"; break;
		case "btnAddText" : addLine(); break;
		case "btnFullscreen" : goFullScreen(); break;
		case "checkbox_didasc" : if (checkbox_didasc.checked) input_replique.select(); break;
		case "status" : field_status.style.opacity = 0; break;
		case "bold" : CMD("bold"); break;
		case "italic" : CMD("italic"); break;
		case "underline" : CMD("underline"); break;
		case "strikeThrough" : CMD("strikeThrough"); break;
		case "insertHorizontalRule" : CMD("insertHorizontalRule"); break;
		case "justifyLeft" : CMD("justifyLeft"); break;
		case "justifyCenter" : CMD("justifyCenter"); break;
		case "justifyRight" : CMD("justifyRight"); break;
		case "formatBlock" : CMD("formatBlock"); break;
		case "indent" : CMD("indent"); break;
		case "outdent" : CMD("outdent"); break;
		case "undo" : CMD("undo"); break;
		case "redo" : CMD("redo"); break;
		case "removeFormat" : CMD("removeFormat"); break;
		default : console.log(f);
	}
	if (f.closest("#page")) setSelection();
	e.stopPropagation();
},false);
