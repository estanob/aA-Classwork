/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/twitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/api_util.js":
/*!******************************!*\
  !*** ./frontend/api_util.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

const APIUtil = {
    followUser: id => {
        return new Promise ((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: `/users/${id}/follow`,
                data: {
                    user_id: this.userId
                },
                dataType: "JSON",
                success: res => resolve(res),
                error: error => reject(error)
            })
        })
    },
    unfollowUser: id => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/users/${id}/follow`,
                method: "DELETE",
                dataType: "JSON",
                success: res => resolve(res),
                error: error => reject(error)
            })
        })
    },
    searchUsers: queryVal => {
        return $.ajax({
            url: "/users/search",
            method: "GET",
            dataType: "JSON",
        }) 
    }
}

module.exports = APIUtil;

/***/ }),

/***/ "./frontend/follow_toggle.js":
/*!***********************************!*\
  !*** ./frontend/follow_toggle.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util */ "./frontend/api_util.js")

class FollowToggle {
  constructor ($ele) {
    this.followButton = $ele;
    this.userId = this.followButton.attr('data-user-id');
    this.followState = this.followButton.attr('data-initial-follow-state');
    this.render();
    this.handleClick();
  }

  render () {
    console.log(this.followState);
    if (this.followState === "unfollowed") { //<= resolved
      this.followButton.prop("disabled", false);
      this.followButton.html("Follow!");
    } else if (this.followState === "followed"){ //<= resolved
      this.followButton.prop("disabled", false);
      this.followButton.html("Unfollow!");
    } else { // disable because we're following/unfollowing 
    // ^ pending state
      this.followButton.prop("disabled", true);
    }
  }

  handleClick () {
    this.followButton.click((e) => {
      if (this.followState === "unfollowed") {
        this.followState = "following";
        this.render();
        APIUtil.followUser(this.userId)
        .then(res => this.handleSuccess(res))
        .catch(error => console.log(error));
      } else if (this.followState === "followed") {
        this.followState = "unfollowing";
        this.render();
        APIUtil.unfollowUser(this.userId)
          .then(res => this.handleSuccess(res))
          .catch(error => console.log(error));
      }
    })
  }

  handleSuccess(res) {
    if (this.followState === "following") this.followState = "unfollowed";
    if (this.followState === "unfollowing") this.followState = "followed";
    this.followState === "followed" ? this.followState = "unfollowed" : this.followState = 'followed';
    this.render();
  }
}

module.exports = FollowToggle;

/***/ }),

/***/ "./frontend/twitter.js":
/*!*****************************!*\
  !*** ./frontend/twitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(/*! ./follow_toggle */ "./frontend/follow_toggle.js");

$(() => {
  $('.follow-toggle').each(function(idx, ele) {
    new FollowToggle($(ele))
  })
})

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map