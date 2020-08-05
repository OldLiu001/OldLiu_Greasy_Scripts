// ==UserScript==
// @name         MidiShow免积分下载
// @version      1.3
// @description  登录后点击播放按钮，自动弹出下载。
// @author       老刘
// @run-at       document-idle
// @match        *://www.midishow.com/midi/*.html
// @namespace    MidiShowDownloader_ByOldLiu
// @grant        none
// ==/UserScript==

//v1.0 初始版本。
//v1.1 增加IE、旧版Edge浏览器支持。
//v1.2 下载时mid文件根据标题命名。
//v1.3 修复bug。

(function() {
  'use strict';
  //hook播放器初始化函数。
  var Original_JZZ_MIDI_SMF = JZZ.MIDI.SMF;
  JZZ.MIDI.SMF = function(Midi_File){
    //从标题获得文件名。
    var Midi_File_Name = document.title.replace(" - MIDI音乐下载试听 :: MidiShow","") + ".mid"
    //创建Midi文件的Uint8Array。
    var Midi_File_Binary_Array = new Uint8Array(Midi_File.length);
    for (var Binary_Pointer = 0; Binary_Pointer < Midi_File.length ; Binary_Pointer++) { 
      Midi_File_Binary_Array[Binary_Pointer] = Midi_File.charCodeAt(Binary_Pointer);
    }
    //得到Midi文件的Blob。
    var Midi_File_Blob = new Blob([Midi_File_Binary_Array],{type:''});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //IE或旧版Edge，直接下载。
        window.navigator.msSaveOrOpenBlob(Midi_File_Blob,Midi_File_Name);
    } else {
        //非IE，模拟点击触发下载。
        var Midi_File_Url = URL.createObjectURL(Midi_File_Blob);
        var Midi_Downloader = document.createElement("a");
        Midi_Downloader.setAttribute("href",Midi_File_Url);
        Midi_Downloader.setAttribute("download",Midi_File_Name);
        Midi_Downloader.setAttribute("target","_blank");
        let Click_Event = document.createEvent("MouseEvents");
        Click_Event.initEvent("click",true,true);  
        Midi_Downloader.dispatchEvent(Click_Event);
    }
    return Original_JZZ_MIDI_SMF(Midi_File);
  }
})();