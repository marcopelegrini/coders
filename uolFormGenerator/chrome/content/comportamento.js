
/**
 * Valores Default de preenchimento do cadastro
 *
 */

var NAME_DEFAULT = ["Darth Vader","Salci Fufu","Sergio Reis","Visconde de Sabugosa","Peter Griphin","Marcelinho Carioca","Tartaruga Ninja","Roberto Leal","Edson Cordeiro","Edson e Hudson","Menino Maluquinho","Boneco de Olinda","Pinóquio o Lenhador"];
var PREFIX_EMAIL_TEST = "teste";
var DOMAIN_EMAIL_TEST = "teste.com.br";
var SENHA_DEFAULT = "uol123";
var CEP_DEFAULT_PRE = "01452";
var CEP_DEFAULT_POS = "002";

var DDD_TEL_DEFAULT = "11";
var PHONE_TEL_DEFAULT = "3038-9672";
var CARACTER_DEFAULT_TURING = "a";
var NUMBERS_CREDIT_CARD = ['5110517600730682','5110120778635039','5110515715062744','5110060241782457','5110681331041742','5110815231673721','5110857627560120','5110817278410223','5110065522634384','5110256341804411',
						   '5140440205170655','5140602233130767','5140264416858225','5140185247232845','5140571516187242','5140678566152321','5140863820241231','5140738123371176','5140156642773600','5140743773183541'];


/**
 * @author: Marcelo Linhares [cad_mlinhares]
 * dathe: 13/05/09 - objeto cadastro
 *
 */
 
 //chrome://browser/content/browser.xul
