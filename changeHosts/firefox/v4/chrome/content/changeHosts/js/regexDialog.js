var existingRegex = null;

function onLoad() {
	coders.browserUtils.getElement("definition-color-picker").color = window.arguments[0].inn.color;
	if(window.arguments[0].inn.regex){
		coders.browserUtils.getElement("regex-input").value = window.arguments[0].inn.regex;
	}
	existingRegex = window.arguments[0].inn.existingRegex;
}

function ok() {
	window.arguments[0].out = {
		regex: coders.browserUtils.getElement("regex-input").value,
		color: coders.browserUtils.getElement("definition-color-picker").color
	};
	return true;
}

function validate(event) {
	if(existingRegex){
		var element = event.originalTarget;

		var valid = true;
		for (var i = 0; i < existingRegex.length; i++){
			if(coders.browserUtils.equalsIgnoreCase(existingRegex[i], element.value)){
				valid = false;
				break;
			}
		}

		if(!valid){
			coders.browserUtils.getElement("regex-image-invalid").setAttribute("style", "display:block;");
			coders.browserUtils.getElement("regex-label-invalid").setAttribute("style", "display:block;");
			document.documentElement.getButton("accept").disabled = true;
			window.sizeToContent();
		}else{
			coders.browserUtils.getElement("regex-image-invalid").removeAttribute("style");
			coders.browserUtils.getElement("regex-label-invalid").removeAttribute("style");
			document.documentElement.getButton("accept").disabled = false;
			window.sizeToContent();
		}
	}
}