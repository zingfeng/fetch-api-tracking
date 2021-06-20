var sun_tracking = {
    // =====================================
    //         CONFIG
    // =====================================

    config: {
        track_all: true, // track all fetch request ?
        tracked_url: [ // Specify URL if track all = false

        ],
    },
    setConfig: function (config) {
        if (typeof config['track_all'] === 'boolean') {
            this.config.track_all = config['track_all'];
        }
        if ((typeof config['tracked_url'] !== 'undefined') && (Array.isArray(config['tracked_url']))) {
            this.config.tracked_url = config['tracked_url'];
        }
    },
    getConfig: function () {
        return this.config;
    },
    insertUrl: function (url) {
        if (Array.isArray(url)) {
            let res = []
            for (let i = 0; i < url.length; i++) {
                res.push(this.insertUrl(url[i]))
            }
            return res;
        }

        if (!this.isValidURL(url)) return false;

        if (!sun_tracking.config.tracked_url.includes(url)) {
            sun_tracking.config.tracked_url.push(url)
        }
        return true;
    },
    removeUrl: function (url) {
        if (Array.isArray(url)) {
            let res = []
            for (let i = 0; i < url.length; i++) {
                res.push(this.removeUrl(url[i]))
            }
            return res;
        }

        if (!this.isValidURL(url)) return false;

        if (sun_tracking.config.tracked_url.includes(url)) {
            let tracked_url = sun_tracking.config.tracked_url
            tracked_url = tracked_url.filter(item => item !== url)
        }
        return true;
    },

    // =====================================
    //         GET TRACKING RESULT
    // =====================================

    getAll: function () {
        return this._result;
    },
    getByUrl: function (url) {
        return this._result.filter(m => (m.url === url));
    },
    getByDomain: function (domain) {
        return this._result.filter(m => (m.domain === domain));
    },

    groupByUrl: function () {
        return this._result.reduce((res, mono) => {
            res[mono.url] = [...res[mono.url] || [], mono];
            return res;
        }, {});
    },
    groupByDomain: function () {
        return this._result.reduce((res, mono) => {
            res[mono.domain] = [...res[mono.domain] || [], mono];
            return res;
        }, {});
    },

    clear: function () {
        this._result = []
        this._log = []
    },

    filterResponseByString: function (string) {
        return this._result.filter(m => (m.body.includes(string)));
    },
    filterResponseByRegex: function (regEx) {
        return this._result.filter(m => (m.body.match(regEx).length > 0));
    },

    // =====================================
    //         LOG
    // =====================================

    getLog: function () {
        return this._log;
    },

    // =====================================
    //         INIT
    // =====================================

    init: function () {
        var fetch_origin = window.fetch;
        window.fetch = function () {
            return fetch_origin.apply(null, arguments).then((async function (response) {
                let clone = response.clone()
                let url = arguments[0].url

                // Check condition
                if ((sun_tracking.config.track_all) || (sun_tracking.config.tracked_url.includes(url))) {
                    try {
                        let body = await clone.text()
                        let url_obj = new URL(url)
                        let domain = url_obj.hostname;

                        // Push
                        sun_tracking._result.push({
                            arguments: arguments,
                            response: response,
                            url: url,
                            domain: domain,
                            body: body,
                            time: Date.now()
                        })
                    } catch (e) {
                    }
                }

                // Log
                sun_tracking._log.push({
                    arguments: arguments,
                    response: response,
                    time: Date.now()
                })
                return response;
            }))
        }
    },

    // =====================================
    //             OTHER
    // =====================================

    isValidURL: function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    },
    _result: [],
    _log: [],
};

sun_tracking.init();