const 	input_replique = document.getElementById("replik"),
		input_persos = document.getElementById("persos"),
		input_didascalie = document.getElementById("didasc"),
		input_date = document.getElementById("input_date"),
		input_author = document.getElementById("input_author"),
		input_title = document.getElementById("input_title"),
		field_page = document.getElementById("page"),
		field_tdm = document.getElementById("tdm");
	
	function time() {
		var today = new Date(),
			date = [today.getFullYear(), ('0' + (today.getMonth() + 1)).slice(-2), ('0' + today.getDate()).slice(-2)].join('/'),
			time = [('0' + today.getHours()).slice(-2),('0' + today.getMinutes()).slice(-2), ('0' + today.getSeconds()).slice(-2)].join(':')
			dateTime = date+' '+time;
		return dateTime;
	}
	function didascalie() {
		var ladidas = input_didascalie.value;
		if (ladidas !== "") {
			return "<span class='didas'>("+ input_didascalie.value+")</span> "
		} else {
			return ""
		}
	}
	function getSelectCharacters() {
		var result = [],
			options = input_persos && input_persos.options,
			opt;

		for (let i = 0, iLen = options.length ; i < iLen ; i++) {
			opt = options[i];
			if (opt.selected) {
				result.push(opt);
			}
		}
		return result;
	}
	function addText() {
		if (input_persos.length == 0) { alert("Créez d'abord un personnage puis sélectionnez-le dans la liste") }
		else if (input_persos.selectedIndex == -1) { alert("Sélectionnez d'abord le personnage qui s'exprime") }
		else if (input_replique.value == "") { alert("Vous n'avez pas entré de texte à ajouter") }
		else {
			field_page.innerHTML = field_page.innerHTML
			+ "<div class='line'><span class='perso'>"
			+ input_persos.options[input_persos.selectedIndex].text
			+ "</span>. "  
			+ didascalie()
			+ "– <span class='repliq'> "
			+ input_replique.value.replace(/\r\n|\r|\n/g,"<br />").replace("{","<span class='didas'>(").replace("}",")</span>")
			+ "</span></div>";
		
			input_didascalie.value = '';
			input_replique.value ='';
			input_persos.selectedIndex = -1;
			input_persos.focus();
		}
		/*
		if (nbl > 1) {
				for (let k = 0 ; k < nbl ; k++) {
					console.log(nb[k].innerText)
				}
			} else if (nbl == 1) {
				console.log(input_persos.options[input_persos.selectedIndex].text)
			} else {
				alert("Vous n'avez pas sélectionné de personnage à supprimer")
			}*/

	}
	function insert_charlist() {
		if (input_persos.selectedIndex == -1) {
			alert("Vous n'avez pas sélectionné de personnage dans la liste de gauche")
		} else {
			var chars = getSelectCharacters(),
				lst = [];
			for (let i = 0; i < chars.length ; i++) {
				lst.push(" "+chars[i].text)
			}
			field_page.innerHTML = field_page.innerHTML + "<div class='char_display'>"+lst+".</div>"
		}
	}
	function insert_act(){
		var rep = prompt("Quel est le numéro de l'acte ?");
		if (/^([0-9]+|[MCDVLXI]+)$/.test(rep)) {
			field_page.innerHTML = field_page.innerHTML + "<h2 class='act_display'>Acte "+rep+"</h2>"
		} else {
			alert("Seuls les caractères suivants sont autorisés :\n0 1 2 3 4 5 6 7 8 9 M D C L X V I\nUtilisez soit des chiffres romains, soit des chiffres arabes.")
		}
	}
	function insert_scene(){
		var rep = prompt("Quel est le numéro de la scène ?");
		if (/^[0-9]+$/.test(rep)){
			field_page.innerHTML = field_page.innerHTML + "<h3 class='scene_display'>Scène "+rep+"</h3>"
		} else {
			alert("Merci d'entrer uniquement des chiffres arabes (0 - 9).")
		}
	}
	function insert_title(){
		var t = input_title.value
		if (t) {
			field_page.innerHTML = field_page.innerHTML + "<h1 class='title_display'>"+t+"</h1>"
		} else {
			alert("Veuillez entrer le titre de l'œuvre dans le menu de droite d'abord")
		}
	}
	function insert_didas(){
		
	}
