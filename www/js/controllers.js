angular.module('starter.controllers', ['ngMap','ngStorage'])

// APP CONTROLLER
.controller('AppCtrl', function($scope, $filter, $ionicModal, $timeout,$state,$ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.profile = {
    name: "Asaf López",
    family: "López Govea",
    user: "saporules",
    pic: "https://pbs.twimg.com/profile_images/768688103561175041/pDR4Qpx__bigger.jpg",
    carpic: "https://acs2.blob.core.windows.net/imgcatalogo/xl/VA_f5e69006e33442dca2c3bab374ca8817.jpg"
  };

  $scope.changeTab = function(state){
    $state.go(state);
    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate: true
    });
  }

}) // END APP CONTROLLER

// LOGIN CONTROLLER
.controller('LoginCtrl', function($scope, $state, $localStorage){
  $scope.$storage = $localStorage;
  // VARS
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.btnCont=true;
  $scope.loginForm = true;
  $scope.registerForm = false;

  // METHODS
  $scope.showForm = function (form,state){
    if(state=== 'open'){
      $scope.btnCont = false;
      if(form === "register"){
        $scope.loginForm = false;
        $scope.registerForm = true;
      }
    }else{
      $scope.btnCont=true;
      $scope.loginForm = true;
      $scope.registerForm = false;
    }
  }
  $scope.loginClick = function(btn,state){
    if (btn === 'login') {
      $scope.$storage.sesion = {user: $scope.loginData.user,pass: $scope.loginData.pass};
      $scope.$storage.guest = false;
    }else if(btn === 'register'){
      $scope.$storage.register = {user: $scope.registerData.user,pass: $scope.registerData.pass, email: $scope.registerData.email};
      $scope.$storage.guest = false;
    }else if(btn === 'guest'){
      $scope.$storage.guest = true;
    }
    $state.go(state);
  }

})// END LOGIN CONTROLLER
// LOCATION CONTROLLER
.controller('LocationCtrl', function ($scope, $state, $filter, $localStorage) {
  $scope.$storage = $localStorage;
  $scope.locationData = {};

  $scope.goAuto = function(){
    if($scope.$storage.guest){
      $state.go('welcome');
    }else{
      $state.go('autoReg');
    }
  }

})// END LOCATION CONTROLLER
// AUTOREG CONTROLLER
.controller('AutoRegCtrl', function ($scope, $state, $filter, $localStorage) {
  $scope.$storage = $localStorage;
  $scope.saveCar = function(option){
    $scope.$storage.car = {marca: $scope.carData.marca, modelo: $scope.carData.modelo, ano: $scope.carData.ano};
    console.log($scope.$storage.car);
  }
})// END AUTOREG CONTROLLER
// WELCOME CONTROLLER
.controller('WelcomeCtrl', function ($scope, $state, $filter, $localStorage) {
  $scope.$storage = $localStorage;
  if($scope.$storage.guest){
    $scope.registered = false;
  }else{
    $scope.registered = true;
  }
})// END WELCOME CONTROLLER

