!function () {
    "use strict";
    const t = document.currentScript
        , e = "data-"
        , n = t.getAttribute.bind(t);
    function o(t) {
        if (!t)
            return !1;
        const e = t.toLowerCase();
        return !!["localhost", "127.0.0.1", "::1"].includes(e) || (!!/^127(\.[0-9]+){0,3}$/.test(e) || (!!/^(\[)?::1?\]?$/.test(e) || !(!e.endsWith(".local") && !e.endsWith(".localhost"))))
    }
    function a() {
        try {
            if (!0 === window.navigator.webdriver || window.callPhantom || window._phantom || window.__nightmare)
                return !0;
            if (!window.navigator || !window.location || !window.document || "object" != typeof window.navigator || "object" != typeof window.location || "object" != typeof window.document)
                return !0;
            const t = window.navigator;
            if (!t.userAgent || "" === t.userAgent || "undefined" === t.userAgent || t.userAgent.length < 5)
                return !0;
            const e = t.userAgent.toLowerCase();
            if (e.includes("headlesschrome") || e.includes("phantomjs") || e.includes("selenium") || e.includes("webdriver") || e.includes("puppeteer") || e.includes("playwright"))
                return !0;
            const n = ["__webdriver_evaluate", "__selenium_evaluate", "__webdriver_script_function", "__webdriver_unwrapped", "__fxdriver_evaluate", "__driver_evaluate", "_Selenium_IDE_Recorder", "_selenium", "calledSelenium", "$cdc_asdjflasutopfhvcZLmcfl_"];
            for (const t of n)
                if (void 0 !== window[t])
                    return !0;
            if (document.documentElement && (document.documentElement.getAttribute("webdriver") || document.documentElement.getAttribute("selenium") || document.documentElement.getAttribute("driver")))
                return !0;
            if (e.includes("python") || e.includes("curl") || e.includes("wget") || e.includes("java/") || e.includes("go-http") || e.includes("node.js") || e.includes("axios") || e.includes("postman"))
                return !0
        } catch (t) {
            return !1
        }
        return !1
    }
    function r(t, e, n) {
        let a = "";
        if (n) {
            const t = new Date;
            t.setTime(t.getTime() + 24 * n * 60 * 60 * 1e3),
                a = "; expires=" + t.toUTCString()
        }
        let r = t + "=" + (e || "") + a + "; path=/";
        h && !o(window.location.hostname) && "file:" !== window.location.protocol && (r += "; domain=." + h.replace(/^\./, "")),
            document.cookie = r
    }
    function s(t) {
        const e = t + "="
            , n = document.cookie.split(";");
        for (let t = 0; t < n.length; t++) {
            let o = n[t];
            for (; " " === o.charAt(0);)
                o = o.substring(1, o.length);
            if (0 === o.indexOf(e))
                return o.substring(e.length, o.length)
        }
        return null
    }
    function i() {
        let t = function () {
            try {
                return new URL(window.location.href).searchParams.get("_df_vid") || null
            } catch {
                return null
            }
        }();
        return t ? (r("insightly_visitor_id", t, 365),
            function () {
                try {
                    const t = new URL(window.location.href);
                    (t.searchParams.has("_df_vid") || t.searchParams.has("_df_sid")) && (t.searchParams.delete("_df_vid"),
                        t.searchParams.delete("_df_sid"),
                        window.history.replaceState({}, "", t.toString()))
                } catch { }
            }(),
            t) : (t = s("insightly_visitor_id"),
                t || (t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (t) {
                    const e = 16 * Math.random() | 0;
                    return ("x" == t ? e : 3 & e | 8).toString(16)
                }
                )),
                    r("insightly_visitor_id", t, 365)),
                t)
    }
    function c() {
        let t = function () {
            try {
                return new URL(window.location.href).searchParams.get("_df_sid") || null
            } catch {
                return null
            }
        }();
        return t ? (r("insightly_session_id", t, 1 / 48),
            t) : (t = s("insightly_session_id"),
                t || (t = "sxxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (t) {
                    const e = 16 * Math.random() | 0;
                    return ("x" == t ? e : 3 & e | 8).toString(16)
                }
                )),
                    r("insightly_session_id", t, 1 / 48)),
                t)
    }
    let l = [];
    window.insightly && window.insightly.q && Array.isArray(window.insightly.q) && (l = window.insightly.q.map((t => Array.from(t))));
    let d = !0
        , u = "";
    d && a() && (d = !1,
        u = "Tracking disabled - bot detected");
    const f = "true" === n(e + "allow-file-protocol")
        , m = "true" === n(e + "allow-localhost");
    d && (o(window.location.hostname) && !m || "file:" === window.location.protocol && !f) && (d = !1,
        u = "file:" === window.location.protocol ? "Tracking disabled on file protocol (use data-allow-file-protocol='true' to enable)" : "Tracking disabled on localhost (use data-allow-localhost='true' to enable)");
    const w = "true" === n(e + "debug");
    d && window !== window.parent && !w && (d = !1,
        u = "Tracking disabled inside an iframe");
    const g = n(e + "website-id")
        , h = n(e + "domain")
        , p = n(e + "allowed-hostnames")
        , _ = p ? p.split(",").map((t => t.trim())).filter(Boolean) : [];
    !d || g && h || (d = !1,
        u = "Missing website ID or domain");
    const v = n(e + "api-url");
    let x;
    if (v)
        x = new URL("/api/events", v).href;
    else {
        const e = !t.src.includes("insightly-three.vercel.app");
        x = e ? new URL("/api/events", window.location.origin).href : "https://insightly-three.vercel.app/api/events"
    }
    function y() {
        const t = window.location.href;
        if (!t)
            return void console.warn("Insightly: Unable to collect href. This may indicate incorrect script implementation or browser issues.");
        const e = new URL(t)
            , n = {}
            , o = e.searchParams.get("fbclid")
            , a = e.searchParams.get("gclid")
            , r = e.searchParams.get("gclsrc")
            , s = e.searchParams.get("wbraid")
            , l = e.searchParams.get("gbraid")
            , d = e.searchParams.get("li_fat_id")
            , u = e.searchParams.get("msclkid")
            , f = e.searchParams.get("ttclid")
            , m = e.searchParams.get("twclid");
        a && (n.gclid = a),
            r && (n.gclsrc = r),
            s && (n.wbraid = s),
            l && (n.gbraid = l),
            d && (n.li_fat_id = d),
            o && (n.fbclid = o),
            u && (n.msclkid = u),
            f && (n.ttclid = f),
            m && (n.twclid = m);
        return {
            websiteId: g,
            domain: h,
            href: t,
            referrer: document.referrer || null,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            visitorId: i(),
            sessionId: c(),
            adClickIds: Object.keys(n).length > 0 ? n : void 0
        }
    }
    function b(t, e) {
        return "true" === localStorage.getItem("insightly_ignore") ? (console.log("Insightly: Tracking disabled via localStorage flag"),
            void (e && e({
                status: 200
            }))) : a() ? (console.log("Insightly: Bot detected, not sending data"),
                void (e && e({
                    status: 200
                }))) : void function (t, e) {
                    const n = new XMLHttpRequest;
                    n.open("POST", x, !0),
                        n.setRequestHeader("Content-Type", "application/json"),
                        n.onreadystatechange = function () {
                            if (n.readyState === XMLHttpRequest.DONE) {
                                if (200 === n.status) {
                                    console.log("Event data sent successfully");
                                    r("insightly_session_id", c(), 1 / 48)
                                } else
                                    console.error("Error sending event data:", n.status);
                                e && e({
                                    status: n.status
                                })
                            }
                        }
                        ,
                        n.send(JSON.stringify(t))
                }(t, e)
    }
    let S = 0
        , D = "";
    function E(t) {
        if (!d)
            return void (t && t({
                status: 200
            }));
        const e = Date.now()
            , n = window.location.href;
        if (n === D && e - S < 6e4)
            return console.log("Insightly: Pageview throttled - too recent"),
                void (t && t({
                    status: 200
                }));
        S = e,
            D = n,
            function (t, e) {
                try {
                    sessionStorage.setItem("insightly_pageview_state", JSON.stringify({
                        time: t,
                        url: e
                    }))
                } catch (t) { }
            }(e, n);
        const o = y();
        o.type = "pageview",
            b(o, t)
    }
    function I(t, e, n) {
        if (!d)
            return void (n && n({
                status: 200
            }));
        const o = y();
        o.type = "payment",
            "stripe" === t ? o.extraData = {
                stripe_session_id: e
            } : "lemonsqueezy" === t ? o.extraData = {
                lemonsqueezy_order_id: e
            } : "polar" === t ? (o.extraData = {
                polar_checkout_id: e
            }) : "dodo_subscription" === t ? (o.extraData = { dodo_subscription_id: e })
                : "dodo_payment" === t && (o.extraData = { dodo_payment_id: e }),
            b(o, n)
    }
    function L(t, e, n) {
        if (!d)
            return void (n && n({
                status: 200
            }));
        const o = y();
        o.type = t,
            o.extraData = e,
            b(o, n)
    }
    function P(t, e) {
        if (d)
            if (t)
                if ("payment" !== t || e?.email)
                    if ("identify" !== t || e?.user_id)
                        if ("payment" === t)
                            L(t, {
                                email: e.email
                            });
                        else if ("identify" === t)
                            !function (t, e, n) {
                                if (!d)
                                    return void (n && n({
                                        status: 200
                                    }));
                                const o = y();
                                o.type = "identify",
                                    o.extraData = {
                                        user_id: t,
                                        name: e.name || "",
                                        ...e
                                    },
                                    b(o, n)
                            }(e.user_id, e);
                        else {
                            const n = A(e || {});
                            if (null === n)
                                return void console.error("Insightly: Custom event rejected due to validation errors");
                            L("custom", {
                                eventName: t,
                                ...n
                            })
                        }
                    else
                        console.warn(`Insightly: Missing user_id for ${t} event`);
                else
                    console.warn(`Insightly: Missing email for ${t} event`);
            else
                console.warn("Insightly: Missing event_name for custom event");
        else
            console.log(`Insightly: Event '${t}' ignored - ${u}`)
    }
    function A(t) {
        if (!t || "object" != typeof t || Array.isArray(t))
            return console.warn("Insightly: customData must be a non-null object"),
                {};
        const e = {};
        let n = 0;
        function o(t) {
            if (null == t)
                return "";
            let e = String(t);
            return e.length > 255 && (e = e.substring(0, 255)),
                e = e.replace(/[<>'"&]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").replace(/data:/gi, "").replace(/vbscript:/gi, "").trim(),
                e
        }
        for (const [r, s] of Object.entries(t)) {
            if ("eventName" === r) {
                e[r] = o(s);
                continue
            }
            if (n >= 10)
                return console.error("Insightly: Maximum 10 custom parameters allowed"),
                    null;
            if ("string" != typeof (a = r) || 0 === a.length || a.length > 32 || !/^[a-z0-9_-]+$/.test(a.toLowerCase()))
                return console.error(`Insightly: Invalid property name "${r}". Use only lowercase letters, numbers, underscores, and hyphens. Max 32 characters.`),
                    null;
            const t = r.toLowerCase()
                , i = o(s);
            e[t] = i,
                n++
        }
        var a;
        return e
    }
    if (window.insightly = P,
        window.insightly.q && delete window.insightly.q,
        function () {
            for (; l.length > 0;) {
                const t = l.shift();
                if (Array.isArray(t) && t.length > 0)
                    try {
                        P.apply(null, t)
                    } catch (e) {
                        console.error("Insightly: Error processing queued call:", e, t)
                    }
            }
        }(),
        !d)
        return void console.warn(`Insightly: ${u}`);
    function k(t) {
        if (!t)
            return null;
        const e = t.replace(/^www\./, "").split(".");
        return e.length >= 2 ? e.slice(-2).join(".") : t
    }
    function F(t) {
        if (t && t.href)
            try {
                const n = new URL(t.href);
                if ("http:" !== n.protocol && "https:" !== n.protocol)
                    return;
                const o = n.hostname
                    , a = window.location.hostname;
                if (o === a)
                    return;
                if (e = a,
                    k(o) === k(e))
                    return;
                !function (t) {
                    if (!t)
                        return !1;
                    if (t === h)
                        return !0;
                    for (const e of _)
                        if (t === e)
                            return !0;
                    return !1
                }(o) ? L("external_link", {
                    url: t.href,
                    text: t.textContent.trim()
                }) : t.href = function (t) {
                    try {
                        const e = new URL(t)
                            , n = i()
                            , o = c();
                        return e.searchParams.set("_df_vid", n),
                            e.searchParams.set("_df_sid", o),
                            e.toString()
                    } catch {
                        return t
                    }
                }(t.href)
            } catch { }
        var e
    }
    function q(t) {
        const e = t.getAttribute("insightly-fast-goal");
        if (e && e.trim()) {
            const n = {
                eventName: e.trim()
            };
            for (const e of t.attributes)
                if (e.name.startsWith("insightly-fast-goal-") && "insightly-fast-goal" !== e.name) {
                    const t = e.name.substring(15);
                    if (t) {
                        n[t.replace(/-/g, "_")] = e.value
                    }
                }
            const o = A(n);
            null !== o && L("custom", o)
        }
    }
    function M(t, e) {
        const n = t.getAttribute("insightly-fast-scroll");
        if (n && n.trim()) {
            const o = t.getAttribute("insightly-fast-scroll-delay");
            let a = 0;
            if (null !== o) {
                const t = parseInt(o, 10);
                !isNaN(t) && t >= 0 && (a = t)
            }
            const r = () => {
                const o = t.getBoundingClientRect();
                if (!(o.bottom > 0 && o.top < window.innerHeight))
                    return void e.unobserve(t);
                const r = function () {
                    const t = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
                        , e = window.innerHeight
                        , n = window.pageYOffset || document.documentElement.scrollTop
                        , o = t - e;
                    return o <= 0 ? 100 : Math.min(100, Math.round(n / o * 100))
                }()
                    , s = t.getAttribute("insightly-fast-scroll-threshold");
                let i = .5;
                if (null !== s) {
                    const t = parseFloat(s);
                    !isNaN(t) && t >= 0 && t <= 1 && (i = t)
                }
                const c = {
                    eventName: n.trim(),
                    scroll_percentage: r.toString(),
                    threshold: i.toString(),
                    delay: a.toString()
                };
                for (const e of t.attributes)
                    if (e.name.startsWith("insightly-fast-scroll-") && "insightly-fast-scroll" !== e.name && "insightly-fast-scroll-threshold" !== e.name && "insightly-fast-scroll-delay" !== e.name) {
                        const t = e.name.substring(17);
                        if (t) {
                            c[t.replace(/-/g, "_")] = e.value
                        }
                    }
                const l = A(c);
                null !== l && L("custom", l),
                    e.unobserve(t)
            }
                ;
            a > 0 ? setTimeout(r, a) : r()
        }
    }
    function R() {
        if (!window.IntersectionObserver)
            return void console.warn("Insightly: Intersection Observer not supported, scroll tracking disabled");
        const t = document.querySelectorAll("[insightly-fast-scroll]");
        if (0 === t.length)
            return;
        const e = new Map;
        t.forEach((function (t) {
            const n = t.getAttribute("insightly-fast-scroll-threshold");
            let o = .5;
            if (null !== n) {
                const t = parseFloat(n);
                !isNaN(t) && t >= 0 && t <= 1 ? o = t : console.warn(`Insightly: Invalid threshold value "${n}" for element. Using default 0.5. Threshold must be between 0 and 1.`)
            }
            e.has(o) || e.set(o, []),
                e.get(o).push(t)
        }
        )),
            e.forEach((function (t, e) {
                const n = new IntersectionObserver((function (t) {
                    t.forEach((function (t) {
                        t.isIntersecting && M(t.target, n)
                    }
                    ))
                }
                ), {
                    root: null,
                    rootMargin: "0px",
                    threshold: e
                });
                t.forEach((function (t) {
                    n.observe(t)
                }
                ))
            }
            ))
    }
    !function () {
        try {
            const t = sessionStorage.getItem("insightly_pageview_state");
            if (t) {
                const { time: e, url: n } = JSON.parse(t);
                S = e || 0,
                    D = n || ""
            }
        } catch (t) {
            S = 0,
                D = ""
        }
    }(),
        document.addEventListener("click", (function (t) {
            const e = t.target.closest("[insightly-fast-goal]");
            e && q(e);
            F(t.target.closest("a"))
        }
        )),
        document.addEventListener("keydown", (function (t) {
            if ("Enter" === t.key || " " === t.key) {
                const e = t.target.closest("[insightly-fast-goal]");
                e && q(e);
                F(t.target.closest("a"))
            }
        }
        )),
        "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", R) : R();
    let T = null;
    function j() {
        E(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("session_id");
                    t && t.startsWith("cs_") && !sessionStorage.getItem("insightly_stripe_payment_sent_" + t) && (I("stripe", t),
                        sessionStorage.setItem("insightly_stripe_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting Stripe session ID:", t)
                }
            }(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("checkout_id");
                    t && !sessionStorage.getItem("insightly_polar_payment_sent_" + t) && (I("polar", t),
                        sessionStorage.setItem("insightly_polar_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting Polar checkout ID:", t)
                }
            }(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("order_id");
                    t && !sessionStorage.getItem("insightly_lemonsqueezy_payment_sent_" + t) && (I("lemonsqueezy", t),
                        sessionStorage.setItem("insightly_lemonsqueezy_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting Lemonsqueezy order ID:", t)
                }
            }(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("subscription_id");
                    t && !sessionStorage.getItem("insightly_dodo_subscription_sent_" + t) && (y("dodo_subscription", t), sessionStorage.setItem("insightly_dodo_subscription_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting DodoPayments subscription ID:", t)
                }
            }(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("payment_id");
                    t && !sessionStorage.getItem("insightly_dodo_payment_sent_" + t) && (y("dodo_payment", t), sessionStorage.setItem("insightly_dodo_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting DodoPayments payment ID:", t)
                }
            }()
    }
    function U() {
        T && clearTimeout(T),
            T = setTimeout(j, 100)
    }
    j();
    function sendHeartbeat() {
        const payload = {
            visitorId: i(),
            sessionId: c(),
            websiteId: g,
            url: window.location.href,
            referrer: document.referrer || null,
            ts: Date.now(),
        };

        fetch("http://insightly-three.vercel.app/api/heartbeat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).catch((err) => console.error("Heartbeat error:", err));
    }
    sendHeartbeat();
    setInterval(sendHeartbeat, 5 * 60 * 60 * 1000);
    let N = window.location.pathname;
    const O = window.history.pushState;
    window.history.pushState = function () {
        O.apply(this, arguments),
            N !== window.location.pathname && (N = window.location.pathname,
                U())
    }
        ,
        window.addEventListener("popstate", (function () {
            N !== window.location.pathname && (N = window.location.pathname,
                U())
        }
        ))
}();
