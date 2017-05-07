
var Base = require('../core/base');
var Packet = require('../modules/packet');
var Channel = require('../modules/channel');

module.exports = (function() {

    var global = this;

    var WebSocket = function WebSocket(url, options) {
        Base.call(this, options);
        // props
        this.set('url', url);
        this.set('channels', {});
        this.set('callbacks', {});
        // state
        this.set('listened', false);
        this.set('connected', false);
        this.set('closed', false);
        // events
        this._create();
        this._keepalive();
    };

    WebSocket.prototype = Object.create(Base.prototype);
    WebSocket.prototype.constructor = WebSocket;

    WebSocket.prototype._keepalive = function() {
        this._i = setInterval(function() {
            if (this.get('closed')) {
              clearInterval(this._i);
              return;
            }
            if (!this.get('connected')) {
                this._create();
            }
        }.bind(this), 2500);
    };

    WebSocket.prototype._create = function() {
        this._onopen = this._onopen.bind(this);
        this._onclose = this._onclose.bind(this);
        this._onmessage = this._onmessage.bind(this);
        var ws  = this.get('ws'),
            url = this.get('url');
        if (typeof url === 'string' && !this.get('connected')) {
            this._cleanup();
            this.set('ws', new global.WebSocket(url));
            this._listen();
        }
    };

    WebSocket.prototype._cleanup = function() {
        var ws = this.get('ws');
        if (typeof ws !== 'undefined' && ws instanceof global.WebSocket) {
            ws.removeEventListener('open', this._onopen);
            ws.removeEventListener('close', this._onclose);
            ws.removeEventListener('message', this._onmessage);
            this.set('callbacks', {});
            this.set('connected', false);
            this.set('listened', false);
            this.unset('ws');
        }
    };

    WebSocket.prototype._listen = function() {
        if (!this.get('listened')) {
            this.set('listened', true);
            var ws = this.get('ws');
            ws.addEventListener('open', this._onopen);
            ws.addEventListener('close', this._onclose);
            ws.addEventListener('message', this._onmessage);
        }
    };

    WebSocket.prototype._onopen = function() {
        this.set('connected', true);
        this.emit('open');
        // get authentication key
        var accesskey;
        if (typeof this.get('accesskey') === 'function') {
          accesskey = this.get('accesskey')();
        }
        // resubscribe all channels when connection is opened
        this.channels(false).map((channel) => {
            var namespace = channel.get('namespace');
            var room = channel.get('room');
            var callback = this.get('callbacks')[namespace + '-' + room] ? this.get('callbacks')[namespace + '-' + room] : () => {};
            channel.subscribe(accesskey, callback);
        });
    };

    WebSocket.prototype._onclose = function() {
        this.set('connected', false);
        this.emit('close');
        // unsubscribe all channels when disconnection
        this.channels(false).map(function(channel) {
            channel.set('subscribed', false);
        });
    };

    WebSocket.prototype._onmessage = function(msg) {
        // creates packet
        var packet = new Packet();
        // parse data and return packet
        packet.parse(msg.data || {});
        // channel events
        if (packet.get('type') === Packet.Type.Channel && typeof packet.get('namespace') === 'string' && typeof packet.get('room') === 'string') {
            var channel = this.channel(packet.get('namespace'), packet.get('room'), false);
            if (channel && channel.subscribed()) {
                channel.emit('message', packet);
            }
        }
        // callback
        var cid = packet.get('cid');
        if (packet.get('reply') === true && typeof this.get('callbacks')[cid] === 'function') {
            this.get('callbacks')[cid].call(undefined, packet);
            delete this.get('callbacks')[cid];
        }
        // receive event
        this.emit('message', packet);
    };

    WebSocket.prototype.close = function() {
      this.set('closed', true)
      this.get('ws').onclose = function () { }; // disable onclose handler first
      this.get('ws').close();
    };

    WebSocket.prototype.send = function(packet) {
        if (!(packet instanceof Packet)) {
            return this.log('packet is invalid');
        }
        packet.set('cid', 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);}));
        if (typeof packet.get('callback') === 'function') {
            this.callback(packet);
        }
        this.get('ws').send(packet.json());
    };

    WebSocket.prototype.subscribe = function(namespace, room, accesskey, callback) {
        var channel = this.channel(namespace, room, true);
        if (!accesskey && typeof this.get('accesskey') === 'function') {
          accesskey = this.get('accesskey')();
        }
        if (channel && !channel.subscribed()) {
            this.get('callbacks')[namespace + '-' + room] = (...args) => {
              callback(...args);
              var callbacks = this.get('callbacks');
              delete callbacks[namespace + '-' + room];
              this.set('callbacks', callbacks);
            };
            channel.subscribe(accesskey, this.get('callbacks')[namespace + '-' + room]);
        }
    };

    WebSocket.prototype.unsubscribe = function(namespace, room, callback) {
        var channel = this.channel(namespace, room, true);
        if (channel && channel.subscribed()) {
            channel.unsubscribe(callback);
        }
    };

    WebSocket.prototype.channel = function(namespace, room, autoCreate) {
        var channel;
        if (typeof autoCreate !== 'boolean') {
            autoCreate = false;
        }
        if (typeof namespace !== 'string') {
            return this.log('please provide the channel namespace');
        }
        if (typeof room !== 'string') {
            return this.log('please provide the channel room name');
        }
        if (typeof this.get('channels')[namespace] !== 'object') {
            this.get('channels')[namespace] = {};
        }
        if (typeof this.get('channels')[namespace][room] === 'object') {
            channel = this.get('channels')[namespace][room];
        } else {
            if (autoCreate === true) {
                channel = new Channel({
                    client    : this,
                    namespace : namespace,
                    room      : room
                });
                this.get('channels')[namespace][room] = channel;
            }
        }
        return channel;
    };

    WebSocket.prototype.channels = function(onlySubscribed) {
        var channels = [];
        var namespaces = Object.keys(this.get('channels'));
        if (typeof onlySubscribed !== 'boolean') {
            onlySubscribed = false;
        }
        for (var i = 0; i < namespaces.length; i++) {
            var namespace = this.get('channels')[namespaces[i]],
                rooms     = Object.keys(namespace);
            for (var j = 0; j < rooms.length; j++) {
                var channel = namespace[rooms[j]];
                if ((onlySubscribed && channel.subscribed()) || !onlySubscribed) {
                    channels.push(channel);
                }
            }
        }
        return channels;
    };

    WebSocket.prototype.callback = function(packet) {
        if (!(packet instanceof Packet)) {
            return this.log('packet is invalid');
        }
        if (typeof packet.get('callback') !== 'function') {
            return this.log('packet has no callback');
        }
        var callbacks = this.get('callbacks');
        var cid = packet.get('cid');
        callbacks[cid] = packet.get('callback');
        return this.set('callbacks', callbacks);
    };

    return WebSocket;

}.call(this || typeof window !== 'undefined' ? window : { }));
