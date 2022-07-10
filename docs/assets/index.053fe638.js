var e = Object.defineProperty,
  t = Object.getOwnPropertySymbols,
  n = Object.prototype.hasOwnProperty,
  s = Object.prototype.propertyIsEnumerable,
  r = (t, n, s) =>
    n in t
      ? e(t, n, { enumerable: !0, configurable: !0, writable: !0, value: s })
      : (t[n] = s),
  i = (e, i) => {
    for (var o in i || (i = {})) n.call(i, o) && r(e, o, i[o]);
    if (t) for (var o of t(i)) s.call(i, o) && r(e, o, i[o]);
    return e;
  };
!(function () {
  const e = document.createElement('link').relList;
  if (!(e && e.supports && e.supports('modulepreload'))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
      t(e);
    new MutationObserver(e => {
      for (const n of e)
        if ('childList' === n.type)
          for (const e of n.addedNodes)
            'LINK' === e.tagName && 'modulepreload' === e.rel && t(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function t(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = (function (e) {
      const t = {};
      return (
        e.integrity && (t.integrity = e.integrity),
        e.referrerpolicy && (t.referrerPolicy = e.referrerpolicy),
        'use-credentials' === e.crossorigin
          ? (t.credentials = 'include')
          : 'anonymous' === e.crossorigin
          ? (t.credentials = 'omit')
          : (t.credentials = 'same-origin'),
        t
      );
    })(e);
    fetch(e.href, t);
  }
})();
var o = {},
  a = e =>
    encodeURIComponent(e).replace(
      /[!'()*]/g,
      e => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
    ),
  l = new RegExp('%[a-f0-9]{2}', 'gi'),
  c = new RegExp('(%[a-f0-9]{2})+', 'gi');
function h(e, t) {
  try {
    return decodeURIComponent(e.join(''));
  } catch (r) {}
  if (1 === e.length) return e;
  t = t || 1;
  var n = e.slice(0, t),
    s = e.slice(t);
  return Array.prototype.concat.call([], h(n), h(s));
}
function u(e) {
  try {
    return decodeURIComponent(e);
  } catch (s) {
    for (var t = e.match(l), n = 1; n < t.length; n++)
      t = (e = h(t, n).join('')).match(l);
    return e;
  }
}
var d = function (e) {
    if ('string' != typeof e)
      throw new TypeError(
        'Expected `encodedURI` to be of type `string`, got `' + typeof e + '`'
      );
    try {
      return (e = e.replace(/\+/g, ' ')), decodeURIComponent(e);
    } catch (t) {
      return (function (e) {
        for (var n = { '%FE%FF': '��', '%FF%FE': '��' }, s = c.exec(e); s; ) {
          try {
            n[s[0]] = decodeURIComponent(s[0]);
          } catch (t) {
            var r = u(s[0]);
            r !== s[0] && (n[s[0]] = r);
          }
          s = c.exec(e);
        }
        n['%C2'] = '�';
        for (var i = Object.keys(n), o = 0; o < i.length; o++) {
          var a = i[o];
          e = e.replace(new RegExp(a, 'g'), n[a]);
        }
        return e;
      })(e);
    }
  },
  p = (e, t) => {
    if ('string' != typeof e || 'string' != typeof t)
      throw new TypeError('Expected the arguments to be of type `string`');
    if ('' === t) return [e];
    const n = e.indexOf(t);
    return -1 === n ? [e] : [e.slice(0, n), e.slice(n + t.length)];
  },
  m = function (e, t) {
    for (
      var n = {}, s = Object.keys(e), r = Array.isArray(t), i = 0;
      i < s.length;
      i++
    ) {
      var o = s[i],
        a = e[o];
      (r ? -1 !== t.indexOf(o) : t(o, a, e)) && (n[o] = a);
    }
    return n;
  };
!(function (e) {
  const t = a,
    n = d,
    s = p,
    r = m,
    i = Symbol('encodeFragmentIdentifier');
  function o(e) {
    if ('string' != typeof e || 1 !== e.length)
      throw new TypeError(
        'arrayFormatSeparator must be single character string'
      );
  }
  function l(e, n) {
    return n.encode ? (n.strict ? t(e) : encodeURIComponent(e)) : e;
  }
  function c(e, t) {
    return t.decode ? n(e) : e;
  }
  function h(e) {
    return Array.isArray(e)
      ? e.sort()
      : 'object' == typeof e
      ? h(Object.keys(e))
          .sort((e, t) => Number(e) - Number(t))
          .map(t => e[t])
      : e;
  }
  function u(e) {
    const t = e.indexOf('#');
    return -1 !== t && (e = e.slice(0, t)), e;
  }
  function f(e) {
    const t = (e = u(e)).indexOf('?');
    return -1 === t ? '' : e.slice(t + 1);
  }
  function g(e, t) {
    return (
      t.parseNumbers &&
      !Number.isNaN(Number(e)) &&
      'string' == typeof e &&
      '' !== e.trim()
        ? (e = Number(e))
        : !t.parseBooleans ||
          null === e ||
          ('true' !== e.toLowerCase() && 'false' !== e.toLowerCase()) ||
          (e = 'true' === e.toLowerCase()),
      e
    );
  }
  function y(e, t) {
    o(
      (t = Object.assign(
        {
          decode: !0,
          sort: !0,
          arrayFormat: 'none',
          arrayFormatSeparator: ',',
          parseNumbers: !1,
          parseBooleans: !1,
        },
        t
      )).arrayFormatSeparator
    );
    const n = (function (e) {
        let t;
        switch (e.arrayFormat) {
          case 'index':
            return (e, n, s) => {
              (t = /\[(\d*)\]$/.exec(e)),
                (e = e.replace(/\[\d*\]$/, '')),
                t
                  ? (void 0 === s[e] && (s[e] = {}), (s[e][t[1]] = n))
                  : (s[e] = n);
            };
          case 'bracket':
            return (e, n, s) => {
              (t = /(\[\])$/.exec(e)),
                (e = e.replace(/\[\]$/, '')),
                t
                  ? void 0 !== s[e]
                    ? (s[e] = [].concat(s[e], n))
                    : (s[e] = [n])
                  : (s[e] = n);
            };
          case 'colon-list-separator':
            return (e, n, s) => {
              (t = /(:list)$/.exec(e)),
                (e = e.replace(/:list$/, '')),
                t
                  ? void 0 !== s[e]
                    ? (s[e] = [].concat(s[e], n))
                    : (s[e] = [n])
                  : (s[e] = n);
            };
          case 'comma':
          case 'separator':
            return (t, n, s) => {
              const r =
                  'string' == typeof n && n.includes(e.arrayFormatSeparator),
                i =
                  'string' == typeof n &&
                  !r &&
                  c(n, e).includes(e.arrayFormatSeparator);
              n = i ? c(n, e) : n;
              const o =
                r || i
                  ? n.split(e.arrayFormatSeparator).map(t => c(t, e))
                  : null === n
                  ? n
                  : c(n, e);
              s[t] = o;
            };
          case 'bracket-separator':
            return (t, n, s) => {
              const r = /(\[\])$/.test(t);
              if (((t = t.replace(/\[\]$/, '')), !r))
                return void (s[t] = n ? c(n, e) : n);
              const i =
                null === n
                  ? []
                  : n.split(e.arrayFormatSeparator).map(t => c(t, e));
              void 0 !== s[t] ? (s[t] = [].concat(s[t], i)) : (s[t] = i);
            };
          default:
            return (e, t, n) => {
              void 0 !== n[e] ? (n[e] = [].concat(n[e], t)) : (n[e] = t);
            };
        }
      })(t),
      r = Object.create(null);
    if ('string' != typeof e) return r;
    if (!(e = e.trim().replace(/^[?#&]/, ''))) return r;
    for (const i of e.split('&')) {
      if ('' === i) continue;
      let [e, o] = s(t.decode ? i.replace(/\+/g, ' ') : i, '=');
      (o =
        void 0 === o
          ? null
          : ['comma', 'separator', 'bracket-separator'].includes(t.arrayFormat)
          ? o
          : c(o, t)),
        n(c(e, t), o, r);
    }
    for (const s of Object.keys(r)) {
      const e = r[s];
      if ('object' == typeof e && null !== e)
        for (const n of Object.keys(e)) e[n] = g(e[n], t);
      else r[s] = g(e, t);
    }
    return !1 === t.sort
      ? r
      : (!0 === t.sort
          ? Object.keys(r).sort()
          : Object.keys(r).sort(t.sort)
        ).reduce((e, t) => {
          const n = r[t];
          return (
            Boolean(n) && 'object' == typeof n && !Array.isArray(n)
              ? (e[t] = h(n))
              : (e[t] = n),
            e
          );
        }, Object.create(null));
  }
  (e.extract = f),
    (e.parse = y),
    (e.stringify = (e, t) => {
      if (!e) return '';
      o(
        (t = Object.assign(
          {
            encode: !0,
            strict: !0,
            arrayFormat: 'none',
            arrayFormatSeparator: ',',
          },
          t
        )).arrayFormatSeparator
      );
      const n = n =>
          (t.skipNull && null == e[n]) || (t.skipEmptyString && '' === e[n]),
        s = (function (e) {
          switch (e.arrayFormat) {
            case 'index':
              return t => (n, s) => {
                const r = n.length;
                return void 0 === s ||
                  (e.skipNull && null === s) ||
                  (e.skipEmptyString && '' === s)
                  ? n
                  : null === s
                  ? [...n, [l(t, e), '[', r, ']'].join('')]
                  : [...n, [l(t, e), '[', l(r, e), ']=', l(s, e)].join('')];
              };
            case 'bracket':
              return t => (n, s) =>
                void 0 === s ||
                (e.skipNull && null === s) ||
                (e.skipEmptyString && '' === s)
                  ? n
                  : null === s
                  ? [...n, [l(t, e), '[]'].join('')]
                  : [...n, [l(t, e), '[]=', l(s, e)].join('')];
            case 'colon-list-separator':
              return t => (n, s) =>
                void 0 === s ||
                (e.skipNull && null === s) ||
                (e.skipEmptyString && '' === s)
                  ? n
                  : null === s
                  ? [...n, [l(t, e), ':list='].join('')]
                  : [...n, [l(t, e), ':list=', l(s, e)].join('')];
            case 'comma':
            case 'separator':
            case 'bracket-separator': {
              const t = 'bracket-separator' === e.arrayFormat ? '[]=' : '=';
              return n => (s, r) =>
                void 0 === r ||
                (e.skipNull && null === r) ||
                (e.skipEmptyString && '' === r)
                  ? s
                  : ((r = null === r ? '' : r),
                    0 === s.length
                      ? [[l(n, e), t, l(r, e)].join('')]
                      : [[s, l(r, e)].join(e.arrayFormatSeparator)]);
            }
            default:
              return t => (n, s) =>
                void 0 === s ||
                (e.skipNull && null === s) ||
                (e.skipEmptyString && '' === s)
                  ? n
                  : null === s
                  ? [...n, l(t, e)]
                  : [...n, [l(t, e), '=', l(s, e)].join('')];
          }
        })(t),
        r = {};
      for (const o of Object.keys(e)) n(o) || (r[o] = e[o]);
      const i = Object.keys(r);
      return (
        !1 !== t.sort && i.sort(t.sort),
        i
          .map(n => {
            const r = e[n];
            return void 0 === r
              ? ''
              : null === r
              ? l(n, t)
              : Array.isArray(r)
              ? 0 === r.length && 'bracket-separator' === t.arrayFormat
                ? l(n, t) + '[]'
                : r.reduce(s(n), []).join('&')
              : l(n, t) + '=' + l(r, t);
          })
          .filter(e => e.length > 0)
          .join('&')
      );
    }),
    (e.parseUrl = (e, t) => {
      t = Object.assign({ decode: !0 }, t);
      const [n, r] = s(e, '#');
      return Object.assign(
        { url: n.split('?')[0] || '', query: y(f(e), t) },
        t && t.parseFragmentIdentifier && r
          ? { fragmentIdentifier: c(r, t) }
          : {}
      );
    }),
    (e.stringifyUrl = (t, n) => {
      n = Object.assign({ encode: !0, strict: !0, [i]: !0 }, n);
      const s = u(t.url).split('?')[0] || '',
        r = e.extract(t.url),
        o = e.parse(r, { sort: !1 }),
        a = Object.assign(o, t.query);
      let c = e.stringify(a, n);
      c && (c = `?${c}`);
      let h = (function (e) {
        let t = '';
        const n = e.indexOf('#');
        return -1 !== n && (t = e.slice(n)), t;
      })(t.url);
      return (
        t.fragmentIdentifier &&
          (h = `#${n[i] ? l(t.fragmentIdentifier, n) : t.fragmentIdentifier}`),
        `${s}${c}${h}`
      );
    }),
    (e.pick = (t, n, s) => {
      s = Object.assign({ parseFragmentIdentifier: !0, [i]: !1 }, s);
      const { url: o, query: a, fragmentIdentifier: l } = e.parseUrl(t, s);
      return e.stringifyUrl(
        { url: o, query: r(a, n), fragmentIdentifier: l },
        s
      );
    }),
    (e.exclude = (t, n, s) => {
      const r = Array.isArray(n) ? e => !n.includes(e) : (e, t) => !n(e, t);
      return e.pick(t, r, s);
    });
})(o);
class f {
  constructor(e, t, n) {
    (this.ctx = e),
      (this.destination = t),
      (this.instrument = n),
      (this.channel = n.channel),
      (this.key = n.key),
      (this.velocity = n.velocity),
      (this.buffer = n.sample),
      (this.playbackRate = n.basePlaybackRate),
      (this.loopStart = n.loopStart),
      (this.loopEnd = n.loopEnd),
      (this.sampleRate = n.sampleRate),
      (this.volume = n.volume),
      (this.panpot = n.panpot),
      (this.pitchBend = n.pitchBend),
      (this.pitchBendSensitivity = n.pitchBendSensitivity),
      (this.modEnvToPitch = n.modEnvToPitch),
      (this.expression = n.expression),
      (this.cutOffFrequency = n.cutOffFrequency),
      (this.hermonicContent = n.hermonicContent),
      (this.reverb = n.reverb),
      (this.startTime = e.currentTime),
      (this.computedPlaybackRate = 0 | this.playbackRate),
      (this.noteOffState = !1),
      (this.audioBuffer = null),
      (this.bufferSource = e.createBufferSource()),
      (this.panner = e.createPanner()),
      (this.outputGainNode = e.createGain()),
      (this.expressionGainNode = e.createGain()),
      (this.filter = e.createBiquadFilter()),
      (this.modulator = e.createBiquadFilter());
  }
  noteOn() {
    const e = this.ctx,
      t = this.instrument,
      n = this.ctx.currentTime || 0,
      s = n + t.volDelay,
      r = n + t.modDelay,
      i = s + t.volAttack,
      o = s + t.modAttack,
      a = i + t.volHold,
      l = o + t.modHold,
      c = a + t.volDecay,
      h = l + t.modDecay,
      u = t.loopStart / this.sampleRate,
      d = t.loopEnd / this.sampleRate,
      p = t.start / this.sampleRate,
      m = 0 !== t.pan ? t.pan : this.panpot,
      f = this.buffer.subarray(0, this.buffer.length + t.end),
      g = (this.audioBuffer = e.createBuffer(1, f.length, this.sampleRate));
    g.getChannelData(0).set(f);
    const y = this.bufferSource;
    (y.buffer = g),
      (y.loop = t.sampleModes || 0),
      (y.loopStart = u),
      (y.loopEnd = d),
      this.updatePitchBend(this.pitchBend);
    const v = this.outputGainNode;
    this.expressionGainNode.gain.value = this.expression / 127;
    const b = this.panner;
    (b.panningModel = 'equalpower'),
      (b.distanceModel = 'inverse'),
      b.setPosition(
        Math.sin((m * Math.PI) / 2),
        0,
        Math.cos((m * Math.PI) / 2)
      );
    let k =
      this.volume * (this.velocity / 127) * (1 - t.initialAttenuation / 1e3);
    k < 0 && (k = 0);
    const w = v.gain;
    w.setValueAtTime(0, n),
      w.setValueAtTime(0, s),
      w.setTargetAtTime(k, s, t.volAttack),
      w.setValueAtTime(k, a),
      w.linearRampToValueAtTime(k * (1 - t.volSustain), c);
    const S = t.initialFilterFc,
      E = t.initialFilterFc + t.modEnvToFilterFc,
      M = S + (E - S) * (1 - t.modSustain),
      C = this.modulator;
    C.Q.setValueAtTime(10 ** (t.initialFilterQ / 200), n),
      (C.frequency.value = S),
      (C.type = 'lowpass'),
      C.frequency.setTargetAtTime(S / 127, this.ctx.currentTime, 0.5),
      C.frequency.setValueAtTime(S, n),
      C.frequency.setValueAtTime(S, r),
      C.frequency.setTargetAtTime(E, r, parseFloat(t.modAttack + 1)),
      C.frequency.setValueAtTime(E, l),
      C.frequency.linearRampToValueAtTime(M, h),
      y.connect(C),
      C.connect(b),
      b.connect(this.expressionGainNode),
      t.mute || this.connect(),
      this.expressionGainNode.connect(v),
      y.start(0, p);
  }
  amountToFreq(e) {
    return 2 ** ((e - 6900) / 1200) * 440;
  }
  noteOff() {
    this.noteOffState = !0;
  }
  isNoteOff() {
    return this.noteOffState;
  }
  release() {
    const e = this.instrument,
      t = this.bufferSource,
      n = this.outputGainNode,
      s = this.ctx.currentTime,
      r = e.releaseTime - 64,
      i = s + e.volRelease * n.gain.value * (1 + r / (r < 0 ? 64 : 63)),
      o = this.modulator,
      a = e.initialFilterFc,
      l = e.initialFilterFc + e.modEnvToFilterFc,
      c = s + e.modRelease * (a === l ? 1 : (o.frequency.value - a) / (l - a));
    if (this.audioBuffer)
      switch (e.sampleModes) {
        case 0:
          t.loop = !1;
          break;
        case 1:
          n.gain.cancelScheduledValues(0),
            n.gain.setValueAtTime(n.gain.value, s),
            n.gain.linearRampToValueAtTime(0, i),
            o.frequency.cancelScheduledValues(0),
            o.frequency.setValueAtTime(o.frequency.value, s),
            o.frequency.linearRampToValueAtTime(a, c),
            t.playbackRate.cancelScheduledValues(0),
            t.playbackRate.setValueAtTime(t.playbackRate.value, s),
            t.playbackRate.linearRampToValueAtTime(
              this.computedPlaybackRate,
              c
            ),
            t.stop(i);
          break;
        case 2:
          break;
        case 3:
          n.gain.cancelScheduledValues(0),
            n.gain.setValueAtTime(n.gain.value, s),
            n.gain.linearRampToValueAtTime(0, i),
            o.frequency.cancelScheduledValues(0),
            o.frequency.setValueAtTime(o.frequency.value, s),
            o.frequency.linearRampToValueAtTime(a, c),
            t.playbackRate.cancelScheduledValues(0),
            t.playbackRate.setValueAtTime(t.playbackRate.value, s),
            t.playbackRate.linearRampToValueAtTime(
              this.computedPlaybackRate,
              c
            ),
            (t.loop = !1),
            (t.buffer = null);
      }
  }
  connect() {
    this.reverb.connect(this.outputGainNode).connect(this.destination);
  }
  disconnect() {
    this.outputGainNode.disconnect(0);
  }
  schedulePlaybackRate() {
    const e = this.bufferSource.playbackRate,
      t = this.computedPlaybackRate,
      n = this.startTime,
      s = this.instrument,
      r = n + s.modAttack,
      i = r + s.modDecay,
      o =
        t *
        1.0594630943592953 **
          (this.modEnvToPitch * this.instrument.scaleTuning);
    e.cancelScheduledValues(0),
      e.setValueAtTime(t, n),
      e.linearRampToValueAtTime(o, r),
      e.linearRampToValueAtTime(t + (o - t) * (1 - s.modSustain), i);
  }
  updateExpression(e) {
    this.expressionGainNode.gain.value = (this.expression = e) / 127;
  }
  updatePitchBend(e) {
    (this.computedPlaybackRate =
      this.playbackRate *
      1.0594630943592953 **
        ((e / (e < 0 ? 8192 : 8191)) *
          this.pitchBendSensitivity *
          this.instrument.scaleTuning)),
      this.schedulePlaybackRate();
  }
}
/**
 * @logue/reverb
 *
 * @description JavaScript Reverb effect class
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2019-2022 By Masashi Yoshikawa All rights reserved.
 * @license MIT
 * @version 0.5.4
 * @see {@link https://github.com/logue/Reverb.js}
 */ const g = '0.5.4',
  y = '2022-07-08T12:56:05.192Z',
  v = 'white',
  b = 'pink',
  k = 'brown';
class w {
  constructor(e, t) {
    (this.version = g),
      (this.build = y),
      (this.ctx = e),
      (this._options = i(i({}, S), t)),
      (this.wetGainNode = this.ctx.createGain()),
      (this.dryGainNode = this.ctx.createGain()),
      (this.filterNode = this.ctx.createBiquadFilter()),
      (this.convolverNode = this.ctx.createConvolver()),
      (this.outputNode = this.ctx.createGain()),
      (this.isConnected = !1),
      this.buildImpulse(),
      this.mix(this._options.mix);
  }
  connect(e) {
    return this.isConnected && this._options.once
      ? ((this.isConnected = !1), this.outputNode)
      : (this.convolverNode.connect(this.filterNode),
        this.filterNode.connect(this.wetGainNode),
        e.connect(this.convolverNode),
        e.connect(this.dryGainNode).connect(this.outputNode),
        e.connect(this.wetGainNode).connect(this.outputNode),
        (this.isConnected = !0),
        this.outputNode);
  }
  disconnect(e) {
    return (
      this.isConnected &&
        (this.convolverNode.disconnect(this.filterNode),
        this.filterNode.disconnect(this.wetGainNode)),
      (this.isConnected = !1),
      e
    );
  }
  mix(e) {
    if (!this.inRange(e, 0, 1))
      throw new RangeError('Reverb.js: Dry/Wet ratio must be between 0 to 1.');
    (this._options.mix = e),
      (this.dryGainNode.gain.value = 1 - this._options.mix),
      (this.wetGainNode.gain.value = this._options.mix);
  }
  time(e) {
    if (!this.inRange(e, 1, 50))
      throw new RangeError(
        'Reverb.js: Time length of inpulse response must be less than 50sec.'
      );
    (this._options.time = e), this.buildImpulse();
  }
  decay(e) {
    if (!this.inRange(e, 0, 100))
      throw new RangeError(
        'Reverb.js: Inpulse Response decay level must be less than 100.'
      );
    (this._options.decay = e), this.buildImpulse();
  }
  delay(e) {
    if (!this.inRange(e, 0, 100))
      throw new RangeError(
        'Reverb.js: Inpulse Response delay time must be less than 100.'
      );
    (this._options.delay = e), this.buildImpulse();
  }
  reverse(e) {
    (this._options.reverse = e), this.buildImpulse();
  }
  filterType(e) {
    this.filterNode.type = this._options.filterType = e;
  }
  filterFreq(e) {
    if (!this.inRange(e, 20, 5e3))
      throw new RangeError(
        'Reverb.js: Filter frequrncy must be between 20 and 5000.'
      );
    (this._options.filterFreq = e),
      (this.filterNode.frequency.value = this._options.filterFreq);
  }
  filterQ(e) {
    if (!this.inRange(e, 0, 10))
      throw new RangeError(
        'Reverb.js: Filter quality value must be between 0 and 10.'
      );
    (this._options.filterQ = e),
      (this.filterNode.Q.value = this._options.filterQ);
  }
  setNoise(e) {
    (this._options.noise = e), this.buildImpulse();
  }
  inRange(e, t, n) {
    return (e - t) * (e - n) <= 0;
  }
  buildImpulse() {
    const e = this.ctx.sampleRate,
      t = Math.max(e * this._options.time, 1),
      n = e * this._options.delay,
      s = this.ctx.createBuffer(2, t, e),
      r = new Float32Array(t),
      i = new Float32Array(t),
      o = [0, 0, 0, 0, 0, 0, 0];
    for (let a = 0; a < t; a++) {
      let e = 0;
      switch (
        (a < n
          ? ((r[a] = 0),
            (i[a] = 0),
            (e = this._options.reverse ? t - (a - n) : a - n))
          : (e = this._options.reverse ? t - a : a),
        this._options.noise)
      ) {
        case b:
          (o[0] = 0.99886 * o[0] + 0.0555179 * w.whiteNoise()),
            (o[1] = 0.99332 * o[1] + 0.0750759 * w.whiteNoise()),
            (o[2] = 0.969 * o[2] + 0.153852 * w.whiteNoise()),
            (o[3] = 0.8665 * o[3] + 0.3104856 * w.whiteNoise()),
            (o[4] = 0.55 * o[4] + 0.5329522 * w.whiteNoise()),
            (o[5] = -0.7616 * o[5] - 0.016898 * w.whiteNoise()),
            (r[a] =
              o[0] +
              o[1] +
              o[2] +
              o[3] +
              o[4] +
              o[5] +
              o[6] +
              0.5362 * w.whiteNoise()),
            (i[a] =
              o[0] +
              o[1] +
              o[2] +
              o[3] +
              o[4] +
              o[5] +
              o[6] +
              0.5362 * w.whiteNoise()),
            (r[a] *= 0.11),
            (i[a] *= 0.11),
            (o[6] = 0.115926 * w.whiteNoise());
          break;
        case k:
          (r[a] = (o[0] + 0.02 * w.whiteNoise()) / 1.02),
            (o[0] = r[a]),
            (i[a] = (o[1] + 0.02 * w.whiteNoise()) / 1.02),
            (o[1] = i[a]),
            (r[a] *= 3.5),
            (i[a] *= 3.5);
          break;
        default:
          (r[a] = w.whiteNoise()), (i[a] = w.whiteNoise());
      }
      (r[a] *= (1 - e / t) ** this._options.decay),
        (i[a] *= (1 - e / t) ** this._options.decay);
    }
    s.getChannelData(0).set(r),
      s.getChannelData(1).set(i),
      (this.convolverNode.buffer = s);
  }
  static whiteNoise() {
    return 2 * Math.random() - 1;
  }
}
const S = {
  noise: v,
  decay: 2,
  delay: 0,
  reverse: !1,
  time: 2,
  filterType: 'lowpass',
  filterFreq: 2200,
  filterQ: 1,
  mix: 0.5,
  once: !1,
};
class E {
  constructor(e, t = {}) {
    (this.input = e),
      (this.ip = t.index || 0),
      (this.length = t.length || e.length - this.ip),
      (this.chunkList = []),
      (this.offset = this.ip),
      (this.padding = void 0 === t.padding || t.padding),
      (this.bigEndian = void 0 !== t.bigEndian && t.bigEndian);
  }
  parse() {
    const e = this.length + this.offset;
    for (this.chunkList = []; this.ip < e; ) this.parseChunk();
  }
  parseChunk() {
    const e = this.input;
    let t,
      n = this.ip;
    this.chunkList.push(
      new M(
        String.fromCharCode(e[n++], e[n++], e[n++], e[n++]),
        (t = this.bigEndian
          ? ((e[n++] << 24) | (e[n++] << 16) | (e[n++] << 8) | e[n++]) >>> 0
          : (e[n++] | (e[n++] << 8) | (e[n++] << 16) | (e[n++] << 24)) >>> 0),
        n
      )
    ),
      (n += t),
      this.padding && 1 == ((n - this.offset) & 1) && n++,
      (this.ip = n);
  }
  getChunk(e) {
    const t = this.chunkList[e];
    return void 0 === t ? null : t;
  }
  getNumberOfChunks() {
    return this.chunkList.length;
  }
}
class M {
  constructor(e, t, n) {
    (this.type = e), (this.size = t), (this.offset = n);
  }
}
class C {
  constructor(e, t = {}) {
    (this.input = e),
      (this.parserOption = t.parserOption || {}),
      (this.sampleRate = t.sampleRate || 22050),
      (this.presetHeader = []),
      (this.presetZone = []),
      (this.presetZoneModulator = []),
      (this.presetZoneGenerator = []),
      (this.instrument = []),
      (this.instrumentZone = []),
      (this.instrumentZoneModulator = []),
      (this.instrumentZoneGenerator = []),
      (this.sampleHeader = []),
      (this.GeneratorEnumeratorTable = Object.keys(this.getGeneratorTable()));
  }
  getGeneratorTable() {
    return Object.freeze({
      startAddrsOffset: 0,
      endAddrsOffset: 0,
      startloopAddrsOffset: 0,
      endloopAddrsOffset: 0,
      startAddrsCoarseOffset: 0,
      modLfoToPitch: 0,
      vibLfoToPitch: 0,
      modEnvToPitch: 0,
      initialFilterFc: 13500,
      initialFilterQ: 0,
      modLfoToFilterFc: 0,
      modEnvToFilterFc: 0,
      endAddrsCoarseOffset: 0,
      modLfoToVolume: 0,
      unused1: void 0,
      chorusEffectsSend: 0,
      reverbEffectsSend: 0,
      pan: 0,
      unused2: void 0,
      unused3: void 0,
      unused4: void 0,
      delayModLFO: -12e3,
      freqModLFO: 0,
      delayVibLFO: -12e3,
      freqVibLFO: 0,
      delayModEnv: -12e3,
      attackModEnv: -12e3,
      holdModEnv: -12e3,
      decayModEnv: -12e3,
      sustainModEnv: 0,
      releaseModEnv: -12e3,
      keynumToModEnvHold: 0,
      keynumToModEnvDecay: 0,
      delayVolEnv: -12e3,
      attackVolEnv: -12e3,
      holdVolEnv: -12e3,
      decayVolEnv: -12e3,
      sustainVolEnv: 0,
      releaseVolEnv: -12e3,
      keynumToVolEnvHold: 0,
      keynumToVolEnvDecay: 0,
      instrument: null,
      reserved1: void 0,
      keyRange: null,
      velRange: null,
      startloopAddrsCoarseOffset: 0,
      keynum: null,
      velocity: null,
      initialAttenuation: 0,
      reserved2: void 0,
      endloopAddrsCoarseOffset: 0,
      coarseTune: 0,
      fineTune: 0,
      sampleID: null,
      sampleModes: 0,
      reserved3: void 0,
      scaleTuning: 100,
      exclusiveClass: null,
      overridingRootKey: null,
      unuded5: void 0,
      endOper: void 0,
    });
  }
  parse() {
    const e = new E(this.input, this.parserOption);
    if ((e.parse(), 1 !== e.chunkList.length))
      throw new Error('wrong chunk length');
    const t = e.getChunk(0);
    if (null === t) throw new Error('chunk not found');
    this.parseRiffChunk(t), (this.input = null);
  }
  parseRiffChunk(e) {
    const t = this.input;
    let n = e.offset;
    if ('RIFF' !== e.type) throw new Error('invalid chunk type:' + e.type);
    const s = String.fromCharCode(t[n++], t[n++], t[n++], t[n++]);
    if ('sfbk' !== s) throw new Error('invalid signature:' + s);
    const r = new E(t, { index: n, length: e.size - 4 });
    if ((r.parse(), 3 !== r.getNumberOfChunks()))
      throw new Error('invalid sfbk structure');
    this.parseInfoList(r.getChunk(0)),
      this.parseSdtaList(r.getChunk(1)),
      this.parsePdtaList(r.getChunk(2));
  }
  parseInfoList(e) {
    const t = this.input;
    let n = e.offset;
    if ('LIST' !== e.type) throw new Error('invalid chunk type:' + e.type);
    const s = String.fromCharCode(t[n++], t[n++], t[n++], t[n++]);
    if ('INFO' !== s) throw new Error('invalid signature:' + s);
    new E(t, { index: n, length: e.size - 4 }).parse();
  }
  parseSdtaList(e) {
    const t = this.input;
    let n = e.offset;
    if ('LIST' !== e.type) throw new Error('invalid chunk type:' + e.type);
    const s = String.fromCharCode(t[n++], t[n++], t[n++], t[n++]);
    if ('sdta' !== s) throw new Error('invalid signature:' + s);
    const r = new E(t, { index: n, length: e.size - 4 });
    if ((r.parse(), 1 !== r.chunkList.length)) throw new Error('TODO');
    this.samplingData = r.getChunk(0);
  }
  parsePdtaList(e) {
    const t = this.input;
    let n = e.offset;
    if ('LIST' !== e.type) throw new Error('invalid chunk type:' + e.type);
    const s = String.fromCharCode(t[n++], t[n++], t[n++], t[n++]);
    if ('pdta' !== s) throw new Error('invalid signature:' + s);
    const r = new E(t, { index: n, length: e.size - 4 });
    if ((r.parse(), 9 !== r.getNumberOfChunks()))
      throw new Error('invalid pdta chunk');
    this.parsePhdr(r.getChunk(0)),
      this.parsePbag(r.getChunk(1)),
      this.parsePmod(r.getChunk(2)),
      this.parsePgen(r.getChunk(3)),
      this.parseInst(r.getChunk(4)),
      this.parseIbag(r.getChunk(5)),
      this.parseImod(r.getChunk(6)),
      this.parseIgen(r.getChunk(7)),
      this.parseShdr(r.getChunk(8));
  }
  parsePhdr(e) {
    const t = this.input;
    let n = e.offset;
    const s = (this.presetHeader = []),
      r = e.offset + e.size;
    if ('phdr' !== e.type) throw new Error('invalid chunk type:' + e.type);
    for (; n < r; )
      s.push({
        presetName: String.fromCharCode.apply(null, t.subarray(n, (n += 20))),
        preset: t[n++] | (t[n++] << 8),
        bank: t[n++] | (t[n++] << 8),
        presetBagIndex: t[n++] | (t[n++] << 8),
        library:
          (t[n++] | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>> 0,
        genre: (t[n++] | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>> 0,
        morphology:
          (t[n++] | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>> 0,
      });
  }
  parsePbag(e) {
    const t = this.input;
    let n = e.offset;
    const s = (this.presetZone = []),
      r = e.offset + e.size;
    if ('pbag' !== e.type) throw new Error('invalid chunk type:' + e.type);
    for (; n < r; )
      s.push({
        presetGeneratorIndex: t[n++] | (t[n++] << 8),
        presetModulatorIndex: t[n++] | (t[n++] << 8),
      });
  }
  parsePmod(e) {
    if ('pmod' !== e.type) throw new Error('invalid chunk type:' + e.type);
    this.presetZoneModulator = this.parseModulator(e);
  }
  parsePgen(e) {
    if ('pgen' !== e.type) throw new Error('invalid chunk type:' + e.type);
    this.presetZoneGenerator = this.parseGenerator(e);
  }
  parseInst(e) {
    const t = this.input;
    let n = e.offset;
    const s = (this.instrument = []),
      r = e.offset + e.size;
    if ('inst' !== e.type) throw new Error('invalid chunk type:' + e.type);
    for (; n < r; )
      s.push({
        instrumentName: String.fromCharCode.apply(
          null,
          t.subarray(n, (n += 20))
        ),
        instrumentBagIndex: t[n++] | (t[n++] << 8),
      });
  }
  parseIbag(e) {
    const t = this.input;
    let n = e.offset;
    const s = (this.instrumentZone = []),
      r = e.offset + e.size;
    if ('ibag' !== e.type) throw new Error('invalid chunk type:' + e.type);
    for (; n < r; )
      s.push({
        instrumentGeneratorIndex: t[n++] | (t[n++] << 8),
        instrumentModulatorIndex: t[n++] | (t[n++] << 8),
      });
  }
  parseImod(e) {
    if ('imod' !== e.type) throw new Error('invalid chunk type:' + e.type);
    this.instrumentZoneModulator = this.parseModulator(e);
  }
  parseIgen(e) {
    if ('igen' !== e.type) throw new Error('invalid chunk type:' + e.type);
    this.instrumentZoneGenerator = this.parseGenerator(e);
  }
  parseShdr(e) {
    const t = this.input;
    let n = e.offset;
    const s = (this.sample = []),
      r = (this.sampleHeader = []),
      i = e.offset + e.size;
    let o, a, l, c, h, u, d, p, m, f;
    if ('shdr' !== e.type) throw new Error('invalid chunk type:' + e.type);
    for (; n < i; ) {
      (o = String.fromCharCode.apply(null, t.subarray(n, (n += 20)))),
        (a =
          ((t[n++] << 0) | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>>
          0),
        (l =
          ((t[n++] << 0) | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>>
          0),
        (c =
          ((t[n++] << 0) | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>>
          0),
        (h =
          ((t[n++] << 0) | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>>
          0),
        (u =
          ((t[n++] << 0) | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24)) >>>
          0),
        (d = t[n++]),
        (p = (t[n++] << 24) >> 24),
        (m = t[n++] | (t[n++] << 8)),
        (f = t[n++] | (t[n++] << 8));
      let e = new Int16Array(
        new Uint8Array(
          t.subarray(
            this.samplingData.offset + 2 * a,
            this.samplingData.offset + 2 * l
          )
        ).buffer
      );
      if (((c -= a), (h -= a), u > 0)) {
        const t = this.adjustSampleData(e, u);
        (e = t.sample), (u *= t.multiply), (c *= t.multiply), (h *= t.multiply);
      }
      s.push(e),
        r.push({
          sampleName: o,
          start: a,
          end: l,
          startLoop: c,
          endLoop: h,
          sampleRate: u,
          originalPitch: d,
          pitchCorrection: p,
          sampleLink: m,
          sampleType: f,
        });
    }
  }
  adjustSampleData(e, t) {
    let n,
      s,
      r,
      i,
      o = 1;
    for (; t < this.sampleRate; ) {
      for (
        n = new Int16Array(2 * e.length), s = i = 0, r = e.length;
        s < r;
        ++s
      )
        (n[i++] = e[s]), (n[i++] = e[s]);
      (e = n), (o *= 2), (t *= 2);
    }
    return { sample: e, multiply: o };
  }
  parseModulator(e) {
    const t = this.input;
    let n = e.offset;
    const s = e.offset + e.size;
    let r, i;
    const o = [];
    for (; n < s; ) {
      if (
        ((n += 2),
        (r = t[n++] | (t[n++] << 8)),
        (i = this.GeneratorEnumeratorTable[r]),
        void 0 === i)
      )
        o.push({
          type: i,
          value: {
            code: r,
            amount: t[n] | (((t[n + 1] << 8) << 16) >> 16),
            lo: t[n++],
            hi: t[n++],
          },
        });
      else
        switch (i) {
          case 'keyRange':
          case 'velRange':
          case 'keynum':
          case 'velocity':
            o.push({
              type: i,
              value: { amount: null, lo: t[n++], hi: t[n++] },
            });
            break;
          default:
            o.push({
              type: i,
              value: { amount: t[n++] | (((t[n++] << 8) << 16) >> 16) },
            });
        }
      (n += 2), (n += 2);
    }
    return o;
  }
  parseGenerator(e) {
    const t = this.input;
    let n = e.offset;
    const s = e.offset + e.size;
    let r, i;
    const o = [];
    for (; n < s; )
      if (
        ((r = t[n++] | (t[n++] << 8)),
        (i = this.GeneratorEnumeratorTable[r]),
        void 0 !== i)
      )
        switch (i) {
          case 'keynum':
          case 'keyRange':
          case 'velRange':
          case 'velocity':
            o.push({
              type: i,
              value: { amount: null, lo: t[n++], hi: t[n++] },
            });
            break;
          default:
            o.push({
              type: i,
              value: { amount: t[n++] | (((t[n++] << 8) << 16) >> 16) },
            });
        }
      else
        o.push({
          type: i,
          value: {
            code: r,
            amount: t[n] | (((t[n + 1] << 8) << 16) >> 16),
            lo: t[n++],
            hi: t[n++],
          },
        });
    return o;
  }
  createInstrument() {
    const e = this.instrument,
      t = this.instrumentZone,
      n = [];
    let s, r, i, o, a, l, c, h, u;
    for (l = 0, c = e.length; l < c; ++l) {
      for (
        s = e[l].instrumentBagIndex,
          r = e[l + 1] ? e[l + 1].instrumentBagIndex : t.length,
          i = [],
          h = s,
          u = r;
        h < u;
        ++h
      )
        (o = this.createInstrumentGenerator_(t, h)),
          (a = this.createInstrumentModulator_(t, h)),
          i.push({
            generator: o.generator,
            generatorSequence: o.generatorInfo,
            modulator: a.modulator,
            modulatorSequence: a.modulatorInfo,
          });
      n.push({ name: e[l].instrumentName, info: i });
    }
    return n;
  }
  createPreset() {
    const e = this.presetHeader,
      t = this.presetZone,
      n = [];
    let s, r, i, o, a, l, c, h, u, d;
    for (c = 0, h = e.length; c < h; ++c) {
      for (
        s = e[c].presetBagIndex,
          r = e[c + 1] ? e[c + 1].presetBagIndex : t.length,
          i = [],
          u = s,
          d = r;
        u < d;
        ++u
      )
        (a = this.createPresetGenerator_(t, u)),
          (l = this.createPresetModulator_(t, u)),
          i.push({
            generator: a.generator,
            generatorSequence: a.generatorInfo,
            modulator: l.modulator,
            modulatorSequence: l.modulatorInfo,
          }),
          (o =
            void 0 !== a.generator.instrument
              ? a.generator.instrument.amount
              : void 0 !== l.modulator.instrument
              ? l.modulator.instrument.amount
              : null);
      n.push({ name: e[c].presetName, info: i, header: e[c], instrument: o });
    }
    return n;
  }
  createInstrumentGenerator_(e, t) {
    const n = this.createBagModGen_(
      e,
      e[t].instrumentGeneratorIndex,
      e[t + 1]
        ? e[t + 1].instrumentGeneratorIndex
        : this.instrumentZoneGenerator.length,
      this.instrumentZoneGenerator
    );
    return { generator: n.modgen, generatorInfo: n.modgenInfo };
  }
  createInstrumentModulator_(e, t) {
    const n = this.createBagModGen_(
      e,
      e[t].presetModulatorIndex,
      e[t + 1]
        ? e[t + 1].instrumentModulatorIndex
        : this.instrumentZoneModulator.length,
      this.instrumentZoneModulator
    );
    return { modulator: n.modgen, modulatorInfo: n.modgenInfo };
  }
  createPresetGenerator_(e, t) {
    const n = this.createBagModGen_(
      e,
      e[t].presetGeneratorIndex,
      e[t + 1]
        ? e[t + 1].presetGeneratorIndex
        : this.presetZoneGenerator.length,
      this.presetZoneGenerator
    );
    return { generator: n.modgen, generatorInfo: n.modgenInfo };
  }
  createPresetModulator_(e, t) {
    const n = this.createBagModGen_(
      e,
      e[t].presetModulatorIndex,
      e[t + 1]
        ? e[t + 1].presetModulatorIndex
        : this.presetZoneModulator.length,
      this.presetZoneModulator
    );
    return { modulator: n.modgen, modulatorInfo: n.modgenInfo };
  }
  createBagModGen_(e, t, n, s) {
    const r = [],
      i = { unknown: [], keyRange: { amount: null, hi: 127, lo: 0 } };
    let o, a, l;
    for (a = t, l = n; a < l; ++a)
      (o = s[a]),
        r.push(o),
        'unknown' === o.type ? i.unknown.push(o.value) : (i[o.type] = o.value);
    return { modgen: i, modgenInfo: r };
  }
}
class A {
  constructor(e) {
    let t, n;
    for (
      this.input = e,
        this.parser = {},
        this.bank = 0,
        this.bankSet = {},
        this.bufferSize = 2048,
        this.ctx = this.getAudioContext(),
        this.gainMaster = this.ctx.createGain(),
        this.bufSrc = this.ctx.createBufferSource(),
        this.channelInstrument = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        this.channelBank = [0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0],
        this.channelVolume = [
          100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
          100, 100,
        ],
        this.channelPanpot = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.channelPitchBend = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        this.channelPitchBendSensitivity = [
          2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        ],
        this.channelExpression = [
          127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,
          127, 127,
        ],
        this.channelAttack = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.channelDecay = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.channelSustin = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.channelRelease = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.channelHold = [
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
        ],
        this.channelHarmonicContent = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.channelCutOffFrequency = [
          64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
        ],
        this.isGS = !1,
        this.isXG = !1,
        this.programSet = [],
        this.channelMute = [
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
        ],
        this.currentNoteOn = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
        ],
        this.baseVolume = 1 / 65535,
        this.masterVolume = 16384,
        this.percussionPart = [
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
          !0,
          !1,
          !1,
          !1,
          !1,
          !1,
          !1,
        ],
        this.percussionVolume = new Array(128),
        t = 0,
        n = this.percussionVolume.length;
      t < n;
      ++t
    )
      this.percussionVolume[t] = 127;
    for (
      this.programSet = {},
        this.reverb = [],
        this.modulation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        this.filter = [],
        t = 0;
      t < 16;
      ++t
    )
      (this.reverb[t] = new w(this.ctx, {
        time: 1.1,
        noise: 'brown',
        once: !1,
        filterType: 'lowpass',
      })),
        (this.filter[t] = this.ctx.createBiquadFilter());
    (this.items = []),
      (this.intersection = new IntersectionObserver(
        e =>
          e.forEach(e => (e.target.dataset.isIntersecting = e.isIntersecting)),
        {}
      )),
      (this.timer = null);
  }
  getAudioContext() {
    const e = new (window.AudioContext || window.webkitAudioContext)();
    e.createGain = e.createGain || e.createGainNode;
    const t = () => {
      document.removeEventListener('touchstart', t);
      const n = e.createBufferSource();
      n.start(), n.stop();
    };
    return document.addEventListener('touchstart', t), e;
  }
  init(e = 'GM') {
    this.gainMaster.disconnect(),
      this.refreshInstruments(this.input),
      (this.isXG = !1),
      (this.isGS = !1);
    for (let t = 0; t < 16; ++t)
      this.programChange(t, 0),
        this.volumeChange(t, 100),
        this.panpotChange(t, 64),
        this.pitchBend(t, 0, 64),
        this.pitchBendSensitivity(t, 2),
        this.hold(t, 0),
        this.expression(t, 127),
        this.bankSelectMsb(t, 9 === t ? 127 : 0),
        this.attackTime(t, 64),
        this.decayTime(t, 64),
        this.sustinTime(t, 64),
        this.releaseTime(t, 64),
        this.harmonicContent(t, 64),
        this.cutOffFrequency(t, 64),
        this.reverbDepth(t, 40),
        this.modulationDepth(t, 0),
        this.updateBankSelect(t),
        this.updateProgramSelect(t);
    'XG' == e ? (this.isXG = !0) : 'GS' == e && (this.isGS = !0),
      this.setPercussionPart(9, !0);
    for (let t = 0; t < 128; ++t) this.percussionVolume[t] = 127;
    this.gainMaster.connect(this.ctx.destination),
      this.element &&
        (this.element.querySelector('.header .keys div').innerText =
          e + ' Mode'),
      (this.element.dataset.mode = e);
  }
  close() {
    this.ctx.close();
  }
  refreshInstruments(e) {
    (this.input = e),
      (this.parser = new C(e, { sampleRate: this.ctx.sampleRate })),
      (this.bankSet = this.createAllInstruments());
  }
  createAllInstruments() {
    const e = this.parser;
    e.parse();
    const t = e.createPreset(),
      n = e.createInstrument(),
      s = [];
    let r, i, o, a, l, c, h, u, d, p;
    const m = [];
    for (c = 0, h = t.length; c < h; ++c)
      if (
        ((o = t[c]),
        (l = o.header.preset),
        (i = o.header.bank),
        (p = o.name.replace(/\0*$/, '')),
        'number' == typeof o.instrument &&
          ((a = n[o.instrument]), 'EOI' !== a.name.replace(/\0*$/, '')))
      ) {
        for (
          void 0 === s[i] && (s[i] = []),
            r = s[i],
            r[l] = {},
            r[l].name = p,
            u = 0,
            d = a.info.length;
          u < d;
          ++u
        )
          this.createNoteInfo(e, a.info[u], r[l]);
        m[i] || (m[i] = {}), (m[i][l] = p);
      }
    return (this.programSet = m), s;
  }
  createNoteInfo(e, t, n) {
    const s = t.generator;
    if (!s.keyRange || !s.sampleID) return;
    const r = this.getModGenAmount(s, 'delayVolEnv'),
      i = this.getModGenAmount(s, 'attackVolEnv'),
      o = this.getModGenAmount(s, 'holdVolEnv'),
      a = this.getModGenAmount(s, 'decayVolEnv'),
      l = this.getModGenAmount(s, 'sustainVolEnv'),
      c = this.getModGenAmount(s, 'releaseVolEnv'),
      h = this.getModGenAmount(s, 'delayModEnv'),
      u = this.getModGenAmount(s, 'attackModEnv'),
      d = this.getModGenAmount(s, 'holdModEnv'),
      p = this.getModGenAmount(s, 'decayModEnv'),
      m = this.getModGenAmount(s, 'sustainModEnv'),
      f = this.getModGenAmount(s, 'releaseModEnv'),
      g = this.getModGenAmount(s, 'scaleTuning') / 100,
      y =
        this.getModGenAmount(s, 'coarseTune') +
        this.getModGenAmount(s, 'fineTune') / 100,
      v = this.getModGenAmount(s, 'sampleModes');
    for (let b = s.keyRange.lo, k = s.keyRange.hi; b <= k; ++b) {
      if (n[b]) continue;
      const t = this.getModGenAmount(s, 'sampleID'),
        k = e.sampleHeader[t];
      n[b] = {
        sample: e.sample[t],
        sampleRate: k.sampleRate,
        sampleModes: v,
        basePlaybackRate:
          1.0594630943592953 **
          ((b -
            this.getModGenAmount(s, 'overridingRootKey', k.originalPitch) +
            y +
            k.pitchCorrection / 100) *
            g),
        modEnvToPitch: this.getModGenAmount(s, 'modEnvToPitch') / 100,
        scaleTuning: g,
        start:
          32768 * this.getModGenAmount(s, 'startAddrsCoarseOffset') +
          this.getModGenAmount(s, 'startAddrsOffset'),
        end:
          32768 * this.getModGenAmount(s, 'endAddrsCoarseOffset') +
          this.getModGenAmount(s, 'endAddrsOffset'),
        loopStart:
          k.startLoop +
          32768 * this.getModGenAmount(s, 'startloopAddrsCoarseOffset') +
          this.getModGenAmount(s, 'startloopAddrsOffset'),
        loopEnd:
          k.endLoop +
          32768 * this.getModGenAmount(s, 'endloopAddrsCoarseOffset') +
          this.getModGenAmount(s, 'endloopAddrsOffset'),
        volDelay: 2 ** (r / 1200),
        volAttack: 2 ** (i / 1200),
        volHold:
          2 ** (o / 1200) *
          2 **
            (((60 - b) * this.getModGenAmount(s, 'keynumToVolEnvHold')) / 1200),
        volDecay:
          2 ** (a / 1200) *
          2 **
            (((60 - b) * this.getModGenAmount(s, 'keynumToVolEnvDecay')) /
              1200),
        volSustain: l / 1e3,
        volRelease: 2 ** (c / 1200),
        modDelay: 2 ** (h / 1200),
        modAttack: 2 ** (u / 1200),
        modHold:
          2 ** (d / 1200) *
          2 **
            (((60 - b) * this.getModGenAmount(s, 'keynumToModEnvHold')) / 1200),
        modDecay:
          2 ** (p / 1200) *
          2 **
            (((60 - b) * this.getModGenAmount(s, 'keynumToModEnvDecay')) /
              1200),
        modSustain: m / 1e3,
        modRelease: 2 ** (f / 1200),
        initialFilterFc:
          8.176 *
          Math.pow(2, this.getModGenAmount(s, 'initialFilterFc') / 1200),
        modEnvToFilterFc: this.getModGenAmount(s, 'modEnvToFilterFc') / 100,
        initialFilterQ: this.getModGenAmount(s, 'initialFilterQ') / 10,
        reverbEffectSend: this.getModGenAmount(s, 'reverbEffectSend') / 10,
        initialAttenuation: this.getModGenAmount(s, 'initialAttenuation') / 10,
        freqVibLFO:
          8.176 * Math.pow(2, this.getModGenAmount(s, 'freqVibLFO') / 1200),
        pan: this.getModGenAmount(s, 'pan') / 1200,
      };
    }
  }
  getModGenAmount(e, t) {
    return e[t] ? e[t].amount : this.parser.getGeneratorTable()[t];
  }
  start() {
    this.connect(), this.bufSrc.start(0), this.setMasterVolume(16383);
  }
  setMasterVolume(e) {
    (this.masterVolume = e),
      (this.gainMaster.gain.value = this.baseVolume * (e / 16384));
  }
  connect() {
    this.bufSrc.connect(this.gainMaster);
  }
  disconnect() {
    this.bufSrc.disconnect(this.gainMaster), (this.bufSrc.buffer = null);
  }
  drawSynth() {
    const e = window.document,
      t = (this.element = e.createElement('div'));
    t.className = 'synthesizer';
    const n = e.createElement('div');
    (n.className = 'instrument'),
      (this.items = [
        'mute',
        'bank',
        'program',
        'volume',
        'expression',
        'panpot',
        'pitchBend',
        'pitchBendSensitivity',
        'reverbDepth',
        'keys',
      ]);
    const s = 'ontouchstart' in window ? 'touchstart' : 'mousedown',
      r = 'ontouchend' in window ? 'touchend' : 'mouseup';
    for (let a = 0; a < 16; a++) {
      const t = e.createElement('div');
      (t.className = 'channel'),
        t.addEventListener(s, () => {
          this.hold(a, 0);
        });
      for (const n in this.items) {
        if (!{}.hasOwnProperty.call(this.items, n)) continue;
        const i = e.createElement('div');
        switch (((i.className = this.items[n]), this.items[n])) {
          case 'mute': {
            const t = e.createElement('div');
            t.className = 'form-check';
            const n = e.createElement('input');
            n.setAttribute('type', 'checkbox'),
              (n.className = 'form-check-input'),
              (n.id = 'mute' + a + 'ch'),
              (n.value = a),
              n.addEventListener(
                'input',
                e => {
                  this.mute(a, e.target.checked);
                },
                !1
              ),
              t.appendChild(n);
            const s = e.createElement('label');
            (s.className = 'form-check-label'),
              (s.textContent = a + 1),
              s.setAttribute('for', 'mute' + a + 'ch'),
              t.appendChild(s),
              i.appendChild(t);
            break;
          }
          case 'bank': {
            const n = e.createElement('select');
            (n.className = 'form-select form-select-sm'),
              n.addEventListener(
                'change',
                ((e, n) => s => {
                  const r = t.querySelector('.program select').value;
                  e.bankChange(n, s.target.value), e.programChange(n, r);
                })(this, a),
                !1
              ),
              i.appendChild(n);
            break;
          }
          case 'program': {
            const t = e.createElement('select');
            (t.className = 'form-select form-select-sm'),
              t.addEventListener(
                'change',
                ((e, t) => n => {
                  e.programChange(t, n.target.value);
                })(this, a),
                !1
              ),
              i.appendChild(t);
            break;
          }
          case 'volume': {
            const e = document.createElement('var');
            (e.innerText = 100), i.appendChild(e);
            break;
          }
          case 'expression': {
            const e = document.createElement('var');
            (e.innerText = 127), i.appendChild(e);
            break;
          }
          case 'pitchBendSensitivity': {
            const e = document.createElement('var');
            (e.innerText = 2), i.appendChild(e);
            break;
          }
          case 'reverbDepth': {
            const e = document.createElement('var');
            (e.innerText = 40), i.appendChild(e);
            break;
          }
          case 'panpot': {
            const t = e.createElement('div');
            t.className = 'progress';
            const n = e.createElement('div');
            (n.className = 'progress-bar'), t.appendChild(n), i.appendChild(t);
            break;
          }
          case 'pitchBend': {
            const t = e.createElement('div');
            t.className = 'progress';
            const n = e.createElement('div');
            (n.className = 'progress-bar progress-bar-animated'),
              t.appendChild(n),
              i.appendChild(t);
            break;
          }
          case 'keys':
            for (let t = 0; t < 127; t++) {
              const n = e.createElement('div'),
                o = t % 12;
              (n.className =
                'key ' + ([1, 3, 6, 8, 10].includes(o) ? 'semitone' : 'tone')),
                i.appendChild(n),
                n.addEventListener(
                  s,
                  ((e, t, n) => s => {
                    s.preventDefault(), (e.drag = !0), e.noteOn(t, n, 127);
                  })(this, a, t)
                ),
                n.addEventListener(
                  'mouseover',
                  ((e, t, n) => s => {
                    s.preventDefault(), e.drag && e.noteOn(t, n, 127);
                  })(this, a, t)
                ),
                n.addEventListener(
                  'mouseout',
                  ((e, t, n) => s => {
                    s.preventDefault(), e.noteOff(t, n, 0);
                  })(this, a, t)
                ),
                n.addEventListener(
                  r,
                  ((e, t, n) => s => {
                    s.preventDefault(), (e.drag = !1), e.noteOff(t, n, 0);
                  })(this, a, t)
                );
            }
        }
        t.appendChild(i);
      }
      n.appendChild(t), this.intersection.observe(t);
    }
    const i = [
        'Ch.',
        'Bank',
        'Program',
        'Vol.',
        'Exp.',
        'Panpot',
        'Pitch',
        '',
        'Rev.',
        '',
      ],
      o = e.createElement('div');
    o.className = 'header';
    for (const a in this.items) {
      if (!{}.hasOwnProperty.call(this.items, a)) continue;
      const t = e.createElement('div');
      (t.className = this.items[a]),
        (t.textContent = i[a]),
        'keys' === this.items[a] &&
          (t.appendChild(document.createElement('code')),
          t.appendChild(document.createElement('div'))),
        o.appendChild(t);
    }
    n.prepend(o), t.appendChild(n);
    return (
      new ResizeObserver(e => {
        for (const n in this.items)
          ({}.hasOwnProperty.call(this.items, n) &&
            (t.querySelector(`.header .${this.items[n]}`).style.width =
              t.querySelector(`.channel .${this.items[n]}`).offsetWidth +
              'px'));
        t.querySelector('.header .keys').style.display =
          document.documentElement.clientWidth <= 680 ? 'none' : 'flex';
      }).observe(t),
      t
    );
  }
  updateSynthElement(e, t, n) {
    if (!this.element) return;
    const s = this.element.querySelectorAll('.instrument > .channel')[e];
    if (s.dataset.isIntersecting) {
      const e = s.querySelector(`.key:nth-child(${t + 1})`);
      0 === n
        ? (e.classList.contains('note-on') && e.classList.remove('note-on'),
          (e.style.opacity = 1))
        : (e.classList.add('note-on'),
          (e.style.opacity = (n / 127).toFixed(2)));
    }
  }
  updateBankSelect(e) {
    if (!this.element) return;
    const t = this.element
      .querySelectorAll('.instrument > .channel')
      [e].querySelector('.bank > select');
    for (; t.firstChild; ) t.removeChild(t.firstChild);
    for (const n in this.programSet) {
      if (!{}.hasOwnProperty.call(this.programSet, n)) continue;
      const s = document.createElement('option');
      (s.value = n),
        (s.textContent = ('000' + parseInt(n)).slice(-3)),
        n === this.channelBank[e] && (s.selected = 'selected'),
        t.appendChild(s);
    }
  }
  updateProgramSelect(e) {
    const t = this.element.querySelectorAll('.instrument > .channel')[e],
      n = this.channelBank[e],
      s = t.querySelector('.bank > select'),
      r = t.querySelector('.program > select');
    for (s.value = this.channelBank[e]; r.firstChild; )
      r.removeChild(r.firstChild);
    for (const i in this.programSet[n]) {
      if (!{}.hasOwnProperty.call(this.programSet[n], i)) continue;
      const t = document.createElement('option');
      (t.value = i),
        (t.textContent = `${('000' + (parseInt(i) + 1)).slice(-3)}:${
          this.programSet[n][i]
        }`),
        i === this.channelInstrument[e] && (t.selected = 'selected'),
        r.appendChild(t);
    }
  }
  noteOn(e, t, n = 100) {
    const s = this.channelBank[e],
      r =
        'object' == typeof this.bankSet[s] ? this.bankSet[s] : this.bankSet[0];
    let i;
    if (
      ((i =
        'object' == typeof r[this.channelInstrument[e]]
          ? r[this.channelInstrument[e]]
          : this.percussionPart[e]
          ? this.bankSet[this.isXG ? 127 : 128][0]
          : this.bankSet[0][this.channelInstrument[e]]),
      void 0 === i[t])
    )
      return;
    const o = i[t];
    let a =
      0 === this.channelPanpot[e]
        ? (127 * Math.random()) | 0
        : this.channelPanpot[e] - 64;
    (a /= a < 0 ? 64 : 63),
      (o.channel = e),
      (o.key = t),
      (o.velocity = n),
      (o.panpot = a),
      (o.volume = this.channelVolume[e] / 127),
      (o.pitchBend = this.channelPitchBend[e] - 8192),
      (o.expression = this.channelExpression[e]),
      (o.pitchBendSensitivity = Math.round(
        this.channelPitchBendSensitivity[e]
      )),
      (o.mute = this.channelMute[e]),
      (o.releaseTime = this.channelRelease[e]),
      (o.cutOffFrequency = this.cutOffFrequency[e]),
      (o.harmonicContent = this.harmonicContent[e]),
      (o.reverb = this.reverb[e]),
      (o.modulation = this.modulation[e]),
      s > 125 && (i.volume *= this.percussionVolume[t] / 127);
    const l = new f(this.ctx, this.gainMaster, o);
    l.noteOn(), this.currentNoteOn[e].push(l), this.updateSynthElement(e, t, n);
  }
  noteOff(e, t) {
    let n, s;
    const r = this.currentNoteOn[e];
    let i;
    const o = this.channelHold[e];
    for (n = 0, s = r.length; n < s; ++n)
      (i = r[n]),
        i.key === t &&
          (i.noteOff(), o || (i.release(), r.splice(n, 1), --n, --s));
    this.updateSynthElement(e, t, 0);
  }
  hold(e, t) {
    const n = this.currentNoteOn[e];
    let s, r, i;
    if (!(this.channelHold[e] = t > 64))
      for (r = 0, i = n.length; r < i; ++r)
        (s = n[r]), s.isNoteOff() && (s.release(), n.splice(r, 1), --r, --i);
    if (this.element) {
      const t = this.element.querySelectorAll('.instrument > .channel')[e];
      if (!t) return;
      this.channelHold[e]
        ? t.classList.add('hold')
        : t.classList.contains('hold') && t.classList.remove('hold');
    }
  }
  bankSelectMsb(e, t) {
    if (this.isXG)
      (this.channelBank[e] = 0),
        64 === t
          ? ((this.channelBank[e] = 125), (this.percussionPart[e] = !0))
          : 126 === t || 127 === t
          ? ((this.channelBank[e] = t), (this.percussionPart[e] = !0))
          : 128 === t &&
            ((this.channelBank[e] = 127), (this.percussionPart[e] = !0));
    else {
      if (!this.isGS) return;
      (this.channelBank[e] = 9 === e ? 128 : t),
        (this.percussionPart[e] = 128 === t);
    }
    this.updateBankSelect(e);
  }
  bankSelectLsb(e, t) {
    this.isXG &&
      !0 !== this.percussionPart[e] &&
      ((this.percussionPart[e] = t >= 125),
      (this.channelBank[e] = t),
      this.updateBankSelect(e));
  }
  programChange(e, t) {
    (this.channelInstrument[e] = t),
      this.bankChange(e, this.channelBank[e]),
      this.element &&
        (this.element
          .querySelectorAll('.instrument > .channel')
          [e].querySelector('.program > select').value = t);
  }
  bankChange(e, t) {
    const n = this.isXG ? 127 : 128;
    this.bankSet[t]
      ? (this.channelBank[e] = t)
      : (this.channelBank[e] = this.percussionPart[e] ? n : 0),
      this.element &&
        (this.element
          .querySelectorAll('.instrument > .channel')
          [e].querySelector('.bank > select').value = t),
      this.updateProgramSelect(e);
  }
  volumeChange(e, t) {
    this.element &&
      (this.element
        .querySelectorAll('.instrument > .channel')
        [e].querySelector('.volume var').innerText = t),
      (this.channelVolume[e] = t);
  }
  expression(e, t) {
    let n, s;
    const r = this.currentNoteOn[e];
    for (n = 0, s = r.length; n < s; ++n) r[n].updateExpression(t);
    this.element &&
      (this.element
        .querySelectorAll('.instrument > .channel')
        [e].querySelector('.expression var').innerText = t),
      (this.channelExpression[e] = t);
  }
  panpotChange(e, t) {
    if (((this.channelPanpot[e] = t), this.element)) {
      const n = this.element
          .querySelectorAll('.instrument > .channel')
          [e].querySelector('.panpot .progress-bar'),
        s = (t / 127) * 100;
      if (
        ((n.style.width = `${s}%`),
        n.classList.remove('left', 'right'),
        64 === t)
      )
        return;
      n.classList.add([t < 63 ? 'left' : 'right']);
    }
  }
  pitchBend(e, t, n) {
    const s = (127 & t) | ((127 & n) << 7);
    let r, i;
    const o = this.currentNoteOn[e],
      a = s - 8192;
    for (r = 0, i = o.length; r < i; ++r) o[r].updatePitchBend(a);
    if (((this.channelPitchBend[e] = s), this.element)) {
      const t = this.element
        .querySelectorAll('.instrument > .channel')
        [e].querySelector('.pitchBend .progress-bar');
      if (
        ((t.style.width = `${Math.floor((s / 16384) * 100)}%`),
        t.classList.remove('high', 'low'),
        0 === a)
      )
        return;
      t.classList.add(a < 0 ? 'low' : 'high');
    }
  }
  pitchBendSensitivity(e, t) {
    this.element &&
      (this.element
        .querySelectorAll('.instrument > .channel')
        [e].querySelector('.pitchBendSensitivity > var').innerText = t),
      (this.channelPitchBendSensitivity[e] = t);
  }
  attackTime(e, t) {
    this.channelAttack[e] = t;
  }
  decayTime(e, t) {
    this.channelDecay[e] = t;
  }
  sustinTime(e, t) {
    this.channelSustin[e] = t;
  }
  releaseTime(e, t) {
    this.channelRelease[e] = t;
  }
  harmonicContent(e, t) {
    this.channelHarmonicContent[e] = t;
  }
  cutOffFrequency(e, t) {
    this.channelCutOffFrequency[e] = t;
  }
  reverbDepth(e, t) {
    this.reverb[e].mix(t / 127),
      this.element &&
        (this.element
          .querySelectorAll('.instrument > .channel')
          [e].querySelector('.reverbDepth var').innerText = t);
  }
  modulationDepth(e, t) {
    if (this.element) {
      const n = this.element
        .querySelectorAll('.instrument > .channel')
        [e].querySelector('.pitchBend .progress-bar');
      0 !== t
        ? n.classList.add(['progress-bar-striped'])
        : n.classList.remove(['progress-bar-striped']);
    }
    this.modulation[e] = t;
  }
  getPitchBendSensitivity(e) {
    return this.channelPitchBendSensitivity[e];
  }
  drumInstrumentLevel(e, t) {
    this.percussionVolume[e] = t;
  }
  allNoteOff(e) {
    const t = this.currentNoteOn[e];
    for (this.hold(e, 0); t.length > 0; ) this.noteOff(e, t[0].key, 0);
  }
  allSoundOff(e) {
    const t = this.currentNoteOn[e];
    let n;
    for (; t.length > 0; )
      (n = t.shift()), this.noteOff(e, n.key, 0), n.release(), n.disconnect();
    this.hold(e, 0);
  }
  resetAllControl(e) {
    this.allNoteOff(e), this.expression(e, 127), this.pitchBend(e, 0, 64);
  }
  mute(e, t) {
    const n = this.currentNoteOn[e];
    let s, r;
    if (((this.channelMute[e] = t), t))
      for (s = 0, r = n.length; s < r; ++s) n[s].disconnect();
    else for (s = 0, r = n.length; s < r; ++s) n[s].connect();
  }
  setPercussionPart(e, t) {
    this.isXG ? (this.channelBank[e] = 127) : (this.channelBank[e] = 128),
      (this.percussionPart[e] = t);
  }
  processMidiMessage(e) {
    clearTimeout(this.timer);
    const t = this.element.querySelector('.header .keys code');
    (t.innerText = e.map(e => String.fromCharCode(e)).join('')),
      (this.timer = setTimeout(() => {
        t.innerText = '';
      }, 5e4));
  }
}
const T = '0.4.0',
  x = '2022-07-10T01:39:01.196Z';
const N = o.parse(window.location.search),
  G = { placeholder: 'placeholder' };
'false' === N.ui && (G.drawSynth = !1);
const I = new (class {
    constructor(e = {}) {
      (this.NrpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        (this.NrpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        (this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        (this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        (this.ready = !1),
        (this.synth = null),
        (this.loadCallback = null),
        (this.messageHandler = this.onmessage.bind(this)),
        (this.rpnMode = !0),
        (this.option = e),
        (this.option.drawSynth = void 0 === e.drawSynth || e.drawSynth),
        (this.option.cache = e.cache ? e.cache : 9e5),
        (this.placeholder =
          void 0 !== e.placeholder
            ? document.getElementById(e.placeholder)
            : window.document.body),
        (this.opener = null),
        (this.version = T),
        (this.build = x);
    }
    async waitForReadystate() {
      'interactive' !== document.readyState &&
        (await new Promise(e => {
          const t = () => {
            window.requestAnimationFrame(e),
              window.removeEventListener('DOMContentLoaded', t);
          };
          window.addEventListener('DOMContentLoaded', t);
        }));
    }
    async setup(e) {
      await this.waitForReadystate();
      const t = window;
      t.opener
        ? (this.opener = t.opener)
        : t.parent !== t && (this.opener = t.parent),
        this.load(e);
    }
    async load(e) {
      const t = window.opener ? window.opener : window.parent;
      t.postMessage('link,progress', '*');
      const n = document.createElement('div');
      n.className = 'alert alert-warning';
      const s = document.createElement('p');
      s.innerText = 'Now Loading...';
      const r = document.createElement('div');
      r.className = 'progress';
      const i = document.createElement('div');
      (i.className = 'progress-bar'),
        r.appendChild(i),
        n.appendChild(s),
        n.appendChild(r),
        this.placeholder.appendChild(n);
      const o = (e, n) => {
          const s = Math.floor((e / n) * 100);
          (i.style.width = s + '%'),
            (i.innerText = s + ' %'),
            t.postMessage('link,progress,' + e + ',' + n, '*'),
            requestAnimationFrame(o);
        },
        a = e => {
          (n.className = 'alert alert-info'),
            (s.innerText = 'Initializing...'),
            (i.style.width = '100%'),
            (i.className =
              'progress-bar progress-bar-striped progress-bar-animated');
          const r = new Uint8Array(e);
          this.loadSoundFont(r),
            this.placeholder.removeChild(n),
            t.postMessage('link,ready', '*');
        },
        l = await caches.open('wml'),
        c = await l.match(e);
      if (!c) {
        const t = await fetch(e, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            Accept: 'audio/x-soundfont',
            'Access-Control-Allow-Origin': '*',
          },
        });
        if (!t.ok)
          return void (e => {
            throw (
              ((n.className = 'alert alert-danger'),
              (s.innerText =
                'An error occurred while parsing SoundFont. See the console log for details. In addition, it may be cured by deleting the cache of the browser.'),
              (r.style.display = 'none'),
              Error(e))
            );
          })();
        const i = t.clone(),
          c = t.clone(),
          h = t.body.getReader();
        for (;;) {
          const { done: e, value: n } = await h.read();
          if (e) break;
          (s.innerText = `Now Loading... (${n.length} byte)`),
            t.headers.has('Content-Length') &&
              o(n.length, t.headers.get('Content-Length'));
        }
        return l.put(e, i), void a(await c.arrayBuffer());
      }
      a(await c.arrayBuffer());
    }
    loadSoundFont(e) {
      const t = window;
      if (this.synth) this.synth.refreshInstruments(e);
      else {
        const n = (this.synth = new A(e));
        if (this.option.drawSynth) this.placeholder.appendChild(n.drawSynth());
        else {
          const e = document.createElement('strong');
          (e.innerText = 'Ready.'), this.placeholder.appendChild(e);
        }
        n.init(),
          n.start(),
          t.addEventListener('message', this.messageHandler, !1);
      }
      t.postMessage('link,ready', '*');
    }
    onmessage(e) {
      const t = 'function' == typeof e.data.split ? e.data.split(',') : [],
        n = t !== [] ? t.shift() : '',
        s = window.opener ? window.opener : window.parent;
      let r;
      switch (n) {
        case 'midi':
          this.processMidiMessage(t.map(e => parseInt(e, 16)));
          break;
        case 'link':
          if (void 0 === s) return;
          switch (((r = t.shift()), r)) {
            case 'reqpatch':
              s.postMessage('link,patch', '*');
              break;
            case 'setpatch':
            case 'ready':
              s.postMessage('link,ready', '*');
              break;
            case 'progress':
              s.postMessage('link,progress', '*');
          }
      }
    }
    setLoadCallback(e) {
      this.loadCallback = e;
    }
    processMidiMessage(e) {
      const t = 15 & e[0],
        n = this.synth;
      switch (240 & e[0]) {
        case 128:
          n.noteOff(t, e[1], e[2]);
          break;
        case 144:
          e[2] > 0 ? n.noteOn(t, e[1], e[2]) : n.noteOff(t, e[1], 0);
          break;
        case 176: {
          const s = e[2];
          switch (e[1]) {
            case 0:
              n.bankSelectMsb(t, s);
              break;
            case 1:
              n.modulationDepth(t, s);
              break;
            case 5:
            case 96:
            case 97:
              break;
            case 6:
              if (this.rpnMode) {
                if (0 === this.RpnMsb[t])
                  if (0 === this.RpnLsb[t]) n.pitchBendSensitivity(t, s);
              } else if (26 === this.NrpnMsb[t])
                n.drumInstrumentLevel(this.NrpnLsb[t], s);
              break;
            case 38:
              if (this.rpnMode && 0 === this.RpnMsb[t])
                if (0 === this.RpnLsb[t])
                  n.pitchBendSensitivity(
                    t,
                    n.getPitchBendSensitivity(t) + s / 100
                  );
              break;
            case 7:
              n.volumeChange(t, s);
              break;
            case 10:
              n.panpotChange(t, s);
              break;
            case 120:
              n.allSoundOff(t);
              break;
            case 121:
              n.resetAllControl(t);
              break;
            case 32:
              n.bankSelectLsb(t, s);
              break;
            case 71:
              n.harmonicContent(t, s);
              break;
            case 98:
              (this.rpnMode = !1), (this.NrpnLsb[t] = s);
              break;
            case 99:
              (this.rpnMode = !1), (this.NrpnMsb[t] = s);
              break;
            case 100:
              (this.rpnMode = !0), (this.RpnLsb[t] = s);
              break;
            case 101:
              (this.rpnMode = !0), (this.RpnMsb[t] = s);
              break;
            case 64:
              n.hold(t, s);
              break;
            case 11:
              n.expression(t, s);
              break;
            case 72:
              n.decayTime(t, s);
              break;
            case 73:
              n.releaseTime(t, s);
              break;
            case 74:
              n.attackTime(t, s);
              break;
            case 75:
              n.cutOffFrequency(t, s);
              break;
            case 91:
              n.reverbDepth(t, s);
          }
          break;
        }
        case 192:
          n.programChange(t, e[1]);
          break;
        case 224:
          n.pitchBend(t, e[1], e[2]);
          break;
        case 240: {
          const t = e[2],
            s = e[3],
            r = e[4];
          if (126 === t && 9 === s)
            switch (r) {
              case 1:
                n.init('GM');
                break;
              case 2:
                break;
              case 3:
                n.init('GM2');
            }
          else if (127 === t)
            1 === e[4] && n.setMasterVolume(e[5] + (e[6] << 7));
          else if (65 === t) {
            const t = e[7] - 15;
            switch (e[8]) {
              case 0:
                if (0 === e[7]) {
                  const t = e.splice(8);
                  t.pop(), t.pop(), n.processMidiMessage(t);
                }
                break;
              case 4:
                n.setMasterVolume(64 * e[9]);
                break;
              case 21: {
                const s = e[8];
                0 === t
                  ? 0 !== s
                    ? n.setPercussionPart(9, !0)
                    : n.setPercussionPart(9, !1)
                  : t >= 10
                  ? 0 !== s
                    ? n.setPercussionPart(t - 1, !0)
                    : n.setPercussionPart(t - 1, !1)
                  : 0 !== s
                  ? n.setPercussionPart(t, !0)
                  : n.setPercussionPart(t, !1);
                break;
              }
              case 25:
              case 48:
              case 56:
              case 69:
                break;
              case 127:
                n.init('GS');
            }
          } else if (67 == t)
            switch ((67 !== e[2] && 67 === e[3] && e.splice(1, 1), e[5])) {
              case 0:
                126 === e[7] && n.init('XG');
                break;
              case 2:
              case 7:
                break;
              case 4:
                n.setMasterVolume(64 * e[9]);
                break;
              case 6: {
                const t = e.splice(8);
                t.pop(), n.processMidiMessage(t);
                break;
              }
              case 8:
                n.setPercussionPart(e[6], 0 !== e[8]);
            }
          break;
        }
        default:
          n.setPercussionPart(9, !0);
      }
    }
    dumpMessage(e) {
      const t = [];
      for (const n of e) t.push(n.toString(16).toUpperCase());
      return t.join(' ');
    }
  })(G),
  O = document.getElementById('message'),
  R = document.getElementById('file'),
  P = document.getElementById('placeholder'),
  F = N.soundfont ? decodeURIComponent(N.soundfont) : 'Yamaha XG Sound Set.sf2';
(document.getElementById('soundfont').innerText = F),
  (document.getElementById('build').innerText = new Date(
    I.build
  ).toLocaleString()),
  I.setLoadCallback(function () {
    O.style.display = 'none';
  }),
  I.setup(F);
const B = e => {
  const t = new FileReader();
  t.readAsArrayBuffer(e),
    (t.onload = t => {
      document.getElementById('soundfont').innerText = e.name;
      const n = new Uint8Array(t.target.result);
      I.loadSoundFont(n, !0);
    });
};
document.addEventListener(
  'DOMContentLoaded',
  e => {
    R.addEventListener('change', e => {
      e.preventDefault(), B(R.files[0]), (R.value = '');
    }),
      P.addEventListener(
        'dragover',
        e => {
          (P.className = 'alert-danger'), e.preventDefault();
        },
        !0
      ),
      P.addEventListener(
        'drop',
        e => {
          P.className = '';
          const t = e.dataTransfer.files;
          e.stopPropagation(), e.preventDefault(), B(t[0]);
        },
        !0
      ),
      P.addEventListener(
        'dragleave',
        e => {
          P.className = '';
        },
        !0
      );
  },
  !1
);
