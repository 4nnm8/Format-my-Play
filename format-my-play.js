var $ = function(a) {
    var b = [];

    function Reach(elements) {
        if (typeof a == "string") {
            b.length = elements.length;
            for (var i = 0; i < b.length; i++) {
                b[i] = elements[i];
            }
        } else {
            b.push(elements);
        }
    }
    Reach.prototype.on = function(evt, fn) {
        for (var i = 0; i < b.length; i++) {
            if (b[i].addEventListener) {
                b[i].addEventListener(evt, fn, false);
            } else if (b[i].attachEvent) {
                b[i].attachEvent('on' + evt, fn);
            } else {
                return false;
            }
        }
    };
    return (typeof a == "string") ? new Reach(document.querySelectorAll(a)) : new Reach(a);
};

const input_replique = document.getElementById("replik"),
    input_persos = document.getElementById("persos"),
    input_didascalie = document.getElementById("didasc"),
    field_date = document.getElementById("field_date"),
    input_author = document.getElementById("input_author"),
    input_title = document.getElementById("input_title"),
    field_page = document.getElementById("page"),
    field_tdm = document.getElementById("tdm"),
    field_status = document.getElementById("status"),
	elem_theme = document.getElementById("theme");


var changeMep = function(x) {
    elem_theme.href = x + ".css"
}


/*** INFO / ALERT ***/
var info = function(texte) {
    field_status.innerHTML = texte;
    field_status.style.display = "block";
    setTimeout(function() {
        field_status.style.opacity = 1
    }, 0);

}
field_status.addEventListener("click", function() {
    field_status.style.opacity = 0;
    setTimeout(function() {
        field_status.style.display = "none"
    }, 500);
});

/*** INFO / ALERT ***/

var printFile = function() {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + input_title + '</title>');
    mywindow.document.write("<link rel=\"stylesheet\" href=\""+ elem_theme.href +"\" type=\"text/css\" media=\"print\"/>");
    mywindow.document.write('</head><body class="print">');
    mywindow.document.write(field_page.innerHTML);
    mywindow.document.write('</body></html>');
    /*mywindow.document.close(); 
    mywindow.focus();
    mywindow.print();
    mywindow.close();*/
    return true;
}

var time = function() {
    var today = new Date(),
        date = [today.getFullYear(), ('0' + (today.getMonth() + 1)).slice(-2), ('0' + today.getDate()).slice(-2)].join('/'),
        time = [('0' + today.getHours()).slice(-2), ('0' + today.getMinutes()).slice(-2), ('0' + today.getSeconds()).slice(-2)].join(':')
    dateTime = date + ' ' + time;
    return dateTime;
}

var getSelectCharacters = function() {
    var result = [],
        options = input_persos && input_persos.options,
        opt;

    for (let i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];
        if (opt.selected) {
            result.push(opt);
        }
    }
    return result;
}
var pasteHtmlAtCaret = function(html) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();

        let target = sel.getRangeAt(0).commonAncestorContainer,
            tarparent = (target.nodeType === 1) ? target : target.parentNode;

        if (/perso|line|repliq/.test(tarparent.className)) {

        }

        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(),
                node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        document.selection.createRange().pasteHTML(html);
    }
}
var addText = function() {
	function clean() {
		input_didascalie.value = '';
        input_replique.value = '';
        input_persos.selectedIndex = -1;
        input_persos.focus();
	}
    if (input_persos.length == 0) {
        info("Créez d'abord un personnage puis sélectionnez-le dans la liste")
    } else if (input_persos.selectedIndex == -1) {
        info("Sélectionnez d'abord le personnage qui s'exprime")
    } else if (input_replique.value == "") {
        info("Vous n'avez pas entré de texte à ajouter")
    } else if (input_didascalie.value) {
        field_page.innerHTML = field_page.innerHTML +
            "<div class='line'><span class='perso-d'>" +
            input_persos.options[input_persos.selectedIndex].text +
            "<span class='didas'>" +
            input_didascalie.value +
            "</span></span> <span class='repliq'>" +
            input_replique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class='didas'>(").replace("}", ")</span>") +
            "</span></div>";
		clean();	
    } else {
		field_page.innerHTML = field_page.innerHTML +
            "<div class='line'><span class='perso'>" +
            input_persos.options[input_persos.selectedIndex].text +
            "</span><span class='repliq'>" +
            input_replique.value.replace(/\r\n|\r|\n/g, "<br />").replace("{", "<span class='didas'>(").replace("}", ")</span>") +
            "</span></div>";
		clean();
	}
    /*
    if (nbl > 1) {
    		for (let k = 0 ; k < nbl ; k++) {
    			console.log(nb[k].innerText)
    		}
    	} else if (nbl == 1) {
    		console.log(input_persos.options[input_persos.selectedIndex].text)
    	} else {
    		info("Vous n'avez pas sélectionné de personnage à supprimer")
    	}
    */

}