var cadastro = {
	page: "",
	
	// verifica se o cadastro é do Metade Ideal
	isMetadeIdeai: function(){
	
	},
	
	getPage: function(){
		return window.top.getBrowser().selectedBrowser.contentWindow.document;
	}, 
	
	getInputs: function(){
		return this.getPage().getElementsByTagName('input');
	},
	
	getSelects: function(){
		return this.getPage().getElementsByTagName('select');
	},
	 
	populateSelect: function(){
		for(i=0; i< this.getSelects().length; i++){
			switch(this.getSelects()[i].name){
				case "creditCardType":
					// define cartão de crédito Mastercard
					this.getSelects()[i].options.selectedIndex = 4;
					break;
				
				case "cod_brand":  // UOL_INC
					
					// define cartão de crédito Mastercard (no cadastro_uolinc, mastercard é 4
					this.getSelects()[i].options.selectedIndex = 4;
					break;
			}		
		}
	},
	
	populateInputs: function(){
		var cont_forms = 0;
		var emailVisitorTemp = util.createEmailVisitor();
		var loginVisitorTemp = util.createLoginVisitor();
		var inputEmailTemp = "";
		
		var cont_endereco = 0;
		for(i=0; i< this.getInputs().length; i++){
			//alert(this.getInputs()[i].name);
			switch(this.getInputs()[i].name){
				case "alternativeEmail":
					this.getInputs()[i].value = emailVisitorTemp;
					cont_forms++;
					break;
				
				case "alternativeEmailConfirmation":
					this.getInputs()[i].value = emailVisitorTemp;
					cont_forms++;
					break;
					
				case "namLogin":
					this.getInputs()[i].value = loginVisitorTemp;
					inputEmailTemp = this.getInputs()[i];
					cont_forms++;
					break;
				
				case "nam_login_suggested": // UOL_INC
					this.getInputs()[i].value = loginVisitorTemp;
					cont_forms++;
					break;
				
				case "nam_login": // UOL_INC
					this.getInputs()[i].checked = true;
					cont_forms++;
					break;
					
				case "namLoginConfirmation":
					this.getInputs()[i].value = emailVisitorTemp;
					inputEmailTemp.value = emailVisitorTemp;
					cont_forms++;
					break;
					
				case "namPerson":
					this.getInputs()[i].value = NAME_DEFAULT[ parseInt(Math.random()*NAME_DEFAULT.length) ] ;
					cont_forms++;
					break;	
				
				case "nam_person": // UOL_INC
					this.getInputs()[i].value = NAME_DEFAULT[ parseInt(Math.random()*NAME_DEFAULT.length) ] ;
					cont_forms++;
					break;	
					
				case "razaoSocial":
					this.getInputs()[i].value = NAME_DEFAULT[ parseInt(Math.random()*NAME_DEFAULT.length) ] ;
					cont_forms++;
					break;	
				
				case "nomeFantasia":
					this.getInputs()[i].value = NAME_DEFAULT[ parseInt(Math.random()*NAME_DEFAULT.length) ] ;
					cont_forms++;
					break;			
				
				case "desPassword":
					this.getInputs()[i].value = SENHA_DEFAULT;
					cont_forms++;
					break;
				
				case "des_password": // UOL_INC
					this.getInputs()[i].value = SENHA_DEFAULT;
					cont_forms++;
					break;
				
				case "des_password_confirmation": // UOL_INC
					this.getInputs()[i].value = SENHA_DEFAULT;
					cont_forms++;
					break;
					
				case "desPasswordConfirmation":
					this.getInputs()[i].value = SENHA_DEFAULT;
					cont_forms++;
					break;
				
				case "tipPassword":
					this.getInputs()[i].value = "bla";
					cont_forms++;
					break;
					
				case "indSex":
					this.getInputs()[i].checked = true;
					cont_forms++;
					break; 
				
				case "ind_sex": // UOL_INC
					this.getInputs()[i].checked = true;
					cont_forms++;
					break; 
					
				case "datBirth":
					var birthDay = "1" + parseInt(9*Math.random()) +"/" + "05/" + util.randomInter('1940','1990')  ;
					this.getInputs()[i].value = birthDay;
					cont_forms++;
					break;
					
				case "dat_birth": // UOL_INC
					var birthDay = "1" + parseInt(9*Math.random()) +"/" + "05/" + util.randomInter('1940','1990')  ;
					this.getInputs()[i].value = birthDay;
					cont_forms++;
					break;
					
				case "cpf":
					this.getInputs()[i].value = util.createCPF();
					cont_forms++;
					break;
				
				case "num_cpf": // UOL_INC
					this.getInputs()[i].value = util.createCPF();
					cont_forms++;
					break;
					
				case "cnpj":
					this.getInputs()[i].value = util.createCNPJ();
					cont_forms++;
					break;
					
				case "codPostalArea":
					this.getInputs()[i].value = CEP_DEFAULT_PRE + CEP_DEFAULT_POS; 
					this.getInputs()[i].focus();
					cont_forms++;
					break;
				
				
				case "cod_postal_area": // UOL_INC
					this.getInputs()[i].value = CEP_DEFAULT_PRE + CEP_DEFAULT_POS;
					this.getInputs()[i].focus();
					cont_forms++;
					break;
				
				case "cep1":
					this.getInputs()[i].value = CEP_DEFAULT_PRE;
					cont_forms++;
					break;
					
				case "cep2":
					this.getInputs()[i].value = CEP_DEFAULT_POS;
					this.getInputs()[i].focus();
					cont_forms++;
					break;
				
				case "numAddress":
					this.getInputs()[i].value = "50"; // numero mágico é do mal  ;-)
					cont_forms++;
					break;
					
				case "num_address":
					this.getInputs()[i].value = "50"; // numero mágico é do mal  ;-)
					cont_forms++;
					break;
					
				case "homePhoneDDD":
					this.getInputs()[i].value = DDD_TEL_DEFAULT;
					cont_forms++;
					break;
				
				case "ddd_home_phone": // UOL_INC
					this.getInputs()[i].value = DDD_TEL_DEFAULT;
					cont_forms++;
					break;
					
				case "workPhone1DDD":
					this.getInputs()[i].value = DDD_TEL_DEFAULT;
					cont_forms++;
					break;
				
				case "workPhone1Number":
					this.getInputs()[i].value = PHONE_TEL_DEFAULT;
					cont_forms++;
					break;
				
				case "home_phone": // UOL_INC 
					this.getInputs()[i].value = PHONE_TEL_DEFAULT;
					cont_forms++;
					break;
					
				case "homePhoneNumber":
					this.getInputs()[i].value = PHONE_TEL_DEFAULT;
					cont_forms++;
					break;

				case "paymentMethodType":
					// pagamento via cartão
					if(this.getInputs()[i].value == "2"){
						this.getInputs()[i].checked = "true";						
					}
					
					break;
				
				case "payment_type": // UOL_INC 
					// pagamento via cartão
					if(this.getInputs()[i].value == "C"){
						this.getInputs()[i].checked = "true";						
					}
					
					break;
				
				case "creditCardNumber":
					// pega o número de cartão de crédito aleatório
					this.getInputs()[i].value = NUMBERS_CREDIT_CARD[ parseInt(Math.random()*NUMBERS_CREDIT_CARD.length) ];
					cont_forms++;
					break;
				
				case "num_credit_card":
					// pega o número de cartão de crédito aleatório
					this.getInputs()[i].value = NUMBERS_CREDIT_CARD[ parseInt(Math.random()*NUMBERS_CREDIT_CARD.length) ];
					cont_forms++;
					break;
					
				case "creditCardValidationDate":
					this.getInputs()[i].value = "12/15";
					cont_forms++;
					break;
				
				case "dat_validity": // UOL_INC 
					this.getInputs()[i].value = "12/15";
					cont_forms++;
					break;
					
				case "creditCardCVV2":
					this.getInputs()[i].value = "123";
					break;
				
				case "credit_card_cvv":  // UOL_INC 
					this.getInputs()[i].value = "123";
					break;
					
				case "turingwordkey":
					this.getInputs()[i].value = CARACTER_DEFAULT_TURING;
					break;
					
				case "flgContractAccepted": 
					this.getInputs()[i].checked = true;
					break; 
					
				case "request_billing_address": // UOL_INC
					if(cont_endereco==0){
						this.getInputs()[i].checked = true;
						cont_endereco++;
					}
					break;
			}
		}
		
		return cont_forms;
	},
	
	run: function(){
		if(this.populateInputs()<=2){
			alert("Amigão, acho que este formulário não é do Cadastro da Plataforma!"); 
		}
		
		this.populateSelect();
	},
};
 

 /**
   * 
   * Gerar massa de dados fakes
   *
   */
 var util = {
	createEmailVisitor: function(){
		return PREFIX_EMAIL_TEST + this.random() + "@" + DOMAIN_EMAIL_TEST;
	},
	
	createLoginVisitor: function(){
		return PREFIX_EMAIL_TEST + this.random();
	},
	
	createCPF: function(){
		return gerarCPF(0);
	},
	
	createCNPJ: function(){
		return gerarCNPJ();
	},
	
	random: function(){
		return Math.floor( Math.random()*900000 );
	},
	
	randomInter: function (limit, sup){
		var n = parseInt( Math.random()*(sup-limit) );
		return parseInt(limit) + parseInt(n)
	}
 };
 
 
 




