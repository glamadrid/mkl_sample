/*global location */
jQuery.sap.require("sap.ui.model.json.JSONModel");
sap.ui.define([
	"com/sap/appcelima/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"com/sap/appcelima/model/formatter",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, GroupHeaderListItem, Filter, FilterOperator, Device, formatter, MessageToast) {
	"use strict";

	return BaseController.extend("com.sap.appcelima.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			//oViewModel.setSizeLimit(1000);  

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

			//var pagina = "Login";
			//this.getSplitContObj().to(this.createId(pagina));
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.value = sObjectId;
			var opcion = sObjectId.substring(0, 3);
			var pagina = "Login";

			// if (opcion == "000") {
			// 	pagina = "Login";
			if (opcion == "000") {
				pagina = "Mensajes";
			} else if (opcion == "001") {
				pagina = "Stocks";
				//sObjectId = "001_CERAMICO01_12345678__";
			} else if (opcion == "002") {
				pagina = "Facturas";
			} else if (opcion == "003") {
				pagina = "Pedidos";
			} else if (opcion == "999") {
				pagina = "Login";
			}

			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("TtMasterSet", {
					GoMaster: sObjectId
				});
				this._bindView("/" + sObjectPath);
				this.getSplitContObj().to(this.createId(pagina));

			}.bind(this));

		},
		
		onRetro: function(oEvent) {
			var pagina = "Stocks";
			this.getSplitContObj().to(this.createId(pagina));
		}, 
		
		onLogueo: function() {
			var pagina = "Mensajes";
			this.getSplitContObj().to(this.createId(pagina));
			//this.byId("appdeclientes").toMaster(this.createId("Menu"));
			
			//this.app.toMaster(this.createId("Login"));
            //this.showMaster();
			
		}, 

		onListItemPress: function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitContObj().toDetail(this.createId(sToPageId));
		},

		getSplitContObj: function() {
			var result = this.byId("appdeclientes");
			if (!result) {
				jQuery.sap.log.error("Usuario el objeto no puede ser encontrado");
			}
			return result;
		},

		handleSelect: function(oEvent) {

			var oTable = this.byId("StocksItemsList");
			var contexts = oTable.getSelectedContexts();
			var oSelectedItems = [];
			var items = contexts.map(function(c) {
				return c.getObject();
			});
			
			if(items.length > 10 || items.length < 1)
			{
			  var msg = "Seleccione mínimo 1 y máximo 10 Sku's";
			  MessageToast.show(msg);	
			}
            else{
			var i;
			//var sObjectId = "001_ATACHAGUA_12345678__";
			var query;
			for (i = 0; i < items.length; i++) {
				if (query === undefined) {
					query = this.value + "MATNR_" + items[i].Text10 + "_";
				} else {
					query = query + items[i].Text10 + "_";
				}
			};
			if (query === undefined) {} else {
				var StockTable = new sap.ui.table.Table;
				var sUrl = "/sap/opu/odata/sap/ZHCP_CLIENTE_APP_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(sUrl);
				StockTable.setModel(oModel);
				var oFilter = new sap.ui.model.Filter("GoDetail", sap.ui.model.FilterOperator.EQ, query);
				StockTable.bindRows("/TtDetailSet", null, null, [oFilter]);
				var oBinding = this.byId("DetalleStocksItemsList").getBinding("items");
				oBinding.filter(oFilter);
				var pagina = "DetalleStocks";
				this.getSplitContObj().to(this.createId(pagina));
			}
		}
		},

		StockonSearch: function(evt) {
			// create model filter
			var filters = [];
			var query = this.value + "FILTER_" + evt.getParameter("query");

			var StockTable = new sap.ui.table.Table;
			var sUrl = "/sap/opu/odata/sap/ZHCP_CLIENTE_APP_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl);
			StockTable.setModel(oModel);
			var oFilter = new sap.ui.model.Filter("GoDetail", sap.ui.model.FilterOperator.EQ, query);
			StockTable.bindRows("/TtDetailSet", null, null, [oFilter]);
			var oBinding = this.byId("StocksItemsList").getBinding("items");
			oBinding.filter(oFilter);
		},

		FacturasonSearch: function(evt) {
			// create model filter
			var filters = [];
			var consulta = evt.getParameter("query");
			var query = this.value + "XBLNR_" + evt.getParameter("query"); 
			//if (consulta.length === 16) { var query = this.value + "XBLNR_" + evt.getParameter("query"); }
			//else { var query = this.value + "FILTER_" + evt.getParameter("query"); }
			var StockTable = new sap.ui.table.Table;
			var sUrl = "/sap/opu/odata/sap/ZHCP_CLIENTE_APP_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl);
			StockTable.setModel(oModel);
			var oFilter = new sap.ui.model.Filter("GoDetail", sap.ui.model.FilterOperator.EQ, query);
			StockTable.bindRows("/TtDetailSet", null, null, [oFilter]);
			var oBinding = this.byId("facturasItemsList").getBinding("items");
			oBinding.filter(oFilter);

		},

		PedidosonSearch: function(evt) {
			// create model filter
			var filters = [];
			var consulta = evt.getParameter("query");
			var query = this.value + "VBELN_" + evt.getParameter("query");
			//if (consulta.length === 7) { var query = this.value + "VBELN_" + evt.getParameter("query"); }
			//else if (consulta.length === 8) { var query = this.value + "VBELN_" + evt.getParameter("query"); }
			//else if (consulta.length === 10) { var query = this.value + "VBELN_" + evt.getParameter("query"); }
			//else { var query = this.value + "FILTER_" + evt.getParameter("query"); }

			var StockTable = new sap.ui.table.Table;
			var sUrl = "/sap/opu/odata/sap/ZHCP_CLIENTE_APP_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl);
			StockTable.setModel(oModel);
			var oFilter = new sap.ui.model.Filter("GoDetail", sap.ui.model.FilterOperator.EQ, query);
			StockTable.bindRows("/TtDetailSet", null, null, [oFilter]);
			var oBinding = this.byId("pedidosItemsList").getBinding("items");
			oBinding.filter(oFilter);

		},		

		rowSelectionChanged: function(oControlEvent) {
			var selectedRowContext = oControlEvent.getParameter("items");
			var link = oControlEvent.getSource().getBindingContext();
			var fr = oControlEvent.getBindingContext();
			var ctx = oControlEvent.getBindingContext();
			sap.m.alert(selectedRowContext);
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.GoMaster,
				sObjectName = oObject.Text02,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});

});