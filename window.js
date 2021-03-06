// Inter process communication tests
// From: https://www.electronjs.org/docs/api/ipc-main

// In renderer process (web page).
const { ipcRenderer } = require('electron')

/* async */
console.group('IPC')
console.log('Running [async] inter-process communication tests...')
console.log('Sending [ping], waiting for [pong]...')
console.groupEnd()
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.group('IPC')
  console.log('Received [' + arg + ']', event) // prints "pong"
  console.groupEnd()
})
ipcRenderer.send('asynchronous-message', 'ping')

/* sync */
/* console.log('Running [sync] inter-process communication tests...')
console.log('Sending [ping], waiting for [pong]...')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong" */

// Frontend system info
console.group('SysInfo')
console.log('Gathering system info...')
console.log('Current process:', process)
console.log('CPU:', process.getCPUUsage())
console.log('Memory:', process.getSystemMemoryInfo())
console.log('Heap:', process.getHeapStatistics())
console.log('Blink:', process.getBlinkMemoryInfo())
console.groupEnd()

// Updatable elements
const platform = document.getElementById('platform')
const node = document.getElementById('node')
const chrome = document.getElementById('chrome')
const electron = document.getElementById('electron')
const kernel = document.getElementById('kernel')
const username = document.getElementById('username')
const lang = document.getElementById('lang')
const home = document.getElementById('home')
const path = document.getElementById('path')
const cpu = document.getElementById('cpu')
const mem = document.getElementById('mem')
const heap = document.getElementById('heap')
const blink = document.getElementById('blink')
const proc = document.getElementById('proc')
const uptime = document.getElementById('uptime')

// Initial display
platform.innerText = process.platform
node.innerText = process.versions.node
chrome.innerText = process.versions.chrome
electron.innerText = process.versions.electron
kernel.innerText = process.getSystemVersion()
username.innerText = process.env.USERNAME
lang.innerText = process.env.LANG
home.innerText = process.env.HOME
path.innerText = process.env.PATH
cpu.innerText = process.getCPUUsage().percentCPUUsage
mem.innerText = process.getSystemMemoryInfo().free + ' / ' + process.getSystemMemoryInfo().total
heap.innerText = process.getHeapStatistics().usedHeapSize + ' / ' + process.getHeapStatistics().totalHeapSize + ' / ' + process.getHeapStatistics().heapSizeLimit
blink.innerText = process.getBlinkMemoryInfo().allocated + ' / ' + process.getBlinkMemoryInfo().total
uptime.innerText = process.uptime()

var initialPromise = process.getProcessMemoryInfo()
initialPromise.then(
  function (res) {
    console.group('SysInfo')
    console.log('Process:', res)
    console.groupEnd()
    proc.innerText = res.private + ' / ' + res.residentSet + ' / ' + res.shared
  },
  function (err) {
    console.error(err)
  }
)

// Refresh display
setInterval(() => {
  cpu.innerText = process.getCPUUsage().percentCPUUsage
  mem.innerText = process.getSystemMemoryInfo().free + ' / ' + process.getSystemMemoryInfo().total
  heap.innerText = process.getHeapStatistics().usedHeapSize + ' / ' + process.getHeapStatistics().totalHeapSize + ' / ' + process.getHeapStatistics().heapSizeLimit
  blink.innerText = process.getBlinkMemoryInfo().allocated + ' / ' + process.getBlinkMemoryInfo().total
  uptime.innerText = process.uptime()

  var promise = process.getProcessMemoryInfo()
  promise.then(
    function (res) {
        proc.innerText = res.private + ' / ' + res.residentSet + ' / ' + res.shared
    },
    function (err) {
        console.error(err)
    }
  )
}, 1000)