/******************************** FONCTIONS MENU INSÉRER ********************************/

var insert_charlist = function() {
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
        field_page.innerHTML = field_page.innerHTML + "<div class='char_display'>" + lst + ".</div>"
    }
}
var insert_act = function() {
    var rep = prompt("Quel est le numéro de l'acte ?");
    if (/^([0-9]+|[MCDVLXI]+)$/.test(rep)) {
        field_page.innerHTML = field_page.innerHTML + "<h2 class='act_display'>Acte " + rep + "</h2>"
    } else if (rep) {
        info("Seuls les caractères suivants sont autorisés :<br/><br/>0 1 2 3 4 5 6 7 8 9 M D C L X V I")
    }
}
var insert_scene = function() {
    var rep = prompt("Quel est le numéro de la scène ?");
    if (/^[0-9]+$/.test(rep)) {
        field_page.innerHTML = field_page.innerHTML + "<h3 class='scene_display'>Scène " + rep + "</h3>"
    } else if (rep) {
        info("Merci d'entrer uniquement des chiffres arabes (0 - 9).")
    }
}
var insert_title = function() {
    var t = input_title.value
    if (t) {
        field_page.innerHTML = field_page.innerHTML + "<h1 class='title_display'>" + t + "</h1>"
    } else {
        info("Veuillez entrer le titre de l'œuvre dans le menu de droite d'abord")
        input_title.focus();
    }
}

/******************************** FONCTIONS MENU PERSONNAGES ********************************/

var character_add = function() {
    var rep = prompt("Comment s'appelle votre personnage ?"),
        opt = document.createElement('option');
    opt.appendChild(document.createTextNode(rep));
    if (rep) {
        input_persos.appendChild(opt);
        if (input_persos.options.length > 8) input_persos.size = input_persos.options.length;
    }
}

var character_remove = function() {
    var nb = getSelectCharacters(),
        nbl = nb.length;

    if (input_persos.length == 0) {
        info('Aucun personnage à supprimer dans la liste !')
    } else if (nbl > 1) {
        for (let k = 0; k < nbl; k++) {
            nb[k].remove();
        }
    } else if (nbl == 1) {
        input_persos.options[input_persos.selectedIndex].remove();
    } else {
        info("Vous n'avez pas sélectionné de personnage à supprimer")
    }
}

var character_clear = function() {
    if (input_persos.length == 0) {
        info('Aucun personnage à supprimer.')
    } else {
        var r = confirm("Êtes-vous certain·e de vouloir supprimer tous les personnages ?");
        if (r) input_persos.options.length = 0;
    }
}

/******************************** FONCTIONS MENU "FICHIER" ********************************/

