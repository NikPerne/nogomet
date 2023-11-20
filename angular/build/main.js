"use strict";
(self["webpackChunkDemo"] = self["webpackChunkDemo"] || []).push([["main"],{

/***/ 3574:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_common_locales_sl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common/locales/sl */ 4011);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-bootstrap/modal */ 7962);
/* harmony import */ var ngx_bootstrap_rating__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ngx-bootstrap/rating */ 2581);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/form-field */ 1333);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/datepicker */ 2226);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/core */ 5309);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/input */ 26);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var ng_apexcharts__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ng-apexcharts */ 7854);
/* harmony import */ var _shared_components_framework_framework_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/components/framework/framework.component */ 288);
/* harmony import */ var _shared_components_about_about_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/components/about/about.component */ 7599);
/* harmony import */ var _shared_components_homepage_homepage_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/components/homepage/homepage.component */ 8461);
/* harmony import */ var _shared_components_header_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/components/header/header.component */ 3650);
/* harmony import */ var _shared_components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/components/sidebar/sidebar.component */ 250);
/* harmony import */ var _shared_pipes_allow_url_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/pipes/allow-url.pipe */ 6240);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/platform-browser/animations */ 4987);
/* harmony import */ var _modules_app_routing_app_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/app-routing/app-routing.module */ 9096);
/* harmony import */ var _shared_components_register_register_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shared/components/register/register.component */ 865);
/* harmony import */ var _shared_components_login_login_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shared/components/login/login.component */ 7645);
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/service-worker */ 1509);
/* harmony import */ var _shared_components_event_list_event_list_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shared/components/event-list/event-list.component */ 1050);
/* harmony import */ var _shared_components_event_details_event_details_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shared/components/event-details/event-details.component */ 107);
/* harmony import */ var _shared_components_details_page_events_details_page_events_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shared/components/details-page-events/details-page-events.component */ 6120);
/* harmony import */ var _shared_pipes_most_recent_signup_pipe__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./shared/pipes/most-recent-signup.pipe */ 6788);






























(0,_angular_common__WEBPACK_IMPORTED_MODULE_13__.registerLocaleData)(_angular_common_locales_sl__WEBPACK_IMPORTED_MODULE_14__["default"], "sl");
class AppModule {
  static #_ = this.ɵfac = function AppModule_Factory(t) {
    return new (t || AppModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineNgModule"]({
    type: AppModule,
    bootstrap: [_shared_components_framework_framework_component__WEBPACK_IMPORTED_MODULE_0__.FrameworkComponent]
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineInjector"]({
    providers: [ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_16__.BsModalService],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_17__.BrowserModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_18__.MatInputModule, ng_apexcharts__WEBPACK_IMPORTED_MODULE_19__.NgApexchartsModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_20__.MatNativeDateModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__.MatFormFieldModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_22__.MatDatepickerModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_23__.HttpClientModule, _modules_app_routing_app_routing_module__WEBPACK_IMPORTED_MODULE_6__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_24__.BrowserAnimationsModule, ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_16__.ModalModule, ngx_bootstrap_rating__WEBPACK_IMPORTED_MODULE_25__.RatingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_26__.FormsModule, _angular_service_worker__WEBPACK_IMPORTED_MODULE_27__.ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !(0,_angular_core__WEBPACK_IMPORTED_MODULE_15__.isDevMode)(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_shared_components_framework_framework_component__WEBPACK_IMPORTED_MODULE_0__.FrameworkComponent, _shared_components_about_about_component__WEBPACK_IMPORTED_MODULE_1__.AboutComponent, _shared_components_homepage_homepage_component__WEBPACK_IMPORTED_MODULE_2__.HomepageComponent, _shared_components_header_header_component__WEBPACK_IMPORTED_MODULE_3__.HeaderComponent, _shared_components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_4__.SidebarComponent, _shared_pipes_allow_url_pipe__WEBPACK_IMPORTED_MODULE_5__.AllowUrlPipe, _shared_components_register_register_component__WEBPACK_IMPORTED_MODULE_7__.RegisterComponent, _shared_components_login_login_component__WEBPACK_IMPORTED_MODULE_8__.LoginComponent, _shared_components_event_list_event_list_component__WEBPACK_IMPORTED_MODULE_9__.EventListComponent, _shared_components_event_details_event_details_component__WEBPACK_IMPORTED_MODULE_10__.EventDetailsComponent, _shared_components_details_page_events_details_page_events_component__WEBPACK_IMPORTED_MODULE_11__.DetailsPageEventsComponent, _shared_pipes_most_recent_signup_pipe__WEBPACK_IMPORTED_MODULE_12__.MostRecentSignupPipe],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_17__.BrowserModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_18__.MatInputModule, ng_apexcharts__WEBPACK_IMPORTED_MODULE_19__.NgApexchartsModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_20__.MatNativeDateModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_21__.MatFormFieldModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_22__.MatDatepickerModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_23__.HttpClientModule, _modules_app_routing_app_routing_module__WEBPACK_IMPORTED_MODULE_6__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_24__.BrowserAnimationsModule, ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_16__.ModalModule, ngx_bootstrap_rating__WEBPACK_IMPORTED_MODULE_25__.RatingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_26__.FormsModule, _angular_service_worker__WEBPACK_IMPORTED_MODULE_27__.ServiceWorkerModule]
  });
})();

/***/ }),

/***/ 9096:
/*!***********************************************************!*\
  !*** ./src/app/modules/app-routing/app-routing.module.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _shared_components_homepage_homepage_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/components/homepage/homepage.component */ 8461);
/* harmony import */ var _shared_components_about_about_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/components/about/about.component */ 7599);
/* harmony import */ var _shared_components_register_register_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/components/register/register.component */ 865);
/* harmony import */ var _shared_components_login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/components/login/login.component */ 7645);
/* harmony import */ var _shared_components_details_page_events_details_page_events_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/components/details-page-events/details-page-events.component */ 6120);
/* harmony import */ var _shared_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/services/auth-guard.service */ 8031);
/* harmony import */ var _shared_components_event_list_event_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/components/event-list/event-list.component */ 1050);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 1699);











