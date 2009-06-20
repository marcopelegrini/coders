//Make sure we load settings
window.addEventListener('load', creditCardGeneratorOnLoad, false);

function creditCardGeneratorOnLoad() {
	var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	// Get the "creditCardGenerator." branch
	var prefs = prefsService.getBranch("creditCardGenerator.");

	try {
		//document.getElementById("creditCardGenerator-check").checked = prefs.getBoolPref('pontuacao');
		
		//Set default card
		var ndx = prefs.getIntPref("defaultCard");
		document.getElementById("creditCardGeneratorDefault").selectedIndex = ndx;

		document.getElementById("creditCardGenerator-check_icone").checked = prefs.getBoolPref('mostraIconeBarraStatus');
	} catch (e) {
		//document.getElementById("creditCardGenerator-check").checked = false;
		document.getElementById("creditCardGenerator-check_icone").checked = false;
	}
}

function creditCardGeneratorAccept() {
	var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	// Get the "creditCardGenerator." branch
	var prefs = prefsService.getBranch("creditCardGenerator.");

	try {
		//prefs.setBoolPref('pontuacao', document.getElementById("creditCardGenerator-check").checked);

		//Write default card
		prefs.setIntPref("defaultCard", document.getElementById("creditCardGeneratorDefault").selectedIndex);
		//Write icon status
		prefs.setBoolPref('mostraIconeBarraStatus', document.getElementById("creditCardGenerator-check_icone").checked);
		
		//Update icon browser
		opener.document.getElementById('creditCardGenerator_statusbar_panel').style.visibility = document.getElementById("creditCardGenerator-check_icone").checked ? "visible" : "collapse";
		opener.document.getElementById('creditCardGenerator_statusbar_panel').setAttribute("status",document.getElementById("creditCardGenerator-check_icone").checked ? "1" : "0");
	} catch (e) {
		var alertText = "Erro ao gravar opções.";
		alert(alertText + e);
	}
}