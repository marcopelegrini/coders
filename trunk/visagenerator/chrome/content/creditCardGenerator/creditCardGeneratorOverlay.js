var gRFPrefsService = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService);
var gRFPrefs = gRFPrefsService.getBranch("creditCardGenerator."); // Get the "creditCardGenerator." branch

var pontuado = true;
var mostraIconeBarraStatus = true;

window.addEventListener("load", function() {
	carregaPrefs();
}, true);

// Função para carregar as preferências
function carregaPrefs() {
	var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	// Get the "creditCardGenerator." branch
	var prefs = prefsService.getBranch("creditCardGenerator."); 

	try {
		pontuado = prefs.getBoolPref('pontuacao');
		mostraIconeBarraStatus = prefs.getBoolPref('mostraIconeBarraStatus');
		document.getElementById('creditCardGenerator_statusbar_panel').style.visibility = mostraIconeBarraStatus ? "visible" : "collapse";
		document.getElementById('creditCardGenerator_statusbar_panel').setAttribute("status", mostraIconeBarraStatus ? "1" : "0");
	} catch (e) {
		pontuado = false;
		mostraIconeBarraStatus = false;
	}
}

function setClipboardContents(copytext){
	try
	{
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		if (!str) {
			return false;
		}
		str.data = copytext;
		var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
		if (!trans) {
			return false;
		}

		trans.addDataFlavor("text/unicode");
		trans.setTransferData("text/unicode",str,copytext.length * 2);

		var clipid = Components.interfaces.nsIClipboard;
		var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
		if (!clip) {
			return false;
		}
		clip.setData(trans,null,clipid.kGlobalClipboard);
		return true;
	}
	catch(e)
	{
		return false;
	}
}

function mostraDefault() {
	var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	// Get the "creditCardGenerator." branch
	var prefs = prefsService.getBranch("creditCardGenerator.");
	var ndx = prefs.getIntPref("defaultCard");
	switch(ndx)
	{
	case 1:
	  mostraMaster();
	  break;
	case 2:
	  mostraAmex();
	  break;
	case 3:
	  mostraDiners();
	  break;
	default:
	  mostraVisa();
	}
}

function mostraVisa() {
	generateCreditCard(visaPrefixList, "VISA");
}

function mostraMaster() {
	generateCreditCard(mastercardPrefixList, "Master Card");
}

function mostraAmex() {
	generateCreditCard(amexPrefixList, "American Express");
}

function mostraDiners() {
	generateCreditCard(dinersPrefixList, "Diners");
}

function generateCreditCard(prefixList, cardName) {
	var sCC = credit_card_number(prefixList, 16, 1);
	var theBox = document.commandDispatcher.focusedElement;
	if (theBox) {
		theBox.value = sCC[0];
	}
	else 
	{
		setClipboardContents(sCC[0]);
		alert("Cartão de Crédito " + cardName + " gerado: " + sCC[0] + "\n\nAgora basta colar onde quiser.");
	}
}