function h(a){return function(){return a}}
(function(a){a.Event.prototype.m=function(){var a={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">","/":"?",";":":","'":'"',"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},c={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,107:43,109:45,110:46,111:47,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},d=this.which;if(0<=[16,37,38,39,40,20,17,18,91].indexOf(d))return!1;"undefined"!==typeof c[d]&&(d=c[d]);c=String.fromCharCode(d);
this.shiftKey?"undefined"!==typeof a[c]&&(c=a[c]):c=c.toLowerCase();return c}})(jQuery);window.Terminal=function(){this.g=null;this.prompt="root@ubuntu> ";this.b=[];this.c=0;this.k=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));$("#cursor").before($('<div class="userinput"></div>'));$("#cursor").after($('<div class="userinput"></div>'))};this.f=function(){$("body > ul").append("<li>"+this.prompt+"</li>");this.k()};this.l=function(a){var b=$('<div class="system_output"></div>');b.text(a);$("body > ul > li:last-child").append(b);
this.k()};this.blink=function(){$("#cursor").toggleClass("blink")};this.j=function(){var a=$("#cursor"),b,c,d=a.prev(),g=a.next();if(0===d.length||!d.hasClass("userinput"))return!1;var e=d.text();if(0===e.length)return!1;b=e.substr(e.length-1);c=a.text();0===g.length&&"&nbsp;"!==c&&(g=$('<div class="userinput"></div>'),a.after(g));d.text(e.substring(0,e.length-1));a.text(b);return"&nbsp;"!==c?(g.prepend(c),!0):!1};this.e=function(){var a=$("#cursor"),b,c,d,g=a.prev(),e=a.next();if(0===e.length||!e.hasClass("userinput"))return!1;
d=e.text();if(0===d.length)return!1;b=d[0];c=a.text();if(0===e.length)return a.html("&nbsp;"),!1;e.text(d.substr(1));a.text(b);g.append(c);return!0};this.h=function(a){var b=$("#cursor").parent().children(".userinput").text();this.b[this.c]=b.substr(0,b.length-1);a=this.c+a;a<this.b.length&&0<=a&&(this.c=a,a=$("#cursor"),a.next().text(""),a.html("&nbsp;"),a.prev().text(this.b[this.c]))};this.n=function(a){var b;if(37===a.which)this.j();else if(39===a.which)this.e();else if(38===a.which)this.h(-1);
else if(40===a.which)this.h(1);else if(35===a.which)for(;this.e(););else if(36===a.which)for(;this.j(););else if(!a.ctrlKey||a.metaKey||a.shiftKey||67!==a.which)if(46===a.which)if(b=$("#cursor"),a=b.next(),0!==a.length&&a.hasClass("userinput")){var c=a.text();0!==c.length?(b.text(c.substr(0,1)),a.text(c.substr(1))):b.html("&nbsp;")}else b.html("&nbsp;");else 8===a.which?(a.preventDefault(),b=$("#cursor").prev(),0<b.length&&b.hasClass("userinput")&&b.text(b.text().slice(0,-1))):13===a.which?(b=$("#cursor").parent().children(".userinput").text(),
b=b.substr(0,b.length-1),0<b.length&&(this.b[this.b.length]=b,this.c=this.b.length),$("#cursor").prev().append($("#cursor").text()),$("#cursor").next().after($(" <br> ")),this.g.execute($.trim(b)).progress($.proxy(this.l,this)).always($.proxy(this.f,this))):222===a.which&&a.shiftKey?(a.preventDefault(),b=$("#cursor").prev(),b.append('"'),this.e()):222===a.which?(a.preventDefault(),b=$("#cursor").prev(),b.append("'"),this.e()):(b=$("#cursor").prev(),(a=a.m())&&b.append(a));else a.preventDefault(),
$("#cursor").next().append("^C"),this.f();$(window).scrollTop($(document).height())};this.bind=function(a,b){this.g=b;var c=$(a.document);c.keydown($.proxy(this.n,this));c.ready($.proxy(function(){this.f();a.setInterval(this.blink,500)},this))}};function l(){this.a={"?":"0"};this.p=/[\w\?\-\!]+/i;this.execute=function(a){var b=$.Deferred(),c=this.o(this.splitText(a));setTimeout($.proxy(function(){this.i(c,b)},this),0);return b.promise()};this.i=function(a,b){var c=a[0];this.a.q=a[a.length-1];if("eval"===a[0])a.shift(),0<a.length?this.i(a):this.a["?"]="0";else if("help"===a[0])b.notify(["Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. "]),b.notify(["To see a full list of commands, type 'commands' "]),
this.a["?"]="0";else if("echo"===a[0])a.shift(),b.notify([a.join(" ")]),this.a["?"]="0";else if("export"===a[0]){for(c=1;c<a.length;++c){var d=a[c].split("=",2);this.a[d[0]]=d[1]}this.a["?"]="0"}else if("unset"===a[0]){for(c=1;c<a.length;++c)this.a[a[c]]="";this.a["?"]="0"}else"undefined"!==typeof l.commands[a[0]]?(d=[new n,new n,new n],d[1].flush=function(a){b.notify([a])},d[2].flush=function(a){b.notify([a])},this.a["?"]=l.commands[c](d,a.length,a,this.a).toString()):void 0!==a[0]&&""!==a[0]&&(b.notify(["error: unknown command "+
a[0]]),this.a["?"]="127");b.resolve()};this.o=function(a){for(var b=1;b<a.length;++b)for(var c=a[b].indexOf("$");0<=c;c=a[b].indexOf("$",c+1))if(0!==c&&"\\"===a[b][c-1])a[b]=a[b].substr(0,c-1)+a[b].substr(c);else{var d=this.p.exec(a[b].substr(c+1))[0];null!==d&&("undefined"===typeof this.a[d]&&(this.a[d]=""),a[b]=a[b].substr(0,c)+this.a[d]+a[b].substr(c+d.length+1))}return a};this.splitText=function(a){for(var b="",c=[],d=!1,g=!1,e=!1,f=0;f<a.length;f++)" "===a[f]&&(d||g)?b+=a[f]:" "!==a[f]||d||g?
"\\"===a[f]?e||d?(b+="\\",e=!1):e=!0:"'"===a[f]?e?(b+="'",e=!1):g?b+="'":d=!d:'"'===a[f]?e?(b+='"',e=!1):d?b+='"':g=!g:"$"===a[f]&&d?b+="\\$":(b+=a[f],e=!1):0<b.length&&(c.push(b),b="");b=$.trim(b);""!==b&&c.push(b);return c}}l.commands={};window.WebBash=l;function n(){this.d=0;this.buffer="";this.write=function(a){this.buffer+=a;this.flush(this.buffer)};this.s=function(a){if(this.d>=this.buffer.length)return!1;if(void 0===a)return this.d=this.buffer.length,this.r;var b=this.buffer.substr(this.d,a);this.d+=a;return b};this.flush=function(){}};(function(a,b){b.commands["false"]=h(1);b.commands["true"]=h(0);b.commands.commands=function(a){var d=[],g;for(g in b.commands)b.commands.hasOwnProperty(g)&&d.push(g);a[1].write(d.join("<br/>"));return 0};b.commands.date=function(a,b){if(1<b)return a[2].write("error: date takes no args"),1;var g=new Date,e=Array(7);e[0]="Sun";e[1]="Mon";e[2]="Tue";e[3]="Wed";e[4]="Thu";e[5]="Fri";e[6]="Sat";var f=Array(12);f[0]="Jan";f[1]="Feb";f[2]="Mar";f[3]="Apr";f[4]="May";f[5]="Jun";f[6]="Jul";f[7]="Aug";f[8]=
"Sep";f[9]="Oct";f[10]="Nov";f[11]="Dec";var p="UTC";4===g.getTimezoneOffset()/60&&(p="EDT");var e=e[g.getDay()].toString()+" "+f[g.getMonth()].toString()+" "+g.getDate().toString()+" ",m=g.getHours(),f=m.toString();10>m&&(f="0"+m.toString());var k=g.getMinutes(),m=k.toString();10>k&&(m="0"+k.toString());var k=g.getSeconds(),q=k.toString();10>k&&(q="0"+k.toString());e+=f+":"+m+":"+q+" "+p+" "+g.getFullYear().toString()+" ";a[1].write(e);return 0}})(jQuery,l);(function(a,b){b.commands.ls=h(0);b.commands.ln=h(0);b.commands.touch=h(0);b.commands.mkdir=h(0);b.commands.cp=h(0);b.commands.mv=h(0);b.commands.rm=h(0);b.commands.chmod=h(0);b.commands.chgrp=h(0);b.commands.chown=h(0)})(jQuery,l);
