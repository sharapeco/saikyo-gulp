String.prototype.PIPE = function (fn) { return fn(this) }
const head = (n = 3) => (str) => str.split('\n').slice(0, n).join('\n')
const clean = () => (str) => str.replace(/\x1B\[\d+m/g, '')

function expose (tasks) {
	const mTasks = Object.assign({}, tasks)

	mTasks.default = callback => {
		console.log('\nCommands are:')
		Object.keys(tasks).forEach(task => {
			console.log(`  ${task}`)
		})
		console.log('')
		callback()
	}

	return mTasks
}

module.exports = {
	head,
	clean,
	expose
}