const routes = [{
  path: "",
  component: _shared_components_homepage_homepage_component__WEBPACK_IMPORTED_MODULE_0__.HomepageComponent,
  canActivate: [_shared_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_5__.AuthGuard]
}, {
  path: "events",
  component: _shared_components_event_list_event_list_component__WEBPACK_IMPORTED_MODULE_6__.EventListComponent,
  canActivate: [_shared_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_5__.AuthGuard]
}, {
  path: "about",
  component: _shared_components_about_about_component__WEBPACK_IMPORTED_MODULE_1__.AboutComponent
}, {
  path: "events/:eventId",
  component: _shared_components_details_page_events_details_page_events_component__WEBPACK_IMPORTED_MODULE_4__.DetailsPageEventsComponent,
  canActivate: [_shared_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_5__.AuthGuard]
}, {
  path: "register",
  component: _shared_components_register_register_component__WEBPACK_IMPORTED_MODULE_2__.RegisterComponent
}, {
  path: "login",
  component: _shared_components_login_login_component__WEBPACK_IMPORTED_MODULE_3__.LoginComponent
}];
class AppRoutingModule {
  static #_ = this.ɵfac = function AppRoutingModule_Factory(t) {
    return new (t || AppRoutingModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
    type: AppRoutingModule
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule]
  });
})();

/***/ }),

/***/ 3595:
/*!*****************************************!*\
  !*** ./src/app/shared/classes/event.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Event: () => (/* binding */ Event)
/* harmony export */ });
class Event {}

/***/ }),

/***/ 3303:
/*!*******************************************!*\
  !*** ./src/app/shared/classes/storage.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BROWSER_STORAGE: () => (/* binding */ BROWSER_STORAGE)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

const BROWSER_STORAGE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken("Browser storage", {
  providedIn: "root",
  factory: () => localStorage
});

/***/ }),

/***/ 7599:
/*!************************************************************!*\
  !*** ./src/app/shared/components/about/about.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AboutComponent: () => (/* binding */ AboutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class AboutComponent {
  static #_ = this.ɵfac = function AboutComponent_Factory(t) {
    return new (t || AboutComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: AboutComponent,
    selectors: [["app-about"]],
    decls: 28,
    vars: 0,
    consts: [[1, "row"], [1, "col-12", "col-lg-8"], [1, "blockquote-footer"]],
    template: function AboutComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "About");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 0)(3, "div", 1)(4, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Even though we have more activities and information serving our days than ever before \u2013 work, family, friends, travel, the internet, books, movies \u2013 boredom is still a part of life. If you\u2019ve found yourself staring blankly at a wall or failing to come up with something to fill your time, you\u2019ve experienced boredom. We created a demo app to help you drive away boredom, a widespread feeling. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Here are rounded up some quotes about being bored. These aren\u2019t dull quotes; they\u2019re interesting ones that reveal the many different aspects of boredom. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "figure")(9, "blockquote");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " \"Is life not a thousand times too short for us to bore ourselves?\" ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "figcaption", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Friedrich Nietzsche");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "figure")(14, "blockquote");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " \"There are no uninteresting things, only uninterested people.\" ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "figcaption", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "G. K. Chesterton");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "figure")(19, "blockquote");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " \"People say nothing is impossible, but I do nothing every day.\" ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "figcaption", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "A. A. Milne");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "figure")(24, "blockquote");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "\"Stay hungy, stay foolish.\"");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "figcaption", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Steve Jobs");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
    },
    encapsulation: 2
  });
}

/***/ }),

/***/ 6120:
/*!****************************************************************************************!*\
  !*** ./src/app/shared/components/details-page-events/details-page-events.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DetailsPageEventsComponent: () => (/* binding */ DetailsPageEventsComponent)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 1891);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _services_demo_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/demo-data.service */ 808);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../header/header.component */ 3650);
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sidebar/sidebar.component */ 250);
/* harmony import */ var _event_details_event_details_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../event-details/event-details.component */ 107);







class DetailsPageEventsComponent {
  constructor(demoDataService, route) {
    this.demoDataService = demoDataService;
    this.route = route;
    this.header = {
      title: "",
      subtitle: "",
      sidebar: ""
    };
  }
  ngOnInit() {
    this.route.paramMap.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.switchMap)(params => {
      let eventId = params.get("eventId") ?? "";
      return this.demoDataService.getEventDetails(eventId);
    })).subscribe(event => {
      this.event = event;
      this.header = {
        title: event.name,
        subtitle: "",
        sidebar: `${event.name} is on our Demo app because it is a fascinating cultural heritage nearby. If you've visited and you like it - or if you don't - please review it to help other people just like you.`
      };
    });
  }
  static #_ = this.ɵfac = function DetailsPageEventsComponent_Factory(t) {
    return new (t || DetailsPageEventsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_services_demo_data_service__WEBPACK_IMPORTED_MODULE_0__.DemoDataService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.ActivatedRoute));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
    type: DetailsPageEventsComponent,
    selectors: [["app-details-page"]],
    decls: 5,
    vars: 3,
    consts: [[3, "content"], [1, "row"], [1, "col-12", "col-lg-9"], [3, "event"], [1, "col-12", "col-lg-3", "mt-4", 3, "content"]],
    template: function DetailsPageEventsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "app-header", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 1)(2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](3, "app-event-details", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-sidebar", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("content", ctx.header);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("event", ctx.event);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("content", ctx.header.sidebar);
      }
    },
    dependencies: [_header_header_component__WEBPACK_IMPORTED_MODULE_1__.HeaderComponent, _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_2__.SidebarComponent, _event_details_event_details_component__WEBPACK_IMPORTED_MODULE_3__.EventDetailsComponent],
    encapsulation: 2
  });
}

/***/ }),

/***/ 107:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/event-details/event-details.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventDetailsComponent: () => (/* binding */ EventDetailsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _services_demo_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/demo-data.service */ 808);
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/authentication.service */ 5948);
/* harmony import */ var _services_connection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/connection.service */ 9362);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _pipes_most_recent_signup_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pipes/most-recent-signup.pipe */ 6788);






