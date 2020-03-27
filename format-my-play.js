const w = document.getElementById("replik"),
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
			sel = x,
			opt = document.createElement('option');
		opt.appendChild( document.createTextNode(rep) );
		sel.appendChild(opt);
		
	},false);

	document.getElementById("remove_perso").addEventListener("click", function(){ 
	
		x.remove(x.selectedIndex); 
		
	},false);
	


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
	
	document.getElementById('btnOpen').addEventListener("click", function(){
		openFile(function(txt){
			document.getElementById('page').innerHTML = txt; 
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
	
	function saveFile() {
        const textToBLOB = new Blob([y.innerHTML], { type: 'text/plain' });
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