jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"com/sap/appcelima/test/integration/NavigationJourneyPhone",
		"com/sap/appcelima/test/integration/NotFoundJourneyPhone",
		"com/sap/appcelima/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});