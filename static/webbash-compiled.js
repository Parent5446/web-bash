function n(b,a,h){var e=b[0];"~"===e?b=h+"/"+b:"/"!==e&&(b=a+"/"+b);b=b.substr(1).split("/");a=[];for(h=0;h<b.length;h++)"."!==b[h]&&""!==b[h]&&(".."===b[h]?a.pop():a.push(b[h]));return"/"+a.join("/")};function r(b,a){var h,e;"undefined"===typeof a&&(a=0);"undefined"===typeof h&&(h=" ");"undefined"===typeof e&&(e="left");if(a+1>=b.length)switch(e){case "left":b=Array(a+1-b.length).join(h)+b;break;case "both":e=a-b.length;var f=Math.ceil(e/2);b=Array(e-f+1).join(h)+b+Array(f+1).join(h);break;default:b=b+Array(a+1-b.length).join(h)}return b};$.b=function(b,a){for(var h={},e=[b[0]],f=1;f<b.length;f++){if("-"!==b[f][0])if("+"===a[0]){e=$.merge(e,b.slice(f));break}else{e.push(b[f]);continue}else if("--"===b[f]){e=$.merge(e,b.slice(f));break}for(var c=1;c<b[f].length;c++){var d=b[f][c],g=a.indexOf(d);if(-1===g)return"Unknown option -"+d;if(":"===a[g+1])if(c===b[f].length-1&&"-"!==b[f+1][0])h[d]=b[++f];else{if(":"!==a[g+2])return"Option -"+d+" requires an argument";h[d]=!0}else h[d]=!0}}return[h,e]};function s(b){for(var a="",h=[],e=!1,f=!1,c=!1,d=0;d<b.length;d++)" "===b[d]&&(e||f)?a+=b[d]:" "!==b[d]||e||f?"\\"===b[d]?c||e?(a+="\\",c=!1):c=!0:"'"===b[d]?c?(a+="'",c=!1):f?a+="'":e=!e:'"'===b[d]?c?(a+='"',c=!1):e?a+='"':f=!f:"$"===b[d]&&e?a+="\\$":(a+=b[d],c=!1):0<a.length&&(h.push(a),a="");a=$.trim(a);""!==a&&h.push(a);return h};window.Terminal=function(){this.j=null;this.c="root@ubuntu> ";this.b=[];this.h=0;this.promise=null;this.s=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));"Password: "!==this.c?($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>'))):($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>')));
$(window).scrollTop($(document).height())};this.v=function(){$("body > ul").empty()};this.l=function(){this.promise=null;$("body > ul").append("<li>"+this.c+"</li>");this.s()};this.w=function(b){var a=$('<div id="system_output"></div>');a.text(b);console.log(a.html());a.html(a.html().replace(/\\n/g,"<BR/>"));console.log(a.html());$("body > ul > li:last-child").append(a);this.s()};this.u=function(){$("#cursor").toggleClass("blink")};this.r=function(){var b=$("#cursor"),a,h,e=b.prev(),f=b.next();if(0===
e.length||!e.hasClass("userinput"))return!1;var c=e.text();if(0===c.length)return!1;a=c.substr(c.length-1);h=b.text();0===f.length&&"&nbsp;"!==h&&(f=$('<div class="userinput"></div>'),b.after(f));e.text(c.substring(0,c.length-1));b.text(a);return"&nbsp;"!==h?(f.prepend(h),!0):!1};this.m=function(){var b=$("#cursor"),a,h,e,f=b.prev(),c=b.next();if(0===c.length||!c.hasClass("userinput"))return!1;e=c.text();if(0===e.length)return!1;a=e[0];h=b.text();if(0===c.length)return b.html("&nbsp;"),!1;c.text(e.substr(1));
b.text(a);f.append(h);return!0};this.p=function(b){var a=$("#cursor").parent().children(".userinput").text();this.b[this.h]=a.substr(0,a.length-1);b=this.h+b;b<this.b.length&&0<=b&&(this.h=b,b=$("#cursor"),b.next().text(""),b.html("&nbsp;"),b.prev().text(this.b[this.h]))};this.A=function(b){var a;if(37===b.which)b.preventDefault(),this.r();else if(39===b.which)b.preventDefault(),this.m();else if(38===b.which)b.preventDefault(),this.p(-1);else if(40===b.which)b.preventDefault(),this.p(1);else if(35===
b.which)for(;this.m(););else if(36===b.which)for(;this.r(););else if(b.ctrlKey&&!b.metaKey&&!b.shiftKey&&67===b.which)b.preventDefault(),$("#cursor").next().append("^C"),this.l();else if(b.ctrlKey&&!b.metaKey&&!b.shiftKey&&68===b.which)b.preventDefault(),this.promise&&this.promise.k?($("#cursor").next().append("^D"),this.promise.k.close()):(this.j.b(this),this.j.i.b(),window.open("","_self",""),window.close(),self.close());else if(46===b.which)if(a=$("#cursor"),b=a.next(),0!==b.length&&b.hasClass("userinput")){var h=
b.text();0!==h.length?(a.text(h.substr(0,1)),b.text(h.substr(1))):a.html("&nbsp;")}else a.html("&nbsp;");else if(8===b.which)b.preventDefault(),a=$("#cursor").prev(),0<a.length&&a.hasClass("userinput")&&a.text(a.text().slice(0,-1));else if(13===b.which)a=$("#cursor").parent().children(".userinput").not(".completed"),b=a.text(),b=$.trim(b.substr(0,b.length-1)),a.addClass("completed"),$("#cursor").prev().append($("#cursor").text()+"<br >"),this.promise&&this.promise.k?this.promise.k.write(b):0<b.length?
(this.b[this.b.length]=b,this.h=this.b.length,this.promise=this.j.h($.trim(b),this),this.promise.progress($.proxy(this.w,this)).always($.proxy(this.l,this))):this.l();else if(222===b.which&&b.shiftKey)b.preventDefault(),a=$("#cursor").prev(),a.append('"'),this.m();else if(222===b.which)b.preventDefault(),a=$("#cursor").prev(),a.append("'"),this.m();else if(!b.ctrlKey&&!b.metaKey){a=$("#cursor").prev();b.preventDefault();var h={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">",
"/":"?",";":":","'":'"',"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},e={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,107:43,109:45,110:46,111:47,173:45,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},f=b.which;0<=[16,37,38,39,40,20,17,18,91].indexOf(f)?b=!1:("undefined"!==typeof e[f]&&(f=e[f]),e=String.fromCharCode(f),b.shiftKey?"undefined"!==typeof h[e]&&(e=h[e]):e=e.toLowerCase(),b=e);b&&a.append(b)}$(window).scrollTop($(document).height())};
this.bind=function(b){null!==this.j&&this.j.b.call(this.j,this);this.j=b;this.j.m.call(this.j,this);this.l()};$(window.document).keydown($.proxy(this.A,this));$(window).bind("beforeunload",function(){this.j.b.call(this.j,this)});window.setInterval(this.u,500);window.setInterval($.proxy(function(){this.j.b(this)},this),1E4)};function u(b){this.e={"?":"0"};this.l={};this.p=/[\w\?\-\!]+/i;this.f=b;this.c=0;this.i=new v;this.m=function(a){var b=this.i.a("GET","/users/"+this.f,{},{},!1),e=this.i.a("GET","/users/"+this.f+"/history",{},{},!1),b=b.responseJSON.homedir;this.e.USER=this.f;this.e.HOME=b;this.e.PWD=b;a.c=this.f+"@ubuntu "+b+" $ ";200===e.status&&(a.b=e.responseJSON,this.c=a.h=e.responseJSON.length)};this.b=function(a){this.c<a.b.length&&(this.i.a("PATCH","/users/"+this.f+"/history",{history:a.b.slice(this.c)}),
this.c=a.b.length)};this.h=function(a,b){var e=$.Deferred();e.k=new w;setTimeout($.proxy(function(){var f=a;"string"===typeof f&&(f=this.B(s(a)));this.q(f,b,e)},this),0);var f=e.promise();f.k=e.k;return f};this.q=function(a,b,e){a[0]in this.l&&(a=$.merge(s(this.l[a[0]]),a.slice(1)));var f="0",c=[e.k,new w,new w],d=!1;foundStderr=!1;nextCmd=null;pipeIndex=a.indexOf("|");if(-1!==pipeIndex){var d=!0,g=a.splice(pipeIndex,a.length-pipeIndex);g.shift();0<g.length&&(nextCmd=this.h(g,b),c[1].n().progress(function(e){nextCmd.k.write(e.o())}),
c[1].n().done(function(e){nextCmd.k.write(e.o());nextCmd.k.close()}),nextCmd.progress(function(a){e.notify(a)}))}for(g=a.indexOf(">");-1!==g;g=a.indexOf(">",g+1)){var d=!0,k=n(a[g+1],this.e.PWD,this.e.HOME);c[1].n().done($.proxy(function(e){var a=e.o();this.i.a("POST","/files"+k,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+k,a,{"Content-Type":"text/plain"})},this))},this));a.splice(g,2)}for(g=a.indexOf("2>");-1!==g;g=a.indexOf("2>",g+1))foundStderr=!0,k=n(a[g+1],this.e.PWD,this.e.HOME),
c[2].n().done($.proxy(function(e){var a=e.o();this.i.a("POST","/files"+k,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+k,a,{"Content-Type":"text/plain"})},this))},this)),a.splice(g,2);for(g=a.indexOf("<");-1!==g;g=a.indexOf("<",g+1))k=n(a[g+1],this.e.PWD,this.e.HOME),c[0]=new w,this.i.a("GET","/files"+k).done(function(e){c[0].write(e);c[0].close()}),a.splice(g,2);d||(c[1].write=function(a){e.notify([a])});foundStderr||(c[2].write=function(a){e.notify([a])});if("exit"===a[0])this.b(b),this.i.b(),
window.open("","_self",""),window.close(),self.close();else if("clear"===a[0])b.v();else if("alias"===a[0]){for(g=1;g<a.length;++g)d=a[g].split("=",2),2==d.length&&(this.l[d[0]]=d[1]);f="0"}else a[0]in u.commands?f=u.commands[a[0]](c,a.length,a,this.e):a[0]&&(e.notify(["error: unknown command "+a[0]]),f="127");var l=$.proxy(function(a){this.e["?"]=a.toString();b.c=this.f+"@ubuntu "+this.e.PWD+" $ ";e.resolve(a)},this);"object"===$.type(f)&&void 0!==f.then?(f.then(function(){c[0].close();c[1].close();
c[2].close()}),null===nextCmd?f.then(l):f.then(function(){nextCmd.then(l)})):(c[0].close(),c[1].close(),c[2].close(),null===nextCmd?l(f):nextCmd.then(function(){l(f)}))};this.B=function(a){for(var b=1;b<a.length;++b)for(var e=a[b].indexOf("$");0<=e;e=a[b].indexOf("$",e+1))if(0!==e&&"\\"===a[b][e-1])a[b]=a[b].substr(0,e-1)+a[b].substr(e);else{var f=this.p.exec(a[b].substr(e+1))[0];null!==f&&("undefined"===typeof this.e[f]&&(this.e[f]=""),a[b]=a[b].substr(0,e)+this.e[f]+a[b].substr(e+f.length+1))}return a}}
u.commands={};window.WebBash=u;window.WebBashLogin=function(){this.i=new v;this.f="";this.m=function(b){b.c="Username: "};this.b=function(){};this.h=function(b,a){var h=$.Deferred();setTimeout($.proxy(function(){this.q(b,a,h)},this),0);return h.promise()};this.q=function(b,a,h){""===this.f?(this.f=b,""!==b&&(a.c="Password: "),h.resolve()):this.i.c(this.f,b).done($.proxy(function(){a.bind(new u(this.f))},this)).fail($.proxy(function(e){h.notify(e.responseText);this.f="";a.c="Username: ";h.resolve()},this))}};function w(){this.h=0;this.b="";this.c=$.Deferred();this.write=function(b){this.b+=b;null!==this.c&&this.c.notify(this)};this.o=function(){var b="";this.h>=this.b.length?b="":(b=this.b.substr(this.h),this.h=this.b.length);return b};this.n=function(){return this.c.promise()};this.close=function(){this.c.resolve(this)}};function v(){this.t=this.f="";this.c=function(b,a){this.f=b;this.t=a;return this.a("GET","/login").then($.proxy(function(a){return this.a("PUT","/login",{username:this.f,password:this.t,token:a.token})},this))};this.b=function(){this.a("DELETE","/login")};this.a=function(b,a,h,e,f){var c="application/x-www-form-urlencoded";void 0!==e&&"Content-Type"in e&&(c=e["Content-Type"]);return $.ajax({async:void 0===f?!0:f,contentType:c,data:h,headers:e,type:b,url:"api.php"+a})}};(function(b,a){a.commands["false"]=function(){return 1};a.commands["true"]=function(){return 0};a.commands.echo=function(a,e,b){b.shift();a[1].write(b.join(" "));return 0};a.commands["export"]=function(a,e,b,c){for(a=1;a<e;++a){var d=b[a].split("=",2);c[d[0]]=d[1]}return 0};a.commands.unset=function(a,e,b,c){for(a=1;a<e;++a)c[b[a]]="";return 0};a.commands.pwd=function(a,e,b,c){a[1].write(c.PWD);return 0};a.commands.help=function(a){a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
a[2].write("To see a full list of commands, type 'commands' ");return 0};a.commands.commands=function(b){var e=[],f;for(f in a.commands)a.commands.hasOwnProperty(f)&&e.push(f);b[1].write(e.join("\n"));return 0};a.commands.whoami=function(a,e,b,c){a[1].write(c.USER);return 0};a.commands.sleep=function(a,e,f){if(2>e)return a[2].write("sleep: missing operand"),1;a=f[1][f[1].length-1];e=0;-1===["s","m","h","d"].indexOf(a)?(e=parseInt(f[1],10),a="s"):e=parseInt(f[1].substr(0,-1),10);switch(a){case "d":e*=
24;case "h":e*=60;case "m":e*=60;case "s":e*=1E3}var c=b.Deferred();setTimeout(function(){c.resolve(0)},e);return c.promise()};a.commands.date=function(a,e){if(1<e)return a[2].write("error: date takes no args"),1;var b=new Date,c=Array(7);c[0]="Sun";c[1]="Mon";c[2]="Tue";c[3]="Wed";c[4]="Thu";c[5]="Fri";c[6]="Sat";var d=Array(12);d[0]="Jan";d[1]="Feb";d[2]="Mar";d[3]="Apr";d[4]="May";d[5]="Jun";d[6]="Jul";d[7]="Aug";d[8]="Sep";d[9]="Oct";d[10]="Nov";d[11]="Dec";var g="UTC";4===b.getTimezoneOffset()/
60&&(g="EDT");var c=c[b.getDay()].toString()+" "+d[b.getMonth()].toString()+" "+b.getDate().toString()+" ",k=b.getHours(),d=k.toString();10>k&&(d="0"+k.toString());var l=b.getMinutes(),k=l.toString();10>l&&(k="0"+l.toString());var l=b.getSeconds(),m=l.toString();10>l&&(m="0"+l.toString());c+=d+":"+k+":"+m+" "+g+" "+b.getFullYear().toString()+" ";a[1].write(c);return 0}})(jQuery,u);(function(b,a){var h=new v;a.commands.cd=function(a,b,c,d){var g="",g=1>=b?d.HOME:"/"===c[1][0]?n(c[1]):n(c[1],d.PWD,d.HOME);b=h.a("GET","/files"+g,{},{},!1);if("directory"!==b.getResponseHeader("File-Type"))return a[2].write("cd: "+g+": Not a directory"),1;if(404===b.status)return a[2].write("cd: "+g+": No such file or directory"),1;if(403===b.status)return a[2].write("cd: "+g+": Permission denied"),1;if(200!==b.status)return a[2].write("cd: "+g+": An internal error occurred"),1;d.PWD=g;return 0};
a.commands.ls=function(a,f,c,d){c=b.b(c,"la");var g=c[0];c=c[1];f=c.length;1===f&&(c[f++]="");for(f=1;f<c.length;f++){var k=n(c[f],d.PWD,d.HOME),l=h.a("GET","/files"+k,{},{},!1);if(null===l||200!==l.status)a[2].write("ls: cannot access "+k+": No such file or directory");else{if("string"===typeof l.responseJSON)l.responseJSON=[l.responseJSON];else if(null===l.responseJSON||void 0===l.responseJSON)l.responseJSON=[];for(var m="",k=0,x=l.responseJSON.length-1;k<l.responseJSON.length;k++,x--){var y=a[1],
p=l.responseJSON[k],t=x;if("."!==p[6]&&".."!==p[6]||"a"in g)if(m=m+p[6]+"\t\t","l"in g){for(var m="d"===p[0]?"d":"-",t=0,q=256;3>t;t++,q>>=1)m+=q&p[1]?"r":"-",q>>=1,m+=q&p[1]?"w":"-",q>>=1,m+=q&p[1]?"x":"-";m+=" "+r(p[2],10);m+=" "+r(p[3],6);m+=" "+r(p[4].toString(),6);m+=" "+p[5].date;m+=" "+p[6];m+="\n";y.write(m);m=""}else m+="\n   ",0===t%4&&(y.write(m),m="")}}}return 0};a.commands.ln=function(a,b,c,d){3!==b&&a[2].write("ln: invalid number of parameters");b=n(c[1],d.PWD,d.HOME);c=n(c[2],d.PWD,
d.HOME);d=h.a("PUT","/files"+c,"",{"File-Type":"link","Content-Location":b},!1);return 404===d.status?(a[2].write("ln: failed to create symbolic link "+c+": No such file or directory"),1):403===d.status?(a[2].write("ln: failed to create symbolic link "+c+": Permission denied"),1):400<=d.status?(a[2].write("ln: failed to create symbolic link "+c+": An internal error occurred"),1):0};a.commands.touch=function(a,b,c,d){for(var g=1;g<b;g++){var k=n(c[g],d.PWD,d.HOME),l=h.a("POST","/files"+k,"",{},!1);
if(404===l.status)return a[2].write("touch: cannot touch "+k+": No such file or directory"),1;if(403===l.status)return a[2].write("touch: cannot touch "+k+": Permission denied"),1;if(400<=l.status)return a[2].write("touch: cannot touch "+k+": An internal error occurred"),1}return 0};a.commands.cat=function(a,b,c,d){1>=b&&(c.push("-"),++b);for(var g=!1,k=1;k<b;k++)if("-"===c[k])g=!0,a[0].n().progress(function(b){a[1].write(b.o())});else{var l=n(c[k],d.PWD,d.HOME);req=h.a("GET","/files"+l,"",{},!1);
200===req.status?"directory"===req.getResponseHeader("File-Type")?a[2].write("cat: "+l+": Is a directory"):"application/json"!==req.getResponseHeader("Content-Type")?a[1].write(req.responseText):a[1].write(req.responseJSON):404===req.status?a[2].write("cat: "+l+": No such file or directory"):403===req.status&&a[2].write("cat: "+l+": Permission denied")}return g?a[0].n():0};a.commands.mkdir=function(a,b,c,d){for(var g=1;g<b;g++){var k=n(c[g],d.PWD,d.HOME),l=h.a("GET","/files"+k,"",{},!1);404!==l.status&&
a[2].write("mkdir: cannot create directory "+k+": File exists");l=h.a("PUT","/files"+k,"",{"File-Type":"directory"},!1);if(404===l.status)return a[2].write("mkdir: cannot create directory "+k+": No such file or directory"),1;if(403===l.status)return a[2].write("mkdir: cannot create directory "+k+": Permission denied"),1;if(400<=l.status)return a[2].write("mkdir: cannot create directory "+k+": An internal error occurred"),1}return 0};a.commands.useradd=function(a,f,c,d){c=b.b(c,"d:g:G:mM");var g=c[0];
c=c[1];f=c.length;if(2>f)return a[2].write("error in usage: useradd [OPTIONS] LOGIN [EMAIL]"),1;3!==f&&c.push(c[1]+"@localhost");var k=h.a("GET","/users/"+c[1],"",{},!1);if(404!==k.status)return a[2].write("useradd: User "+c[1]+" already exists"),1;f="/home/"+c[1];"d"in g&&(f=g.d);f=n(f,d.PWD,d.HOME);if("m"in g&&!("M"in g)){k=h.a("PUT","/files"+f,"",{"File-Type":"directory"},!1);if(404===k.status)return a[2].write("useradd: cannot create directory "+path+": No such file or directory"),1;if(403===
k.status)return a[2].write("useradd: cannot create directory "+path+": Permission denied"),1;if(400<=k.status)return a[2].write("useradd: cannot create directory "+path+": An internal error occurred"),1}d=[];"g"in g&&d.push(g.g);"G"in g&&(d=b.merge(d,g.G.split(",")));k=h.a("PUT","/users/"+c[1],{password:"!",email:c[2],home_directory:f,groups:d},{},!1);if(400===k.status||404===k.status&&"Cannot find file or directory"===k.responseJSON)return a[2].write("useradd: invalid home directory"),1;if(403===
k.status)return a[2].write("useradd: cannot create user: Permission denied"),1;if(500===k.status)return a[2].write("count not create user: server timed out"),1;h.a("PATCH","/files"+f,"",{"File-Owner":c[1]},!1);return 0};a.commands.passwd=function(a,f,c,d){2>f&&(c.push(d.USER),++f);var g=b.Deferred();a[0].n().progress(function(b){b=b.o();b=h.a("PATCH","/users/"+c[1],{password:b},{},!1);400===b.status?(a[2].write("useradd: invalid home directory"),g.resolve(1)):403===b.status?(a[2].write("useradd: cannot create user: Permission denied"),
g.resolve(1)):500==b.status?(a[2].write("count not create user: server timed out"),g.resolve(1)):g.resolve(0)});a[1].write("Password: ");return g};a.commands.cp=function(a,b,c,d){3!==b&&a[2].write("cp: invalid number of parameters");b=n(c[1],d.PWD,d.HOME);c=n(c[2],d.PWD,d.HOME);d=h.a("PUT","/files"+c,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);return 404===d.status?(a[2].write("cp: cannot create regular file "+c+": No such file or directory"),1):403===d.status?(a[2].write("cp: cannot create regular file "+
c+": Permission denied"),1):400<=d.status&&"Invalid file data source"===d.responseJSON?(a[2].write("cp: cannot stat "+b+": No such file or directory"),1):0};a.commands.mv=function(a,b,c,d){3!==b&&a[2].write("mv: invalid number of parameters");b=n(c[1],d.PWD,d.HOME);c=n(c[2],d.PWD,d.HOME);d=h.a("PUT","/files"+c,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);if(404===d.status)return a[2].write("mv: cannot create regular file "+c+": No such file or directory"),1;if(403===d.status)return a[2].write("mv: cannot create regular file "+
c+": Permission denied"),1;if(400<=d.status&&"Invalid file data source"===d.responseJSON)return a[2].write("mv: cannot stat "+b+": No such file or directory"),1;d=h.a("DELETE","/files"+b,"",{},!1);return 403===d.status?(a[2].write("mv: cannot remove "+b+": Permission denied"),1):0};a.commands.rmdir=function(a,b,c,d){for(var g=1;g<b;g++){var k=n(c[g],d.PWD,d.HOME),l=h.a("GET","/files"+k,{},{},!1);404===l.status?a[2].write("rmdir: cannot remove "+k+": No such directory"):403===l.status?a[2].write("rmdir: cannot remove "+
k+": Permission denied"):"directory"===l.getResponseHeader("File-Type")&&2===l.responseJSON.length?h.a("DELETE","/files"+k,"",{},!1):a[2].write("rmdir: cannot remove "+k+": Non-empty directory")}return 0};a.commands.rm=function(a,f,c,d){f=b.b(c,"r");var g=f[0];c=f[1];f=c.length;var k=!1,l;for(l in g)g.hasOwnProperty(l)&&"r"===l&&(k=!0);for(g=1;g<f;g++){l=n(c[g],d.PWD,d.HOME);var m=h.a("GET","/files"+l,{},{},!1);"directory"!==m.getResponseHeader("File-Type")||k?(m=h.a("DELETE","/files"+l,"",{},!1),
404===m.status?a[2].write("rm: cannot remove "+l+": No such file or directory"):403===m.status&&a[2].write("rm: cannot remove "+l+": Permission denied")):a[2].write("rm: cannot remove "+l+": File is a directory")}return 0};a.commands.chmod=function(a,b,c,d){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var g=2;g<b;g++){var k=n(c[g],d.PWD,d.HOME),l=h.a("PATCH","/files"+k,"",{"File-Permissions":c[1]},!1);404===l.status?a[2].write("chown: cannot access "+k+": No such file or directory"):
403===l.status&&a[2].write("chown: changing permissions of "+k+": Permission denied")}return 0};a.commands.chgrp=function(a,b,c,d){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var g=2;g<b;g++){var k=n(c[g],d.PWD,d.HOME),l=h.a("PATCH","/files"+k,"",{"File-Group":c[1]},!1);if(404===l.status)a[2].write("chown: cannot access "+k+": No such file or directory");else if(403===l.status)a[2].write("chown: changing ownership of "+k+": Permission denied");else if(400<=l.status&&"Invalid group"===
l.responseJSON)return a[2].write("chown: invalid group: "+c[1]),1}return 0};a.commands.chown=function(a,b,c,d){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var g=2;g<b;g++){var k=n(c[g],d.PWD,d.HOME),l=h.a("PATCH","/files"+k,"",{"File-Owner":c[1]},!1);if(404===l.status)a[2].write("chown: cannot access "+k+": No such file or directory");else if(403===l.status)a[2].write("chown: changing ownership of "+k+": Permission denied");else if(400<=l.status&&"Invalid owner"===l.responseJSON)return a[2].write("chown: invalid user: "+
c[1]),1}return 0};a.commands.uname=function(a,f,c){f=b.b(c,"asnr")[0];c=h.a("GET","/","",{},!1);if(200!==c.status)return a[2].write("uname: cannot access server"),1;var d="";if("s"in f||"a"in f)d+=c.responseJSON.kernel+" ";if("n"in f||"a"in f)d+=c.responseJSON.hostname+" ";if("r"in f||"a"in f)d+=c.responseJSON.version+" ";a[1].write(d);return 0}})(jQuery,u);
