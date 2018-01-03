jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 TtMasterSet in the list
// * All 3 TtMasterSet have at least one CabeceraDetaleNav

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/sap/appcelima/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/sap/appcelima/test/integration/pages/App",
	"com/sap/appcelima/test/integration/pages/Browser",
	"com/sap/appcelima/test/integration/pages/Master",
	"com/sap/appcelima/test/integration/pages/Detail",
	"com/sap/appcelima/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.sap.appcelima.view."
	});

	sap.ui.require([
		"com/sap/appcelima/test/integration/MasterJourney",
		"com/sap/appcelima/test/integration/NavigationJourney",
		"com/sap/appcelima/test/integration/NotFoundJourney",
		"com/sap/appcelima/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});