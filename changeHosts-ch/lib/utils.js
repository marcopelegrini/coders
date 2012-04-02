var ChangeHosts 			= ChangeHosts 				|| {};

ChangeHosts.Utils			= ChangeHosts.Utils			|| {};

// Returns true if the platform is Windows
ChangeHosts.Utils.isWindows = function()
{
	// If the platform contains 'win'
	if(navigator.platform.toLowerCase().indexOf("win") != -1)
	{
		return true;
	}
	
	return false;
};