module.exports = (emitter) => {
    let namespace = {};
    return (ns) => {
        if (!namespace[ns]) {
            namespace[ns] = {
                _namespace: ns,
                _listenersBind: {},
                _bind(eventName, listener){
                    if (!this._listenersBind[eventName]) {
                        this._listenersBind[eventName] = [];
                    }
                    this._listenersBind[eventName].push(listener);
                },
                removeAllListeners(){
                    for (let eventName in this._listenersBind) {
                        for (let listener in this._listenersBind[eventName]) {
                            emitter.removeListener(eventName, this._listenersBind[eventName][listener]);
                        }
                    }
                },
                on(eventName, listener) {
                    emitter.on(eventName, listener);
                    this._bind(eventName, listener);
                    return this;
                },
                once(eventName, listener) {
                    emitter.once(eventName, listener);
                    this._bind(eventName, listener);
                    return this;
                },
                addListener(eventName, listener){
                    return this.on(eventName, listener);
                },
                prependListener(eventName, listener) {
                    emitter.prependListener(eventName, listener);
                    this._bind(eventName, listener);
                    return this;
                },
                prependOnceListener(eventName, listener){
                    emitter.prependOnceListener(eventName, listener);
                    this._bind(eventName, listener);
                    return this;
                }
            }
        }
        return namespace[ns];
    }
};