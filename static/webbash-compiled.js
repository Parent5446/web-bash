function r(a,b,h){var c=a[0];"~"===c?a=h+"/"+a:"/"!==c&&(a=b+"/"+a);a=a.substr(1).split("/");b=[];for(h=0;h<a.length;h++)"."!==a[h]&&""!==a[h]&&(".."===a[h]?b.pop():b.push(a[h]));return"/"+b.join("/")};function v(a,b,h,c){"undefined"===typeof b&&(b=0);"undefined"===typeof h&&(h=" ");"undefined"===typeof c&&(c="left");if(""===h)return a;if(b+1>=a.length)switch(c){case "left":a=Array(b+1-a.length).join(h)+a;break;case "both":b=b-a.length;c=Math.ceil(b/2);a=Array(b-c+1).join(h)+a+Array(c+1).join(h);break;default:a=a+Array(b+1-a.length).join(h)}return a};$.b=function(a,b){for(var h={},c=[a[0]],e=1;e<a.length;e++){if("-"!==a[e][0])if("+"===b[0]){c=$.merge(c,a.slice(e));break}else{c.push(a[e]);continue}else if("--"===a[e]){c=$.merge(c,a.slice(e));break}for(var m=1;m<a[e].length;m++){var f=a[e][m],d=b.indexOf(f);if(-1===d)return["Unknown option -"+f,a];if(":"===b[d+1])if(m===a[e].length-1&&"-"!==a[e+1][0])h[f]=a[++e];else if(":"!==b[d+2])if(m+1<a[e].length){h[f]=a[e].substr(m+1);break}else return["Option -"+f+" requires an argument",a];else h[f]=!0;
else h[f]=!0}}return[h,c]};function w(a){for(var b="",h=[],c=!1,e=!1,m=!1,f=0;f<a.length;f++)" "===a[f]&&(c||e)?b+=a[f]:" "!==a[f]||c||e?"\\"===a[f]?m||c?(b+="\\",m=!1):m=!0:"'"===a[f]?m?(b+="'",m=!1):e?b+="'":c=!c:'"'===a[f]?m?(b+='"',m=!1):c?b+='"':e=!e:"$"===a[f]&&c?b+="\\$":(b+=a[f],m=!1):0<b.length&&(h.push(b),b="");b=$.trim(b);""!==b&&h.push(b);return h};window.Terminal=function(){this.j=null;this.c="root@ubuntu> ";this.b=[];this.h=0;this.promise=null;this.l=!1;this.B=/\n/g;this.m=function(){(this.l=!this.l)?($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>'))):($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>')))};this.u=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));
this.l?($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>'))):($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>')));$(window).scrollTop($(document).height())};this.A=function(){$("body > ul").empty()};this.o=function(){this.promise=null;this.l=!1;$("body > ul").append("<li>"+this.c+"</li>");this.u()};this.C=function(a){var b=$('<div class="system_output"></div>');
b.text(a);b.html(b.html().replace(this.B,"<br>"));$("body > ul > li:last-child").append(b);this.u()};this.w=function(){$("#cursor").toggleClass("blink")};this.t=function(){var a=$("#cursor"),b,h,c=a.prev(),e=a.next();if(0===c.length||!c.hasClass("userinput"))return!1;var m=c.text();if(0===m.length)return!1;b=m.substr(m.length-1);h=a.text();0===e.length&&"&nbsp;"!==h&&(e=$('<div class="userinput"></div>'),a.after(e));c.text(m.substring(0,m.length-1));a.text(b);return"&nbsp;"!==h?(e.prepend(h),!0):
!1};this.q=function(){var a=$("#cursor"),b,h,c,e=a.prev(),m=a.next();if(0===m.length||!m.hasClass("userinput"))return!1;c=m.text();if(0===c.length)return!1;b=c[0];h=a.text();if(0===m.length)return a.html("&nbsp;"),!1;m.text(c.substr(1));a.text(b);e.append(h);return!0};this.s=function(a){var b=$("#cursor").parent().children(".userinput").text();this.b[this.h]=b.substr(0,b.length-1);a=this.h+a;a<this.b.length&&0<=a&&(this.h=a,a=$("#cursor"),a.next().text(""),a.html("&nbsp;"),a.prev().text(this.b[this.h]))};
this.D=function(a){var b;if(37===a.which)a.preventDefault(),this.t();else if(39===a.which)a.preventDefault(),this.q();else if(38===a.which)a.preventDefault(),this.s(-1);else if(40===a.which)a.preventDefault(),this.s(1);else if(35===a.which)for(;this.q(););else if(36===a.which)for(;this.t(););else if(a.ctrlKey&&!a.metaKey&&!a.shiftKey&&67===a.which)a.preventDefault(),$("#cursor").next().append("^C"),this.o();else if(a.ctrlKey&&!a.metaKey&&!a.shiftKey&&68===a.which)a.preventDefault(),this.promise&&
this.promise.k?($("#cursor").next().append("^D"),this.promise.k.close()):(this.j.b(this),this.j.i.b(),window.open("","_self",""),window.close(),self.close());else if(46===a.which)if(b=$("#cursor"),a=b.next(),0!==a.length&&a.hasClass("userinput")){var h=a.text();0!==h.length?(b.text(h.substr(0,1)),a.text(h.substr(1))):b.html("&nbsp;")}else b.html("&nbsp;");else if(8===a.which)a.preventDefault(),b=$("#cursor").prev(),0<b.length&&b.hasClass("userinput")&&b.text(b.text().slice(0,-1));else if(13===a.which)b=
$("#cursor").parent().children(".userinput").not(".completed"),a=b.text(),a=$.trim(a.substr(0,a.length-1)),b.addClass("completed"),0!=$("#cursor").next().length?($("#cursor").prev().append($("#cursor").text()),$("#cursor").next().append("<br>")):$("#cursor").prev().append($("#cursor").text()+"<br>"),this.promise&&this.promise.k?this.promise.k.write(a):0<a.length?(this.b[this.b.length]=a,this.h=this.b.length,this.promise=this.j.h($.trim(a),this),this.promise.progress($.proxy(this.C,this)).always($.proxy(this.o,
this))):this.o();else if(222===a.which&&a.shiftKey)a.preventDefault(),b=$("#cursor").prev(),b.append('"'),this.q();else if(222===a.which)a.preventDefault(),b=$("#cursor").prev(),b.append("'"),this.q();else if(!a.ctrlKey&&!a.metaKey){b=$("#cursor").prev();a.preventDefault();var h={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">","/":"?",";":":","'":'"',"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},c={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,
107:43,109:45,110:46,111:47,173:45,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},e=a.which;0<=[16,37,38,39,40,20,17,18,91].indexOf(e)?a=!1:("undefined"!==typeof c[e]&&(e=c[e]),c=String.fromCharCode(e),a.shiftKey?"undefined"!==typeof h[c]&&(c=h[c]):c=c.toLowerCase(),a=c);a&&b.append(a)}$(window).scrollTop($(document).height())};this.bind=function(a){null!==this.j&&this.j.b.call(this.j,this);this.j=a;this.j.m.call(this.j,this);this.o()};$(window.document).keydown($.proxy(this.D,
this));$(window).bind("beforeunload",function(){this.j.b.call(this.j,this)});window.setInterval(this.w,500);window.setInterval($.proxy(function(){this.j.b(this)},this),1E4)};function x(a){this.e={"?":"0"};this.l={};this.o=/[\w\?\-\!]+/i;this.f=a;this.c=0;this.i=new y;this.m=function(b){var a=this.i.a("GET","/users/"+this.f,{},{},!1),c=this.i.a("GET","/users/"+this.f+"/history",{},{},!1);(a=a.responseJSON.homedir)||(a="/");this.e.USER=this.f;this.e.HOME=a;this.e.PWD=a;b.c=this.f+"@ubuntu "+a+" $ ";200===c.status&&(b.b=c.responseJSON,this.c=b.h=c.responseJSON.length)};this.b=function(b){this.c<b.b.length&&(this.i.a("PATCH","/users/"+this.f+"/history",{history:b.b.slice(this.c)}),
this.c=b.b.length)};this.h=function(b,a){var c=$.Deferred();c.k=new z;setTimeout($.proxy(function(){var e=b;"string"===typeof e&&(e=this.F(w(b)));this.r(e,a,c)},this),0);var e=c.promise();e.k=c.k;return e};this.r=function(b,a,c){b[0]in this.l&&(b=$.merge(w(this.l[b[0]]),b.slice(1)));var e="0",m=[c.k,new z,new z],f=!1;foundStderr=!1;nextCmd=null;pipeIndex=b.indexOf("|");if(-1!==pipeIndex){var f=!0,d=b.splice(pipeIndex,b.length-pipeIndex);d.shift();0<d.length&&(nextCmd=this.h(d,a),m[1].n().progress(function(e){nextCmd.k.write(e.p())}),
m[1].n().done(function(e){nextCmd.k.write(e.p());nextCmd.k.close()}),nextCmd.progress(function(e){c.notify(e)}))}for(d=b.indexOf(">");-1!==d;d=b.indexOf(">",d+1)){var f=!0,k=r(b[d+1],this.e.PWD,this.e.HOME);m[1].n().done($.proxy(function(e){var a=e.p();this.i.a("POST","/files"+k,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+k,a,{"Content-Type":"text/plain"})},this))},this));b.splice(d,2)}for(d=b.indexOf("2>");-1!==d;d=b.indexOf("2>",d+1))foundStderr=!0,k=r(b[d+1],this.e.PWD,this.e.HOME),
m[2].n().done($.proxy(function(e){var a=e.p();this.i.a("POST","/files"+k,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+k,a,{"Content-Type":"text/plain"})},this))},this)),b.splice(d,2);for(d=b.indexOf("<");-1!==d;d=b.indexOf("<",d+1))k=r(b[d+1],this.e.PWD,this.e.HOME),m[0]=new z,this.i.a("GET","/files"+k).done(function(e){m[0].write(e);m[0].close()}),b.splice(d,2);f||(m[1].write=function(e){c.notify([e])});foundStderr||(m[2].write=function(e){c.notify([e])});if("exit"===b[0])this.b(a),this.i.b(),
window.open("","_self",""),window.close(),self.close();else if("clear"===b[0])a.A();else if("alias"===b[0]){for(d=1;d<b.length;++d)f=b[d].split("=",2),2==f.length&&(this.l[f[0]]=f[1]);e="0"}else b[0]in x.commands?e=x.commands[b[0]](m,b.length,b,this.e,a):b[0]&&(c.notify(["error: unknown command "+b[0]]),e="127");var l=$.proxy(function(e){this.e["?"]=e.toString();a.c=this.f+"@ubuntu "+this.e.PWD+" $ ";c.resolve(e)},this);"object"===$.type(e)&&void 0!==e.then?(e.then(function(){m[0].close();m[1].close();
m[2].close()}),null===nextCmd?e.then(l):e.then(function(){nextCmd.then(l)})):(m[0].close(),m[1].close(),m[2].close(),null===nextCmd?l(e):nextCmd.then(function(){l(e)}))};this.F=function(a){for(var h=1;h<a.length;++h)for(var c=a[h].indexOf("$");0<=c;c=a[h].indexOf("$",c+1))if(0!==c&&"\\"===a[h][c-1])a[h]=a[h].substr(0,c-1)+a[h].substr(c);else{var e=this.o.exec(a[h].substr(c+1))[0];null!==e&&("undefined"===typeof this.e[e]&&(this.e[e]=""),a[h]=a[h].substr(0,c)+this.e[e]+a[h].substr(c+e.length+1))}return a}}
x.commands={};window.WebBash=x;window.WebBashLogin=function(){this.i=new y;this.f="";this.m=function(a){a.c="Username: "};this.b=function(){};this.h=function(a,b){var h=$.Deferred();setTimeout($.proxy(function(){this.r(a,b,h)},this),0);return h.promise()};this.r=function(a,b,h){""===this.f?(this.f=a,""!==a&&(b.c="Password: "),h.resolve(),""!==a&&b.m()):this.i.c(this.f,a).done($.proxy(function(){b.m();b.bind(new x(this.f))},this)).fail($.proxy(function(a){h.notify("\n"+a.responseText);this.f="";b.c="Username: ";b.m();h.resolve()},
this))}};function z(){this.h=0;this.b="";this.c=$.Deferred();this.write=function(a){this.b+=a;null!==this.c&&this.c.notify(this)};this.p=function(){var a="";this.h>=this.b.length?a="":(a=this.b.substr(this.h),this.h=this.b.length);return a};this.n=function(){return this.c.promise()};this.close=function(){this.c.resolve(this)}};function y(){this.v=this.f="";this.c=function(a,b){this.f=a;this.v=b;return this.a("GET","/login").then($.proxy(function(a){return this.a("PUT","/login",{username:this.f,password:this.v,token:a.token})},this))};this.b=function(){this.a("DELETE","/login")};this.a=function(a,b,h,c,e){var m="application/x-www-form-urlencoded";void 0!==c&&"Content-Type"in c&&(m=c["Content-Type"]);return $.ajax({async:void 0===e?!0:e,contentType:m,data:h,headers:c,type:a,url:"api.php"+b})}};(function(a,b){b.commands["false"]=function(){return 1};b.commands["true"]=function(){return 0};b.commands.echo=function(a,b,e){e.shift();a[1].write(e.join(" "));return 0};b.commands["export"]=function(a,b,e,m){for(a=1;a<b;++a){var f=e[a].split("=",2);m[f[0]]=f[1]}return 0};b.commands.unset=function(a,b,e,m){for(a=1;a<b;++a)m[e[a]]="";return 0};b.commands.pwd=function(a,b,e,m){a[1].write(m.PWD);return 0};b.commands.help=function(a){a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
a[2].write("To see a full list of commands, type 'commands' ");return 0};b.commands.commands=function(a){var c=[],e;for(e in b.commands)b.commands.hasOwnProperty(e)&&c.push(e);a[1].write(c.join("\n"));return 0};b.commands.whoami=function(a,b,e,m){a[1].write(m.USER);return 0};b.commands.sleep=function(b,c,e){if(2>c)return b[2].write("sleep: missing operand"),1;b=e[1][e[1].length-1];c=0;-1===["s","m","h","d"].indexOf(b)?(c=parseInt(e[1],10),b="s"):c=parseInt(e[1].substr(0,-1),10);switch(b){case "d":c*=
24;case "h":c*=60;case "m":c*=60;case "s":c*=1E3}var m=a.Deferred();setTimeout(function(){m.resolve(0)},c);return m.promise()};b.commands.date=function(b,c,e){1>=c&&e.push("%c");c=new Date;var m="Sun Mon Tue Wed Thu Fri Sat".split(" "),f="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),d="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),k="January February March April May June July August September October November December".split(" ");e=e[1].split("");for(var l=e.indexOf("%");0<=
l;l=e.indexOf("%",l+1)){var g="",p="0",n=1,t=[];"-"===e[l+n]?(++n,p=""):"_"===e[l+n]&&(++n,p=" ");switch(e[l+n++]){case "D":t="%m/%d/%y".split("");break;case "e":t=["%","_","d"];break;case "F":t="%Y-%m-%d".split("");break;case "k":t=["%","-","H"];break;case "l":t=["%","-","I"];break;case "R":t=["%","H",":","%","M"];break;case "T":t="%H:%M:%S".split("");break;case "%":g="%";break;case "a":g=m[c.getDay()];break;case "A":g=f[c.getDay()];break;case "b":case "h":g=d[c.getMonth()];break;case "B":g=k[c.getMonth()];
break;case "c":g=c.toLocaleString();break;case "C":g=c.getFullYear().toString().substr(0,2);break;case "d":g=c.getDate();break;case "H":g=c.getHours();break;case "I":g=c.getHours()%12;break;case "m":g=c.getMonth();break;case "M":g=c.getMinutes();break;case "n":g="\n";break;case "N":g=1E3*c.getMilliseconds();break;case "p":g=12<=c.getHours()?"PM":"AM";break;case "P":g=12<=c.getHours()?"pm":"am";break;case "s":g=c.getTime()/1E3;break;case "S":g=c.getSeconds();break;case "t":g="\t";break;case "u":g=
c.getDay()+1;break;case "w":g=c.getDay();break;case "x":g=c.toLocaleDateString();break;case "X":case "r":g=c.toLocaleTimeString();break;case "y":g=c.getFullYear()%100;break;case "Y":g=c.getFullYear();break;case "z":var q=c.getTimezoneOffset(),g=0<=q?"+":"-",g=g+(q/60+""+q%60);break;case "Z":g="EDT"}"number"===a.type(g)&&(g=v(g.toString(),2,p,"left"));Array.prototype.splice.apply(e,[l,n,g].concat(t))}b[1].write(e.join(""));return 0};b.commands.printf=function(b,c,e){if(1>=c)return b[2].write("error in usage: printf FORMAT [ARGS ...]"),
1;for(var m=1,f=e[1].split(""),d=f.indexOf("%");0<=d;d=f.indexOf("%",d+1)){var k="",l=1,g="",p=" ",n="right",t="0",q=null,s,k=f.indexOf("$",d+l);s=f.slice(d+l,k);-1===k||isNaN(s)?s=m++ +1:(++l,s=parseInt(s,10)+1);k=s<c?e[s]:"";a:for(;d+l<f.length;)switch(f[d+l]){case "+":++l;g="+";break;case " ":++l;g=" ";break;case "-":++l;n="left";break;case "0":++l;p="0";n="left";break;default:break a}for(;!isNaN(f[d+l]);)t+=f[d+l++];t=parseInt(t,10);if("."===f[d+l]){++l;for(q="0";!isNaN(f[d+l]);)q+=f[d+l++];q=
parseInt(q,10)}switch(f[d+l++]){case "d":case "i":k=parseInt(e[s],10);break;case "u":k=Math.abs(parseInt(e[s],10));break;case "f":case "F":case "g":case "G":k=parseFloat(e[s],10);break;case "x":case "X":k=parseInt(e[s],10).toString(16);break;case "o":k=parseInt(e[s],10).toString(8);break;case "s":k=e[s];break;case "c":k=e[s].substr(0,1);break;case "n":k="";break;case "%":t=0,q=null,k="%"}null!==q?"number"===a.type(k)?(0>k&&(g=""),k=g+k.toFixed(q).toString()):k=k.substr(0,q):"number"===a.type(k)&&
(0>k&&(g=""),k=g+k.toString());k=v(k,t,p,n);f.splice(d,l,k)}b[1].write(f.join(""));return 0}})(jQuery,x);(function(a,b){var h=new y;b.commands.cd=function(a,b,f,d){var c="",c=1>=b?d.HOME:"/"===f[1][0]?r(f[1]):r(f[1],d.PWD,d.HOME);b=h.a("GET","/files"+c,{},{},!1);if("directory"!==b.getResponseHeader("File-Type"))return a[2].write("cd: "+c+": Not a directory"),1;if(404===b.status)return a[2].write("cd: "+c+": No such file or directory"),1;if(403===b.status)return a[2].write("cd: "+c+": Permission denied"),1;if(200!==b.status)return a[2].write("cd: "+c+": An internal error occurred"),1;d.PWD=c;return 0};
var c;b.commands.ls=function(e,b,f,d){f=a.b(f,"latcurS");var k=f[0];f=f[1];b=f.length;if(1===b)f[b++]="";else if("string"===a.type(k))return e[2].write(k),1;b="name";"l"in k&&"t"in k?"c"in k?b="ctime":"u"in k&&(b="atime"):"t"in k?b="mtime":"S"in k&&(b="size");for(var l=1;l<f.length;l++){var g=r(f[l],d.PWD,d.HOME),p=h.a("GET","/files"+g,{},{"Sort-By":b},!1);if(null===p||200!==p.status)e[2].write("ls: cannot access "+g+": No such file or directory");else{if("directory"!==p.getResponseHeader("File-Type"))console.log(g),
p.responseJSON=[["f",p.getResponseHeader("File-Perms"),p.getResponseHeader("File-Owner"),p.getResponseHeader("File-Group"),p.getResponseHeader("Content-Length"),p.getResponseHeader("Last-Modified"),g]];else if(null===p.responseJSON||void 0===p.responseJSON)p.responseJSON=[];"r"in k&&p.responseJSON.reverse();var n="";c=p.responseJSON.length;for(g=counter=0;g<p.responseJSON.length;g++){var t=e[1],q=p.responseJSON[g],s=k;if("."!==q[6][0]||"a"in s)if(n=n+q[6]+"\t\t","l"in s){for(var n="d"===q[0]?"d":
"-",s=0,u=256;3>s;s++,u>>=1)n+=u&q[1]?"r":"-",u>>=1,n+=u&q[1]?"w":"-",u>>=1,n+=u&q[1]?"x":"-";n+=" "+v(q[2],10);n+=" "+v(q[3],6);n+=" "+v(q[4].toString(),6);n+=" "+q[5].date;n+=" "+q[6];n+="\n";t.write(n);n=""}else{if(counter++,0===counter%4||counter===c)n+="\n",t.write(n),n=""}else c--}}}return 0};b.commands.ln=function(a,b,f,d){3!==b&&a[2].write("ln: invalid number of parameters");b=r(f[1],d.PWD,d.HOME);f=r(f[2],d.PWD,d.HOME);d=h.a("PUT","/files"+f,"",{"File-Type":"link","Content-Location":b},!1);
return 404===d.status?(a[2].write("ln: failed to create symbolic link "+f+": No such file or directory"),1):403===d.status?(a[2].write("ln: failed to create symbolic link "+f+": Permission denied"),1):400<=d.status?(a[2].write("ln: failed to create symbolic link "+f+": An internal error occurred"),1):0};b.commands.touch=function(a,b,f,d){for(var c=1;c<b;c++){var l=r(f[c],d.PWD,d.HOME),g=h.a("POST","/files"+l,"",{},!1);if(404===g.status)return a[2].write("touch: cannot touch "+l+": No such file or directory"),
1;if(403===g.status)return a[2].write("touch: cannot touch "+l+": Permission denied"),1;if(400<=g.status)return a[2].write("touch: cannot touch "+l+": An internal error occurred"),1}return 0};b.commands.cat=function(a,b,f,d){1>=b&&(f.push("-"),++b);for(var c=!1,l=1;l<b;l++)if("-"===f[l])c=!0,a[0].n().progress(function(b){a[1].write(b.p())});else{var g=r(f[l],d.PWD,d.HOME);req=h.a("GET","/files"+g,"",{},!1);200===req.status?"directory"===req.getResponseHeader("File-Type")?a[2].write("cat: "+g+": Is a directory"):
"application/json"!==req.getResponseHeader("Content-Type")?a[1].write(req.responseText):a[1].write(req.responseJSON):404===req.status?a[2].write("cat: "+g+": No such file or directory"):403===req.status&&a[2].write("cat: "+g+": Permission denied")}return c?a[0].n():0};b.commands.mkdir=function(a,b,f,c){for(var k=1;k<b;k++){var l=r(f[k],c.PWD,c.HOME),g=h.a("GET","/files"+l,"",{},!1);404!==g.status&&a[2].write("mkdir: cannot create directory "+l+": File exists");g=h.a("PUT","/files"+l,"",{"File-Type":"directory"},
!1);if(404===g.status)return a[2].write("mkdir: cannot create directory "+l+": No such file or directory"),1;if(403===g.status)return a[2].write("mkdir: cannot create directory "+l+": Permission denied"),1;if(400<=g.status)return a[2].write("mkdir: cannot create directory "+l+": An internal error occurred"),1}return 0};b.commands.useradd=function(b,c,f,d){f=a.b(f,"d:g:G:mM");var k=f[0];f=f[1];c=f.length;if("string"===a.type(k))return b[2].write(k),1;if(2>c)return b[2].write("error in usage: useradd [OPTIONS] LOGIN [EMAIL]"),
1;3!==c&&f.push(f[1]+"@localhost");var l=h.a("GET","/users/"+f[1],"",{},!1);if(404!==l.status)return b[2].write("useradd: User "+f[1]+" already exists"),1;c="/home/"+f[1];"d"in k&&(c=k.d);c=r(c,d.PWD,d.HOME);if("m"in k&&!("M"in k)){l=h.a("PUT","/files"+c,"",{"File-Type":"directory"},!1);if(404===l.status)return b[2].write("useradd: cannot create directory "+path+": No such file or directory"),1;if(403===l.status)return b[2].write("useradd: cannot create directory "+path+": Permission denied"),1;if(400<=
l.status)return b[2].write("useradd: cannot create directory "+path+": An internal error occurred"),1}d=[];"g"in k&&d.push(k.g);"G"in k&&(d=a.merge(d,k.G.split(",")));l=h.a("PUT","/users/"+f[1],{password:"!",email:f[2],home_directory:c,groups:d},{},!1);if(400===l.status||404===l.status&&"Cannot find file or directory"===l.responseJSON)return b[2].write("useradd: invalid home directory"),1;if(403===l.status)return b[2].write("useradd: cannot create user: Permission denied"),1;if(500===l.status)return b[2].write("count not create user: server timed out"),
1;h.a("PATCH","/files"+c,"",{"File-Owner":f[1]},!1);return 0};b.commands.userdel=function(b,c,f){f=a.b(f,"r");var d=f[0];f=f[1];c=f.length;if(2>c)return b[2].write("error in usage: userdel [OPTIONS] LOGIN"),1;if("string"===a.type(d))return b[2].write(d),1;if("r"in d){d=h.a("GET","/users/"+f[1],"",{},!1);if(404===d.status)return b[2].write("userdel: User "+f[1]+" does not exist"),1;c=d.responseJSON.homedir;d=h.a("DELETE","/files"+c,"",{},!1);if(403===d.status)return b[2].write("userdel: Cannot delete home directory "+
c+": Permission denied"),1}d=h.a("DELETE","/users/"+f[1],"",{},!1);return 404===d.status?(b[2].write("userdel: User "+f[1]+" does not exist"),1):403===d.status?(b[2].write("userdel: cannot delete user: Permission denied"),1):0};b.commands.passwd=function(b,c,f,d,k){2>c&&(f.push(d.USER),++c);var l=a.Deferred();b[0].n().progress(function(a){a=a.p();k.m();a=h.a("PATCH","/users/"+f[1],{password:a},{},!1);400===a.status?(b[2].write("useradd: invalid home directory"),l.resolve(1)):403===a.status?(b[2].write("useradd: cannot create user: Permission denied"),
l.resolve(1)):500==a.status?(b[2].write("count not create user: server timed out"),l.resolve(1)):l.resolve(0)});b[1].write("Password: ");k.m();return l};b.commands.cp=function(a,b,c,d){3!==b&&a[2].write("cp: invalid number of parameters");b=r(c[1],d.PWD,d.HOME);c=r(c[2],d.PWD,d.HOME);d=h.a("PUT","/files"+c,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);return 404===d.status?(a[2].write("cp: cannot create regular file "+c+": No such file or directory"),1):403===d.status?(a[2].write("cp: cannot create regular file "+
c+": Permission denied"),1):400<=d.status&&"Invalid file data source"===d.responseJSON?(a[2].write("cp: cannot stat "+b+": No such file or directory"),1):0};b.commands.mv=function(a,b,c,d){if(3!==b)return a[2].write("mv: invalid number of parameters"),1;b=r(c[1],d.PWD,d.HOME);c=r(c[2],d.PWD,d.HOME);d=h.a("PUT","/files"+c,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);if(404===d.status)return a[2].write("mv: cannot create regular file "+c+": No such file or directory"),1;if(403===d.status)return a[2].write("mv: cannot create regular file "+
c+": Permission denied"),1;if(400<=d.status&&"Invalid file data source"===d.responseJSON)return a[2].write("mv: cannot stat "+b+": No such file or directory"),1;d=h.a("DELETE","/files"+b,"",{},!1);return 403===d.status?(a[2].write("mv: cannot remove "+b+": Permission denied"),1):0};b.commands.rmdir=function(a,b,c,d){for(var k=1;k<b;k++){var l=r(c[k],d.PWD,d.HOME),g=h.a("GET","/files"+l,{},{},!1);404===g.status?a[2].write("rmdir: cannot remove "+l+": No such directory"):403===g.status?a[2].write("rmdir: cannot remove "+
l+": Permission denied"):"directory"===g.getResponseHeader("File-Type")&&2===g.responseJSON.length?h.a("DELETE","/files"+l,"",{},!1):a[2].write("rmdir: cannot remove "+l+": Non-empty directory")}return 0};b.commands.rm=function(b,c,f,d){c=a.b(f,"r");var k=c[0];f=c[1];c=f.length;if("string"===a.type(k))return b[2].write(k),1;var l=!1,g;for(g in k)k.hasOwnProperty(g)&&"r"===g&&(l=!0);for(k=1;k<c;k++){g=r(f[k],d.PWD,d.HOME);var p=h.a("GET","/files"+g,{},{},!1);"directory"!==p.getResponseHeader("File-Type")||
l?(p=h.a("DELETE","/files"+g,"",{},!1),404===p.status?b[2].write("rm: cannot remove "+g+": No such file or directory"):403===p.status&&b[2].write("rm: cannot remove "+g+": Permission denied")):b[2].write("rm: cannot remove "+g+": File is a directory")}return 0};b.commands.chmod=function(a,b,c,d){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var k=2;k<b;k++){var l=r(c[k],d.PWD,d.HOME),g=h.a("PATCH","/files"+l,"",{"File-Permissions":c[1]},!1);404===g.status?a[2].write("chown: cannot access "+
l+": No such file or directory"):403===g.status&&a[2].write("chown: changing permissions of "+l+": Permission denied")}return 0};b.commands.chgrp=function(a,b,c,d){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var k=2;k<b;k++){var l=r(c[k],d.PWD,d.HOME),g=h.a("PATCH","/files"+l,"",{"File-Group":c[1]},!1);if(404===g.status)a[2].write("chown: cannot access "+l+": No such file or directory");else if(403===g.status)a[2].write("chown: changing ownership of "+l+": Permission denied");
else if(400<=g.status&&"Invalid group"===g.responseJSON)return a[2].write("chown: invalid group: "+c[1]),1}return 0};b.commands.chown=function(a,b,c,d){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var k=2;k<b;k++){var l=r(c[k],d.PWD,d.HOME),g=h.a("PATCH","/files"+l,"",{"File-Owner":c[1]},!1);if(404===g.status)a[2].write("chown: cannot access "+l+": No such file or directory");else if(403===g.status)a[2].write("chown: changing ownership of "+l+": Permission denied");else if(400<=
g.status&&"Invalid owner"===g.responseJSON)return a[2].write("chown: invalid user: "+c[1]),1}return 0};b.commands.uname=function(b,c,f){c=a.b(f,"asnr")[0];if("string"===a.type(c))return b[2].write(c),1;f=h.a("GET","/","",{},!1);if(200!==f.status)return b[2].write("uname: cannot access server"),1;var d="";if("s"in c||"a"in c)d+=f.responseJSON.kernel+" ";if("n"in c||"a"in c)d+=f.responseJSON.hostname+" ";if("r"in c||"a"in c)d+=f.responseJSON.version+" ";b[1].write(d);return 0}})(jQuery,x);