/**
 * Funçãoo para gerara CPF
 * @author: http://geradorcpf.alexestudos.eti.br/
 *
 * TODO: Peguei este código spagueti na Net, quando tiver um tempo, otimizá-lo
 *
 */

function mod(dividendo,divisor) 
{
	return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
}
 
  
 function rnd(n) { 
    /* funcao para gerar numeros randomicos com n maximo */ 
    var rndNum = Math.round(Math.random()*n); 
    return rndNum; 
}

function gerarCPF(mascara) {
    /* funcao para gerar e retornar CPF valido 
       se mascara = 1 retorna no formato: 999.999.999-99 */
    
    var cpf = ''; 
    
    var n = 9;
    
    /* gerar numeros aleatorios para as 9 primeiras posicoes */
    var n1 = rnd(n); 
    var n2 = rnd(n); 
    var n3 = rnd(n); 
    var n4 = rnd(n); 
    var n5 = rnd(n); 
    var n6 = rnd(n); 
    var n7 = rnd(n); 
    var n8 = rnd(n); 
    var n9 = rnd(n); 
    
    /* primeiro digito verificador */
    var dv1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10; 
    
    dv1 = 11 - ( dv1 % 11); 
    if (dv1>=10) { 
        dv1 = 0; 
    }

    /* segundo digito verificador */
    var dv2 = dv1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11; 
    
    dv2 = 11 - ( dv2 % 11 ); 
    if (dv2>=10) { 
        dv2 = 0; 
    }
    
    if (mascara == 1) {
        /* com mascara */
        cpf = ''+n1+n2+n3+'.'+n4+n5+n6+'.'+n7+n8+n9+'-'+dv1+dv2;
    } else {
        /* somente numeros */
        cpf = ''+n1+n2+n3+n4+n5+n6+n7+n8+n9+dv1+dv2;
    }
    
    return cpf;
}


function gerarCNPJ()
{
	var n = 9;
	var n1  = rnd(n);
 	var n2  = rnd(n);
 	var n3  = rnd(n);
 	var n4  = rnd(n);
 	var n5  = rnd(n);
 	var n6  = rnd(n);
 	var n7  = rnd(n);
 	var n8  = rnd(n);
 	var n9  = 0; //rnd(n);
 	var n10 = 0; //rnd(n);
 	var n11 = 0; //rnd(n);	
 	var n12 = 1; //rnd(n);		
	var d1 = n12*2+n11*3+n10*4+n9*5+n8*6+n7*7+n6*8+n5*9+n4*2+n3*3+n2*4+n1*5;
 	d1 = 11 - ( mod(d1,11) );
 	if (d1>=10) d1 = 0;
 	var d2 = d1*2+n12*3+n11*4+n10*5+n9*6+n8*7+n7*8+n6*9+n5*2+n4*3+n3*4+n2*5+n1*6;
 	d2 = 11 - ( mod(d2,11) );
 	if (d2>=10) d2 = 0;
	retorno = ''+n1+n2+n3+n4+n5+n6+n7+n8+n9+n10+n11+n12+d1+d2;
 	return retorno;
}