function EventDetailsComponent_div_0_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " No SignUps yet, please add yours. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function EventDetailsComponent_div_0_div_24_i_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function EventDetailsComponent_div_0_div_24_i_5_Template_i_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r9);
      const signup_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r7.deleteSignup(signup_r3._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function EventDetailsComponent_div_0_div_24_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Pridem");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function EventDetailsComponent_div_0_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 17)(1, "div", 18)(2, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "i", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, EventDetailsComponent_div_0_div_24_i_5_Template, 1, 0, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div")(7, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](9, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "i", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 23)(12, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](13, "i", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](14, EventDetailsComponent_div_0_div_24_div_14_Template, 2, 0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const signup_r3 = ctx.$implicit;
    const last_r4 = ctx.last;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", !last_r4 ? "mb-4" : "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](signup_r3.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.canDeleteSignUp(signup_r3));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind4"](9, 5, signup_r3.createdOn, "d. MMMM, yyyy", "CEST", "sl"), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", signup_r3.attending == true);
  }
}
const _c0 = function (a1) {
  return {
    "col-12": true,
    "col-md-6": a1
  };
};
function EventDetailsComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 4)(1, "div", 5)(2, "div", 6)(3, "div", 7)(4, "h4", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "i", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "Nogomet ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 10)(8, "div", 4)(9, "div", 11)(10, "h6");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 12)(15, "div", 6)(16, "div", 7)(17, "div", 13)(18, "div")(19, "h4", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](20, "i", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "User's SignUps ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](23, EventDetailsComponent_div_0_div_23_Template, 2, 0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, EventDetailsComponent_div_0_div_24_Template, 15, 10, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](25, "mostRecentSignup");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](6, _c0, ctx_r0.isConnected()));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r0.event.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r0.event.signedup || ctx_r0.event.signedup.length == 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](25, 4, ctx_r0.event.signedup));
  }
}
class EventDetailsComponent {
  constructor(demoDataService, authenticationService, connectionService) {
    this.demoDataService = demoDataService;
    this.authenticationService = authenticationService;
    this.connectionService = connectionService;
    this.newSignup = {
      name: "",
      createdOn: new Date(),
      attending: true
    };
  }
  isConnected() {
    if (!this.connectionService.isConnected) this.isLoggedIn();
    return this.connectionService.isConnected;
  }
  signUpForEvent() {
    this.newSignup.name = this.getCurrentUser();
    this.demoDataService.signUpForEvent(this.event._id, this.newSignup).subscribe({
      next: signedUp => {
        this.event?.signedup?.unshift(signedUp);
      },
      error: err => {
        "Error adding signup.";
      }
    });
  }
  isUserSignedUp() {
    return this.event.signedup?.some(signup => {
      return signup.name === this.getCurrentUser();
    });
  }
  deleteSignup(signupId) {
    if (signupId) {
      this.demoDataService.deleteSignUpFromEvent(this.event._id, signupId).subscribe({
        next: () => {
          this.event.signedup = this.event.signedup?.filter(signup => signup._id !== signupId);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }
  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
  getCurrentUser() {
    const user = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }
  canDeleteSignUp(signedUp) {
    return this.isLoggedIn() && this.getCurrentUser() === signedUp.name;
  }
  static #_ = this.ɵfac = function EventDetailsComponent_Factory(t) {
    return new (t || EventDetailsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_demo_data_service__WEBPACK_IMPORTED_MODULE_0__.DemoDataService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_authentication_service__WEBPACK_IMPORTED_MODULE_1__.AuthenticationService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_connection_service__WEBPACK_IMPORTED_MODULE_2__.ConnectionService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: EventDetailsComponent,
    selectors: [["app-event-details"]],
    inputs: {
      event: "event"
    },
    decls: 5,
    vars: 2,
    consts: [["class", "row", 4, "ngIf"], [1, "modal-footer"], ["type", "button", 1, "btn", "btn-sm", "btn-primary", 3, "disabled", "click"], [1, "fa-regular", "fa-circle-check", "me-2"], [1, "row"], [3, "ngClass"], [1, "card", "mt-4"], [1, "card-header", "bg-light"], [1, "mt-1", "mb-1"], [1, "fa-regular", "fa-file-lines", "pe-2"], [1, "card-body"], [1, "col-12"], [1, "col-6"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "fa-regular", "fa-comments", "pe-2"], [4, "ngIf"], ["class", "mt-2", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "mt-2", 3, "ngClass"], [1, "d-flex", "justify-content-between", "align-items-baseline", "bg-light", "rounded-3", "p-1"], [1, "ms-1"], [1, "fa-regular", "fa-user", "ps-4", "pe-2"], ["class", "fa-solid fa-trash-can text-primary show-pointer ms-4", 3, "click", 4, "ngIf"], [1, "fa-regular", "fa-calendar", "ps-2", "pe-1"], [1, "d-flex", "flex-row", "align-items-baseline"], [1, "p-2"], [1, "far", "fa-comment-dots"], [1, "fa-solid", "fa-trash-can", "text-primary", "show-pointer", "ms-4", 3, "click"]],
    template: function EventDetailsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, EventDetailsComponent_div_0_Template, 26, 8, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1)(2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function EventDetailsComponent_Template_button_click_2_listener() {
          return ctx.signUpForEvent();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "i", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Sign up ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.event);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.isUserSignedUp());
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.DatePipe, _pipes_most_recent_signup_pipe__WEBPACK_IMPORTED_MODULE_3__.MostRecentSignupPipe],
    encapsulation: 2
  });
}

/***/ }),

/***/ 1050:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/event-list/event-list.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventListComponent: () => (/* binding */ EventListComponent)
/* harmony export */ });
/* harmony import */ var _classes_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../classes/event */ 3595);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/modal */ 7962);
/* harmony import */ var _services_demo_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/demo-data.service */ 808);
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/authentication.service */ 5948);
/* harmony import */ var _services_connection_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/connection.service */ 9362);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ 26);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 1333);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/datepicker */ 2226);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 8849);












