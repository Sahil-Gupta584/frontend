! function () {
    "use strict";
    const t = document.currentScript,
        e = "data-",
        n = t.getAttribute.bind(t);

    function o(t) {
        if (!t) return !1;
        const e = t.toLowerCase();
        return !!["localhost", "127.0.0.1", "::1"].includes(e) || (!!/^127(\.[0-9]+){0,3}$/.test(e) || (!!/^(\[)?::1?\]?$/.test(e) || !(!e.endsWith(".local") && !e.endsWith(".localhost"))))
    }

    function a() {
        try {
            if (!0 === window.navigator.webdriver || window.callPhantom || window._phantom || window.__nightmare) return !0;
            if (!window.navigator || !window.location || !window.document || "object" != typeof window.navigator || "object" != typeof window.location || "object" != typeof window.document) return !0;
            const t = window.navigator;
            if (!t.userAgent || "" === t.userAgent || "undefined" === t.userAgent || t.userAgent.length < 5) return !0;
            const e = t.userAgent.toLowerCase();
            if (e.includes("headlesschrome") || e.includes("phantomjs") || e.includes("selenium") || e.includes("webdriver") || e.includes("puppeteer") || e.includes("playwright")) return !0;
            const n = ["__webdriver_evaluate", "__selenium_evaluate", "__webdriver_script_function", "__webdriver_unwrapped", "__fxdriver_evaluate", "__driver_evaluate", "_Selenium_IDE_Recorder", "_selenium", "calledSelenium", "$cdc_asdjflasutopfhvcZLmcfl_"];
            for (const t of n)
                if (void 0 !== window[t]) return !0;
            if (document.documentElement && (document.documentElement.getAttribute("webdriver") || document.documentElement.getAttribute("selenium") || document.documentElement.getAttribute("driver"))) return !0;
            if (e.includes("python") || e.includes("curl") || e.includes("wget") || e.includes("java/") || e.includes("go-http") || e.includes("node.js") || e.includes("axios") || e.includes("postman")) return !0
        } catch (t) {
            return !1
        }
        return !1
    }

    function s(t, e, n) {
        let a = "";
        if (n) {
            const t = new Date;
            t.setTime(t.getTime() + 24 * n * 60 * 60 * 1e3), a = "; expires=" + t.toUTCString()
        }
        let s = t + "=" + (e || "") + a + "; path=/";
        g && !o(window.location.hostname) && "file:" !== window.location.protocol && (s += "; domain=." + g.replace(/^\./, "")), document.cookie = s
    }

    function r(t) {
        const e = t + "=",
            n = document.cookie.split(";");
        for (let t = 0; t < n.length; t++) {
            let o = n[t];
            for (;
                " " === o.charAt(0);) o = o.substring(1, o.length);
            if (0 === o.indexOf(e)) return o.substring(e.length, o.length)
        }
        return null
    }

    function i() {
        let t = r("insightly_visitor_id");
        return t || (t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (t) {
            const e = 16 * Math.random() | 0;
            return ("x" == t ? e : 3 & e | 8).toString(16)
        })), s("insightly_visitor_id", t, 365)), t
    }

    function c() {
        let t = r("insightly_session_id");
        return t || (t = "sxxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (t) {
            const e = 16 * Math.random() | 0;
            return ("x" == t ? e : 3 & e | 8).toString(16)
        })), s("insightly_session_id", t, 1 / 48)), t
    }
    let l = [];
    window.insightly && window.insightly.q && Array.isArray(window.insightly.q) && (l = window.insightly.q.map((t => Array.from(t))));
    let d = !0,
        u = "";
    // d && a() && (d = !1, u = "Tracking disabled - bot detected"), d && (o(window.location.hostname) || "file:" === window.location.protocol) && (d = !1, u = "Tracking disabled on localhost, file protocol");
    const f = "true" === n(e + "debug");
    d && window !== window.parent && !f && (d = !1, u = "Tracking disabled inside an iframe");
    const m = n(e + "website-id"),
        g = n(e + "domain");
    !d || m && g || (d = !1, u = "Missing website ID or domain");
    const w = !t.src.includes("localhost:3000") ? new URL("/api/events", window.location.origin).href : "http://localhost:3000/api/events";

    function h() {
        const t = window.location.href;
        if (!t) return void console.warn("insightly: Unable to collect href. This may indicate incorrect script implementation or browser issues.");
        const e = new URL(t),
            n = {},
            o = e.searchParams.get("fbclid"),
            a = e.searchParams.get("gclid"),
            s = e.searchParams.get("gclsrc"),
            r = e.searchParams.get("wbraid"),
            l = e.searchParams.get("gbraid"),
            d = e.searchParams.get("li_fat_id"),
            u = e.searchParams.get("msclkid"),
            f = e.searchParams.get("ttclid"),
            w = e.searchParams.get("twclid");
        a && (n.gclid = a), s && (n.gclsrc = s), r && (n.wbraid = r), l && (n.gbraid = l), d && (n.li_fat_id = d), o && (n.fbclid = o), u && (n.msclkid = u), f && (n.ttclid = f), w && (n.twclid = w);
        return {
            websiteId: m,
            domain: g,
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

    function p(t, e) {
        return "true" === localStorage.getItem("insightly_ignore") ? (console.log("insightly: Tracking disabled via localStorage flag"), void (e && e({
            status: 200
        }))) : a() ? (console.log("insightly: Bot detected, not sending data"), void (e && e({
            status: 200
        }))) : void
        function (t, e) {
            const n = new XMLHttpRequest;
            n.open("POST", w, !0), n.setRequestHeader("Content-Type", "application/json"), n.onreadystatechange = function () {
                if (n.readyState === XMLHttpRequest.DONE) {
                    if (200 === n.status) {
                        console.log("Event data sent successfully");
                        s("insightly_session_id", c(), 1 / 48)
                    } else console.error("Error sending event data:", n.status);
                    e && e({
                        status: n.status
                    })
                }
            }, n.send(JSON.stringify(t))
        }(t, e)
    }
    let _ = 0,
        x = "";

    function v(t) {
        if (!d) return void (t && t({
            status: 200
        }));
        const e = Date.now(),
            n = window.location.href;
        if (n === x && e - _ < 6e4) return console.log("insightly: Pageview throttled - too recent"), void (t && t({
            status: 200
        }));
        _ = e, x = n,
            function (t, e) {
                try {
                    sessionStorage.setItem("insightly_pageview_state", JSON.stringify({
                        time: t,
                        url: e
                    }))
                } catch (t) { }
            }(e, n);
        const o = h();
        o.type = "pageview", p(o, t)
    }

    function y(t, e, n) {
        if (!d) return void (n && n({
            status: 200
        }));
        const o = h();
        o.type = "payment", "stripe" === t ? o.extraData = {
            stripe_session_id: e
        } : "lemonsqueezy" === t ? o.extraData = {
            lemonsqueezy_order_id: e
        } : "polar" === t && (o.extraData = {
            polar_checkout_id: e
        }), p(o, n)
    }

    function b(t, e, n) {
        if (!d) return void (n && n({
            status: 200
        }));
        const o = h();
        o.type = t, o.extraData = e, p(o, n)
    }

    function S(t, e) {
        if (d)
            if (t)
                if ("payment" !== t || e?.email)
                    if ("identify" !== t || e?.user_id)
                        if ("payment" === t) b(t, {
                            email: e.email
                        });
                        else if ("identify" === t) ! function (t, e, n) {
                            if (!d) return void (n && n({
                                status: 200
                            }));
                            const o = h();
                            o.type = "identify", o.extraData = {
                                user_id: t,
                                name: e.name || "",
                                ...e
                            }, p(o, n)
                        }(e.user_id, e);
                        else {
                            const n = D(e || {});
                            if (null === n) return void console.error("insightly: Custom event rejected due to validation errors");
                            b("custom", {
                                eventName: t,
                                ...n
                            })
                        } else console.warn(`insightly: Missing user_id for ${t} event`);
                else console.warn(`insightly: Missing email for ${t} event`);
            else console.warn("insightly: Missing event_name for custom event");
        else console.log(`insightly: Event '${t}' ignored - ${u}`)
    }

    function D(t) {
        if (!t || "object" != typeof t || Array.isArray(t)) return console.warn("insightly: customData must be a non-null object"), {};
        const e = {};
        let n = 0;

        function o(t) {
            if (null == t) return "";
            let e = String(t);
            return e.length > 255 && (e = e.substring(0, 255)), e = e.replace(/[<>'"&]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").replace(/data:/gi, "").replace(/vbscript:/gi, "").trim(), e
        }
        for (const [s, r] of Object.entries(t)) {
            if ("eventName" === s) {
                e[s] = o(r);
                continue
            }
            if (n >= 10) return console.error("insightly: Maximum 10 custom parameters allowed"), null;
            if ("string" != typeof (a = s) || 0 === a.length || a.length > 32 || !/^[a-z0-9_-]+$/.test(a.toLowerCase())) return console.error(`insightly: Invalid property name "${s}". Use only lowercase letters, numbers, underscores, and hyphens. Max 32 characters.`), null;
            const t = s.toLowerCase(),
                i = o(r);
            e[t] = i, n++
        }
        var a;
        return e
    }
    if (window.insightly = S, window.insightly.q && delete window.insightly.q, function () {
        for (; l.length > 0;) {
            const t = l.shift();
            if (Array.isArray(t) && t.length > 0) try {
                S.apply(null, t)
            } catch (e) {
                console.error("insightly: Error processing queued call:", e, t)
            }
        }
    }(), !d) return void console.warn(`insightly: ${u}`);

    function E(t) {
        t && t.href && function (t) {
            try {
                const e = new URL(t, window.location.origin);
                if ("http:" !== e.protocol && "https:" !== e.protocol) return !1;
                return window.location.hostname !== e.hostname
            } catch {
                return !1
            }
        }(t.href) && b("external_link", {
            url: t.href,
            text: t.textContent.trim()
        })
    }

    function I(t) {
        const e = t.getAttribute("data-fast-goal");
        if (e && e.trim()) {
            const n = {
                eventName: e.trim()
            };
            for (const e of t.attributes)
                if (e.name.startsWith("data-fast-goal-") && "data-fast-goal" !== e.name) {
                    const t = e.name.substring(15);
                    if (t) {
                        n[t.replace(/-/g, "_")] = e.value
                    }
                } const o = D(n);
            null !== o && b("custom", o)
        }
    }

    function A(t) {
        const e = t.getAttribute("data-fast-scroll");
        if (e && e.trim()) {
            const n = t.getAttribute("data-fast-scroll-delay");
            let o = 0;
            if (null !== n) {
                const t = parseInt(n, 10);
                !isNaN(t) && t >= 0 && (o = t)
            }
            const a = () => {
                const n = function () {
                    const t = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
                        e = window.innerHeight,
                        n = window.pageYOffset || document.documentElement.scrollTop,
                        o = t - e;
                    return o <= 0 ? 100 : Math.min(100, Math.round(n / o * 100))
                }(),
                    a = t.getAttribute("data-fast-scroll-threshold");
                let s = .5;
                if (null !== a) {
                    const t = parseFloat(a);
                    !isNaN(t) && t >= 0 && t <= 1 && (s = t)
                }
                const r = {
                    eventName: e.trim(),
                    scroll_percentage: n.toString(),
                    threshold: s.toString(),
                    delay: o.toString()
                };
                for (const e of t.attributes)
                    if (e.name.startsWith("data-fast-scroll-") && "data-fast-scroll" !== e.name && "data-fast-scroll-threshold" !== e.name && "data-fast-scroll-delay" !== e.name) {
                        const t = e.name.substring(17);
                        if (t) {
                            r[t.replace(/-/g, "_")] = e.value
                        }
                    } const i = D(r);
                null !== i && b("custom", i)
            };
            o > 0 ? setTimeout(a, o) : a()
        }
    }

    function L() {
        if (!window.IntersectionObserver) return void console.warn("insightly: Intersection Observer not supported, scroll tracking disabled");
        const t = document.querySelectorAll("[data-fast-scroll]");
        if (0 === t.length) return;
        const e = new Map;
        t.forEach((function (t) {
            const n = t.getAttribute("data-fast-scroll-threshold");
            let o = .5;
            if (null !== n) {
                const t = parseFloat(n);
                !isNaN(t) && t >= 0 && t <= 1 ? o = t : console.warn(`insightly: Invalid threshold value "${n}" for element. Using default 0.5. Threshold must be between 0 and 1.`)
            }
            e.has(o) || e.set(o, []), e.get(o).push(t)
        })), e.forEach((function (t, e) {
            const n = new IntersectionObserver((function (t) {
                t.forEach((function (t) {
                    t.isIntersecting && (A(t.target), n.unobserve(t.target))
                }))
            }), {
                root: null,
                rootMargin: "0px",
                threshold: e
            });
            t.forEach((function (t) {
                n.observe(t)
            }))
        }))
    } ! function () {
        try {
            const t = sessionStorage.getItem("insightly_pageview_state");
            if (t) {
                const {
                    time: e,
                    url: n
                } = JSON.parse(t);
                _ = e || 0, x = n || ""
            }
        } catch (t) {
            _ = 0, x = ""
        }
    }(), document.addEventListener("click", (function (t) {
        const e = t.target.closest("[data-fast-goal]");
        e && I(e);
        E(t.target.closest("a"))
    })), document.addEventListener("keydown", (function (t) {
        if ("Enter" === t.key || " " === t.key) {
            const e = t.target.closest("[data-fast-goal]");
            e && I(e);
            E(t.target.closest("a"))
        }
    })), document.addEventListener("submit", (function (t) {
        const e = t.target.closest("form[data-fast-goal]");
        e && function (t) {
            const e = t.getAttribute("data-fast-goal");
            if (e && e.trim()) {
                const n = {
                    eventName: e.trim()
                };
                for (const e of t.attributes)
                    if (e.name.startsWith("data-fast-goal-") && "data-fast-goal" !== e.name) {
                        const t = e.name.substring(15);
                        t && (n[t.replace(/-/g, "_")] = e.value)
                    } const o = new FormData(t);
                for (const [e, a] of o.entries())
                    if (a && "" !== a.toString().trim()) {
                        const o = t.querySelector(`[name="${e}"]`);
                        o && "password" !== o.type && (n[e] = a.toString().trim())
                    } const a = D(n);
                null !== a && b("custom", a)
            }
        }(e)
    })), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", L) : L();
    let k = null;

    function F() {
        v(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("session_id");
                    t && t.startsWith("cs_") && !sessionStorage.getItem("insightly_stripe_payment_sent_" + t) && (y("stripe", t), sessionStorage.setItem("insightly_stripe_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting Stripe session ID:", t)
                }
            }(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("checkout_id");
                    t && !sessionStorage.getItem("insightly_polar_payment_sent_" + t) && (y("polar", t), sessionStorage.setItem("insightly_polar_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting Polar checkout ID:", t)
                }
            }(),
            function () {
                try {
                    const t = new URL(window.location.href).searchParams.get("order_id");
                    t && !sessionStorage.getItem("insightly_lemonsqueezy_payment_sent_" + t) && (y("lemonsqueezy", t), sessionStorage.setItem("insightly_lemonsqueezy_payment_sent_" + t, "1"))
                } catch (t) {
                    console.error("Error auto detecting Lemonsqueezy order ID:", t)
                }
            }()
    }

    function q() {
        k && clearTimeout(k), k = setTimeout(F, 100)
    }

    function sendHeartbeat() {
        const payload = {
            visitorId: i(), // existing function that gives a unique visitor ID
            sessionId: c(), // existing function that gives session ID
            websiteId: m,   // from data-website-id
            url: window.location.href,
            referrer: document.referrer || null,
            ts: Date.now(),
        };

        fetch("http://localhost:3000/api/heartbeat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).catch((err) => console.error("Heartbeat error:", err));
    }
    F();
    // ---- Heartbeat loop ----
    sendHeartbeat();
    // setInterval(sendHeartbeat, 5 * 60 * 60 * 1000);
    setInterval(sendHeartbeat, 5 * 60 * 60 * 1000);
    let M = window.location.pathname;
    const P = window.history.pushState;
    window.history.pushState = function () {
        P.apply(this, arguments), M !== window.location.pathname && (M = window.location.pathname, q())
    }, window.addEventListener("popstate", (function () {
        M !== window.location.pathname && (M = window.location.pathname, q())
    }))
}();