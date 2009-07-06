function gercpfcnpjInit()
{
  var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  var prefs = prefsService.getBranch("gercpfcnpj.");
  
  try
  {
      document.getElementById("gercpfcnpjPontuation").checked = prefs.getBoolPref('pontuacao');
      document.getElementById("gercpfcnpjStatusBarIcon").checked = prefs.getBoolPref('mostraIconeBarraStatus');
  }
  catch (e)
  {
      document.getElementById("gercpfcnpjPontuation").checked = false;
      document.getElementById("gercpfcnpjStatusBarIcon").checked = false;
  }           
}

function gercpfcnpjAccept()
{
  var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  var prefs = prefsService.getBranch("gercpfcnpj.");
  
  try
  {
    prefs.setBoolPref('pontuacao', document.getElementById("gercpfcnpjPontuation").checked );
    prefs.setBoolPref('mostraIconeBarraStatus', document.getElementById("gercpfcnpjStatusBarIcon").checked );
    //atualizar browser
   
    var windowMediator =
        Components.classes["@mozilla.org/appshell/window-mediator;1"]
        .getService(Components.interfaces.nsIWindowMediator);
    var browserEnumerator = windowMediator.getEnumerator("navigator:browser");
    var doc = browserEnumerator.getNext().document;

    doc.getElementById('cpfcnpj_statusbar_panel').style.display = document.getElementById("gercpfcnpjStatusBarIcon").checked ? null : "none";
    doc.getElementById('cpfcnpj_statusbar_panel').setAttribute("status", document.getElementById("gercpfcnpjStatusBarIcon").checked ? "1" : "0");
  }
  catch (e)
  {
      var alertText = "Erro ao gravar op\xE7\xF5es.";
      alert(alertText + e);
  }
}