var isItEmpty = function() {
    var one = field_page.textContent.trim(),
        two = input_persos.length > 0,
        thr = input_author.value,
        fou = input_title.value;
    if (one || two || thr || fou) {
        return false
    } else {
        return true
    }
}
var clearAll = function() {
    field_date.innerHTML = input_title.value = input_author.value = field_page.innerHTML = input_didascalie.value = input_replique.value = "";
    input_persos.length = 0;
    input_persos.size = 8;
}
var closeFile = function() {
    if (!isItEmpty()) {
        var r = confirm("Voulez-vous enregistrer votre fichier en cours avant de le fermer ?");
        if (r) {
            saveFile()
        }
        clearAll()
    }
}
var newFile = function() {
    if (!isItEmpty()) {
        var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en créer un nouveau ?");
        if (r) {
            saveFile()
        }
        clearAll()
    }
}
var saveFile = function() {
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
        field_page.innerHTML
    var textToBLOB = new Blob([entry], {
        type: 'text/plain'
    });
    var sFileName = input_title.value.replace(/[\/:"~*?<>|]+/g, '').replace(/\s/g, "_") +
        '_' +
        time().replace(/([0-9]{4})\/([0-9]{2})\/([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g, "$1-$2-$3_$4h$5") +
        '.fmp';
    let newLink = document.createElement("a");
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
}

var openAFile = function() {
    if (!isItEmpty()) {
        var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en créer un nouveau ?");
        if (r) {
            saveFile()
        }
        clearAll()
    }
    openFile(function(txt) {
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
    });
}
var openFile = function(callBack) {
    var fichier = document.createElement('input');
    fichier.setAttribute('type', "file");
    fichier.setAttribute('id', "btnOpenFile");
    fichier.onchange = function() {
        if (/.fmp$/.test(fichier.value)) {
            readText(this, callBack);
            document.body.removeChild(this);
        } else {
            info("Le fichier doit être au format .FMP")
        }
    }
    fichier.style.display = 'none';
    document.body.appendChild(fichier);
    fichier.click();
}

function readText(filePath, callBack) {
    var reader;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
    } else {
        info('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
    var output = "";
    if (filePath.files && filePath.files[0]) {
        reader.onload = function(e) {
            output = e.target.result;
            callBack(output);
        };
        reader.readAsText(filePath.files[0]);
    }
    return true;
}

/******************************** EVENT LISTENERS ********************************/
var previous_target;


var okay = /didas|line|repliq|perso|((title|act|scene|char)_display)/


document.addEventListener("click", function(e) {
    let new_targ = e.target;
    console.log(new_targ);

    if (previous_target && new_targ.id == "page") {
        previous_target.style.border = "0"
    }

    if (okay.test(new_targ.className)) {
        if (previous_target && previous_target != new_targ) {
            previous_target.style.border = "0"
        }
        new_targ.style.border = "1px dashed #999"
        previous_target = new_targ
    }
});

input_replique.addEventListener("keypress", function(evt) {
    if (evt.keyCode == 13 && evt.shiftKey) {
        addText()
    }
}, false);

field_page.addEventListener("keypress", function(evt) {
    var texte = "<div class='line'><span class='perso'>Personnage.</span> – <span class='repliq'>Texte de réplique.</span></div>";
    if (evt.keyCode == 13 && evt.shiftKey) {
        pasteHtmlAtCaret(texte)
        evt.preventDefault();
    }
}, false);

window.addEventListener("beforeunload", function(e) {
    if (!isItEmpty()) {
        var a = "Vous vous apprêtez à quitter cette page alors qu'un travail est en cours, voulez-vous le sauvegarder ?";
        e.returnValue = a;
        return a;
    }

});
window.addEventListener("load", clearAll);

const editor = document.getElementById('wysiwyg'),
    buttons = editor.querySelectorAll('button');

for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener('click', function(e) {
        let action = this.dataset.action;
        document.execCommand(action, false);
    });
}

$("#btnNewFile").on("click", newFile);
$("#btnOpenFile").on("click", openAFile);
$("#btnSaveFile").on("click", saveFile);
$("#btnCloseFile").on("click", closeFile);
$("#btnPrintFile").on("click", printFile);
$("#btnAddPerso").on("click", character_add);
$("#btnRemovePerso").on("click", character_remove);
$("#btnClearPerso").on("click", character_clear);
$("#btnInsCharList").on("click", insert_charlist);
$("#btnInsAct").on("click", insert_act);
$("#btnInsScene").on("click", insert_scene);
$("#btnInsTitle").on("click", insert_title);
$("#btnMepInline").on("click", function() {
    changeMep("mep_inline")
});
$("#btnMepClassic").on("click", function() {
    changeMep("mep_classic")
});
$("#btnMepScreenplay").on("click", function() {
    changeMep("mep_screenplay")
});
//*$("#btnInsDidas").on("click", insert_didas);
$("#btnAddText").on("click", addText);