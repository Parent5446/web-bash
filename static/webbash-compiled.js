(function(b){b.Event.prototype.u=function(){var a={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">","/":"?",";":":","'":'"',"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},c={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,107:43,109:45,110:46,111:47,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},f=this.which;if(0<=[16,37,38,39,40,20,17,18,91].indexOf(f))return!1;"undefined"!==typeof c[f]&&(f=c[f]);c=String.fromCharCode(f);
this.shiftKey?"undefined"!==typeof a[c]&&(c=a[c]):c=c.toLowerCase();return c}})(jQuery);(function(b){b.c=function(a,c,f){var b=a[0];"~"===b?a=f+"/"+a:"/"!==b&&(a=c+"/"+a);a=a.substr(1).split("/");c=[];for(f=0;f<a.length;f++)"."!==a[f]&&""!==a[f]&&(".."===a[f]?c.pop():c.push(a[f]));return"/"+c.join("/")}})(jQuery);(function(b){function a(a,b,d){return d.indexOf(a)===b}b.w=function(c){var b=[],d;for(d in c)if(c.hasOwnProperty(d))for(var e=1;e<c[d].length;++e)b[b.length]=c[d][e];return b=b.filter(a)}})(jQuery);window.Terminal=function(){this.e=null;this.prompt="root@ubuntu> ";this.d=[];this.g=0;this.r=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));"Password: "!==this.prompt?($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>'))):($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>')));
$(window).scrollTop($(document).height())};this.clear=function(){$("body > ul").empty()};this.m=function(){$("body > ul").append("<li>"+this.prompt+"</li>");this.r()};this.t=function(b){var a=$('<div id="system_output"></div>');a.text(b);$("body > ul > li:last-child").append(a);this.r()};this.blink=function(){$("#cursor").toggleClass("blink")};this.p=function(){var b=$("#cursor"),a,c,f=b.prev(),d=b.next();if(0===f.length||!f.hasClass("userinput"))return!1;var e=f.text();if(0===e.length)return!1;a=
e.substr(e.length-1);c=b.text();0===d.length&&"&nbsp;"!==c&&(d=$('<div class="userinput"></div>'),b.after(d));f.text(e.substring(0,e.length-1));b.text(a);return"&nbsp;"!==c?(d.prepend(c),!0):!1};this.l=function(){var b=$("#cursor"),a,c,f,d=b.prev(),e=b.next();if(0===e.length||!e.hasClass("userinput"))return!1;f=e.text();if(0===f.length)return!1;a=f[0];c=b.text();if(0===e.length)return b.html("&nbsp;"),!1;e.text(f.substr(1));b.text(a);d.append(c);return!0};this.o=function(b){var a=$("#cursor").parent().children(".userinput").text();
this.d[this.g]=a.substr(0,a.length-1);b=this.g+b;b<this.d.length&&0<=b&&(this.g=b,b=$("#cursor"),b.next().text(""),b.html("&nbsp;"),b.prev().text(this.d[this.g]))};this.A=function(b){var a;if(37===b.which)b.preventDefault(),this.p();else if(39===b.which)b.preventDefault(),this.l();else if(38===b.which)b.preventDefault(),this.o(-1);else if(40===b.which)b.preventDefault(),this.o(1);else if(35===b.which)for(;this.l(););else if(36===b.which)for(;this.p(););else if(!b.ctrlKey||b.metaKey||b.shiftKey||67!==
b.which)if(46===b.which)if(a=$("#cursor"),b=a.next(),0!==b.length&&b.hasClass("userinput")){var c=b.text();0!==c.length?(a.text(c.substr(0,1)),b.text(c.substr(1))):a.html("&nbsp;")}else a.html("&nbsp;");else 8===b.which?(b.preventDefault(),a=$("#cursor").prev(),0<a.length&&a.hasClass("userinput")&&a.text(a.text().slice(0,-1))):13===b.which?(a=$("#cursor").parent().children(".userinput").text(),a=a.substr(0,a.length-1),0<a.length&&(this.d[this.d.length]=a,this.g=this.d.length),$("#cursor").prev().append($("#cursor").text()),
$("#cursor").next().after($(" <br> ")),this.e.execute($.trim(a),this).progress($.proxy(this.t,this)).always($.proxy(this.m,this))):222===b.which&&b.shiftKey?(b.preventDefault(),a=$("#cursor").prev(),a.append('"'),this.l()):222===b.which?(b.preventDefault(),a=$("#cursor").prev(),a.append("'"),this.l()):(a=$("#cursor").prev(),(b=b.u())&&a.append(b));else b.preventDefault(),$("#cursor").next().append("^C"),this.m();$(window).scrollTop($(document).height())};this.bind=function(b){null!==this.e&&$.proxy(this.e.j,
this.e)(this);this.e=b;$.proxy(this.e.s,this.e)(this);this.m()};$(window.document).keydown($.proxy(this.A,this));$(window).bind("beforeunload",function(){$.proxy(this.e.j,this.e)(this)});window.setInterval(this.blink,500);window.setInterval($.proxy(function(){this.e.j(this)},this),1E4)};function t(b){this.f={"?":"0"};this.C=/[\w\?\-\!]+/i;this.b=b;this.k=0;this.h=new w;this.s=function(a){var c=this.h.a("GET","/users/"+this.b,{},{},!1),b=this.h.a("GET","/users/"+this.b+"/history",{},{},!1),c=c.responseJSON.homedir;this.f.USER=this.b;this.f.HOME=c;this.f.PWD=c;a.prompt=this.b+"@ubuntu "+c+" $ ";200===b.status&&(a.d=b.responseJSON,this.k=a.g=b.responseJSON.length)};this.j=function(a){this.k<a.d.length&&(this.h.a("PATCH","/users/"+this.b+"/history",{history:a.d.slice(this.k)}),this.k=
a.d.length)};this.execute=function(a,c){var b=$.Deferred();setTimeout($.proxy(function(){var d=this.B(this.splitText(a));this.n(d,c,b)},this),0);return b.promise()};this.n=function(a,c,b){var d;"exit"===a[0]?(this.j(c),window.open("","_self",""),window.close(),self.close()):"clear"===a[0]?c.clear():"undefined"!==typeof t.commands[a[0]]?(d=[new x,new x,new x],d[1].flush=function(a){b.notify([a])},d[2].flush=function(a){b.notify([a])},d=t.commands[a[0]](d,a.length,a,this.f)):void 0!==a[0]&&""!==a[0]&&
(b.notify(["error: unknown command "+a[0]]),d="127");updateFunc=$.proxy(function(a){this.f["?"]=a.toString();c.prompt=this.b+"@ubuntu "+this.f.PWD+" $ ";b.resolve()},this);"object"===$.type(d)&&void 0!==d.then?d.then(updateFunc):updateFunc(d)};this.B=function(a){for(var c=1;c<a.length;++c)for(var b=a[c].indexOf("$");0<=b;b=a[c].indexOf("$",b+1))if(0!==b&&"\\"===a[c][b-1])a[c]=a[c].substr(0,b-1)+a[c].substr(b);else{var d=this.C.exec(a[c].substr(b+1))[0];null!==d&&("undefined"===typeof this.f[d]&&(this.f[d]=
""),a[c]=a[c].substr(0,b)+this.f[d]+a[c].substr(b+d.length+1))}return a};this.splitText=function(a){for(var b="",f=[],d=!1,e=!1,g=!1,p=0;p<a.length;p++)" "===a[p]&&(d||e)?b+=a[p]:" "!==a[p]||d||e?"\\"===a[p]?g||d?(b+="\\",g=!1):g=!0:"'"===a[p]?g?(b+="'",g=!1):e?b+="'":d=!d:'"'===a[p]?g?(b+='"',g=!1):d?b+='"':e=!e:"$"===a[p]&&d?b+="\\$":(b+=a[p],g=!1):0<b.length&&(f.push(b),b="");b=$.trim(b);""!==b&&f.push(b);return f}}t.commands={};window.WebBash=t;window.WebBashLogin=function(){this.h=new w;this.b="";this.s=function(b){b.prompt="Username: "};this.j=function(){};this.execute=function(b,a){var c=$.Deferred();setTimeout($.proxy(function(){this.n(b,a,c)},this),0);return c.promise()};this.n=function(b,a,c){""===this.b?(this.b=b,""!==b&&(a.prompt="Password: "),c.resolve()):this.h.v(this.b,b).done($.proxy(function(){a.bind(new t(this.b))},this)).fail($.proxy(function(b){c.notify(b.responseText);this.b="";a.prompt="Username: ";c.resolve()},this))}};function x(){this.i=0;this.buffer="";this.write=function(b){this.buffer+=b;this.flush(this.buffer)};this.F=function(b){if(this.i>=this.buffer.length)return!1;if(void 0===b)return this.i=this.buffer.length,this.D;var a=this.buffer.substr(this.i,b);this.i+=b;return a};this.clear=function(){this.buffer=""};this.flush=function(){this.buffer=""}};function w(){this.q=this.b="";this.v=function(b,a){this.b=b;this.q=a;return this.a("GET","/login").then($.proxy(function(b){return this.a("POST","/login",{username:this.b,password:this.q,token:b.token})},this))};this.a=function(b,a,c,f,d){var e="application/x-www-form-urlencoded";void 0!==f&&"Content-Type"in f&&(e=f["Content-Type"]);return $.ajax({async:void 0===d?!0:d,contentType:e,data:c,headers:f,type:b,url:"api.php"+a})}};(function(b,a){a.commands["false"]=function(){return 1};a.commands["true"]=function(){return 0};a.commands.echo=function(b,a,d){d.shift();b[1].write(d.join(" "));return 0};a.commands["export"]=function(b,a,d,e){for(b=1;b<a;++b){var g=d[b].split("=",2);e[g[0]]=g[1]}return 0};a.commands.unset=function(b,a,d,e){for(b=1;b<a;++b)e[d[b]]="";return 0};a.commands.pwd=function(b,a,d,e){b[1].write(e.PWD);return 0};a.commands.help=function(b){b[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
b[2].write("To see a full list of commands, type 'commands' ");return 0};a.commands.commands=function(b){var f=[],d;for(d in a.commands)a.commands.hasOwnProperty(d)&&f.push(d);b[1].write(f.join("\n"));return 0};a.commands.whoami=function(b,a,d,e){b[1].write(e.USER);return 0};a.commands.sleep=function(a,f,d){if(2>d.length)return a[2].write("sleep: missing operand"),1;a=d[1][d[1].length-1];f=0;-1===["s","m","h","d"].indexOf(a)?(f=parseInt(d[1]),a="s"):f=parseInt(d[1].substr(0,-1));switch(a){case "d":f*=
24;case "h":f*=60;case "m":f*=60;case "s":f*=1E3}var e=b.Deferred();setTimeout(function(){e.resolve(0)},f);return e.promise()};a.commands.date=function(b,a){if(1<a)return b[2].write("error: date takes no args"),1;var d=new Date,e=Array(7);e[0]="Sun";e[1]="Mon";e[2]="Tue";e[3]="Wed";e[4]="Thu";e[5]="Fri";e[6]="Sat";var g=Array(12);g[0]="Jan";g[1]="Feb";g[2]="Mar";g[3]="Apr";g[4]="May";g[5]="Jun";g[6]="Jul";g[7]="Aug";g[8]="Sep";g[9]="Oct";g[10]="Nov";g[11]="Dec";var p="UTC";4===d.getTimezoneOffset()/
60&&(p="EDT");var e=e[d.getDay()].toString()+" "+g[d.getMonth()].toString()+" "+d.getDate().toString()+" ",u=d.getHours(),g=u.toString();10>u&&(g="0"+u.toString());var n=d.getMinutes(),u=n.toString();10>n&&(u="0"+n.toString());var n=d.getSeconds(),h=n.toString();10>n&&(h="0"+n.toString());e+=g+":"+u+":"+h+" "+p+" "+d.getFullYear().toString()+" ";b[1].write(e);return 0}})(jQuery,t);(function(b,a){function c(b,a,c){var h=" ";"undefined"==typeof a&&(a=0);"undefined"==typeof h&&(h=" ");"undefined"==typeof c&&(c=e);if(a+1>=b.length)switch(c){case d:b=Array(a+1-b.length).join(h)+b;break;case g:a=Math.ceil((padlen=a-b.length)/2);b=Array(padlen-a+1).join(h)+b+Array(a+1).join(h);break;default:b+=Array(a+1-b.length).join(h)}return b}var f=new w;a.commands.cd=function(a,d,c,h){var e="",e=1>=d?h.HOME:"/"===c[1][0]?b.c(c[1]):b.c(c[1],h.PWD,h.HOME);d=f.a("GET","/files"+e,{},{},!1);if(200===
d.status)return h.PWD=e,0;404===d.status?a[2].write("cd: "+e+": No such file or directory"):403===d.status?a[2].write("cd: "+e+": Permission denied"):a[2].write("cd: "+e+": An internal error occurred");return 1};var d=1,e=2,g=3;a.commands.ls=function(a,e,n,h){var g=[],m=[],l=[];e=/-[\w]+/;for(var r in n)e.test(n[r])?g[g.length]=n[r]:m[m.length]=n[r];e=m.length;g=b.w(g);1===e&&(m[e]="",e++);n="/files"+h.PWD;var k="";for(h=1;h<e;h++)if(r=f.a("GET",n+m[h],{},{},!1),r.responseJSON instanceof Array)for(var C=
r.responseJSON.length-1,y=0;y<r.responseJSON.length;y++){var v=a[1],q=r.responseJSON[y],z=g,F=C,k=k+q[6]+"\t\t",s=!0,D=!1,A=void 0;for(A in z)if(z.hasOwnProperty(A))switch(z[A]){case "a":D=!0;break;case "l":for(var k="d"===q[0]?"d":"-",s=256,E=0;3>E;E++)k=s&q[1]?k+"r":k+"-",s>>=1,k=s&q[1]?k+"w":k+"-",s>>=1,k=s&q[1]?k+"x":k+"-";k+=" "+c(q[2],10,d);k+=" "+c(q[3],6,d);k+=" "+c(q[4].toString(),6,d);k+=" "+q[5].date;k+=" "+q[6];s=!1}if("."!==q[6]&&".."!==q[6]||D)s?(k+="\n   ",F%4||(v.write(k),v.clear(),
k="")):(k+="\n",v.write(k),v.clear(),k="");C--}else if("string"===typeof r.responseJSOn||404==r.status)l[l.length]=m[h];for(var B in l)B.hasOwnProperty(B)&&a[2].write("Failed to find the following path "+l[B]+"\n");return 0};a.commands.ln=function(a,d,c,h){3!==d&&a[2].write("ln: invalid number of parameters");d=b.c(c[1],h.PWD,h.HOME);c=b.c(c[2],h.PWD,h.HOME);h=f.a("PUT","/files"+c,"",{"File-Type":"link","Content-Location":d},!1);return 404===h.status?(a[2].write("ln: failed to create symbolic link "+
c+": No such file or directory"),1):403===h.status?(a[2].write("ln: failed to create symbolic link "+c+": Permission denied"),1):400<=h.status?(a[2].write("ln: failed to create symbolic link "+c+": An internal error occurred"),1):0};a.commands.touch=function(a,c,d,h){for(var e=1;e<c;e++){var g=b.c(d[e],h.PWD,h.HOME),l=f.a("POST","/files"+g,"",{},!1);if(404===l.status)return a[2].write("touch: cannot touch "+g+": No such file or directory"),1;if(403===l.status)return a[2].write("touch: cannot touch "+
g+": Permission denied"),1;if(400<=l.status)return a[2].write("touch: cannot touch "+g+": An internal error occurred"),1}return 0};a.commands.cat=function(a,c,d,h){if(1>=c)return a[2].write("cat: invalid number of parameters"),1;for(var e=1;e<c;e++){var g=b.c(d[e],h.PWD,h.HOME);req=f.a("GET","/files"+g,"",{},!1);200===req.status?"directory"===req.getResponseHeader("File-Type")?a[2].write("cat: "+g+": Is a directory"):a[1].write(req.responseText):404===req.status?a[2].write("cat: "+g+": No such file or directory"):
403===req.status&&a[2].write("cat: "+g+": Permission denied")}return 0};a.commands.mkdir=function(a,c,d,e){for(var g=1;g<c;g++){var m=b.c(d[g],e.PWD,e.HOME),l=f.a("PUT","/files"+m,"",{"File-Type":"directory"},!1);if(404===l.status)return a[2].write("mkdir: cannot create directory "+m+": No such file or directory"),1;if(403===l.status)return a[2].write("mkdir: cannot create directory "+m+": Permission denied"),1;if(400<=l.status)return a[2].write("mkdir: cannot create directory "+m+": An internal error occurred"),
1}return 0};a.commands.useradd=function(b,a,c){if(4!=a)return b[2].write("error in usage: useradd username password email"),1;a=f.a("PUT","/users/"+c[1],{password:c[2],email:c[3],home_directory:"/"+c[1]},"",!1);if(400==a.status||403==a.status||404==a.status)return b[2].write("count not create user: "+a.responseJSON),1;if(500==a.status)return b[2].write("count not create user: server timed out"),1;b[1].write("user successfully created");return 0};a.commands.cp=function(a,c,d,e){3!==c&&a[2].write("cp: invalid number of parameters");
c=b.c(d[1],e.PWD,e.HOME);d=b.c(d[2],e.PWD,e.HOME);e=f.a("PUT","/files"+d,c,{"Content-Type":"application/vnd.webbash.filepath"},!1);return 404===e.status?(a[2].write("cp: cannot create regular file "+d+": No such file or directory"),1):403===e.status?(a[2].write("cp: cannot create regular file "+d+": Permission denied"),1):400<=e.status&&"Invalid file data source"===e.responseJSON?(a[2].write("cp: cannot stat "+c+": No such file or directory"),1):0};a.commands.mv=function(a,c,d,e){3!==c&&a[2].write("mv: invalid number of parameters");
c=b.c(d[1],e.PWD,e.HOME);d=b.c(d[2],e.PWD,e.HOME);e=f.a("PUT","/files"+d,c,{"Content-Type":"application/vnd.webbash.filepath"},!1);if(404===e.status)return a[2].write("mv: cannot create regular file "+d+": No such file or directory"),1;if(403===e.status)return a[2].write("mv: cannot create regular file "+d+": Permission denied"),1;if(400<=e.status&&"Invalid file data source"===e.responseJSON)return a[2].write("mv: cannot stat "+c+": No such file or directory"),1;e=f.a("DELETE","/files"+c,"",{},!1);
return 403===e.status?(a[2].write("mv: cannot remove "+c+": Permission denied"),1):0};a.commands.rm=function(a,c,d,e){for(var g=1;g<c;g++){var m=b.c(d[g],e.PWD,e.HOME);req=f.a("DELETE","/files"+m,"",{},!1);404===req.status?a[2].write("mv: cannot remove "+src+": No such file or directory"):403===req.status&&a[2].write("mv: cannot remove "+src+": Permission denied")}return 0};a.commands.chmod=function(){return 0};a.commands.chgrp=function(a,c,d,e){if(3>c)return a[2].write("chown: needs at least 2 parameters"),
1;for(var g=2;g<c;g++){var m=b.c(d[g],e.PWD,e.HOME),l=f.a("PATCH","/files"+m,"",{"File-Group":d[1]},!1);if(404===l.status)a[2].write("chown: cannot access "+m+": No such file or directory");else if(403===l.status)a[2].write("chown: changing ownership of "+m+": Permission denied");else if(400<=l.status&&"Invalid group"===l.responseJSON)return a[2].write("chown: invalid group: "+d[1]),1}return 0};a.commands.chown=function(a,c,d,e){if(3>c)return a[2].write("chown: needs at least 2 parameters"),1;for(var g=
2;g<c;g++){var m=b.c(d[g],e.PWD,e.HOME),l=f.a("PATCH","/files"+m,"",{"File-Owner":d[1]},!1);if(404===l.status)a[2].write("chown: cannot access "+m+": No such file or directory");else if(403===l.status)a[2].write("chown: changing ownership of "+m+": Permission denied");else if(400<=l.status&&"Invalid owner"===l.responseJSON)return a[2].write("chown: invalid user: "+d[1]),1}return 0}})(jQuery,t);
