const 		w = document.getElementById("replik"),
		  x = document.getElementById("persos"),
		  y = document.getElementById("page"),
		  z = document.getElementById("didasc");
	
	function d_toggle(a) {
		if (a.value == "") {
			a.value = a.defaultValue;
			a.style.color = "#888";
		} else if (a.value == a.defaultValue){
			a.value = "";
			a.style.color = "#000";
		} else {
			a.style.color = "#000";
			a.select();
		}
	}
	function didascalie() {
		var ladidas = z.value;
		if (ladidas !== "") {
			return "<span class='didas'>("+ z.value+")</span> "
		} else {
			return ""
		}
	}
	x.addEventListener("change",function(){	z.focus() },false);
	z.addEventListener("focus",function(){ d_toggle(this) },false);
	z.addEventListener("blur",function(){ d_toggle(this) },false);
	w.addEventListener("focus",function(){ d_toggle(this) },false);
	w.addEventListener("blur",function(){ d_toggle(this) },false);
	document.getElementById("btnSave").addEventListener("click", function(){ saveFile()	},false);
	
	document.getElementById("add_perso").addEventListener("click", function(){ 
	
		var rep = prompt("Comment s'appelle votre personnage ?"),
			opt = document.createElement('option');
		opt.appendChild(document.createTextNode(rep));
		if (rep) {
			x.appendChild(opt);x.size = x.size + 1
		}
		
		
	},false);

	document.getElementById("remove_perso").addEventListener("click", function(){ 
	
		x.remove(x.selectedIndex);
		x.size = x.size - 1
		
	},false);
	

	/* AJOUTER REPLIQUE */
	document.getElementById("add").addEventListener("click",function(){		
		y.innerHTML = y.innerHTML
		+ "<div class='line'><span class='perso'>"
		+ x.options[x.selectedIndex].text
		+ "</span>. "  
		+ didascalie()
		+ "– <span class='repliq'> "
		+ document.getElementById("replik").value
		+ "</span></div>";
		
		document.getElementById("didasc").value = '';
		document.getElementById("replik").value ='';
		
		x.focus();
	
	},false);
	
	/* OUVRIR FICHIER et RECUP DONNEES */
	document.getElementById('btnOpen').addEventListener("click", function(){
		openFile(function(txt){
			var firstLine = txt.split('\n')[0],
				char_list = firstLine.split(','),
				char_lgt = char_list.length;
			x.size = char_lgt;
			
			for (let j = 0 ; j < char_lgt ; j++) {		
				var opt = document.createElement('option');
				opt.appendChild(document.createTextNode(char_list[j]));
				x.appendChild(opt);
			}
			document.getElementById('page').innerHTML = txt.split('\n')[1];
		});
	},false);
	
	function openFile(callBack){
	  var element = document.createElement('input');
	  element.setAttribute('type', "file");
	  element.setAttribute('id', "btnOpenFile");
	  element.onchange = function(){
		  readText(this,callBack);
		  document.body.removeChild(this);
	  }
	  element.style.display = 'none';
	  document.body.appendChild(element);
	  element.click();
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
	
	/* SAUVER FICHIER */
	function saveFile() {
		
		var perso_list = [];
		
		for (let i = 0 ; i < x.length ; i++) {
			perso_list.push(x.options[i].text);
		}
		
		var entry = perso_list +"\n"+ y.innerHTML
		
        const textToBLOB = new Blob([entry], { type: 'text/plain' });
        const sFileName = 'new_Theatre.txt';
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
    }