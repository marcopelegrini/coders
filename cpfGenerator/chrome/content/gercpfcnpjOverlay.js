var gRFPrefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
var gRFPrefs = gRFPrefsService.getBranch("gercpfcnpj."); // Get the "gercpfcnpj." branch

// *************************************************
// Script Gerador de CPF e CNPJ Válidos
// Autor: Carlos Eugênio Torres
// Email: carloseugeniotorres@gmail.com
// Website: http://www.carloseugeniotorres.com
// Data 1a. versão: 13/01/2003
// Data última atualização: 26/07/2008
// *************************************************
// Proibida a cópia de qualquer parte deste
// script sem manter este aviso e os dados
// do autor. Use com responsabilidade.
// *************************************************

// Variável global para dizer se o CPF/CNPJ será pontuado ou não
var pontuado = true;
// Variável global para dizer se mostra ou não o ícone na barra de status
var mostraIconeBarraStatus = true;

window.addEventListener("load",function() {carregaPrefs();} ,true);

// Função para carregar as preferências
function carregaPrefs()
{
	var prefsService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefsService.getBranch("gercpfcnpj."); // Get the "gercpfcnpj." branch
  
	try
	{
		pontuado = prefs.getBoolPref('pontuacao');
		mostraIconeBarraStatus = prefs.getBoolPref('mostraIconeBarraStatus');
		document.getElementById('cpfcnpj_statusbar_panel').style.visibility = mostraIconeBarraStatus ? "visible" : "collapse";
		document.getElementById('cpfcnpj_statusbar_panel').setAttribute("status", mostraIconeBarraStatus ? "1" : "0");		
	}
	catch (e)
	{
		pontuado = false;
		mostraIconeBarraStatus = false;
	}    
}

// Função para gerar números randômicos
function gera_random(n)
{
    var ranNum = Math.round(Math.random()*n);
    return ranNum;
}

// Função para retornar o resto da divisao entre números (mod)
function mod(dividendo,divisor) 
{
	return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
}

// Função que gera números de CPF válidos
function cpf()
{
	var retorno = "";
	var n = 9;
	var n1 = gera_random(n);
 	var n2 = gera_random(n);
 	var n3 = gera_random(n);
 	var n4 = gera_random(n);
 	var n5 = gera_random(n);
 	var n6 = gera_random(n);
 	var n7 = gera_random(n);
 	var n8 = gera_random(n);
 	var n9 = gera_random(n);
 	var d1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10;
 	d1 = 11 - ( mod(d1,11) );
 	if (d1>=10) d1 = 0;
 	var d2 = d1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11;
 	d2 = 11 - ( mod(d2,11) );
 	if (d2>=10) d2 = 0;
	if(gRFPrefs.getBoolPref('pontuacao') == true)
		retorno = ""+n1+n2+n3+"."+n4+n5+n6+"."+n7+n8+n9+"-"+d1+d2;
	else 
		retorno = ""+n1+n2+n3+n4+n5+n6+n7+n8+n9+d1+d2;
 	return retorno;
}

// Função que gera números de CNPJ válidos
function cnpj()
{
	var retorno = "";
	var n = 9;
	var n1  = gera_random(n);
 	var n2  = gera_random(n);
 	var n3  = gera_random(n);
 	var n4  = gera_random(n);
 	var n5  = gera_random(n);
 	var n6  = gera_random(n);
 	var n7  = gera_random(n);
 	var n8  = gera_random(n);
 	var n9  = 0; //gera_random(n);
 	var n10 = 0; //gera_random(n);
 	var n11 = 0; //gera_random(n);	
 	var n12 = 1; //gera_random(n);		
	var d1 = n12*2+n11*3+n10*4+n9*5+n8*6+n7*7+n6*8+n5*9+n4*2+n3*3+n2*4+n1*5;
 	d1 = 11 - ( mod(d1,11) );
 	if (d1>=10) d1 = 0;
 	var d2 = d1*2+n12*3+n11*4+n10*5+n9*6+n8*7+n7*8+n6*9+n5*2+n4*3+n3*4+n2*5+n1*6;
 	d2 = 11 - ( mod(d2,11) );
 	if (d2>=10) d2 = 0;
	if(gRFPrefs.getBoolPref('pontuacao') == true)
		retorno = ""+n1+n2+"."+n3+n4+n5+"."+n6+n7+n8+"/"+n9+n10+n11+n12+"-"+d1+d2;
	else 
		retorno = ""+n1+n2+n3+n4+n5+n6+n7+n8+n9+n10+n11+n12+d1+d2;
 	return retorno;
}

function setClipboardContents(copytext)
{	
	try
	{
		var str = Components.classes["@mozilla.org/supports-string;1"].
            createInstance(Components.interfaces.nsISupportsString);
		if (!str) return false;
		str.data = copytext;

		var trans = Components.classes["@mozilla.org/widget/transferable;1"].
              createInstance(Components.interfaces.nsITransferable);
		if (!trans) return false;

		trans.addDataFlavor("text/unicode");
		trans.setTransferData("text/unicode",str,copytext.length * 2);

		var clipid = Components.interfaces.nsIClipboard;
		var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
		if (!clip) return false;

		clip.setData(trans,null,clipid.kGlobalClipboard);
		return true;
	}
	catch(e)
	{
		return false;
	}
}

function mostraCPF() 
{
	var sCPF = cpf();
	var theBox = document.commandDispatcher.focusedElement;
	if (theBox)
		theBox.value = sCPF;
	else
	{
		setClipboardContents(sCPF);
		alert("Gerador de CPF e CNPJ\n-----------------------------\n\nCPF gerado: " + sCPF + "\n\nAgora basta colar onde quiser.");
	}
}

function mostraCNPJ() 
{
	var sCNPJ = cnpj();
	var theBox = document.commandDispatcher.focusedElement;
	if (theBox)
		theBox.value = sCNPJ;
	else
	{	
		setClipboardContents(sCNPJ);
		alert("Gerador de CPF e CNPJ\n----------------------------\n\nCNPJ gerado: " + sCNPJ + "\n\nAgora basta colar onde quiser.");
	}
}

// Adicionado por Bruno Caimar <bruno.caimar@gmail.com> em 02/2006 
// Pega o evento gerado pelo clique no icone no status bar e gera CPF/CNPJ
// Botão direito           - CNPJ 
// Botão esquerdo (outros) - CPF
// -----------------------------------------------------------------------------
// Modificado por Carlos Eugênio Torres em 22/02/2006
// Botão esquerdo: CPF
// Botão do meio : CNPJ
// Botão direito : Opções
function gerarCPFouCNPJ(e) 
{
	try 
	{
		if (e.button == 0)
		{
			mostraCPF();
		}
		else if (e.button == 1)
		{
			mostraCNPJ();
		}
		else if (e.button == 2)
		{
			window.openDialog('chrome://gercpfcnpj/content/gercpfcnpjOptions.xul', 'gercpfcnpj-options', 'centerscreen,chrome,modal');
		}
	} 
	catch(erro) 
	{
		alert("Ocorreu um erro...\n" + erro.description) ; 
	}
}