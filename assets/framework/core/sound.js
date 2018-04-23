let sound = {
	_sources: {},
};

sound.add = function(soundName, path) {
	let source = this._sources[soundName];

	if (util.isDefine(source)) {
		util.log_sys('%-#f00', 'the "{0}" sound effect file has already existed.', soundName);
		return false;
	}

	util.log_sys('%-#009999', '音效文件载入 {0}: {1}', soundName, path);

	this._sources[soundName] = {
		path: path,
		id: -1,
	};
	return true;
};

sound.remove = function(soundName) {
	let source = this._sources[soundName];

	if (util.isDefine(source)) {
		util.log_sys('%-#f00', 'the "{0}" sound effect file has already existed.', soundName);
		return false;
	}

	cc.audioEngine.uncache(this._sources.path);
	delete this._sources[soundName];
	return true;
};

sound.removeAll = function() {
	cc.audioEngine.uncacheAll();
	this._sources = {};
	return true;
};

sound.play = function(soundName, isLoop = false, volume = 1) {
	let source = this._sources[soundName];
	source.id = cc.audioEngine.play(source.path, isLoop, volume);
};

sound.playOnly = function(soundName, isLoop = false, volume = 1) {
	this.stop(soundName);

	let source = this._sources[soundName];
	source.id = cc.audioEngine.play(source.path, isLoop, volume);
};

sound.stop = function(soundName) {
	let source = this._sources[soundName];
	if (source.id > -1) {
		cc.audioEngine.stop(source.id);
		source.id = -1;
	}
};

module.exports = sound;
