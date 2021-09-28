const { contextBridge, ipcRenderer } = require("electron");

/** @type {import("./types").NowPlayingAPI} */
const npApi = {
	previous: () => ipcRenderer.send("previous"),
	playpause: () => ipcRenderer.send("playpause"),
	next: () => ipcRenderer.send("next"),

	shuffle: () => ipcRenderer.send("shuffle"),
	repeat: () => ipcRenderer.send("repeat"),

	seek: (positionToSeekbar) => ipcRenderer.send("seek", positionToSeekbar),
	getposition: () => ipcRenderer.invoke("getposition"),

	minimize: () => ipcRenderer.send("minimize"),
	close: () => ipcRenderer.send("close"),

	registerUpdateCallback: (callback) => ipcRenderer.on("update", (_e, v) => callback(v))
};

contextBridge.exposeInMainWorld("np", npApi);
contextBridge.exposeInMainWorld("transparentBackground", process.env.ILOVEGLASS === "1");
contextBridge.exposeInMainWorld("debugMode", process.env.DEBUG === "1");
