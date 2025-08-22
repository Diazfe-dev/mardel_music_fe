class Observer {
    constructor() {
        this.subscriptors = [];
    }

    subscribe(observer) {
        this.subscriptors.push(observer);
    }

    unsubscribe(observer) {
        this.subscriptors = this.subscriptors.filter(obs => obs !== observer);
    }

    notify(data) {
        this.subscriptors.forEach(observer => observer(data));
    }
}

export default Observer;