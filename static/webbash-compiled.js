function p(b,a,h){var c=b[0];"~"===c?b=h+"/"+b:"/"!==c&&(b=a+"/"+b);b=b.substr(1).split("/");a=[];for(h=0;h<b.length;h++)"."!==b[h]&&""!==b[h]&&(".."===b[h]?a.pop():a.push(b[h]));return"/"+a.join("/")};function s(b,a){var h,c;"undefined"===typeof a&&(a=0);"undefined"===typeof h&&(h=" ");"undefined"===typeof c&&(c="left");if(a+1>=b.length)switch(c){case "left":b=Array(a+1-b.length).join(h)+b;break;case "both":c=a-b.length;var f=Math.ceil(c/2);b=Array(c-f+1).join(h)+b+Array(f+1).join(h);break;default:b=b+Array(a+1-b.length).join(h)}return b};$.b=function(b,a){for(var h={},c=[b[0]],f=1;f<b.length;f++){if("-"!==b[f][0])if("+"===a[0]){c=$.merge(c,b.slice(f));break}else{c.push(b[f]);continue}else if("--"===b[f]){c=$.merge(c,b.slice(f));break}for(var g=1;g<b[f].length;g++){var d=b[f][g],e=a.indexOf(d);if(-1===e)return"Unknown option -"+d;if(":"===a[e+1])if(g===b[f].length-1&&"-"!==b[f+1][0])h[d]=b[++f];else{if(":"!==a[e+2])return"Option -"+d+" requires an argument";h[d]=!0}else h[d]=!0}}return[h,c]};function u(b){for(var a="",h=[],c=!1,f=!1,g=!1,d=0;d<b.length;d++)" "===b[d]&&(c||f)?a+=b[d]:" "!==b[d]||c||f?"\\"===b[d]?g||c?(a+="\\",g=!1):g=!0:"'"===b[d]?g?(a+="'",g=!1):f?a+="'":c=!c:'"'===b[d]?g?(a+='"',g=!1):c?a+='"':f=!f:"$"===b[d]&&c?a+="\\$":(a+=b[d],g=!1):0<a.length&&(h.push(a),a="");a=$.trim(a);""!==a&&h.push(a);return h};window.Terminal=function(){this.j=null;this.c="root@ubuntu> ";this.b=[];this.h=0;this.promise=null;this.s=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));"Password: "!==this.c?($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>'))):($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>')));
$(window).scrollTop($(document).height())};this.v=function(){$("body > ul").empty()};this.l=function(){this.promise=null;$("body > ul").append("<li>"+this.c+"</li>");this.s()};this.w=function(b){var a=$('<div id="system_output"></div>');a.text(b);a.html(a.html().replace(/\n/g,"<br>"));$("body > ul > li:last-child").append(a);this.s()};this.u=function(){$("#cursor").toggleClass("blink")};this.r=function(){var b=$("#cursor"),a,h,c=b.prev(),f=b.next();if(0===c.length||!c.hasClass("userinput"))return!1;
var g=c.text();if(0===g.length)return!1;a=g.substr(g.length-1);h=b.text();0===f.length&&"&nbsp;"!==h&&(f=$('<div class="userinput"></div>'),b.after(f));c.text(g.substring(0,g.length-1));b.text(a);return"&nbsp;"!==h?(f.prepend(h),!0):!1};this.m=function(){var b=$("#cursor"),a,h,c,f=b.prev(),g=b.next();if(0===g.length||!g.hasClass("userinput"))return!1;c=g.text();if(0===c.length)return!1;a=c[0];h=b.text();if(0===g.length)return b.html("&nbsp;"),!1;g.text(c.substr(1));b.text(a);f.append(h);return!0};
this.p=function(b){var a=$("#cursor").parent().children(".userinput").text();this.b[this.h]=a.substr(0,a.length-1);b=this.h+b;b<this.b.length&&0<=b&&(this.h=b,b=$("#cursor"),b.next().text(""),b.html("&nbsp;"),b.prev().text(this.b[this.h]))};this.A=function(b){var a;if(37===b.which)b.preventDefault(),this.r();else if(39===b.which)b.preventDefault(),this.m();else if(38===b.which)b.preventDefault(),this.p(-1);else if(40===b.which)b.preventDefault(),this.p(1);else if(35===b.which)for(;this.m(););else if(36===
b.which)for(;this.r(););else if(b.ctrlKey&&!b.metaKey&&!b.shiftKey&&67===b.which)b.preventDefault(),$("#cursor").next().append("^C"),this.l();else if(b.ctrlKey&&!b.metaKey&&!b.shiftKey&&68===b.which)b.preventDefault(),this.promise&&this.promise.k?($("#cursor").next().append("^D"),this.promise.k.close()):(this.j.b(this),this.j.i.b(),window.open("","_self",""),window.close(),self.close());else if(46===b.which)if(a=$("#cursor"),b=a.next(),0!==b.length&&b.hasClass("userinput")){var h=b.text();0!==h.length?
(a.text(h.substr(0,1)),b.text(h.substr(1))):a.html("&nbsp;")}else a.html("&nbsp;");else if(8===b.which)b.preventDefault(),a=$("#cursor").prev(),0<a.length&&a.hasClass("userinput")&&a.text(a.text().slice(0,-1));else if(13===b.which)a=$("#cursor").parent().children(".userinput").not(".completed"),b=a.text(),b=$.trim(b.substr(0,b.length-1)),a.addClass("completed"),$("#cursor").prev().append($("#cursor").text()+"<br >"),this.promise&&this.promise.k?this.promise.k.write(b):0<b.length?(this.b[this.b.length]=
b,this.h=this.b.length,this.promise=this.j.h($.trim(b),this),this.promise.progress($.proxy(this.w,this)).always($.proxy(this.l,this))):this.l();else if(222===b.which&&b.shiftKey)b.preventDefault(),a=$("#cursor").prev(),a.append('"'),this.m();else if(222===b.which)b.preventDefault(),a=$("#cursor").prev(),a.append("'"),this.m();else if(!b.ctrlKey&&!b.metaKey){a=$("#cursor").prev();b.preventDefault();var h={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">","/":"?",";":":","'":'"',
"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},c={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,107:43,109:45,110:46,111:47,173:45,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},f=b.which;0<=[16,37,38,39,40,20,17,18,91].indexOf(f)?b=!1:("undefined"!==typeof c[f]&&(f=c[f]),c=String.fromCharCode(f),b.shiftKey?"undefined"!==typeof h[c]&&(c=h[c]):c=c.toLowerCase(),b=c);b&&a.append(b)}$(window).scrollTop($(document).height())};this.bind=function(b){null!==
this.j&&this.j.b.call(this.j,this);this.j=b;this.j.m.call(this.j,this);this.l()};$(window.document).keydown($.proxy(this.A,this));$(window).bind("beforeunload",function(){this.j.b.call(this.j,this)});window.setInterval(this.u,500);window.setInterval($.proxy(function(){this.j.b(this)},this),1E4)};function v(b){this.e={"?":"0"};this.l={};this.p=/[\w\?\-\!]+/i;this.f=b;this.c=0;this.i=new w;this.m=function(a){var b=this.i.a("GET","/users/"+this.f,{},{},!1),c=this.i.a("GET","/users/"+this.f+"/history",{},{},!1),b=b.responseJSON.homedir;this.e.USER=this.f;this.e.HOME=b;this.e.PWD=b;a.c=this.f+"@ubuntu "+b+" $ ";200===c.status&&(a.b=c.responseJSON,this.c=a.h=c.responseJSON.length)};this.b=function(a){this.c<a.b.length&&(this.i.a("PATCH","/users/"+this.f+"/history",{history:a.b.slice(this.c)}),
this.c=a.b.length)};this.h=function(a,b){var c=$.Deferred();c.k=new x;setTimeout($.proxy(function(){var f=a;"string"===typeof f&&(f=this.B(u(a)));this.q(f,b,c)},this),0);var f=c.promise();f.k=c.k;return f};this.q=function(a,b,c){a[0]in this.l&&(a=$.merge(u(this.l[a[0]]),a.slice(1)));var f="0",g=[c.k,new x,new x],d=!1;foundStderr=!1;nextCmd=null;pipeIndex=a.indexOf("|");if(-1!==pipeIndex){var d=!0,e=a.splice(pipeIndex,a.length-pipeIndex);e.shift();0<e.length&&(nextCmd=this.h(e,b),g[1].n().progress(function(a){nextCmd.k.write(a.o())}),
g[1].n().done(function(a){nextCmd.k.write(a.o());nextCmd.k.close()}),nextCmd.progress(function(a){c.notify(a)}))}for(e=a.indexOf(">");-1!==e;e=a.indexOf(">",e+1)){var d=!0,m=p(a[e+1],this.e.PWD,this.e.HOME);g[1].n().done($.proxy(function(a){var f=a.o();this.i.a("POST","/files"+m,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+m,f,{"Content-Type":"text/plain"})},this))},this));a.splice(e,2)}for(e=a.indexOf("2>");-1!==e;e=a.indexOf("2>",e+1))foundStderr=!0,m=p(a[e+1],this.e.PWD,this.e.HOME),
g[2].n().done($.proxy(function(a){var f=a.o();this.i.a("POST","/files"+m,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+m,f,{"Content-Type":"text/plain"})},this))},this)),a.splice(e,2);for(e=a.indexOf("<");-1!==e;e=a.indexOf("<",e+1))m=p(a[e+1],this.e.PWD,this.e.HOME),g[0]=new x,this.i.a("GET","/files"+m).done(function(a){g[0].write(a);g[0].close()}),a.splice(e,2);d||(g[1].write=function(a){c.notify([a])});foundStderr||(g[2].write=function(a){c.notify([a])});if("exit"===a[0])this.b(b),this.i.b(),
window.open("","_self",""),window.close(),self.close();else if("clear"===a[0])b.v();else if("alias"===a[0]){for(e=1;e<a.length;++e)d=a[e].split("=",2),2==d.length&&(this.l[d[0]]=d[1]);f="0"}else a[0]in v.commands?f=v.commands[a[0]](g,a.length,a,this.e):a[0]&&(c.notify(["error: unknown command "+a[0]]),f="127");var k=$.proxy(function(a){this.e["?"]=a.toString();b.c=this.f+"@ubuntu "+this.e.PWD+" $ ";c.resolve(a)},this);"object"===$.type(f)&&void 0!==f.then?(f.then(function(){g[0].close();g[1].close();
g[2].close()}),null===nextCmd?f.then(k):f.then(function(){nextCmd.then(k)})):(g[0].close(),g[1].close(),g[2].close(),null===nextCmd?k(f):nextCmd.then(function(){k(f)}))};this.B=function(a){for(var b=1;b<a.length;++b)for(var c=a[b].indexOf("$");0<=c;c=a[b].indexOf("$",c+1))if(0!==c&&"\\"===a[b][c-1])a[b]=a[b].substr(0,c-1)+a[b].substr(c);else{var f=this.p.exec(a[b].substr(c+1))[0];null!==f&&("undefined"===typeof this.e[f]&&(this.e[f]=""),a[b]=a[b].substr(0,c)+this.e[f]+a[b].substr(c+f.length+1))}return a}}
v.commands={};window.WebBash=v;window.WebBashLogin=function(){this.i=new w;this.f="";this.m=function(b){b.c="Username: "};this.b=function(){};this.h=function(b,a){var h=$.Deferred();setTimeout($.proxy(function(){this.q(b,a,h)},this),0);return h.promise()};this.q=function(b,a,h){""===this.f?(this.f=b,""!==b&&(a.c="Password: "),h.resolve()):this.i.c(this.f,b).done($.proxy(function(){a.bind(new v(this.f))},this)).fail($.proxy(function(b){h.notify(b.responseText);this.f="";a.c="Username: ";h.resolve()},this))}};function x(){this.h=0;this.b="";this.c=$.Deferred();this.write=function(b){this.b+=b;null!==this.c&&this.c.notify(this)};this.o=function(){var b="";this.h>=this.b.length?b="":(b=this.b.substr(this.h),this.h=this.b.length);return b};this.n=function(){return this.c.promise()};this.close=function(){this.c.resolve(this)}};function w(){this.t=this.f="";this.c=function(b,a){this.f=b;this.t=a;return this.a("GET","/login").then($.proxy(function(a){return this.a("PUT","/login",{username:this.f,password:this.t,token:a.token})},this))};this.b=function(){this.a("DELETE","/login")};this.a=function(b,a,h,c,f){var g="application/x-www-form-urlencoded";void 0!==c&&"Content-Type"in c&&(g=c["Content-Type"]);return $.ajax({async:void 0===f?!0:f,contentType:g,data:h,headers:c,type:b,url:"api.php"+a})}};(function(b,a){a.commands["false"]=function(){return 1};a.commands["true"]=function(){return 0};a.commands.echo=function(a,b,f){f.shift();a[1].write(f.join(" "));return 0};a.commands["export"]=function(a,b,f,g){for(a=1;a<b;++a){var d=f[a].split("=",2);g[d[0]]=d[1]}return 0};a.commands.unset=function(a,b,f,g){for(a=1;a<b;++a)g[f[a]]="";return 0};a.commands.pwd=function(a,b,f,g){a[1].write(g.PWD);return 0};a.commands.help=function(a){a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
a[2].write("To see a full list of commands, type 'commands' ");return 0};a.commands.commands=function(b){var c=[],f;for(f in a.commands)a.commands.hasOwnProperty(f)&&c.push(f);b[1].write(c.join("\n"));return 0};a.commands.whoami=function(a,b,f,g){a[1].write(g.USER);return 0};a.commands.sleep=function(a,c,f){if(2>c)return a[2].write("sleep: missing operand"),1;a=f[1][f[1].length-1];c=0;-1===["s","m","h","d"].indexOf(a)?(c=parseInt(f[1],10),a="s"):c=parseInt(f[1].substr(0,-1),10);switch(a){case "d":c*=
24;case "h":c*=60;case "m":c*=60;case "s":c*=1E3}var g=b.Deferred();setTimeout(function(){g.resolve(0)},c);return g.promise()};a.commands.date=function(a,b){if(1<b)return a[2].write("error: date takes no args"),1;var f=new Date,g=Array(7);g[0]="Sun";g[1]="Mon";g[2]="Tue";g[3]="Wed";g[4]="Thu";g[5]="Fri";g[6]="Sat";var d=Array(12);d[0]="Jan";d[1]="Feb";d[2]="Mar";d[3]="Apr";d[4]="May";d[5]="Jun";d[6]="Jul";d[7]="Aug";d[8]="Sep";d[9]="Oct";d[10]="Nov";d[11]="Dec";var e="UTC";4===f.getTimezoneOffset()/
60&&(e="EDT");var g=g[f.getDay()].toString()+" "+d[f.getMonth()].toString()+" "+f.getDate().toString()+" ",m=f.getHours(),d=m.toString();10>m&&(d="0"+m.toString());var k=f.getMinutes(),m=k.toString();10>k&&(m="0"+k.toString());var k=f.getSeconds(),l=k.toString();10>k&&(l="0"+k.toString());g+=d+":"+m+":"+l+" "+e+" "+f.getFullYear().toString()+" ";a[1].write(g);return 0}})(jQuery,v);(function(b,a){var h=new w;a.commands.cd=function(a,b,d,e){var c="",c=1>=b?e.HOME:"/"===d[1][0]?p(d[1]):p(d[1],e.PWD,e.HOME);b=h.a("GET","/files"+c,{},{},!1);if("directory"!==b.getResponseHeader("File-Type"))return a[2].write("cd: "+c+": Not a directory"),1;if(404===b.status)return a[2].write("cd: "+c+": No such file or directory"),1;if(403===b.status)return a[2].write("cd: "+c+": Permission denied"),1;if(200!==b.status)return a[2].write("cd: "+c+": An internal error occurred"),1;e.PWD=c;return 0};
var c;a.commands.ls=function(a,g,d,e){d=b.b(d,"la");var m=d[0];d=d[1];g=d.length;1===g&&(d[g++]="");for(g=1;g<d.length;g++){var k=p(d[g],e.PWD,e.HOME),l=h.a("GET","/files"+k,{},{},!1);if(null===l||200!==l.status)a[2].write("ls: cannot access "+k+": No such file or directory");else{if("string"===typeof l.responseJSON)l.responseJSON=[l.responseJSON];else if(null===l.responseJSON||void 0===l.responseJSON)l.responseJSON=[];var n="";c=l.responseJSON.length;for(k=counter=0;k<l.responseJSON.length;k++){var y=
a[1],q=l.responseJSON[k],t=m;if("."!==q[6]&&".."!==q[6]||"a"in t)if(n=n+q[6]+"\t\t","l"in t){for(var n="d"===q[0]?"d":"-",t=0,r=256;3>t;t++,r>>=1)n+=r&q[1]?"r":"-",r>>=1,n+=r&q[1]?"w":"-",r>>=1,n+=r&q[1]?"x":"-";n+=" "+s(q[2],10);n+=" "+s(q[3],6);n+=" "+s(q[4].toString(),6);n+=" "+q[5].date;n+=" "+q[6];n+="\n";y.write(n);n=""}else{if(counter++,0===counter%4||counter===c)n+="\n",y.write(n),n=""}else c--}}}return 0};a.commands.ln=function(a,b,d,e){3!==b&&a[2].write("ln: invalid number of parameters");
b=p(d[1],e.PWD,e.HOME);d=p(d[2],e.PWD,e.HOME);e=h.a("PUT","/files"+d,"",{"File-Type":"link","Content-Location":b},!1);return 404===e.status?(a[2].write("ln: failed to create symbolic link "+d+": No such file or directory"),1):403===e.status?(a[2].write("ln: failed to create symbolic link "+d+": Permission denied"),1):400<=e.status?(a[2].write("ln: failed to create symbolic link "+d+": An internal error occurred"),1):0};a.commands.touch=function(a,b,d,e){for(var c=1;c<b;c++){var k=p(d[c],e.PWD,e.HOME),
l=h.a("POST","/files"+k,"",{},!1);if(404===l.status)return a[2].write("touch: cannot touch "+k+": No such file or directory"),1;if(403===l.status)return a[2].write("touch: cannot touch "+k+": Permission denied"),1;if(400<=l.status)return a[2].write("touch: cannot touch "+k+": An internal error occurred"),1}return 0};a.commands.cat=function(a,b,d,e){1>=b&&(d.push("-"),++b);for(var c=!1,k=1;k<b;k++)if("-"===d[k])c=!0,a[0].n().progress(function(b){a[1].write(b.o())});else{var l=p(d[k],e.PWD,e.HOME);
req=h.a("GET","/files"+l,"",{},!1);200===req.status?"directory"===req.getResponseHeader("File-Type")?a[2].write("cat: "+l+": Is a directory"):"application/json"!==req.getResponseHeader("Content-Type")?a[1].write(req.responseText):a[1].write(req.responseJSON):404===req.status?a[2].write("cat: "+l+": No such file or directory"):403===req.status&&a[2].write("cat: "+l+": Permission denied")}return c?a[0].n():0};a.commands.mkdir=function(a,b,d,e){for(var c=1;c<b;c++){var k=p(d[c],e.PWD,e.HOME),l=h.a("GET",
"/files"+k,"",{},!1);404!==l.status&&a[2].write("mkdir: cannot create directory "+k+": File exists");l=h.a("PUT","/files"+k,"",{"File-Type":"directory"},!1);if(404===l.status)return a[2].write("mkdir: cannot create directory "+k+": No such file or directory"),1;if(403===l.status)return a[2].write("mkdir: cannot create directory "+k+": Permission denied"),1;if(400<=l.status)return a[2].write("mkdir: cannot create directory "+k+": An internal error occurred"),1}return 0};a.commands.useradd=function(a,
g,d,c){d=b.b(d,"d:g:G:mM");var m=d[0];d=d[1];g=d.length;if(2>g)return a[2].write("error in usage: useradd [OPTIONS] LOGIN [EMAIL]"),1;3!==g&&d.push(d[1]+"@localhost");var k=h.a("GET","/users/"+d[1],"",{},!1);if(404!==k.status)return a[2].write("useradd: User "+d[1]+" already exists"),1;g="/home/"+d[1];"d"in m&&(g=m.d);g=p(g,c.PWD,c.HOME);if("m"in m&&!("M"in m)){k=h.a("PUT","/files"+g,"",{"File-Type":"directory"},!1);if(404===k.status)return a[2].write("useradd: cannot create directory "+path+": No such file or directory"),
1;if(403===k.status)return a[2].write("useradd: cannot create directory "+path+": Permission denied"),1;if(400<=k.status)return a[2].write("useradd: cannot create directory "+path+": An internal error occurred"),1}c=[];"g"in m&&c.push(m.g);"G"in m&&(c=b.merge(c,m.G.split(",")));k=h.a("PUT","/users/"+d[1],{password:"!",email:d[2],home_directory:g,groups:c},{},!1);if(400===k.status||404===k.status&&"Cannot find file or directory"===k.responseJSON)return a[2].write("useradd: invalid home directory"),
1;if(403===k.status)return a[2].write("useradd: cannot create user: Permission denied"),1;if(500===k.status)return a[2].write("count not create user: server timed out"),1;h.a("PATCH","/files"+g,"",{"File-Owner":d[1]},!1);return 0};a.commands.passwd=function(a,g,d,c){2>g&&(d.push(c.USER),++g);var m=b.Deferred();a[0].n().progress(function(b){b=b.o();b=h.a("PATCH","/users/"+d[1],{password:b},{},!1);400===b.status?(a[2].write("useradd: invalid home directory"),m.resolve(1)):403===b.status?(a[2].write("useradd: cannot create user: Permission denied"),
m.resolve(1)):500==b.status?(a[2].write("count not create user: server timed out"),m.resolve(1)):m.resolve(0)});a[1].write("Password: ");return m};a.commands.cp=function(a,b,d,c){3!==b&&a[2].write("cp: invalid number of parameters");b=p(d[1],c.PWD,c.HOME);d=p(d[2],c.PWD,c.HOME);c=h.a("PUT","/files"+d,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);return 404===c.status?(a[2].write("cp: cannot create regular file "+d+": No such file or directory"),1):403===c.status?(a[2].write("cp: cannot create regular file "+
d+": Permission denied"),1):400<=c.status&&"Invalid file data source"===c.responseJSON?(a[2].write("cp: cannot stat "+b+": No such file or directory"),1):0};a.commands.mv=function(a,b,c,e){3!==b&&a[2].write("mv: invalid number of parameters");b=p(c[1],e.PWD,e.HOME);c=p(c[2],e.PWD,e.HOME);e=h.a("PUT","/files"+c,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);if(404===e.status)return a[2].write("mv: cannot create regular file "+c+": No such file or directory"),1;if(403===e.status)return a[2].write("mv: cannot create regular file "+
c+": Permission denied"),1;if(400<=e.status&&"Invalid file data source"===e.responseJSON)return a[2].write("mv: cannot stat "+b+": No such file or directory"),1;e=h.a("DELETE","/files"+b,"",{},!1);return 403===e.status?(a[2].write("mv: cannot remove "+b+": Permission denied"),1):0};a.commands.rmdir=function(a,b,c,e){for(var m=1;m<b;m++){var k=p(c[m],e.PWD,e.HOME),l=h.a("GET","/files"+k,{},{},!1);404===l.status?a[2].write("rmdir: cannot remove "+k+": No such directory"):403===l.status?a[2].write("rmdir: cannot remove "+
k+": Permission denied"):"directory"===l.getResponseHeader("File-Type")&&2===l.responseJSON.length?h.a("DELETE","/files"+k,"",{},!1):a[2].write("rmdir: cannot remove "+k+": Non-empty directory")}return 0};a.commands.rm=function(a,c,d,e){c=b.b(d,"r");var m=c[0];d=c[1];c=d.length;var k=!1,l;for(l in m)m.hasOwnProperty(l)&&"r"===l&&(k=!0);for(m=1;m<c;m++){l=p(d[m],e.PWD,e.HOME);var n=h.a("GET","/files"+l,{},{},!1);"directory"!==n.getResponseHeader("File-Type")||k?(n=h.a("DELETE","/files"+l,"",{},!1),
404===n.status?a[2].write("rm: cannot remove "+l+": No such file or directory"):403===n.status&&a[2].write("rm: cannot remove "+l+": Permission denied")):a[2].write("rm: cannot remove "+l+": File is a directory")}return 0};a.commands.chmod=function(a,b,c,e){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var m=2;m<b;m++){var k=p(c[m],e.PWD,e.HOME),l=h.a("PATCH","/files"+k,"",{"File-Permissions":c[1]},!1);404===l.status?a[2].write("chown: cannot access "+k+": No such file or directory"):
403===l.status&&a[2].write("chown: changing permissions of "+k+": Permission denied")}return 0};a.commands.chgrp=function(a,b,c,e){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var m=2;m<b;m++){var k=p(c[m],e.PWD,e.HOME),l=h.a("PATCH","/files"+k,"",{"File-Group":c[1]},!1);if(404===l.status)a[2].write("chown: cannot access "+k+": No such file or directory");else if(403===l.status)a[2].write("chown: changing ownership of "+k+": Permission denied");else if(400<=l.status&&"Invalid group"===
l.responseJSON)return a[2].write("chown: invalid group: "+c[1]),1}return 0};a.commands.chown=function(a,b,c,e){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var m=2;m<b;m++){var k=p(c[m],e.PWD,e.HOME),l=h.a("PATCH","/files"+k,"",{"File-Owner":c[1]},!1);if(404===l.status)a[2].write("chown: cannot access "+k+": No such file or directory");else if(403===l.status)a[2].write("chown: changing ownership of "+k+": Permission denied");else if(400<=l.status&&"Invalid owner"===l.responseJSON)return a[2].write("chown: invalid user: "+
c[1]),1}return 0};a.commands.uname=function(a,c,d){c=b.b(d,"asnr")[0];d=h.a("GET","/","",{},!1);if(200!==d.status)return a[2].write("uname: cannot access server"),1;var e="";if("s"in c||"a"in c)e+=d.responseJSON.kernel+" ";if("n"in c||"a"in c)e+=d.responseJSON.hostname+" ";if("r"in c||"a"in c)e+=d.responseJSON.version+" ";a[1].write(e);return 0}})(jQuery,v);