// DIRECTORIO CONTROLLER
.controller('DirectorioCtrl', function($scope, $state, $filter, NegociosData, $ionicLoading, $ionicPopup, $localStorage, EstablecimientosData) {
  $scope.$storage = $localStorage;
  $scope.tabsState = true;
  $scope.closeBtn = false;
  $scope.searchList = false;
  // $scope.names=$scope.datapointsList ;
  $scope.adn = {};
	$scope.srchchange = function () {
    console.log('search changed');
    $scope.searchList = false;
    $scope.names = null;
    var filtervalue = [];
		var serachData=$scope.negocios;
		//console.log(serachData);
    for (var i = 0; i <serachData.length; i++) {
      var fltvar = $filter('uppercase')($scope.adn.item);
      var jsval = $filter('uppercase')(serachData[i].name);
      if (jsval.indexOf(fltvar) >= 0) {
          filtervalue.push(serachData[i]);
      }
    }
    // console.log("last");
    //console.log(filtervalue);
    $scope.names = filtervalue;
    $scope.searchList = true;
    console.log("srchchange searchList = "+$scope.searchList);

  };

  $scope.ressetserach = function () {
    $scope.searchList=false;
    console.log("ressetserach searchList = "+$scope.searchList);
    $scope.adn.item = "";
    $scope.names = $scope.negocios;
  }

  // if($scope.$storage.businesses === undefined){
  //   console.log('businesses is null');
  //   $ionicLoading.show();
    // NegociosData.getNegocios().then(function(response){
    //   //console.log(response);
    //   $scope.$storage.businesses = response;
    //   $scope.negocios = $scope.$storage.businesses;
    //   $scope.names = $scope.negocios;
    //   $ionicLoading.hide();
    // }).catch(function(response){
    //   $ionicLoading.hide();
    //   //console.log(response);
    //   $scope.showAlert('fail',response);
    // });
  // }else{
  //   console.log('businesses not null');
  //   $scope.negocios = $scope.$storage.businesses;
  //   $scope.names = $scope.negocios;
  // }
  $scope.showAlert = function(res, response) {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
  $ionicLoading.show();
  EstablecimientosData.getCategorias().then(function(response){
    $scope.categories = response;
    // console.log($scope.categories);
    $ionicLoading.hide();
  }).catch(function(response){
    // console.log(response);
    $ionicLoading.hide();
  });

  if($scope.$storage.subcats === undefined){
    $scope.subcats = {};
    // console.log('undefined');
  }else{
    $scope.subcats = $scope.$storage.subcats;
    // console.log('defined');
    // console.log($scope.subcats);

  }

  $scope.goCategory = function(id,name){
    console.log('goCategory('+id+','+name+')');
    $scope.category = id;
    $scope.the_cat = $filter('filter')($scope.categories,{id:$scope.category});
    $scope.subcats = $scope.the_cat[0].subcategories;
    EstablecimientosData.setSubcategorias($scope.subcats);
    $state.go('app.dirCat',{catName: name});
  }


})// END DIRECTORIO CONTROLLER

// DIRECTORIO CAT CONTROLLER
.controller('DirCatCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $localStorage,EstablecimientosData) {
  $scope.catName = $stateParams.catName;
  $scope.subcats = EstablecimientosData.getSubcategorias();
  $scope.goList = function(id){
    EstablecimientosData.setList(id);
  }
})//END DIRECTORIO CAT CONTROLLER

// DIRECTORIO LISTA CONTROLLER
.controller('DirListCtrl', function($state, $scope, $stateParams, $ionicLoading, EstablecimientosData) {
  $ionicLoading.show();
  $scope.negocios = {};
  var subcat = $stateParams.subcatId;
  $scope.subcatName = $stateParams.subcatName;
  EstablecimientosData.getEstablecimientos(subcat).then(function(response){
    $scope.negocios= response;
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
  });
  $scope.lol = function(lol){
    // console.log(lol);
    $state.go('app.dirSingle',{singleId:lol});
  }

})//END DIRECTORIO LISTA CONTROLLER

// DIRECTORIO SINGLE CONTROLLER
.controller('DirSingleCtrl', function($state, $scope, $stateParams, $ionicLoading, EstablecimientosData) {
  // console.log('DirSingleCtrl');
  $ionicLoading.show();
  $scope.single = {};
  var singleId = $stateParams.singleId;
  // console.log($stateParams);
  EstablecimientosData.getSingle(singleId).then(function(response){
    $ionicLoading.hide();
    console.log(response);
    $scope.single = response;
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
  });
})//END DIRECTORIO SINGLE CONTROLLER

