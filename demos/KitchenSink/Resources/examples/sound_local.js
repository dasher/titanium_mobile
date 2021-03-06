if (Titanium.Media.audioPlaying) {
	Titanium.Media.defaultAudioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_AMBIENT;
}

var win = Titanium.UI.currentWindow;

//TODO: USE OBJECT
var sound = Titanium.Media.createSound({
	url:'../cricket.wav'
});

//
// PLAY
//
var play = Titanium.UI.createButton({
	title:'Play',
	height:40,
	width:145,
	left:10,
	top:10
});
play.addEventListener('click', function()
{
	sound.play();
	pb.max = sound.duration;
});
win.add(play);

//
// PAUSE
//
var pause = Titanium.UI.createButton({
	title:'Pause',
	height:40,
	width:145,
	right:10,
	top:10
});
pause.addEventListener('click', function()
{
	sound.pause();
});
win.add(pause);

//
// RESET
//
var reset = Titanium.UI.createButton({
	title:'Reset',
	height:40,
	width:145,
	left:10,
	top:60
});
reset.addEventListener('click', function()
{
	sound.reset();
	pb.value = 0;

});
win.add(reset);

//
// STOP
//
var stop = Titanium.UI.createButton({
	title:'Stop',
	height:40,
	width:145,
	right:10,
	top:60
});
stop.addEventListener('click', function()
{
	sound.stop();
	pb.value = 0;
});
win.add(stop);

//
// VOLUME +
//
var volumeUp = Titanium.UI.createButton({
	title:'Volume++',
	height:40,
	width:145,
	left:10,
	top:110
});
volumeUp.addEventListener('click', function()
{
	if (sound.volume < 1.0)
	{
		sound.volume += 0.1;
		volumeUp.title = 'Volume++ (' + String(sound.volume).substring(0,3) + ')';
		volumeDown.title = 'Volume--';
	}
});
win.add(volumeUp);

//
// VOLUME -
//
var volumeDown = Titanium.UI.createButton({
	title:'Volume--',
	height:40,
	width:145,
	right:10,
	top:110
});
volumeDown.addEventListener('click', function()
{
	if (sound.volume > 0)
	{
		if (sound.volume < 0.1)
			sound.volume = 0;
		else
			sound.volume -= 0.1;
		volumeDown.title = 'Volume-- (' + String(sound.volume).substring(0,3) + ')';
		volumeUp.title = 'Volume++';
	}

});
win.add(volumeDown);

//
// LOOPING
//
var looping = Titanium.UI.createButton({
	title:'Looping (false)',
	height:40,
	width:145,
	left:10,
	top:160
});
looping.addEventListener('click', function()
{
	sound.looping = (sound.looping==false)?true:false;
	looping.title = 'Looping (' + sound.isLooping() + ')';
});
win.add(looping);

//
// SET SESSION MODE
//
var title;
switch (Titanium.Media.defaultAudioSessionMode) {
	case Titanium.Media.AUDIO_SESSION_MODE_SOLO_AMBIENT:
		title = 'Set session mode: Solo Ambient';
		break;
	case Titanium.Media.AUDIO_SESSION_MODE_AMBIENT:
		title = 'Set session mode: Ambient';
		break;
}
var sessionMode = Titanium.UI.createButton({
	title:title,
	height:40,
	width:300,
	bottom:10
});

sessionMode.addEventListener('click', function() {
	switch (sound.audioSessionMode) {
		case Titanium.Media.AUDIO_SESSION_MODE_SOLO_AMBIENT:
			sound.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_AMBIENT;
			sessionMode.title = 'Set session mode: Ambient';
			break;
		case Titanium.Media.AUDIO_SESSION_MODE_AMBIENT:
			sound.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_PLAYBACK;
			sessionMode.title = 'Set session mode: Playback';
			break;
		case Titanium.Media.AUDIO_SESSION_MODE_PLAYBACK:
			sound.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
			sessionMode.title = 'Set session mode: Play & Record';
			break;
		case Titanium.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD:
			sound.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_SOLO_AMBIENT;
			sessionMode.title = 'Set session mode: Solo Ambient';
			break;
	}
});

win.add(sessionMode);

//
// EVENTS
//
sound.addEventListener('complete', function()
{
	pb.value = 0;
});
sound.addEventListener('resume', function()
{
	Titanium.API.info('RESUME CALLED');
});

//
//  PROGRESS BAR TO TRACK SOUND DURATION
//
var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var pb = Titanium.UI.createProgressBar({
	min:0,
	value:0,
	width:200
});

win.setToolbar([flexSpace,pb,flexSpace]);
pb.show();

//
// INTERVAL TO UPDATE PB
//
var i = setInterval(function()
{
	if (sound.isPlaying())
	{
		Ti.API.info('time ' + sound.time);
		pb.value = sound.time;

	}
},500);

//
//  CLOSE EVENT - CANCEL INTERVAL
//
win.addEventListener('close', function()
{
	clearInterval(i);
	sound.destroy();
});

