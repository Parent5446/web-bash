function k(a){return function(){return a}}
(function(a){a.Event.prototype.s=function(){var b={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">","/":"?",";":":","'":'"',"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},c={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,107:43,109:45,110:46,111:47,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},a=this.which;if(0<=[16,37,38,39,40,20,17,18,91].indexOf(a))return!1;"undefined"!==typeof c[a]&&(a=c[a]);c=String.fromCharCode(a);
this.shiftKey?"undefined"!==typeof b[c]&&(c=b[c]):c=c.toLowerCase();return c}})(jQuery);(function(a){a.n=function(b){b=b.substr(1).split("/");for(var c=[],a=0;a<b.length;a++)"."!==b[a]&&""!==b[a]&&(".."===b[a]?c.pop():c.push(b[a]));return"/"+c.join("/")}})(jQuery);window.Terminal=function(){this.g=null;this.prompt="root@ubuntu> ";this.c=[];this.e=0;this.o=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));$("#cursor").before($('<div class="userinput"></div>'));$("#cursor").after($('<div class="userinput"></div>'))};this.i=function(){$("body > ul").append("<li>"+this.prompt+"</li>");this.o()};this.r=function(a){var b=$('<div class="system_output"></div>');b.text(a);$("body > ul > li:last-child").append(b);
this.o()};this.blink=function(){$("#cursor").toggleClass("blink")};this.l=function(){var a=$("#cursor"),b,c,h=a.prev(),d=a.next();if(0===h.length||!h.hasClass("userinput"))return!1;var e=h.text();if(0===e.length)return!1;b=e.substr(e.length-1);c=a.text();0===d.length&&"&nbsp;"!==c&&(d=$('<div class="userinput"></div>'),a.after(d));h.text(e.substring(0,e.length-1));a.text(b);return"&nbsp;"!==c?(d.prepend(c),!0):!1};this.h=function(){var a=$("#cursor"),b,c,h,d=a.prev(),e=a.next();if(0===e.length||!e.hasClass("userinput"))return!1;
h=e.text();if(0===h.length)return!1;b=h[0];c=a.text();if(0===e.length)return a.html("&nbsp;"),!1;e.text(h.substr(1));a.text(b);d.append(c);return!0};this.k=function(a){var b=$("#cursor").parent().children(".userinput").text();this.c[this.e]=b.substr(0,b.length-1);a=this.e+a;a<this.c.length&&0<=a&&(this.e=a,a=$("#cursor"),a.next().text(""),a.html("&nbsp;"),a.prev().text(this.c[this.e]))};this.u=function(a){var b;if(37===a.which)this.l();else if(39===a.which)this.h();else if(38===a.which)this.k(-1);
else if(40===a.which)this.k(1);else if(35===a.which)for(;this.h(););else if(36===a.which)for(;this.l(););else if(!a.ctrlKey||a.metaKey||a.shiftKey||67!==a.which)if(46===a.which)if(b=$("#cursor"),a=b.next(),0!==a.length&&a.hasClass("userinput")){var c=a.text();0!==c.length?(b.text(c.substr(0,1)),a.text(c.substr(1))):b.html("&nbsp;")}else b.html("&nbsp;");else 8===a.which?(a.preventDefault(),b=$("#cursor").prev(),0<b.length&&b.hasClass("userinput")&&b.text(b.text().slice(0,-1))):13===a.which?(b=$("#cursor").parent().children(".userinput").text(),
b=b.substr(0,b.length-1),0<b.length&&(this.c[this.c.length]=b,this.e=this.c.length),$("#cursor").prev().append($("#cursor").text()),$("#cursor").next().after($(" <br> ")),this.g.execute($.trim(b),this).progress($.proxy(this.r,this)).always($.proxy(this.i,this))):222===a.which&&a.shiftKey?(a.preventDefault(),b=$("#cursor").prev(),b.append('"'),this.h()):222===a.which?(a.preventDefault(),b=$("#cursor").prev(),b.append("'"),this.h()):(b=$("#cursor").prev(),(a=a.s())&&b.append(a));else a.preventDefault(),
$("#cursor").next().append("^C"),this.i();$(window).scrollTop($(document).height())};this.bind=function(a){this.g=a;$.proxy(this.g.p,this.g)(this);this.i()};$(window.document).keydown($.proxy(this.u,this));window.setInterval(this.blink,500)};function m(a){this.b={"?":"0"};this.w=/[\w\?\-\!]+/i;this.a=a;this.p=function(b){var c=(new p).d("GET","/users/"+this.a,{},{},!1).responseJSON.homedir;this.b.HOME=c;this.b.PWD=c;b.prompt=this.a+"@ubuntu "+c+" $ "};this.execute=function(b,c){var a=$.Deferred(),d=this.v(this.splitText(b));setTimeout($.proxy(function(){this.j(d,c,a)},this),0);return a.promise()};this.j=function(b,c,a){if("undefined"!==typeof m.commands[b[0]]){var d=[new q,new q,new q];d[1].flush=function(b){a.notify([b])};d[2].flush=
function(b){a.notify([b])};this.b["?"]=m.commands[b[0]](d,b.length,b,this.b).toString()}else void 0!==b[0]&&""!==b[0]&&(a.notify(["error: unknown command "+b[0]]),this.b["?"]="127");this.b.A=b[b.length-1];c.prompt=this.a+"@ubuntu "+this.b.PWD+" $ ";a.resolve()};this.v=function(b){for(var c=1;c<b.length;++c)for(var a=b[c].indexOf("$");0<=a;a=b[c].indexOf("$",a+1))if(0!==a&&"\\"===b[c][a-1])b[c]=b[c].substr(0,a-1)+b[c].substr(a);else{var d=this.w.exec(b[c].substr(a+1))[0];null!==d&&("undefined"===typeof this.b[d]&&
(this.b[d]=""),b[c]=b[c].substr(0,a)+this.b[d]+b[c].substr(a+d.length+1))}return b};this.splitText=function(b){for(var a="",h=[],d=!1,e=!1,f=!1,g=0;g<b.length;g++)" "===b[g]&&(d||e)?a+=b[g]:" "!==b[g]||d||e?"\\"===b[g]?f||d?(a+="\\",f=!1):f=!0:"'"===b[g]?f?(a+="'",f=!1):e?a+="'":d=!d:'"'===b[g]?f?(a+='"',f=!1):d?a+='"':e=!e:"$"===b[g]&&d?a+="\\$":(a+=b[g],f=!1):0<a.length&&(h.push(a),a="");a=$.trim(a);""!==a&&h.push(a);return h}}m.commands={};window.WebBash=m;window.WebBashLogin=function(){this.q=new p;this.a="";this.p=function(a){a.prompt="Username: "};this.execute=function(a,b){var c=$.Deferred();setTimeout($.proxy(function(){this.j(a,b,c)},this),0);return c.promise()};this.j=function(a,b,c){""===this.a?(this.a=a,""!==a&&(b.prompt="Password: "),c.resolve()):this.q.t(this.a,a).done($.proxy(function(){b.bind(new m(this.a))},this)).fail(function(a){c.notify(a.responseText);this.a=null;b.prompt="Username: ";c.resolve()})}};function q(){this.f=0;this.buffer="";this.write=function(a){this.buffer+=a;this.flush(this.buffer)};this.C=function(a){if(this.f>=this.buffer.length)return!1;if(void 0===a)return this.f=this.buffer.length,this.B;var b=this.buffer.substr(this.f,a);this.f+=a;return b};this.flush=function(){}};function p(){this.m=this.a="";this.t=function(a,b){this.a=a;this.m=b;return this.d("GET","/login").then($.proxy(function(a){return this.d("POST","/login",{username:this.a,password:this.m,token:a.token})},this))};this.d=function(a,b,c,h,d){return $.ajax({async:void 0===d?!0:d,data:c,dataType:"json",headers:h,type:a,url:"api.php"+b})}};(function(a,b){b.commands["false"]=k(1);b.commands["true"]=k(0);b.commands.echo=function(a,b,d){d.shift();a[1].write(d.join(" "));return 0};b.commands["export"]=function(a,b,d,e){for(a=1;a<b;++a){var f=d[a].split("=",2);e[f[0]]=f[1]}return 0};b.commands.unset=function(a,b,d,e){for(a=1;a<b;++a)e[d[a]]="";return 0};b.commands.pwd=function(a,b,d,e){a[1].write(e.PWD);return 0};b.commands.help=function(a){a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
a[2].write("To see a full list of commands, type 'commands' ");return 0};b.commands.commands=function(a){var h=[],d;for(d in b.commands)b.commands.hasOwnProperty(d)&&h.push(d);a[1].write(h.join("\n"));return 0};b.commands.date=function(a,b){if(1<b)return a[2].write("error: date takes no args"),1;var d=new Date,e=Array(7);e[0]="Sun";e[1]="Mon";e[2]="Tue";e[3]="Wed";e[4]="Thu";e[5]="Fri";e[6]="Sat";var f=Array(12);f[0]="Jan";f[1]="Feb";f[2]="Mar";f[3]="Apr";f[4]="May";f[5]="Jun";f[6]="Jul";f[7]="Aug";
f[8]="Sep";f[9]="Oct";f[10]="Nov";f[11]="Dec";var g="UTC";4===d.getTimezoneOffset()/60&&(g="EDT");var e=e[d.getDay()].toString()+" "+f[d.getMonth()].toString()+" "+d.getDate().toString()+" ",l=d.getHours(),f=l.toString();10>l&&(f="0"+l.toString());var n=d.getMinutes(),l=n.toString();10>n&&(l="0"+n.toString());var n=d.getSeconds(),r=n.toString();10>n&&(r="0"+n.toString());e+=f+":"+l+":"+r+" "+g+" "+d.getFullYear().toString()+" ";a[1].write(e);return 0}})(jQuery,m);(function(a,b){var c=new p;b.commands.cd=function(b,d,e,f){var g="",g=1>=d?f.HOME:"/"===e[1][0]?a.n(e[1]):a.n(f.PWD+"/"+e[1]);if(200===c.d("GET","/files"+g,{},{},!1).status)return f.PWD=g,0;b[2].write("cd: "+g+": No such file or directory");return 1};b.commands.ls=function(a,b,e,f){1===b&&(e[b]=f.HOME,b++);for(f=1;f<b;f++)for(var g=c.d("GET","/files"+e[1],{},{},!1),l=0;l<g.responseJSON.length;l++)a[1].write(g.responseJSON[l]+"\n");return 0};b.commands.ln=k(0);b.commands.touch=k(0);b.commands.mkdir=
function(a,b,e){for(var f=1;f<b;f++){var g=c.d("PUT","/files"+e[f],"",{"File-Type":"directory"},!1);if(404===g.status)return a[2].write("mkdir: cannot create directory "+e[f]+": No such file or directory"),1;if(403===g.status)return a[2].write("mkdir: cannot create directory "+e[f]+": Permission denied"),1;if(400<=g.status)return a[2].write("mkdir: cannot create directory "+e[f]+": An internal error occurred"),1}return 0};b.commands.cp=k(0);b.commands.mv=k(0);b.commands.rm=k(0);b.commands.chmod=k(0);
b.commands.chgrp=k(0);b.commands.chown=k(0)})(jQuery,m);
