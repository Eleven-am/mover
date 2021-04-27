const {terminal} = require( 'terminal-kit' );

export default function Log (answers) {
    this.verbose = answers.verbose
    this.bar = !answers.verbose ? terminal.progressBar({
        title: 'progress:',
        eta: true,
        percent: true,
        items: 4
    }): null;
}

Log.prototype.show = function (info) {
    if (this.verbose)
        console.log(info)
}

Log.prototype.update = function (number) {
    if (this.bar)
        this.bar.update(number)
    else
        this.show(number);
}

Log.prototype.startItem = function (number) {
    if (this.bar)
        this.bar.startItem(number)
    else
        this.show('starting: ' + number);
}

Log.prototype.itemDone = function (number) {
    if (this.bar)
        this.bar.itemDone(number)
    else
        this.show('done: ' + number);
}

Log.prototype.done = async function () {
    if (this.bar)
        await exit()
    else
        this.show('process completed');
}

const exit = () => setTimeout( async function() {
    terminal('\n');
    await process.exit();
}, 200 ) ;