/*** FONCTIONS MENU PERSONNAGES ***************************************/	
	function add_character() {
		var rep = prompt("Comment s'appelle votre personnage ?"),
			opt = document.createElement('option');
		opt.appendChild(document.createTextNode(rep));
		if (rep) {
			input_persos.appendChild(opt);
			if (input_persos.options.length > 8) input_persos.size = input_persos.options.length;
		}	
	}
	function remove_character() {
		var nb = getSelectCharacters(),
			nbl = nb.length;

		if (input_persos.length == 0) {
			alert('Aucun personnage à supprimer dans la liste !')
		} else if (nbl > 1) {
			for (let k = 0 ; k < nbl ; k++) {
				nb[k].remove();
			}
		} else if (nbl == 1) {
			input_persos.options[input_persos.selectedIndex].remove();
		} else {
			alert("Vous n'avez pas sélectionné de personnage à supprimer")
		}
	}
	function clear_charlist() {
		if (input_persos.length == 0) {
			alert('Aucun personnage à supprimer.')
		} else {
			var r = confirm("Êtes-vous certain·e de vouloir supprimer tous les personnages ?");
			if (r) input_persos.options.length = 0;
		}
	}
	function isItEmpty() {
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
/*** FONCTIONS MENU "FICHIER" ***************************************/
	function clearAll() {
		input_date.value = input_title.value = input_author.value = field_page.innerHTML = input_didascalie.value = input_replique.value = "";					
		input_persos.length = 0;
		input_persos.size = 8;
	}
	function closeFile() {
		if (!isItEmpty()) {
			var r = confirm("Voulez-vous enregistrer votre fichier en cours avant de le fermer ?");
			if (r) { saveFile() }
			clearAll()
		}
	}
	function newFile(){ 
		if (!isItEmpty()) {
			var r = confirm("Voulez-vous enregistrer votre fichier en cours avant d'en créer un nouveau ?");
			if (r) { saveFile() }
			clearAll()
		}
	}
	function saveFile() {
		if (isItEmpty()) {
			alert("Rien à enregistrer !");
			return false
		}
		var perso_list = [];
		for (let i = 0 ; i < input_persos.length ; i++) {
			perso_list.push(input_persos.options[i].text);
		}
		var entry = time()
					+";"
					+ input_title.value
					+";"
					+ input_author.value
					+"\n"
					+ perso_list
					+"\n"
					+ field_page.innerHTML
        var textToBLOB = new Blob([entry], { type: 'text/plain' });
        var sFileName = input_title.value.replace(/[\/:"~*?<>|]+/g,'').replace(/\s/g,"_")
		+'_'
		+time().replace(/([0-9]{4})\/([0-9]{2})\/([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g,"$1-$2-$3_$4h$5")
		+'.fmp';
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
		input_date.value = time();
    }

	function openAFile() {
		openFile(function(txt){
		var firstLine = txt.split('\n')[0],
			secondLine = txt.split('\n')[1],
			char_list = secondLine.split(';'),
			char_lgt = char_list.length;
		input_persos.size = char_lgt;
		
		for (let j = 0 ; j < char_lgt ; j++) {		
			var opt = document.createElement('option');
			opt.appendChild(document.createTextNode(char_list[j]));
			input_persos.appendChild(opt);
		}
		input_date.value = firstLine.split(';')[0];
		input_title.value = firstLine.split(';')[1];
		input_author.value = firstLine.split(';')[2];
		
		var newnew = txt.split('\n')
		newnew = newnew.splice(2,newnew.length).join("\n")
		document.getElementById('page').innerHTML = newnew;
		
		});
	}
	function openFile(callBack){
	  var fichier = document.createElement('input');
	  fichier.setAttribute('type', "file");
	  fichier.setAttribute('id', "btnOpenFile");
	  fichier.onchange = function(){
		  if (/.fmp$/.test(fichier.value)) {
		  readText(this,callBack);
		  document.body.removeChild(this);
		  } else {
			alert("Le fichier doit être au format .FMP")  
		  }
	  }
	  fichier.style.display = 'none';
	  document.body.appendChild(fichier);
	  fichier.click();
	}
		
	function readText(filePath,callBack) {
		var reader;
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			reader = new FileReader();
		} else {
			alert('The File APIs are not fully supported by your browser. Fallback required.');
			return false;
		}
		var output = "";
		if(filePath.files && filePath.files[0]) {           
			reader.onload = function (e) {
				output = e.target.result;
				callBack(output);
			};
			reader.readAsText(filePath.files[0]);
		}     
		return true;
	}
/*** BOUTONS EVENEMENTS ***************************************/
	
document.getElementById("btnNewFile").addEventListener("click", function(){ newFile() },false);
document.getElementById("btnOpenFile").addEventListener("click", function(){ openAFile() },false);
document.getElementById("btnSaveFile").addEventListener("click", function(){ saveFile()	},false);
document.getElementById("btnCloseFile").addEventListener("click", function(){ closeFile() },false);
document.getElementById("btnAddPerso").addEventListener("click", function(){ add_character() },false);
document.getElementById("btnRemovePerso").addEventListener("click", function(){ remove_character() },false);
document.getElementById("btnClearPerso").addEventListener("click", function(){ clear_charlist() },false);
document.getElementById("btnInsCharList").addEventListener("click",function(){ insert_charlist() },false);
document.getElementById("btnInsAct").addEventListener("click",function(){ insert_act() },false);
document.getElementById("btnInsScene").addEventListener("click",function(){ insert_scene() },false);
document.getElementById("btnInsTitle").addEventListener("click",function(){ insert_title() },false);
document.getElementById("btnInsDidas").addEventListener("click",function(){ insert_didas() },false);
document.getElementById("btnAddText").addEventListener("click",function(){ addText() },false);
document.getElementById("replik").addEventListener("keypress",function(evt){
	if (evt.keyCode == 13 && evt.shiftKey) {
		addText()
	}
},false)