const _c0 = function (a1) {
  return ["/events", a1];
};
function EventListComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "div", 8)(2, "div", 9)(3, "div", 10)(4, "div")(5, "h4", 11)(6, "a", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "i", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 14)(10, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "p", 15)(13, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](15, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const event_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](9, _c0, event_r5._id));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](event_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", event_r5.description, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind4"](15, 4, event_r5.date, "d. MMMM, yyyy", "CEST", "sl"));
  }
}
const _c1 = function (a0) {
  return {
    "disabled": a0
  };
};
function EventListComponent_a_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function EventListComponent_a_6_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](9);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r6.openModal(_r3));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "i", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Add Event");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](1, _c1, !ctx_r1.isConnected()));
  }
}
function EventListComponent_a_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "i", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Login to create event");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](1, _c1, !ctx_r2.isConnected()));
  }
}
function EventListComponent_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 21)(1, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "i", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Add comment ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function EventListComponent_ng_template_8_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r9.closeModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 25)(8, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "i", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 27)(12, "label", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Name of event");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "textarea", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function EventListComponent_ng_template_8_Template_textarea_ngModelChange_14_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r11.newEvent.name = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "div", 27)(16, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17, "Description of event");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "textarea", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function EventListComponent_ng_template_8_Template_textarea_ngModelChange_18_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r12.newEvent.description = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "div", 27)(20, "label", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "Date of event");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "mat-form-field")(23, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function EventListComponent_ng_template_8_Template_input_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r13.newEvent.date = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](24, "mat-datepicker-toggle", 34)(25, "mat-datepicker", null, 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "div", 36)(28, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function EventListComponent_ng_template_8_Template_button_click_28_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r14.closeModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](29, "i", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](30, "Cancel ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](31, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function EventListComponent_ng_template_8_Template_button_click_31_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r15.createEvent());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](32, "i", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](33, "Save ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](26);
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("hidden", !ctx_r4.formDataError);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", ctx_r4.formDataError, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r4.newEvent.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r4.newEvent.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matDatepicker", _r8)("ngModel", ctx_r4.newEvent.date);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("for", _r8);
  }
}
class EventListComponent {
  constructor(modalService, demoDataService, authenticationService, connectionService) {
    this.modalService = modalService;
    this.demoDataService = demoDataService;
    this.authenticationService = authenticationService;
    this.connectionService = connectionService;
    this.filterLocations = {
      nResults: 10
    };
    this.newEvent = {
      name: "",
      description: "",
      date: new Date(),
      _id: ''
    };
    this.getEvents = () => {
      this.message = "Loading nearby events ...";
      this.demoDataService.getEvents(this.filterLocations.nResults).subscribe(events => {
        this.message = events.length > 0 ? "" : "No events found!";
        this.events = events;
      });
    };
  }
  ngOnInit() {
    this.getEvents();
  }
  /*    private getEvents = () => {
      this.demoDataService.getEvents(10).subscribe({
        next: (apiEvents: any[]) => {
          this.events = apiEvents.map(apiEvent => {
            const event: Event = {
              // map API event properties to Event interface
              _id: apiEvent._id,
              name: apiEvent.name,
              description: apiEvent.description,
              date: apiEvent.date
            };
            return event;
          });
        }
      });
    } */
  isFormDataValid() {
    let isValid = false;
    if (this.newEvent.name && this.newEvent.description && this.newEvent.date) {
      isValid = true;
    }
    return isValid;
  }
  createEvent() {
    this.formDataError = "";
    if (this.isFormDataValid()) {
      this.demoDataService.createEvent(this.newEvent).subscribe({
        next: createdEvent => {
          this.getEvents;
          // Add created event to array
          this.events?.unshift(createdEvent);
          // Reload events
          this.demoDataService.getEvents(10);
          // Reset form
          this.newEvent = new _classes_event__WEBPACK_IMPORTED_MODULE_0__.Event();
          // Close modal
          this.closeModal();
          this.getEvents;
        },
        error: error => {
          this.formDataError = error;
        }
      });
    } else {
      this.formDataError = "All fields required, including rating between 1 and 5.";
    }
  }
  openModal(form) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true
    });
  }
  closeModal() {
    this.newEvent = {
      _id: "",
      name: "",
      description: "",
      date: new Date()
    };
    this.formDataError = "";
    this.modalRef?.hide();
  }
  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
  isConnected() {
    if (!this.connectionService.isConnected) this.closeModal();
    return this.connectionService.isConnected;
  }
  static #_ = this.ɵfac = function EventListComponent_Factory(t) {
    return new (t || EventListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__.BsModalService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_demo_data_service__WEBPACK_IMPORTED_MODULE_1__.DemoDataService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_authentication_service__WEBPACK_IMPORTED_MODULE_2__.AuthenticationService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_connection_service__WEBPACK_IMPORTED_MODULE_3__.ConnectionService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: EventListComponent,
    selectors: [["app-event-list"]],
    decls: 10,
    vars: 5,
    consts: [[1, "col-12"], [1, "alert", "alert-dark", "mt-4", "p-2", 3, "hidden"], [1, "fa-solid", "fa-triangle-exclamation", "pe-2"], [4, "ngFor", "ngForOf"], [3, "ngSwitch"], ["class", "btn btn-primary btn-sm", 3, "ngClass", "click", 4, "ngSwitchCase"], ["routerLink", "/login", "class", "btn btn-primary btn-sm", 3, "ngClass", 4, "ngSwitchDefault"], ["eventForm", ""], [1, "card", "mt-4"], [1, "card-header", "bg-light"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "mt-1", "mb-1"], [1, "link-primary", "text-decoration-none", 3, "routerLink"], [1, "fa-solid", "fa-location-dot", "me-2"], [1, "card-body"], [1, "mb-0"], [1, "text-muted"], [1, "btn", "btn-primary", "btn-sm", 3, "ngClass", "click"], [1, "fa-regular", "fa-comment-dots", "pe-2"], ["routerLink", "/login", 1, "btn", "btn-primary", "btn-sm", 3, "ngClass"], [1, "fa-solid", "fa-right-to-bracket", "pe-2"], [1, "modal-header"], [1, "modal-title", "pull-left"], ["type", "button", "aria-label", "Close", 1, "btn-close", "close", "pull-right", 3, "click"], ["aria-hidden", "true", 1, "visually-hidden"], [1, "modal-body"], [1, "alert", "alert-dark", "p-2", 3, "hidden"], [1, "form-group"], ["for", "name", 1, "form-label", "mt-2"], ["id", "event", "rows", "3", "placeholder", "Enter name", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], ["for", "description", 1, "form-label", "mt-2"], ["id", "event", "rows", "3", "placeholder", "Enter description", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], ["for", "date", 1, "form-label", "mt-2"], ["matInput", "", "placeholder", "Choose a date", 3, "matDatepicker", "ngModel", "ngModelChange"], ["matIconSuffix", "", 3, "for"], ["datepicker", ""], [1, "modal-footer"], ["type", "button", 1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "fa-regular", "fa-circle-xmark", "me-1"], ["type", "button", 1, "btn", "btn-sm", "btn-primary", 3, "click"], [1, "fa-regular", "fa-circle-check", "me-2"]],
    template: function EventListComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "i", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, EventListComponent_div_4_Template, 16, 11, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, EventListComponent_a_6_Template, 4, 3, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, EventListComponent_a_7_Template, 3, 3, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, EventListComponent_ng_template_8_Template, 34, 7, "ng-template", null, 7, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("hidden", !ctx.message);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", ctx.message, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.events);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngSwitch", ctx.isLoggedIn());
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngSwitchCase", true);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgSwitchCase, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgSwitchDefault, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatSuffix, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_9__.MatDatepicker, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_9__.MatDatepickerInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_9__.MatDatepickerToggle, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_6__.DatePipe],
    encapsulation: 2
  });
}

