module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 185:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright (c) WarnerMedia Direct, LLC. All rights reserved. Licensed under the MIT license.
// See the LICENSE file for license information.

const core = __nccwpck_require__(510);
const github = __nccwpck_require__(800);

async function main() {
    const request = {
        owner: core.getInput('owner', { required: true }),
        repo: core.getInput('repo', { required: true }),
        pull_number: core.getInput('pull-number', { required: true })
    };
    const token = core.getInput('repo-token', { required: true });

    core.info(`Getting PR #${request.pull_number} from ${request.owner}/${request.repo}`);

    const octokit = github.getOctokit(token);
    const { data } = await octokit.pulls.get(request);
    core.setOutput('base-ref',   data.base.ref);
    core.setOutput('base-sha',   data.base.sha);
    core.setOutput('base-owner', data.base.repo.owner.login);
    core.setOutput('base-repo',  data.base.repo.name);
    core.setOutput('head-ref',   data.head.ref);
    core.setOutput('head-sha',   data.head.sha);
    core.setOutput('head-owner', data.head.repo.owner.login);
    core.setOutput('head-repo',  data.head.repo.name);
}

module.exports = { main };

if (require.main === require.cache[eval('__filename')]) {
    main().catch(error => core.setFailed(error));
}


/***/ }),

/***/ 510:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 800:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(185);
/******/ })()
;