// CERCA DE MI CONTROLLER
.controller('CercaCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading) {
  $ionicLoading.show();
  NgMap.getMap().then(function(map) {
    $scope.map = map;
    $ionicLoading.hide();
  });
  $scope.callbackFunc = function(param) {
    $scope.myself = $scope.map.getCenter();
  };
  $scope.markers = [
    {title:'Omakase',pos:[22.153145, -100.994635]},
    {title:'Tequisquiapan',pos:[22.150601, -100.992575]},
    {title:'Banorte',pos:[22.150233, -100.995128]}
  ];
})// END CERCA DE MI CONTROLLER
// SEGUROS CONTROLLER
.controller('SegurosCtrl', function($state, $scope, $stateParams, $ionicLoading, SegurosData, $ionicNavBarDelegate, $ionicPopup) {
  $ionicNavBarDelegate.showBackButton(false);
  // $ionicLoading.show();

  // SegurosData.getMarcas().then(function(response){
  //   console.log(response);
  //   $ionicLoading.hide();
  //   $scope.marcas=response;
  // }).catch(function(response){
  //   $ionicLoading.hide();
  //   console.log(response);
  //   $scope.showAlert('fail',response);
  // });
  //
  // $scope.goForModels = function(brand){
  //   SegurosData.getModelos(brand).then(function(response){
  //     console.log(response);
  //     $ionicLoading.hide();
  //     //$scope.showAlert('success',response);
  //     $scope.modelos = response;
  //   }).catch(function(response){
  //     $ionicLoading.hide();
  //     console.log(response);
  //     $scope.showAlert('fail',response);
  //   });
  // }
  //
  // $scope.goForCotizacion = function(datos){
  //   SegurosData.getCotizacion(datos).then(function(response){
  //     console.log(response);
  //     $ionicLoading.hide();
  //     //$scope.showAlert('success',response);
  //     $scope.cotizacion = response;
  //   }).catch(function(response){
  //     $ionicLoading.hide();
  //     console.log(response);
  //     $scope.showAlert('fail',response);
  //   });
  // }

  $scope.goForCotizacion = function(){
    // $scope.datos={
    //   edad: 25,
    //   marca: 'CHEVROLET',
    //   cp: '78250',
    //   genero: 'MASCULINO',
    //   tipo: 'PARTICULAR',
    //   modelo: 2010,
    //   descripcion: 'AVEO',
    //   plan: 'AMPLIA',
    //   periodo: 'MENSUAL',
    //   grupo: 'cadena'
    // };
    // $ionicLoading.show();
    // SegurosData.getCotizacion($scope.datos).then(function(response){
    //   console.log(response);
    //   $ionicLoading.hide();
    //   $scope.showAlert('success',response);
    //   $scope.cotizacion = response;
    // }).catch(function(response){
    //   $ionicLoading.hide();
    //   console.log(response);
    //   $scope.showAlert('fail',response);
    // });
  }

  $scope.showAlert = function(res, response) {
    if(res === "success"){
      var alertPopup = $ionicPopup.alert({
        title: 'Yaaas!',
        template: response
      });
    }else{
      var alertPopup = $ionicPopup.alert({
        title: 'Damn!',
        template: response
      });
    }

    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.marcas = {	"Marcas": [
      ["ACURA"],
  		["ALFA ROMEO"],
  		["AUDI"],
  		["BAIC"],
  		["BIUCK"],
  		["BMW"],
  		["BUICK"],
  		["CADILLAC"],
  		["CHEVROLET"],
  		["CHRYSLER"],
  		["DODGE"],
  		["FIAT"],
  		["FORD"],
  		["GENERAL MOTORS"]
  	]
  };

  $scope.modelos = {"Modelos":[[2017],[2016],[2015],[2014],[2013],[2012],[2011],[2010],[2009],[2008],[2007],[2005],[2004],null]};

  $scope.descripciones = {"Descripciones":[["ILX "],["MDX "],["RDX "],["RLX "],["TL "],["TSX "],null]};

  $scope.brands = $scope.marcas.Marcas;
  $scope.models = $scope.modelos.Modelos;
  $scope.des = $scope.descripciones.Descripciones;
  console.log($scope.brands);

})// END SEGUROS CONTROLLER

// SEGUROS LISTA CONTROLLER
.controller('SegListCtrl', function($state, $filter,$scope, $stateParams, $ionicLoading, SegurosData) {
  $scope.datos = {
	"IDXML": null,
	"Grupo": null,
	"GrupoAbr": "YEGO",
	"GrupoNombre": null,
	"NuevaCotizacion": null,
	"Vehiculo": null,
	"Contacto": {
		"RFC": null,
		"Nombre": null,
		"ApellidoPaterno": null,
		"ApellidoMaterno": null,
		"Edad": "25",
		"Genero": "MASCULINO",
		"FechaNacimiento": "\/Date(-62135575200000)\/",
		"LugarNacimiento": null,
		"Cliente": null,
		"Direccion": {
			"Calle": null,
			"NoExterior": null,
			"NoInterior": null,
			"CPostal": "78250",
			"IDColonia": 0,
			"Colonia": null,
			"IDCiudad": 0,
			"Ciudad": null,
			"Estado": null,
			"IDEstado": 0,
			"Pais": null
		},
		"Email": null,
		"Telefono": null,
		"Celular": null,
		"RazonSocial": null,
		"TipoPersona": null,
		"Nacionalidad": null
	},
	"FormadePago": {
		"NombreFPago": 0,
		"MedioPago": 0
	},
	"RespuestaCotizacion": null,
	"Cotizacion": [
    {
		"URL": null,
		"VehiculoCotizado": "CHEVROLET AVEO DT CE PAQ-C C/ACC. V-TELA CD 5PAS. 4PTAS. AUT. L4 MPI",
		"NumeroCotizacion": null,
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 5713.5508,
		"PrimaTotal": 6387.5613,
		"Impuesto": 881.043,
		"Descuento": 857.0325,
		"Recargos": 0,
		"Derechos": 650,
		"PorcentajeImp": 0,
		"PrimerPago": 6387.5632000000005,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "0",
		"NombreAseguradora": "ABA",
		"Cobertura": {
			"Danios_Materiales": "-NDAÑOS MATERIALES-SAmparada-D5.00 %",
			"Robo_Total": "-NROBO TOTAL-SAmparada-D10.00 %",
			"RC_Bienes": "-NRESPONSABILIDAD CIVIL POR DAÑOS A TERCEROS-SAmparada-DDSMVDF",
			"RC_Personas": "-NRESPONSABILIDAD CIVIL PERSONAS-SAmparada-DUMA",
			"Defensa_Legal": "-NASISTENCIA LEGAL PROVIAL *-SAmparada-D",
			"Gastos_Medicos_Ocupantes": "-NGASTOS MÉDICOS OCUPANTES-SAmparada-D",
			"Asistencia_Vial": "-NASISTENCIA EN VIAJE IKE *-SAmparada-D",
			"RC_MuerteAccidental": "-NRESPONSABILIDAD CIVIL POR FALLECIMIENTO-SAmparada-D",
			"RC_USA": "-NRESPONSABILIDAD CIVIL USA ACE-SAmparada-DNo aplica",
			"Gestoria_Vial": "N/A",
			"RC_Familiar": "-NRESPONSABILIDAD  CIVIL  FAMILIAR-SAmparada-D",
			"Extencion_RC": "N/A",
			"Cob_Cristales": "N/A",
			"DescuentCotizacion": "15"
		}
	},{
		"URL": null,
		"VehiculoCotizado": " ",
		"NumeroCotizacion": null,
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 0,
		"PrimaTotal": 0,
		"Impuesto": 0,
		"Descuento": 0,
		"Recargos": 0,
		"Derechos": 0,
		"PorcentajeImp": 0,
		"PrimerPago": 0,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "1",
		"NombreAseguradora": "AXA",
		"Cobertura": {
			"Danios_Materiales": null,
			"Robo_Total": null,
			"RC_Bienes": null,
			"RC_Personas": null,
			"Defensa_Legal": null,
			"Gastos_Medicos_Ocupantes": null,
			"Asistencia_Vial": null,
			"RC_MuerteAccidental": "N/A",
			"RC_USA": "N/A",
			"Gestoria_Vial": "N/A",
			"RC_Familiar": "N/A",
			"Extencion_RC": "N/A",
			"Cob_Cristales": "N/A",
			"DescuentCotizacion": ""
		}
	}, {
		"URL": null,
		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M C/ACC. CD 5PAS. 4PTAS. STD. 4CIL.",
		"NumeroCotizacion": null,
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 0,
		"PrimaTotal": 0,
		"Impuesto": 0,
		"Descuento": 0,
		"Recargos": 0,
		"Derechos": 0,
		"PorcentajeImp": 0,
		"PrimerPago": 0,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "2",
		"NombreAseguradora": "BANORTE",
		"Cobertura": null
	}, {
		"URL": null,
		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M C/ACC. MP3 STD.",
		"NumeroCotizacion": "4876224",
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 6102.5,
		"PrimaTotal": 7653.11,
		"Impuesto": 1055.6,
		"Descuento": 0,
		"Recargos": 0,
		"Derechos": 495,
		"PorcentajeImp": 0,
		"PrimerPago": 7653.11,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "3",
		"NombreAseguradora": "GNP",
		"Cobertura": {
			"Danios_Materiales": "-NDAÑOS MATERIALES-SV. CONVENIDO68,355.00-D3,417.75",
			"Robo_Total": "-NROBO TOTAL-SV. CONVENIDO68,355.00-D6,835.50",
			"RC_Bienes": "-NRESPONSABILIDAD CIVIL POR DAÑOS A TERCEROS-S3000000-D",
			"RC_Personas": "N/A",
			"Defensa_Legal": "-NPROTECCIÓN LEGAL-SAMPARADA-D",
			"Gastos_Medicos_Ocupantes": "-NGASTOS MÉDICOS OCUPANTES-S200000-D",
			"Asistencia_Vial": "N/A",
			"RC_MuerteAccidental": "N/A",
			"RC_USA": "N/A",
			"Gestoria_Vial": "N/A",
			"RC_Familiar": "N/A",
			"Extencion_RC": "-NEXTENSIÓN COBERTURA RESP. CIVIL-SAMPARADA-D",
			"Cob_Cristales": "-NCRISTALES-SAMPARADA-D",
			"DescuentCotizacion": "0"
		}
	}, {
		"URL": null,
		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M 5PAS.",
		"NumeroCotizacion": null,
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 3748.27935599527,
		"PrimaTotal": 4881.6040529545135,
		"Impuesto": 673.32469695924317,
		"Descuento": 0,
		"Recargos": 0,
		"Derechos": 460,
		"PorcentajeImp": 0,
		"PrimerPago": 0,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "4",
		"NombreAseguradora": "HDI",
		"Cobertura": null
	}, {
		"URL": null,
		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-M",
		"NumeroCotizacion": "1640105415838",
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 1995.41,
		"PrimaTotal": 2836.68,
		"Impuesto": 391.27,
		"Descuento": 0,
		"Recargos": 0,
		"Derechos": 450,
		"PorcentajeImp": 0,
		"PrimerPago": 2836.68,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "5",
		"NombreAseguradora": "MAPFRE",
		"Cobertura": {
			"Danios_Materiales": "-NDAÑOS MATERIALES-SV. Convenido-D5%",
			"Robo_Total": "-NROBO TOTAL-SV. Convenido-D10%",
			"RC_Bienes": "-NRC A TERCEROS EN SUS BIENES-S500000-D",
			"RC_Personas": "-NRC A TERCEROS EN SUS PERSONAS-S500000-D",
			"Defensa_Legal": "-NDEFENSA JURIDICA-SAmparada-D",
			"Gastos_Medicos_Ocupantes": "-NGASTOS MEDICOS-S200000-D",
			"Asistencia_Vial": "-NASISTENCIA COMPLETA-SAmparada-D",
			"RC_MuerteAccidental": "-NRC CATASTROFICA POR MUERTE ACC-S2000000-D",
			"RC_USA": "N/A",
			"Gestoria_Vial": "N/A",
			"RC_Familiar": "N/A",
			"Extencion_RC": "N/A",
			"Cob_Cristales": "N/A",
			"DescuentCotizacion": null
		}
	}, {
		"URL": null,
		"VehiculoCotizado": "CHEVROLET AVEO CE PAQ-F C/ACC. CD | MP3 5PAS. AUT. 1.60L 103HP ABS",
		"NumeroCotizacion": null,
		"FechaInicio": "\/Date(1472446800000)\/",
		"FechaFin": "\/Date(1503982800000)\/",
		"PrimaNeta": 4904.15,
		"PrimaTotal": 6425.41,
		"Impuesto": 886.26,
		"Descuento": 0,
		"Recargos": 0,
		"Derechos": 635,
		"PorcentajeImp": 0,
		"PrimerPago": 6425.41,
		"PagosSubsecuentes": 0,
		"ClavePaquete": null,
		"ViaWS": false,
		"IDAseguradora": "6",
		"NombreAseguradora": "QUALITAS",
		"Cobertura": {
			"Danios_Materiales": "-NDAÑOS MATERIALES-S83000-D0005",
			"Robo_Total": "-NROBO TOTAL-S83000-D00010",
			"RC_Bienes": "-NRESPONSABILIDAD CIVIL-S3000000-D0000",
			"RC_Personas": "N/A",
			"Defensa_Legal": "-NGASTOS LEGALES-S3000000-D0",
			"Gastos_Medicos_Ocupantes": "-NGASTOS MÉDICOS-S200000-D0",
			"Asistencia_Vial": "-NASISTENCIA VIAL-S8560-D0",
			"RC_MuerteAccidental": "-NMUERTE DEL CONDUCTOR POR ACCIDENTE AUTOMOVILISTICO-S100000-D0",
			"RC_USA": "-NRC EN EL EXTRANJERO-S1200000-D",
			"Gestoria_Vial": "N/A",
			"RC_Familiar": "N/A",
			"Extencion_RC": "-NEXTENSIÓN DE RC-S3000000-D0",
			"Cob_Cristales": "N/A",
			"DescuentCotizacion": "30"
		}
	}],
	"DatosCompra": null,
	"Oportunidad": null,
	"GeneraOT": false
}
  // $scope.sendData={
  //   edad: 25,
  //   marca: 'CHEVROLET',
  //   cp: '78250',
  //   genero: 'MASCULINO',
  //   tipo: 'PARTICULAR',
  //   modelo: 2010,
  //   descripcion: 'AVEO',
  //   plan: 'AMPLIA',
  //   periodo: 'MENSUAL',
  //   grupo: 'YEGO'
  // };
  // $ionicLoading.show();
  // SegurosData.getCotizacion($scope.sendData).then(function(response){
  //   $scope.datos = response;
  //   // console.log($scope.datos);
  //   $ionicLoading.hide();
  // }).catch(function(response){
  //   $ionicLoading.hide();
  //   console.log(response);
  // });


  $scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
  }

  $scope.cotizaciones = $filter('filter')($scope.datos.Cotizacion, $scope.greaterThan('PrimaNeta',0));

  // $scope.cotizaciones = $scope.datos.Cotizacion;
  $scope.amplia_cont = true;
  $scope.limitada_cont = false;
  $scope.changeSegurosTab = function(tab){
    if(tab === 'amplia'){
      $scope.amplia_cont = true;
      $scope.limitada_cont = false;
    }else if(tab === 'limitada'){
      $scope.amplia_cont = false;
      $scope.limitada_cont = true;
    }
  }

  $scope.goSingle = function(index){
    console.log($scope.cotizaciones[index]);
    SegurosData.setSingle($scope.cotizaciones[index]);
    $state.go('app.segSingle');
  }

})//END SEGUROS LISTA CONTROLLER

