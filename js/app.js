angular.module("findtutors", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","findtutors.controllers", "findtutors.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Findtutors" ;
		$rootScope.appLogo = "data/images/images/find.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = true ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_home = false ;
		$rootScope.hide_menu_find_a_tutor = false ;
		$rootScope.hide_menu_institute = false ;
		$rootScope.hide_menu_find_students = false ;
		$rootScope.hide_menu_course = false ;
		$rootScope.hide_menu_buy_course = false ;
		$rootScope.hide_menu_about_us = false ;
		$rootScope.hide_menu_contact = false ;
		$rootScope.hide_menu_form_login = false ;
		$rootScope.hide_menu_form_user = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "findtutors",
				storeName : "findtutors",
				description : "The offline datastore for Findtutors app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				var confirmPopup = $ionicPopup.confirm({
					title: "Confirm Exit",
					template: "Are you sure you want to exit?"
				});
				confirmPopup.then(function (close){
					if(close){
						ionic.Platform.exitApp();
					}
				});
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("findtutors",{
		url: "/findtutors",
			abstract: true,
			templateUrl: "templates/findtutors-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("findtutors.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.all_courses", {
		url: "/all_courses",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-all_courses.html",
						controller: "all_coursesCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.buy_course", {
		url: "/buy_course",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-buy_course.html",
						controller: "buy_courseCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.commerce", {
		url: "/commerce",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-commerce.html",
						controller: "commerceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.competition", {
		url: "/competition",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-competition.html",
						controller: "competitionCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.computer", {
		url: "/computer",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-computer.html",
						controller: "computerCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.contact", {
		url: "/contact",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-contact.html",
						controller: "contactCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.course", {
		url: "/course",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-course.html",
						controller: "courseCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.engineering", {
		url: "/engineering",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-engineering.html",
						controller: "engineeringCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.faqs", {
		url: "/faqs",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.find_a_tutor", {
		url: "/find_a_tutor",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-find_a_tutor.html",
						controller: "find_a_tutorCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.find_students", {
		url: "/find_students",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-find_students.html",
						controller: "find_studentsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.form_login", {
		url: "/form_login",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-form_login.html",
						controller: "form_loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.form_order", {
		url: "/form_order",
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-form_order.html",
						controller: "form_orderCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.form_user", {
		url: "/form_user",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-form_user.html",
						controller: "form_userCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.help", {
		url: "/help",
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-help.html",
						controller: "helpCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.home", {
		url: "/home",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-home.html",
						controller: "homeCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.institute", {
		url: "/institute",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-institute.html",
						controller: "instituteCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.institute_institute", {
		url: "/institute_institute",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-institute_institute.html",
						controller: "institute_instituteCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.language", {
		url: "/language",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.languages", {
		url: "/languages",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-languages.html",
						controller: "languagesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.login", {
		url: "/login",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-login.html",
						controller: "loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.order", {
		url: "/order",
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-order.html",
						controller: "orderCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.profile", {
		url: "/profile",
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-profile.html",
						controller: "profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.register", {
		url: "/register",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-register.html",
						controller: "registerCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.science", {
		url: "/science",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-science.html",
						controller: "scienceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.social_science", {
		url: "/social_science",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-social_science.html",
						controller: "social_scienceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("findtutors.terms_and_conditions", {
		url: "/terms_and_conditions",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-terms_and_conditions.html",
						controller: "terms_and_conditionsCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("findtutors.vikram_keshri_rout", {
		url: "/vikram_keshri_rout",
		cache:false,
		views: {
			"findtutors-side_menus" : {
						templateUrl:"templates/findtutors-vikram_keshri_rout.html",
						controller: "vikram_keshri_routCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})


// router by user


	$urlRouterProvider.otherwise("/findtutors/dashboard");
});
