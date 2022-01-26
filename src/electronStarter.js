const path = require('path');
const {app, BrowserWindow, globalShortcut} = require('electron');
const {globalShortcutEvents} = require('./services/shortcuts');

app.on('ready', () => {
	let window = new BrowserWindow({
		width: 1800, height: 1000, webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	window.setMenu(null);
	window.webContents.openDevTools();
	window.loadFile(path.resolve(__dirname, 'index.html'));

	globalShortcut.register('MediaPreviousTrack', () => window.webContents.send(globalShortcutEvents.PREV));
	globalShortcut.register('MediaNextTrack', () => window.webContents.send(globalShortcutEvents.NEXT));
	globalShortcut.register('MediaPlayPause', () => window.webContents.send(globalShortcutEvents.PAUSE));
	globalShortcut.register('Shift+MediaPreviousTrack', () => window.webContents.send(globalShortcutEvents.BACKWARD));
	globalShortcut.register('Shift+MediaNextTrack', () => window.webContents.send(globalShortcutEvents.FORWARD));
});

app.once('window-all-closed', app.quit);
