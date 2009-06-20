var currentSelection = null;
function updateDetailView(sender){
//alert(sender.offsetTop);
if (currentSelection == sender) {
	// if (currentSelection != null) currentSelection.className = "";
	// currentSelection = null;
	// $('detail-view').style.visibility = 'hidden';
	// $('main-table').style.background = "url('images/PillarOfLight.png') no-repeat";

	return;
} else {
	if (currentSelection){
		currentSelection.className = "";
	}
		
	currentSelection = sender;
}

$('detail-view').style.visibility = 'hidden';
$('main-table').style.background = "none";
sender.className = "selected";
var target = 'detail-contents';

var myAjax = new Ajax.Updater(target, sender.href, {method: 'get', onComplete:
function(){ 
	var fitToTop = document.body.scrollTop;
	var ideal = sender.offsetTop-74;
	var fitToBottom = fitToTop + document.body.clientHeight - $('detail-view').clientHeight - 1;
	var marginTop = Math.min(ideal, fitToBottom); // Don't go higher than the top
	marginTop = Math.max(marginTop, fitToTop); // Don't go higher than the top
	marginTop = Math.max(marginTop, 49); // Don't go higher than gray
	$('detail-view').style.marginTop = marginTop;
	$('detail-view').style.visibility = '';
	myLightbox.updateImageList();
	}});
}

function toggleDonations(){
	if ($('more-projects').style.display == 'none') {
		$('more-projects').style.display = 'block';
	} else {
		$('more-projects').style.display = 'none';
	}
}

function getProject (){
	mainURL = window.location.search;
	URLparts = mainURL.split('?');
	updateDetailView($(URLparts[1]));
}