// SEGUROS SINGLE CONTROLLER
.controller('SegSingleCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, SegurosData) {
  $scope.seguro = SegurosData.getSingle();
})//END SEGUROS SINGLE CONTROLLER

// GUIA DE PRECIOS CONTROLLER
.controller('GuiaCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $ionicNavBarDelegate) {

})//END GUIA DE PRECIOS CONTROLLER
// CUPONERA CONTROLLER
.controller('CuponeraCtrl', function($state, $scope, $rootScope, $stateParams, $ionicLoading, $ionicNavBarDelegate, $ionicPopup, CuponesData) {
  $ionicLoading.show();
  CuponesData.getCupones().then(function(response){
    $scope.cupones = response;
    console.log($scope.cupones);
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
    console.log(response);
    $scope.showAlert();
  });
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Ups!',
      template: 'Hubo un error accediendo a la base de datos'
    });

    alertPopup.then(function(res) {
      // console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
})//END CUPONERA CONTROLLER
// PERFIL CONTROLLER
.controller('PerfilCtrl', function($state, $scope, $rootScope, $stateParams, NgMap, $ionicLoading, $localStorage, $ionicModal) {
  $scope.$storage = $localStorage
  $scope.carData = {};
  $scope.famData = {};
  $scope.profile = {
    name: "Asaf López",
    family: "López Govea",
    pic: "https://pbs.twimg.com/profile_images/650080647940182016/XQCQTGh6_bigger.jpg",
    carpic: "https://acs2.blob.core.windows.net/imgcatalogo/xl/VA_f5e69006e33442dca2c3bab374ca8817.jpg",
    email: "asaf.eduardo@gmail.com"
  };
  $scope.perfil_cont = true;
  $scope.garage_cont = false;
  $scope.familia_cont = false;
  $scope.changeProfileTab = function(tab){
    if(tab === 'perfil'){
      $scope.perfil_cont = true;
      $scope.garage_cont = false;
      $scope.familia_cont = false;
    }else if(tab === 'garage'){
      $scope.perfil_cont = false;
      $scope.garage_cont = true;
      $scope.familia_cont = false;
    }else if(tab === 'familia'){
      $scope.perfil_cont = false;
      $scope.garage_cont = false;
      $scope.familia_cont = true;
    }
  }

  $ionicModal.fromTemplateUrl('templates/modals/newcar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.newCarModal = modal;
  });

  $scope.newCar = function(){
    $scope.newCarModal.show();
  }
  $scope.saveCar = function(option){
    if (option === 'cerrar') {
      $scope.newCarModal.hide();
    }else{
      $scope.$storage.car = {marca: $scope.carData.marca, modelo: $scope.carData.modelo, ano: $scope.carData.ano};
      console.log($scope.$storage.car);
      $scope.newCarModal.hide();
    }
  }

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});