/***/ }),

/***/ 288:
/*!********************************************************************!*\
  !*** ./src/app/shared/components/framework/framework.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FrameworkComponent: () => (/* binding */ FrameworkComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/authentication.service */ 5948);
/* harmony import */ var _services_history_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/history.service */ 7844);
/* harmony import */ var _services_connection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/connection.service */ 9362);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 7947);






function FrameworkComponent_li_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "li", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function FrameworkComponent_a_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Login");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function FrameworkComponent_a_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function FrameworkComponent_a_30_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r3.logout());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Logout");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
const _c0 = function (a0, a1) {
  return {
    "fa-user-ninja": a0,
    "fa-user-shield": a1
  };
};
class FrameworkComponent {
  constructor(authenticationService, historyService, connectionService) {
    this.authenticationService = authenticationService;
    this.historyService = historyService;
    this.connectionService = connectionService;
  }
  isConnected() {
    return this.connectionService.isConnected;
  }
  logout() {
    this.authenticationService.logout();
  }
  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
  getCurrentUser() {
    const user = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }
  static #_ = this.ɵfac = function FrameworkComponent_Factory(t) {
    return new (t || FrameworkComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_authentication_service__WEBPACK_IMPORTED_MODULE_0__.AuthenticationService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_history_service__WEBPACK_IMPORTED_MODULE_1__.HistoryService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_connection_service__WEBPACK_IMPORTED_MODULE_2__.ConnectionService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: FrameworkComponent,
    selectors: [["app-framework"]],
    decls: 39,
    vars: 8,
    consts: [[1, "navbar", "navbar-expand-md", "navbar-dark", "bg-primary"], [1, "container-fluid"], ["routerLink", "", 1, "navbar-brand"], [1, "fa-regular", "fa-futbol", "me-2"], ["type", "button", "data-bs-toggle", "collapse", "data-bs-target", "#navbarContent", "aria-controls", "navbarContent", "aria-expanded", "false", "aria-label", "Toggle navigation", 1, "navbar-toggler"], [1, "navbar-toggler-icon"], ["id", "navbarContent", 1, "collapse", "navbar-collapse"], [1, "navbar-nav", "me-auto"], [1, "nav-item", "dropdown"], ["data-bs-toggle", "dropdown", "role", "button", "aria-haspopup", "true", "aria-expanded", "false", 1, "nav-link", "dropdown-toggle"], [1, "dropdown-menu"], ["target", "_blank", "href", "https://github.com/UL-FRI-DevOps-WebDevelopment/Demo", 1, "dropdown-item"], ["target", "_blank", "href", "https://teaching.lavbic.net/DevOps/WebDev/frontend/", 1, "dropdown-item"], [1, "dropdown-divider"], ["routerLink", "about", 1, "dropdown-item"], [1, "navbar-nav", "justify-content-end"], ["class", "nav-item p-2", 4, "ngIf"], [1, "fa-solid", "me-1", 3, "ngClass"], [1, "dropdown-menu", "dropdown-menu-end"], ["routerLink", "login", "class", "dropdown-item show-pointer", 4, "ngIf"], ["class", "dropdown-item show-pointer", 3, "click", 4, "ngIf"], [1, "container-fluid", "pt-4", "pb-4"], [1, "mt-5"], [1, "row"], [1, "col-12"], [1, "nav-item", "p-2"], [1, "fa-solid", "fa-triangle-exclamation", "text-light"], ["routerLink", "login", 1, "dropdown-item", "show-pointer"], [1, "dropdown-item", "show-pointer", 3, "click"]],
    template: function FrameworkComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "nav", 0)(1, "div", 1)(2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "i", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Nogomet");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, " app ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 6)(10, "ul", 7)(11, "li", 8)(12, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, " Information ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "div", 10)(15, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, " Application source code ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, " Web Development - frontend course material ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](19, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "About application");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "ul", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](23, FrameworkComponent_li_23_Template, 2, 0, "li", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "li", 8)(25, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](26, "i", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, FrameworkComponent_a_29_Template, 2, 0, "a", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](30, FrameworkComponent_a_30_Template, 2, 0, "a", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "main")(32, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](33, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "footer", 22)(35, "div", 23)(36, "div", 24)(37, "small");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38, "\u00A9 Nik Perne");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isConnected());
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](5, _c0, !ctx.isLoggedIn(), ctx.isLoggedIn()));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", ctx.getCurrentUser(), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isLoggedIn());
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isLoggedIn());
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterOutlet, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink],
    encapsulation: 2
  });
}

/***/ }),

/***/ 3650:
/*!**************************************************************!*\
  !*** ./src/app/shared/components/header/header.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderComponent: () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class HeaderComponent {
  static #_ = this.ɵfac = function HeaderComponent_Factory(t) {
    return new (t || HeaderComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: HeaderComponent,
    selectors: [["app-header"]],
    inputs: {
      content: "content"
    },
    decls: 6,
    vars: 2,
    consts: [[1, "row", "banner"], [1, "col-12"], [1, "fs-6", "text-secondary", "fw-lighter", "ms-3"]],
    template: function HeaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.content.title, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.content.subtitle);
      }
    },
    encapsulation: 2
  });
}

/***/ }),

/***/ 8461:
/*!******************************************************************!*\
  !*** ./src/app/shared/components/homepage/homepage.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HomepageComponent: () => (/* binding */ HomepageComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../header/header.component */ 3650);
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sidebar/sidebar.component */ 250);
/* harmony import */ var _event_list_event_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../event-list/event-list.component */ 1050);




