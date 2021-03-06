class Manager {
    constructor() {
        this.clientsCount = 0;
        this.clientsNickname = [];
    }
    printStatus() {
        console.log("clientsCount :", this.clientsCount);
        console.log("nickname list :" + this.clientsNickname);
    }
    nicknameSplice(nickname) {
        var index = this.clientsNickname.findIndex(Element => Element == nickname);
        if(index) this.clientsNickname.splice(index, 1);
    }
    updateClientNum() {
        console.log("update-clientNum()");
        io.emit(ref.UPDATE_CLIENTNUM, this.clientsCount);
    }
    getClientNum() {
        return this.clientsCount;
    }
    addClientNum() {
        this.clientsCount += 1;
    }
    getNicknameList() {
        return this.clientsNickname;
    }
    subClientNum() {
        this.clientsCount -= 1;
    }
    findNickname(target) {
        return this.clientsNickname.find(Element => Element == target);
    }
    addNickname(nickname) {
        this.clientsNickname.push(nickname);
    }
}

module.exports = new Manager();