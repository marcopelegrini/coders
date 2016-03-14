(function(coders) {

	coders.preferenceUtils = function(branchName, bundleName) {

		this.branchName = branchName;
		this.bundleName = bundleName;
		this.prefs = null;

		//Get preferences branch
		this.getPrefs = function() {
			//Lazy loading
			if (!this.prefs) {
				var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
				this.prefs = prefService.getBranch(this.branchName);
			}
			return this.prefs;
		}

		this.getBool = function(name) {
			try {
				return this.getPrefs().getBoolPref(name);
			} catch (e) {
				return null;
			}
		}

		this.setBool = function(name, value) {
			try {
				this.getPrefs().setBoolPref(name, value);
			} catch (e) {
				throw "Could not set preference " + name + " to value " + value;
			}
		}

		this.getString = function(name) {
			try {
				return this.getPrefs().getCharPref(name);
			} catch (e) {
				return null;
			}
		}

		this.setString = function(name, value) {
			try {
				this.getPrefs().setCharPref(name, value);
			} catch (e) {
				throw "Could not set preference " + name + " to value " + value;
			}
		}

		this.getInt = function(name) {
			try {
				return this.getPrefs().getIntPref(name);
			} catch (e) {
				return null;
			}
		}

		this.setInt = function(name, value) {
			try {
				this.getPrefs().setIntPref(name, value);
			} catch (e) {
				throw "Could not set preference " + name + " to value " + value;
			}
		}

		this.clear = function(name) {
			try {
				this.getPrefs().clearUserPref(name);
			} catch (e) {
				throw "Could not reset preference ";
			}
		}

		this.getStringList = function(name) {
			try {
				var list = this.getString(name);
				if (list && list != null) {
					return list.split(',');
				} else {
					return null;
				}
			} catch (e) {
				return null;
			}
		}

		this.addToStringList = function(name, value) {
			var list = this.getString(name);
			if (list && list != null) {
				this.setString(name, list += ',' + value);
			} else {
				this.setString(name, value);
			}
		}

		this.removeFromStringList = function(name, value) {
			var array = this.getStringList(name);
			if (array != null && array.length > 0) {
				for (var i = 0; i < array.length; i++) {
					if (array[i] == value) {
						array.splice(i, 1);
						this.setString(name, array.toString());
						return true;
					}
				};
			}
			return false;
		}

		this.resetUserPreferences = function() {
			var prefBranch = this.getPrefs();
			var c = {
				value: 0
			};
			var chindren = prefBranch.getChildList("", c);
			for (var i = 0; i < c.value; ++i) {
				if (prefBranch.prefHasUserValue(chindren[i])) {
					prefBranch.clearUserPref(chindren[i]);
				}
			}
		}

		this.getSBundle = function() {
			return document.getElementById(this.bundleName);
		}
	}
})(window.coders = window.coders||{});