class HomepageComponent {
  constructor() {
    this.header = {
      title: "Nogomet",
      subtitle: "",
      sidebar: ''
    };
  }
  static #_ = this.ɵfac = function HomepageComponent_Factory(t) {
    return new (t || HomepageComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: HomepageComponent,
    selectors: [["app-homepage"]],
    decls: 5,
    vars: 2,
    consts: [[3, "content"], [1, "row"], [1, "col-12", "col-md-8"], [1, "col-12", "col-md-4", "mt-4", 3, "content"]],
    template: function HomepageComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "app-header", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1)(2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "app-event-list");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "app-sidebar", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("content", ctx.header);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("content", ctx.header.sidebar);
      }
    },
    dependencies: [_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__.SidebarComponent, _event_list_event_list_component__WEBPACK_IMPORTED_MODULE_2__.EventListComponent],
    encapsulation: 2
  });
}

/***/ }),

/***/ 7645:
/*!************************************************************!*\
  !*** ./src/app/shared/components/login/login.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginComponent: () => (/* binding */ LoginComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 3252);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/authentication.service */ 5948);
/* harmony import */ var _services_history_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/history.service */ 7844);
/* harmony import */ var _services_connection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/connection.service */ 9362);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/header.component */ 3650);










function LoginComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 6)(1, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "i", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", ctx_r0.formError, " ");
  }
}
class LoginComponent {
  constructor(router, authenticationService, historyService, connectionService) {
    this.router = router;
    this.authenticationService = authenticationService;
    this.historyService = historyService;
    this.connectionService = connectionService;
    this.credentials = {
      timesSignedUp: 0,
      name: "",
      email: "",
      password: ""
    };
    this.header = {
      title: "Sign in",
      subtitle: "",
      sidebar: ""
    };
  }
  isConnected() {
    return this.connectionService.isConnected;
  }
  onLoginSubmit() {
    this.formError = "";
    if (!this.credentials.email || !this.credentials.password) this.formError = "All fields are required, please try again.";else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.credentials.email)) this.formError = "Please enter a valid e-mail address.";else if (this.credentials.password.length < 3) this.formError = "Password must be at least 3 characters long.";else this.doLogin();
  }
  doLogin() {
    this.authenticationService.login(this.credentials).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      this.formError = error.toString();
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => error);
    })).subscribe(() => {
      this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
    });
  }
  static #_ = this.ɵfac = function LoginComponent_Factory(t) {
    return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_authentication_service__WEBPACK_IMPORTED_MODULE_0__.AuthenticationService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_history_service__WEBPACK_IMPORTED_MODULE_1__.HistoryService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_connection_service__WEBPACK_IMPORTED_MODULE_2__.ConnectionService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: LoginComponent,
    selectors: [["app-login"]],
    decls: 22,
    vars: 5,
    consts: [[3, "content"], [1, "row"], [1, "col-12", "col-md-8"], ["routerLink", "/register", 1, "link-primary"], ["autocomplete", "off", 3, "ngSubmit"], ["class", "form-group", 4, "ngIf"], [1, "form-group"], ["for", "email", 1, "form-label", "mb-1", "mt-3"], ["type", "text", "id", "email", "name", "email", "placeholder", "Enter e-mail address", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], ["for", "password", 1, "form-label", "mb-1", "mt-3"], ["type", "password", "id", "password", "name", "password", "placeholder", "Enter password", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], [1, "form-group", "mt-3"], ["type", "submit", 1, "btn", "btn-sm", "btn-primary", "me-2", 3, "disabled"], [1, "fa-regular", "fa-circle-check", "pe-2"], ["role", "alert", 1, "alert", "alert-dark", "p-2", "mt-4"], [1, "fas", "fa-exclamation-triangle", "pe-2"]],
    template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-header", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1)(2, "div", 2)(3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, " Not a member? Please ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "register");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " first. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_8_listener() {
          return ctx.onLoginSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, LoginComponent_div_9_Template, 4, 1, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "div", 6)(11, "label", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "E-mail address");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function LoginComponent_Template_input_ngModelChange_13_listener($event) {
          return ctx.credentials.email = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 6)(15, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function LoginComponent_Template_input_ngModelChange_17_listener($event) {
          return ctx.credentials.password = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "div", 11)(19, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](20, "i", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "Login ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("content", ctx.header);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.formError);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx.credentials.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx.credentials.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx.isConnected());
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm, _header_header_component__WEBPACK_IMPORTED_MODULE_3__.HeaderComponent],
    encapsulation: 2
  });
}

/***/ }),

/***/ 865:
/*!******************************************************************!*\
  !*** ./src/app/shared/components/register/register.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegisterComponent: () => (/* binding */ RegisterComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 3252);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/authentication.service */ 5948);
/* harmony import */ var _services_history_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/history.service */ 7844);
/* harmony import */ var _services_connection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/connection.service */ 9362);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../header/header.component */ 3650);










function RegisterComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 6)(1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "i", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", ctx_r0.formError, " ");
  }
}
class RegisterComponent {
  constructor(router, authenticationService, historyService, connectionService) {
    this.router = router;
    this.authenticationService = authenticationService;
    this.historyService = historyService;
    this.connectionService = connectionService;
    this.credentials = {
      name: "",
      timesSignedUp: 0,
      email: "",
      password: ""
    };
    this.header = {
      title: "Create a new account",
      subtitle: "",
      sidebar: ""
    };
  }
  isConnected() {
    return this.connectionService.isConnected;
  }
  onRegisterSubmit() {
    this.formError = "";
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) this.formError = "All fields are required, please try again.";else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.credentials.email)) this.formError = "Please enter a valid e-mail address.";else if (this.credentials.password.length < 3) this.formError = "Password must be at least 3 characters long.";else this.doRegister();
  }
  doRegister() {
    this.authenticationService.register(this.credentials).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      this.formError = error.toString();
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => error);
    })).subscribe(() => {
      this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
    });
  }
  static #_ = this.ɵfac = function RegisterComponent_Factory(t) {
    return new (t || RegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_authentication_service__WEBPACK_IMPORTED_MODULE_0__.AuthenticationService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_history_service__WEBPACK_IMPORTED_MODULE_1__.HistoryService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_connection_service__WEBPACK_IMPORTED_MODULE_2__.ConnectionService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: RegisterComponent,
    selectors: [["app-register"]],
    decls: 26,
    vars: 6,
    consts: [[3, "content"], [1, "row"], [1, "col-12", "col-md-8"], ["routerLink", "/login", 1, "link-primary"], ["autocomplete", "off", 3, "ngSubmit"], ["class", "form-group", 4, "ngIf"], [1, "form-group"], ["for", "name", 1, "form-label", "mb-1"], ["type", "text", "id", "name", "name", "name", "placeholder", "Enter your name", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], ["for", "email", 1, "form-label", "mb-1", "mt-3"], ["type", "text", "id", "email", "name", "email", "placeholder", "Enter e-mail address", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], ["for", "password", 1, "form-label", "mb-1", "mt-3"], ["type", "password", "id", "password", "name", "password", "placeholder", "Enter password", 1, "form-control", "form-control-sm", 3, "ngModel", "ngModelChange"], [1, "form-group", "mt-3"], ["type", "submit", 1, "btn", "btn-sm", "btn-primary", "me-2", 3, "disabled"], [1, "fa-regular", "fa-circle-check", "pe-2"], ["role", "alert", 1, "alert", "alert-dark", "p-2", "mt-4"], [1, "fas", "fa-exclamation-triangle", "pe-2"]],
    template: function RegisterComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-header", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1)(2, "div", 2)(3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, " Already a member? Please ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "login");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " instead. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function RegisterComponent_Template_form_ngSubmit_8_listener() {
          return ctx.onRegisterSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, RegisterComponent_div_9_Template, 4, 1, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "div", 6)(11, "label", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "Full name");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function RegisterComponent_Template_input_ngModelChange_13_listener($event) {
          return ctx.credentials.name = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 6)(15, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "E-mail address");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function RegisterComponent_Template_input_ngModelChange_17_listener($event) {
          return ctx.credentials.email = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "div", 6)(19, "label", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](20, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function RegisterComponent_Template_input_ngModelChange_21_listener($event) {
          return ctx.credentials.password = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "div", 13)(23, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](24, "i", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](25, "Register ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("content", ctx.header);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.formError);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx.credentials.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx.credentials.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx.credentials.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx.isConnected());
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgForm, _header_header_component__WEBPACK_IMPORTED_MODULE_3__.HeaderComponent],
    encapsulation: 2
  });
}

/***/ }),

/***/ 250:
/*!****************************************************************!*\
  !*** ./src/app/shared/components/sidebar/sidebar.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarComponent: () => (/* binding */ SidebarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _services_demo_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/demo-data.service */ 808);
/* harmony import */ var ng_apexcharts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng-apexcharts */ 7854);



class SidebarComponent {
  constructor(demoDataService) {
    this.demoDataService = demoDataService;
    this.content = "";
    this.users = [];
    this.chartOptions = {
      series: [{
        name: "Obiskal",
        data: []
      }],
      chart: {
        type: "bar",
        height: 350,
        width: 500
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      }
    };
  }
  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.demoDataService.getUsers(10).subscribe(users => {
      this.users = users;
      // Create new data array in the required format
      const newData = this.users.map(user => {
        return {
          x: user.name,
          y: user.timesSignedUp
        };
      });
      // Update the chartOptions with the new data
      this.chartOptions = {
        ...this.chartOptions,
        series: [{
          data: newData
        }]
      };
    });
  }
  static #_ = this.ɵfac = function SidebarComponent_Factory(t) {
    return new (t || SidebarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_demo_data_service__WEBPACK_IMPORTED_MODULE_0__.DemoDataService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: SidebarComponent,
    selectors: [["app-sidebar"]],
    inputs: {
      content: "content"
    },
    decls: 1,
    vars: 5,
    consts: [[3, "series", "chart", "dataLabels", "plotOptions", "xaxis"]],
    template: function SidebarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "apx-chart", 0);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("series", ctx.chartOptions.series)("chart", ctx.chartOptions.chart)("dataLabels", ctx.chartOptions.dataLabels)("plotOptions", ctx.chartOptions.plotOptions)("xaxis", ctx.chartOptions.xaxis);
      }
    },
    dependencies: [ng_apexcharts__WEBPACK_IMPORTED_MODULE_2__.ChartComponent],
    encapsulation: 2
  });
}

/***/ }),

/***/ 6240:
/*!************************************************!*\
  !*** ./src/app/shared/pipes/allow-url.pipe.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AllowUrlPipe: () => (/* binding */ AllowUrlPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 6480);


class AllowUrlPipe {
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  static #_ = this.ɵfac = function AllowUrlPipe_Factory(t) {
    return new (t || AllowUrlPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.DomSanitizer, 16));
  };
  static #_2 = this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
    name: "allowUrl",
    type: AllowUrlPipe,
    pure: true
  });
}

/***/ }),

/***/ 6788:
/*!*********************************************************!*\
  !*** ./src/app/shared/pipes/most-recent-signup.pipe.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MostRecentSignupPipe: () => (/* binding */ MostRecentSignupPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class MostRecentSignupPipe {
  transform(signups) {
    if (signups && signups.length > 0) {
      signups = signups.sort((a, b) => {
        let order = 0;
        if (b.createdOn && a.createdOn) {
          if (b.createdOn > a.createdOn) order = 1;else if (b.createdOn < a.createdOn) order = -1;
        }
        return order;
      });
    }
    return signups;
  }
  static #_ = this.ɵfac = function MostRecentSignupPipe_Factory(t) {
    return new (t || MostRecentSignupPipe)();
  };
  static #_2 = this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
    name: "mostRecentSignup",
    type: MostRecentSignupPipe,
    pure: true
  });
}

/***/ }),

/***/ 8031:
/*!*******************************************************!*\
  !*** ./src/app/shared/services/auth-guard.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthGuard: () => (/* binding */ AuthGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./authentication.service */ 5948);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 7947);



class AuthGuard {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  static #_ = this.ɵfac = function AuthGuard_Factory(t) {
    return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_authentication_service__WEBPACK_IMPORTED_MODULE_0__.AuthenticationService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: AuthGuard,
    factory: AuthGuard.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 5948:
/*!***********************************************************!*\
  !*** ./src/app/shared/services/authentication.service.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthenticationService: () => (/* binding */ AuthenticationService)
/* harmony export */ });
/* harmony import */ var _classes_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/storage */ 3303);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 3738);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _demo_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./demo-data.service */ 808);




