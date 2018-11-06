
var _videos = [
    { videoid: "iD2Jr9E1rJA", autoplay: 0, quality: "medium", mute: 1 },
    { videoid: "zZirnf6rNEI", autoplay: 0, quality: "medium", mute: 1 },
    { videoid: "LMiWVXUejTY", autoplay: 0, quality: "medium", mute: 0 },
    { videoid: "BGPKsJofqGg", autoplay: 0, quality: "medium", mute: 0 },
    { videoid: "q6Zorm9yQhA", autoplay: 0, quality: "medium", mute: 0 },
    { videoid: "WaYAhkH2cJM", autoplay: 0, quality: "medium", mute: 0 },
    { videoid: "TZcpvMGMOok", autoplay: 0, quality: "medium", mute: 0 },
    { videoid: "kNNCtXIxivU", autoplay: 0, quality: "medium", mute: 0 }
];
var vQualities = [{ value: "tiny", text: "144" }, { value: "small", text: "240p" }, { value: "medium", text: "360p" }, { value: "large", text: "480p" }, { value: "hd720", text: "720p HD" }, { value: "hd1080", text: "1080p HD" }, { value: "highres", text: "1440p HD" }];

var _player_demo;

var board = document.getElementById("board");
var tag = document.createElement("script");
board.innerHTML = "initializing";
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubeIframeAPIReady() {
    setTimeout(function () {
        Vue.component("youtube-videos", {
            props: ["playerid", "videoid", "autoplay", "mute", "quality", "duration"],
            data: function () {
                return { player: null, paused: !0, stopped: !0, availableQualities: vQualities, isRanging: !1,isInited:!1 };
            },
            methods: {
                playvidy: function () {
                    this.player.playVideo();
                    this.paused = !1;
                    this.stopped = !1;
                },
                pausevidy: function () {
                    //alert("hjk");
                    //let ell = document.getElementById(this.playerid);
                    //console.log("el", ell);
                    this.player.pauseVideo();
                    this.paused = !0;
                },
                stopvidy: function () {
                    //alert("hjk");
                    //let ell = document.getElementById(this.playerid);
                    //console.log("el", ell);
                    this.player.stopVideo();
                    this.stopped = !0;
                    this.paused = !0;
                },
                toggleMute: function () {
                    this.mute = !this.mute;
                    if (this.mute) {
                        this.player.mute();
                    } else {
                        this.player.unMute();
                    }
                },
                changeQuality: function () {
                    console.log("qs", this.quality);
                    this.player.setPlaybackQuality(this.quality);
                },
                initAvaliableQualities() {
                    let _aq = this.player.getAvailableQualityLevels();
                    //console.log("avail quaikt",_aq);
                    this.availableQualities = [];
                    _aq.forEach((x) => {
                        vQualities.forEach((y) => {
                            if (y.value == x) {
                                this.availableQualities.push({ value: y.value, text: y.text });
                            };
                        })

                    });
                },
                changeDuration: function () {
                    this.isRanging = !0;
                    var newpoint = this.player.getDuration() * (this.duration / 100);
                    this.player.seekTo(newpoint);
                    //this.updateProgressBar()
                    this.isRanging = !1;

                },
                updateProgressBar() {
                    if (this.isRanging)
                        return false;

                    this.duration = ((this.player.getCurrentTime() / this.player.getDuration()) * 100);

                    this.$nextTick(() => {
                        var progressbar = this.$refs.progressBar;
                        if (progressbar != undefined) {
                            var output = this.$refs.output;
                            progressbar.value = ((this.player.getCurrentTime() / this.player.getDuration()) * 100);
                            time = Math.round(this.player.getCurrentTime());
                            var minutes = Math.floor(time / 60),
                                seconds = time - minutes * 60;
                            seconds = seconds < 10 ? '0' + seconds : seconds;
                            output.innerHTML = minutes + ":" + seconds;
                            //progressbar.setAttribute("tooltip","bu:"+  minutes + ":" + seconds);
                        }
                    });
                }
            },
            mounted: function () {
                this.$emit('change');
                //let ell = document.getElementById(this.playerid);
                //this.muted = this.mute;
                var self = this;

                this.player = new YT.Player(this.playerid, {
                    height: "300",
                    width: "100%",
                    videoId: self.videoid,
                    playerVars: {
                        autoplay: self.autoplay,
                        controls: 1,
                        showinfo: 0,
                        mute: self.mute
                    },
                    events: {
                        onReady: function (event) {
                            self.isInited= !0;
                            if (self.autoplay === 1) {
                                self.playvidy();
                            } else {
                                self.pausevidy();
                            }
                            if (self.quality != null && self.quality != undefined) {
                                event.target.setPlaybackQuality(self.quality);
                            }
                            setInterval(function () {
                                //updateTimerDisplay();
                                self.updateProgressBar();
                            }, 1000);

                            //console.log("kullanılabilir kaliteler ", event.target);
                        },
                        onStateChange: function () {
                            self.initAvaliableQualities();
                            if (event.data == YT.PlayerState.BUFFERING) {
                                //event.target.setPlaybackQuality('hd720');
                                //self.updateProgressBar();
                            }
                            var playerStatus = event.data;
                            if (playerStatus == -1) {
                                //alert("başlamadı"); //
                            } else if (playerStatus == 0) {
                                //alert("bitti"); //
                            } else if (playerStatus == 1) {
                                //$(".dotted-ovesrlay").addClass("dotted-overlay");
                                //alert("playing"); //
                            } else if (playerStatus == 2) {
                                //alert("paused"); //
                            } else if (playerStatus == 3) {
                                //alert("buffering");
                            } else if (playerStatus == 5) {
                                //alert("video cued");
                            }
                        }
                    }
                });


            },

            template: `<div class="col-12 col-sm-6 col-md-4 col-lg-3"><div class="yv-wrapper">
      <div class="yv-inner">
       <div class="embed-responsive embed-responsive-16by9">
  <div :id="playerid" class="embed-responsive-item" >player is loading..</div>
  </div>
          <div class="controls" v-if="isInited" >
<form class="form-range" v-if="player!=null && !stopped">
          <input type="range"   ref="progressBar" class="form-control" @input="changeDuration" v-model="duration" value="0" />
<output ref="output"  ></output>
</form>      
<button type="button" class="btn btn-info btn-sm" v-if="paused && player!=null" v-on:click="playvidy"><i class="fa fa-play"></i></button>
            <button type="button" class="btn btn-info btn-sm" v-if="!paused" v-on:click="pausevidy"><i class="fa fa-pause"></i></button>
 <button type="button" class="btn btn-info btn-sm" v-if="!stopped" v-on:click="stopvidy"><i class="fa fa-stop"></i></button>
            <button type="button" class="btn btn-info btn-sm" v-on:click="toggleMute">
              <i v-if="!mute" class="fa fa-volume-up"></i>
              <i v-if="mute" class="fas fa-volume-mute"></i>         
            </button>
<select class="custom-select" data-toggle="tooltip" title="Available qualities" v-if="!stopped" v-model="quality" @change="changeQuality"><option v-for="item in availableQualities" :value="item.value">{{item.text}}</option></select>
          </div>
        </div></div></div>`
        });

        var app = new Vue({
            el: "#app1",
            data: function () {
                return { myvideos: _videos, inited: !1 };
            },
            created: function () {
                this.inited = !0;
            }
        });
    }, 1500);
}
function onPlayerStateChange(event) {
    //info.html("status is " + event.data);
    if (event.data == YT.PlayerState.BUFFERING) {
        //event.target.setPlaybackQuality('hd720');
    }
    var playerStatus = event.data;
    if (playerStatus == -1) {
        //alert("başlamadı"); //
    } else if (playerStatus == 0) {
        //alert("bitti"); //
    } else if (playerStatus == 1) {
        //$(".dotted-ovesrlay").addClass("dotted-overlay");
        //alert("playing"); //
    } else if (playerStatus == 2) {
        //alert("paused"); //
    } else if (playerStatus == 3) {
        //alert("buffering");
    } else if (playerStatus == 5) {
        //alert("video cued");
    }
    /*if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
          }*/
}
