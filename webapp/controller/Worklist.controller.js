sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox) {
    "use strict";

    return BaseController.extend("com.ntt.sm.userproject1.controller.Worklist", {

        formatter: formatter,
        onLiveChange: function (oEvent) {
            var sNewValue = oEvent.getParameter("value");
            this.byId("getValue").setText(sNewValue);
        }
        ,

        onSelectDelete: function () {

            var oSelected = this.byId("table").getSelectedItem();

            const oModel = oSelected.getCells()[0].getProperty("title");
            const oKey = this.getModel().createKey("/UserInformationSet", {
                Username: oModel
            });


            this.onDelete(oKey, this.getModel())
                .then(() => { })
                .catch(() => { })
                .finally(() => { });
        }
        ,
        onPressDeleteUser: function () {
            const oModel = this.getModel("model").getProperty("/");
            const oKey = this.getModel().createKey("/UserInformationSet", {
                Username: oModel.Username
            });


            this.onDelete(oKey, this.getModel())
                .then(() => { })
                .catch(() => { })
                .finally(() => { });


        },

        onUpdateUser: function () {
            const oUserInformation = {};
            const oServiceModel = this.getModel();
            const oJSONModel = this.getModel("model").getProperty("/");
            const oKey = oServiceModel.createKey("/UserInformationSet", {
                Username: oJSONModel.Username
            });


            oUserInformation.Username = oJSONModel.Username
            oUserInformation.Name = oJSONModel.Name
            oUserInformation.Surname = oJSONModel.Surname
            oUserInformation.Birthdate = oJSONModel.Birthdate
            oUserInformation.Mail = oJSONModel.Mail


            this.onUpdate(oKey, oUserInformation, oServiceModel)
                .then((oResponseData) => {

                })
                .catch(() => { })
                .finally(() => { });


        }
        ,
        onInit: function () {
            var oViewModel;


            this._aTableSearchState = [];


            oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },
        onACDialog: function () {
            this.oDialog.close();
            this.oDialog.destroy();
            this.oDialog = null;


        },
        onPressCreateUser: function () {
            const oName = this.byId("getValueName").getProperty("value")[0].toUpperCase()
            const oSurname = this.byId("getValueSurname").getProperty("value").toUpperCase()
            const oNameSurname = oName + oSurname
            const oUserInformation = this.getModel("model").getProperty("/");



            let oData = {};

            oData.Username = oNameSurname
            oData.Name = oUserInformation.Name
            oData.Surname = oUserInformation.Surname
            oData.Birthdate = oUserInformation.Birthdate
            oData.Mail = oUserInformation.Mail


            MessageBox.confirm(this.getResourceBundle().getText("infoCreateUser"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                styleClass: this.getOwnerComponent().getContentDensityClass(),
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        this.onCreate("/UserInformationSet", oData, this.getModel())
                            .then((oResponse) => {

                            })
                            .catch(() => { })
                            .finally(() => { this.onRefresh(true); })

                    }
                }
            });
        }
        ,
        onShowDeleteDialog: function () {
            this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ntt.sm.userproject1.fragment.DeleteUser", this);
            this.getView().addDependent(this.oDialog);
            this.oDialog.open();
        }
        ,
        onShowCreateDialog: function () {
            this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ntt.sm.userproject1.fragment.CreateUser", this);
            this.getView().addDependent(this.oDialog);
            this.oDialog.open();
        },
        onShowUpdateDialog: function () {
            this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.ntt.sm.userproject1.fragment.UpdateUser", this);
            this.getView().addDependent(this.oDialog);
            this.oDialog.open();
        }
        ,


        onUpdateFinished: function (oEvent) {

            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");

            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },


        onPress: function (oEvent) {

            this._showObject(oEvent.getSource());
        },


        onNavBack: function () {

            history.go(-1);
        },


        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {

                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("Username", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/UserInformationSet".length)
            });
        },

        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");

            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});