class AuthenticationService {
  constructor(storage, demoDataService) {
    this.storage = storage;
    this.demoDataService = demoDataService;
  }
  login(user) {
    return this.demoDataService.login(user).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(authResponse => {
      this.saveToken(authResponse.token);
    }));
  }
  register(user) {
    return this.demoDataService.register(user).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(authResponse => {
      this.saveToken(authResponse.token);
    }));
  }
  logout() {
    this.storage.removeItem("demo-token");
  }
  getToken() {
    return this.storage.getItem("demo-token");
  }
  saveToken(token) {
    this.storage.setItem("demo-token", token);
  }
  b64Utf8(input) {
    return decodeURIComponent(Array.prototype.map.call(window.atob(input), character => {
      return "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  }
  isLoggedIn() {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(this.b64Utf8(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } else return false;
  }
  getCurrentUser() {
    let user;
    if (this.isLoggedIn()) {
      let token = this.getToken();
      if (token) {
        let {
          email,
          name,
          timesSignedUp
        } = JSON.parse(this.b64Utf8(token.split(".")[1]));
        user = {
          email,
          name,
          timesSignedUp
        };
      }
    }
    return user;
  }
  static #_ = this.ɵfac = function AuthenticationService_Factory(t) {
    return new (t || AuthenticationService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_classes_storage__WEBPACK_IMPORTED_MODULE_0__.BROWSER_STORAGE), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_demo_data_service__WEBPACK_IMPORTED_MODULE_1__.DemoDataService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: AuthenticationService,
    factory: AuthenticationService.ɵfac,
    providedIn: "root"
  });
}

/***/ }),

/***/ 9362:
/*!*******************************************************!*\
  !*** ./src/app/shared/services/connection.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConnectionService: () => (/* binding */ ConnectionService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 7835);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 9016);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 2235);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 9736);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);



class ConnectionService {
  constructor() {
    this.isConnected = false;
    (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.merge)((0,rxjs__WEBPACK_IMPORTED_MODULE_1__.fromEvent)(window, "offline").pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(() => false)), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.fromEvent)(window, "online").pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(() => true)), new rxjs__WEBPACK_IMPORTED_MODULE_3__.Observable(sub => {
      sub.next(navigator.onLine);
      sub.complete();
    })).subscribe(connected => this.isConnected = connected);
  }
  static #_ = this.ɵfac = function ConnectionService_Factory(t) {
    return new (t || ConnectionService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: ConnectionService,
    factory: ConnectionService.ɵfac,
    providedIn: "root"
  });
}

/***/ }),

/***/ 808:
/*!******************************************************!*\
  !*** ./src/app/shared/services/demo-data.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DemoDataService: () => (/* binding */ DemoDataService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 3252);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 6360);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var _classes_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/storage */ 3303);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../environments/environment */ 108);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);







class DemoDataService {
  constructor(http, storage) {
    this.http = http;
    this.storage = storage;
    this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
  }
  login(user) {
    return this.makeAuthApiCall("login", user);
  }
  getUsers(nResults) {
    const url = `${this.apiUrl}/users?nResults=${nResults}`;
    return this.http.get(url).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  deleteSignUpFromEvent(eventId, signupId) {
    const url = `${this.apiUrl}/events/${eventId}/signups/${signupId}`;
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpHeaders().set("Authorization", `Bearer ${this.storage.getItem("demo-token")}`);
    return this.http.delete(url, {
      headers
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  getEvents(nResults) {
    const url = `${this.apiUrl}/events?nResults=${nResults}`;
    return this.http.get(url).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  /*   getEvents(limit?: number): Observable<Event[]> {
      return this.http.get<Event[]>(`${this.apiUrl}/events?limit=${limit}`);
    } */
  getEventDetails(eventId) {
    const url = `${this.apiUrl}/events/${eventId}`;
    return this.http.get(url).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  signUpForEvent(eventId, signup) {
    const url = `${this.apiUrl}/events/${eventId}/signups`;
    let body = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpParams().set("name", signup.name).set("attending", signup.attending);
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", `Bearer ${this.storage.getItem("demo-token")}`);
    return this.http.post(url, body, {
      headers
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  createEvent(event) {
    const url = `${this.apiUrl}/events`;
    let body = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpParams().set("name", event.name).set("description", event.description).set("date", event.date.toISOString());
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", `Bearer ${this.storage.getItem("demo-token")}`);
    return this.http.post(url, body, {
      headers
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  register(user) {
    return this.makeAuthApiCall("register", user);
  }
  makeAuthApiCall(urlPath, user) {
    const url = `${this.apiUrl}/${urlPath}`;
    let body = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpParams().set("email", user.email).set("name", user.name);
    if (user.password) body = body.set("password", user.password);
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(url, body, {
      headers
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.retry)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError));
  }
  handleError(error) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error.error.message || error.statusText);
  }
  static #_ = this.ɵfac = function DemoDataService_Factory(t) {
    return new (t || DemoDataService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_classes_storage__WEBPACK_IMPORTED_MODULE_0__.BROWSER_STORAGE));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
    token: DemoDataService,
    factory: DemoDataService.ɵfac,
    providedIn: "root"
  });
}

/***/ }),

/***/ 7844:
/*!****************************************************!*\
  !*** ./src/app/shared/services/history.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HistoryService: () => (/* binding */ HistoryService)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);



class HistoryService {
  constructor(router) {
    this.router = router;
    this.urls = [];
    this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof _angular_router__WEBPACK_IMPORTED_MODULE_0__.NavigationEnd) this.urls.push(routerEvent.urlAfterRedirects);
    });
  }
  getPreviousUrl() {
    this.urls.pop();
    if (this.urls.length > 0) return this.urls.slice(-1).toString();else return "/";
  }
  getLastNonLoginUrl() {
    const exclude = ["/register", "/login"];
    this.urls.pop();
    const filtererd = this.urls.filter(url => !exclude.includes(url));
    if (filtererd.length > 0) return filtererd.slice(-1).toString();else return "/";
  }
  static #_ = this.ɵfac = function HistoryService_Factory(t) {
    return new (t || HistoryService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_0__.Router));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: HistoryService,
    factory: HistoryService.ɵfac,
    providedIn: "root"
  });
}

/***/ }),

/***/ 108:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  apiUrl: "https://localhost:3000/api",
  //apiUrl: "https://host.docker.internal:3000/api",
  production: false
};

/***/ }),

/***/ 6792:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 3574);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(6792)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map