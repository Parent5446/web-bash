function p(a,b,h){var c=a[0];"~"===c?a=h+"/"+a:"/"!==c&&(a=b+"/"+a);a=a.substr(1).split("/");b=[];for(h=0;h<a.length;h++)"."!==a[h]&&""!==a[h]&&(".."===a[h]?b.pop():b.push(a[h]));return"/"+b.join("/")};function t(a,b){var h,c;"undefined"===typeof b&&(b=0);"undefined"===typeof h&&(h=" ");"undefined"===typeof c&&(c="left");if(b+1>=a.length)switch(c){case "left":a=Array(b+1-a.length).join(h)+a;break;case "both":c=b-a.length;var g=Math.ceil(c/2);a=Array(c-g+1).join(h)+a+Array(g+1).join(h);break;default:a=a+Array(b+1-a.length).join(h)}return a};$.b=function(a,b){for(var h={},c=[a[0]],g=1;g<a.length;g++){if("-"!==a[g][0])if("+"===b[0]){c=$.merge(c,a.slice(g));break}else{c.push(a[g]);continue}else if("--"===a[g]){c=$.merge(c,a.slice(g));break}for(var e=1;e<a[g].length;e++){var d=a[g][e],f=b.indexOf(d);if(-1===f)return["Unknown option -"+d,a];if(":"===b[f+1])if(e===a[g].length-1&&"-"!==a[g+1][0])h[d]=a[++g];else{if(":"!==b[f+2])return"Option -"+d+" requires an argument";h[d]=!0}else h[d]=!0}}return[h,c]};function v(a){for(var b="",h=[],c=!1,g=!1,e=!1,d=0;d<a.length;d++)" "===a[d]&&(c||g)?b+=a[d]:" "!==a[d]||c||g?"\\"===a[d]?e||c?(b+="\\",e=!1):e=!0:"'"===a[d]?e?(b+="'",e=!1):g?b+="'":c=!c:'"'===a[d]?e?(b+='"',e=!1):c?b+='"':g=!g:"$"===a[d]&&c?b+="\\$":(b+=a[d],e=!1):0<b.length&&(h.push(b),b="");b=$.trim(b);""!==b&&h.push(b);return h};window.Terminal=function(){this.j=null;this.c="root@ubuntu> ";this.b=[];this.h=0;this.promise=null;this.l=!1;this.B=/\n/g;this.m=function(){(this.l=!this.l)?($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>'))):($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>')))};this.u=function(){$("#cursor").remove();$("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));
this.l?($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')),$("#cursor").after($('<div id="hiddentext" class="userinput"></div>'))):($("#cursor").before($('<div class="userinput"></div>')),$("#cursor").after($('<div class="userinput></div>')));$(window).scrollTop($(document).height())};this.A=function(){$("body > ul").empty()};this.o=function(){this.promise=null;this.l=!1;$("body > ul").append("<li>"+this.c+"</li>");this.u()};this.C=function(a){var b=$('<div class="system_output"></div>');
b.text(a);b.html(b.html().replace(this.B,"<br>"));$("body > ul > li:last-child").append(b);this.u()};this.w=function(){$("#cursor").toggleClass("blink")};this.t=function(){var a=$("#cursor"),b,h,c=a.prev(),g=a.next();if(0===c.length||!c.hasClass("userinput"))return!1;var e=c.text();if(0===e.length)return!1;b=e.substr(e.length-1);h=a.text();0===g.length&&"&nbsp;"!==h&&(g=$('<div class="userinput"></div>'),a.after(g));c.text(e.substring(0,e.length-1));a.text(b);return"&nbsp;"!==h?(g.prepend(h),!0):
!1};this.q=function(){var a=$("#cursor"),b,h,c,g=a.prev(),e=a.next();if(0===e.length||!e.hasClass("userinput"))return!1;c=e.text();if(0===c.length)return!1;b=c[0];h=a.text();if(0===e.length)return a.html("&nbsp;"),!1;e.text(c.substr(1));a.text(b);g.append(h);return!0};this.s=function(a){var b=$("#cursor").parent().children(".userinput").text();this.b[this.h]=b.substr(0,b.length-1);a=this.h+a;a<this.b.length&&0<=a&&(this.h=a,a=$("#cursor"),a.next().text(""),a.html("&nbsp;"),a.prev().text(this.b[this.h]))};
this.D=function(a){var b;if(37===a.which)a.preventDefault(),this.t();else if(39===a.which)a.preventDefault(),this.q();else if(38===a.which)a.preventDefault(),this.s(-1);else if(40===a.which)a.preventDefault(),this.s(1);else if(35===a.which)for(;this.q(););else if(36===a.which)for(;this.t(););else if(a.ctrlKey&&!a.metaKey&&!a.shiftKey&&67===a.which)a.preventDefault(),$("#cursor").next().append("^C"),this.o();else if(a.ctrlKey&&!a.metaKey&&!a.shiftKey&&68===a.which)a.preventDefault(),this.promise&&
this.promise.k?($("#cursor").next().append("^D"),this.promise.k.close()):(this.j.b(this),this.j.i.b(),window.open("","_self",""),window.close(),self.close());else if(46===a.which)if(b=$("#cursor"),a=b.next(),0!==a.length&&a.hasClass("userinput")){var h=a.text();0!==h.length?(b.text(h.substr(0,1)),a.text(h.substr(1))):b.html("&nbsp;")}else b.html("&nbsp;");else if(8===a.which)a.preventDefault(),b=$("#cursor").prev(),0<b.length&&b.hasClass("userinput")&&b.text(b.text().slice(0,-1));else if(13===a.which)b=
$("#cursor").parent().children(".userinput").not(".completed"),a=b.text(),a=$.trim(a.substr(0,a.length-1)),b.addClass("completed"),0!=$("#cursor").next().length?($("#cursor").prev().append($("#cursor").text()),$("#cursor").next().append("<br>")):$("#cursor").prev().append($("#cursor").text()+"<br>"),this.promise&&this.promise.k?this.promise.k.write(a):0<a.length?(this.b[this.b.length]=a,this.h=this.b.length,this.promise=this.j.h($.trim(a),this),this.promise.progress($.proxy(this.C,this)).always($.proxy(this.o,
this))):this.o();else if(222===a.which&&a.shiftKey)a.preventDefault(),b=$("#cursor").prev(),b.append('"'),this.q();else if(222===a.which)a.preventDefault(),b=$("#cursor").prev(),b.append("'"),this.q();else if(!a.ctrlKey&&!a.metaKey){b=$("#cursor").prev();a.preventDefault();var h={1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",",":"<",".":">","/":"?",";":":","'":'"',"[":"{","]":"}","\\":"|","`":"~","-":"_","=":"+"},c={96:48,97:49,98:50,99:51,100:52,101:53,102:54,103:55,104:56,105:57,106:42,
107:43,109:45,110:46,111:47,173:45,186:59,187:61,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},g=a.which;0<=[16,37,38,39,40,20,17,18,91].indexOf(g)?a=!1:("undefined"!==typeof c[g]&&(g=c[g]),c=String.fromCharCode(g),a.shiftKey?"undefined"!==typeof h[c]&&(c=h[c]):c=c.toLowerCase(),a=c);a&&b.append(a)}$(window).scrollTop($(document).height())};this.bind=function(a){null!==this.j&&this.j.b.call(this.j,this);this.j=a;this.j.m.call(this.j,this);this.o()};$(window.document).keydown($.proxy(this.D,
this));$(window).bind("beforeunload",function(){this.j.b.call(this.j,this)});window.setInterval(this.w,500);window.setInterval($.proxy(function(){this.j.b(this)},this),1E4)};function w(a){this.e={"?":"0"};this.l={};this.o=/[\w\?\-\!]+/i;this.f=a;this.c=0;this.i=new x;this.m=function(b){var a=this.i.a("GET","/users/"+this.f,{},{},!1),c=this.i.a("GET","/users/"+this.f+"/history",{},{},!1);(a=a.responseJSON.homedir)||(a="/");this.e.USER=this.f;this.e.HOME=a;this.e.PWD=a;b.c=this.f+"@ubuntu "+a+" $ ";200===c.status&&(b.b=c.responseJSON,this.c=b.h=c.responseJSON.length)};this.b=function(b){this.c<b.b.length&&(this.i.a("PATCH","/users/"+this.f+"/history",{history:b.b.slice(this.c)}),
this.c=b.b.length)};this.h=function(b,a){var c=$.Deferred();c.k=new y;setTimeout($.proxy(function(){var g=b;"string"===typeof g&&(g=this.F(v(b)));this.r(g,a,c)},this),0);var g=c.promise();g.k=c.k;return g};this.r=function(b,a,c){b[0]in this.l&&(b=$.merge(v(this.l[b[0]]),b.slice(1)));var g="0",e=[c.k,new y,new y],d=!1;foundStderr=!1;nextCmd=null;pipeIndex=b.indexOf("|");if(-1!==pipeIndex){var d=!0,f=b.splice(pipeIndex,b.length-pipeIndex);f.shift();0<f.length&&(nextCmd=this.h(f,a),e[1].n().progress(function(a){nextCmd.k.write(a.p())}),
e[1].n().done(function(a){nextCmd.k.write(a.p());nextCmd.k.close()}),nextCmd.progress(function(a){c.notify(a)}))}for(f=b.indexOf(">");-1!==f;f=b.indexOf(">",f+1)){var d=!0,l=p(b[f+1],this.e.PWD,this.e.HOME);e[1].n().done($.proxy(function(a){var b=a.p();this.i.a("POST","/files"+l,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+l,b,{"Content-Type":"text/plain"})},this))},this));b.splice(f,2)}for(f=b.indexOf("2>");-1!==f;f=b.indexOf("2>",f+1))foundStderr=!0,l=p(b[f+1],this.e.PWD,this.e.HOME),
e[2].n().done($.proxy(function(a){var b=a.p();this.i.a("POST","/files"+l,"",{}).done($.proxy(function(){this.i.a("PATCH","/files"+l,b,{"Content-Type":"text/plain"})},this))},this)),b.splice(f,2);for(f=b.indexOf("<");-1!==f;f=b.indexOf("<",f+1))l=p(b[f+1],this.e.PWD,this.e.HOME),e[0]=new y,this.i.a("GET","/files"+l).done(function(a){e[0].write(a);e[0].close()}),b.splice(f,2);d||(e[1].write=function(a){c.notify([a])});foundStderr||(e[2].write=function(a){c.notify([a])});if("exit"===b[0])this.b(a),this.i.b(),
window.open("","_self",""),window.close(),self.close();else if("clear"===b[0])a.A();else if("alias"===b[0]){for(f=1;f<b.length;++f)d=b[f].split("=",2),2==d.length&&(this.l[d[0]]=d[1]);g="0"}else b[0]in w.commands?g=w.commands[b[0]](e,b.length,b,this.e,a):b[0]&&(c.notify(["error: unknown command "+b[0]]),g="127");var k=$.proxy(function(b){this.e["?"]=b.toString();a.c=this.f+"@ubuntu "+this.e.PWD+" $ ";c.resolve(b)},this);"object"===$.type(g)&&void 0!==g.then?(g.then(function(){e[0].close();e[1].close();
e[2].close()}),null===nextCmd?g.then(k):g.then(function(){nextCmd.then(k)})):(e[0].close(),e[1].close(),e[2].close(),null===nextCmd?k(g):nextCmd.then(function(){k(g)}))};this.F=function(a){for(var h=1;h<a.length;++h)for(var c=a[h].indexOf("$");0<=c;c=a[h].indexOf("$",c+1))if(0!==c&&"\\"===a[h][c-1])a[h]=a[h].substr(0,c-1)+a[h].substr(c);else{var g=this.o.exec(a[h].substr(c+1))[0];null!==g&&("undefined"===typeof this.e[g]&&(this.e[g]=""),a[h]=a[h].substr(0,c)+this.e[g]+a[h].substr(c+g.length+1))}return a}}
w.commands={};window.WebBash=w;window.WebBashLogin=function(){this.i=new x;this.f="";this.m=function(a){a.c="Username: "};this.b=function(){};this.h=function(a,b){var h=$.Deferred();setTimeout($.proxy(function(){this.r(a,b,h)},this),0);return h.promise()};this.r=function(a,b,h){""===this.f?(this.f=a,""!==a&&(b.c="Password: "),h.resolve(),""!==a&&b.m()):this.i.c(this.f,a).done($.proxy(function(){b.m();b.bind(new w(this.f))},this)).fail($.proxy(function(a){h.notify("\n"+a.responseText);this.f="";b.c="Username: ";b.m();h.resolve()},
this))}};function y(){this.h=0;this.b="";this.c=$.Deferred();this.write=function(a){this.b+=a;null!==this.c&&this.c.notify(this)};this.p=function(){var a="";this.h>=this.b.length?a="":(a=this.b.substr(this.h),this.h=this.b.length);return a};this.n=function(){return this.c.promise()};this.close=function(){this.c.resolve(this)}};function x(){this.v=this.f="";this.c=function(a,b){this.f=a;this.v=b;return this.a("GET","/login").then($.proxy(function(a){return this.a("PUT","/login",{username:this.f,password:this.v,token:a.token})},this))};this.b=function(){this.a("DELETE","/login")};this.a=function(a,b,h,c,g){var e="application/x-www-form-urlencoded";void 0!==c&&"Content-Type"in c&&(e=c["Content-Type"]);return $.ajax({async:void 0===g?!0:g,contentType:e,data:h,headers:c,type:a,url:"api.php"+b})}};(function(a,b){b.commands["false"]=function(){return 1};b.commands["true"]=function(){return 0};b.commands.echo=function(a,b,g){g.shift();a[1].write(g.join(" "));return 0};b.commands["export"]=function(a,b,g,e){for(a=1;a<b;++a){var d=g[a].split("=",2);e[d[0]]=d[1]}return 0};b.commands.unset=function(a,b,g,e){for(a=1;a<b;++a)e[g[a]]="";return 0};b.commands.pwd=function(a,b,g,e){a[1].write(e.PWD);return 0};b.commands.help=function(a){a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
a[2].write("To see a full list of commands, type 'commands' ");return 0};b.commands.commands=function(a){var c=[],g;for(g in b.commands)b.commands.hasOwnProperty(g)&&c.push(g);a[1].write(c.join("\n"));return 0};b.commands.whoami=function(a,b,g,e){a[1].write(e.USER);return 0};b.commands.sleep=function(b,c,g){if(2>c)return b[2].write("sleep: missing operand"),1;b=g[1][g[1].length-1];c=0;-1===["s","m","h","d"].indexOf(b)?(c=parseInt(g[1],10),b="s"):c=parseInt(g[1].substr(0,-1),10);switch(b){case "d":c*=
24;case "h":c*=60;case "m":c*=60;case "s":c*=1E3}var e=a.Deferred();setTimeout(function(){e.resolve(0)},c);return e.promise()};b.commands.date=function(a,b){if(1<b)return a[2].write("error: date takes no args"),1;var g=new Date,e=Array(7);e[0]="Sun";e[1]="Mon";e[2]="Tue";e[3]="Wed";e[4]="Thu";e[5]="Fri";e[6]="Sat";var d=Array(12);d[0]="Jan";d[1]="Feb";d[2]="Mar";d[3]="Apr";d[4]="May";d[5]="Jun";d[6]="Jul";d[7]="Aug";d[8]="Sep";d[9]="Oct";d[10]="Nov";d[11]="Dec";var f="UTC";4===g.getTimezoneOffset()/
60&&(f="EDT");var e=e[g.getDay()].toString()+" "+d[g.getMonth()].toString()+" "+g.getDate().toString()+" ",l=g.getHours(),d=l.toString();10>l&&(d="0"+l.toString());var k=g.getMinutes(),l=k.toString();10>k&&(l="0"+k.toString());var k=g.getSeconds(),m=k.toString();10>k&&(m="0"+k.toString());e+=d+":"+l+":"+m+" "+f+" "+g.getFullYear().toString()+" ";a[1].write(e);return 0}})(jQuery,w);(function(a,b){var h=new x;b.commands.cd=function(a,b,d,f){var c="",c=1>=b?f.HOME:"/"===d[1][0]?p(d[1]):p(d[1],f.PWD,f.HOME);b=h.a("GET","/files"+c,{},{},!1);if("directory"!==b.getResponseHeader("File-Type"))return a[2].write("cd: "+c+": Not a directory"),1;if(404===b.status)return a[2].write("cd: "+c+": No such file or directory"),1;if(403===b.status)return a[2].write("cd: "+c+": Permission denied"),1;if(200!==b.status)return a[2].write("cd: "+c+": An internal error occurred"),1;f.PWD=c;return 0};
var c;b.commands.ls=function(b,e,d,f){d=a.b(d,"latcurS");var l=d[0];d=d[1];e=d.length;if(1===e)d[e++]="";else if("string"===a.type(l))return b[2].write(l),1;e="name";"l"in l&&"t"in l?"c"in l?e="ctime":"u"in l&&(e="atime"):"t"in l?e="mtime":"S"in l&&(e="size");for(var k=1;k<d.length;k++){var m=p(d[k],f.PWD,f.HOME),q=h.a("GET","/files"+m,{},{"Sort-By":e},!1);if(null===q||200!==q.status)b[2].write("ls: cannot access "+m+": No such file or directory");else{if("directory"!==q.getResponseHeader("File-Type"))console.log(m),
q.responseJSON=[["f",q.getResponseHeader("File-Perms"),q.getResponseHeader("File-Owner"),q.getResponseHeader("File-Group"),q.getResponseHeader("Content-Length"),q.getResponseHeader("Last-Modified"),m]];else if(null===q.responseJSON||void 0===q.responseJSON)q.responseJSON=[];"r"in l&&q.responseJSON.reverse();var n="";c=q.responseJSON.length;for(m=counter=0;m<q.responseJSON.length;m++){var z=b[1],r=q.responseJSON[m],u=l;if("."!==r[6][0]||"a"in u)if(n=n+r[6]+"\t\t","l"in u){for(var n="d"===r[0]?"d":
"-",u=0,s=256;3>u;u++,s>>=1)n+=s&r[1]?"r":"-",s>>=1,n+=s&r[1]?"w":"-",s>>=1,n+=s&r[1]?"x":"-";n+=" "+t(r[2],10);n+=" "+t(r[3],6);n+=" "+t(r[4].toString(),6);n+=" "+r[5].date;n+=" "+r[6];n+="\n";z.write(n);n=""}else{if(counter++,0===counter%4||counter===c)n+="\n",z.write(n),n=""}else c--}}}return 0};b.commands.ln=function(a,b,d,f){3!==b&&a[2].write("ln: invalid number of parameters");b=p(d[1],f.PWD,f.HOME);d=p(d[2],f.PWD,f.HOME);f=h.a("PUT","/files"+d,"",{"File-Type":"link","Content-Location":b},!1);
return 404===f.status?(a[2].write("ln: failed to create symbolic link "+d+": No such file or directory"),1):403===f.status?(a[2].write("ln: failed to create symbolic link "+d+": Permission denied"),1):400<=f.status?(a[2].write("ln: failed to create symbolic link "+d+": An internal error occurred"),1):0};b.commands.touch=function(a,b,d,f){for(var c=1;c<b;c++){var k=p(d[c],f.PWD,f.HOME),m=h.a("POST","/files"+k,"",{},!1);if(404===m.status)return a[2].write("touch: cannot touch "+k+": No such file or directory"),
1;if(403===m.status)return a[2].write("touch: cannot touch "+k+": Permission denied"),1;if(400<=m.status)return a[2].write("touch: cannot touch "+k+": An internal error occurred"),1}return 0};b.commands.cat=function(a,b,d,f){1>=b&&(d.push("-"),++b);for(var c=!1,k=1;k<b;k++)if("-"===d[k])c=!0,a[0].n().progress(function(b){a[1].write(b.p())});else{var m=p(d[k],f.PWD,f.HOME);req=h.a("GET","/files"+m,"",{},!1);200===req.status?"directory"===req.getResponseHeader("File-Type")?a[2].write("cat: "+m+": Is a directory"):
"application/json"!==req.getResponseHeader("Content-Type")?a[1].write(req.responseText):a[1].write(req.responseJSON):404===req.status?a[2].write("cat: "+m+": No such file or directory"):403===req.status&&a[2].write("cat: "+m+": Permission denied")}return c?a[0].n():0};b.commands.mkdir=function(a,b,d,f){for(var c=1;c<b;c++){var k=p(d[c],f.PWD,f.HOME),m=h.a("GET","/files"+k,"",{},!1);404!==m.status&&a[2].write("mkdir: cannot create directory "+k+": File exists");m=h.a("PUT","/files"+k,"",{"File-Type":"directory"},
!1);if(404===m.status)return a[2].write("mkdir: cannot create directory "+k+": No such file or directory"),1;if(403===m.status)return a[2].write("mkdir: cannot create directory "+k+": Permission denied"),1;if(400<=m.status)return a[2].write("mkdir: cannot create directory "+k+": An internal error occurred"),1}return 0};b.commands.useradd=function(b,e,d,c){d=a.b(d,"d:g:G:mM");var l=d[0];d=d[1];e=d.length;if(2>e)return b[2].write("error in usage: useradd [OPTIONS] LOGIN [EMAIL]"),1;if(3!==e)d.push(d[1]+
"@localhost");else if("string"===a.type(l))return b[2].write(l),1;var k=h.a("GET","/users/"+d[1],"",{},!1);if(404!==k.status)return b[2].write("useradd: User "+d[1]+" already exists"),1;e="/home/"+d[1];"d"in l&&(e=l.d);e=p(e,c.PWD,c.HOME);if("m"in l&&!("M"in l)){k=h.a("PUT","/files"+e,"",{"File-Type":"directory"},!1);if(404===k.status)return b[2].write("useradd: cannot create directory "+path+": No such file or directory"),1;if(403===k.status)return b[2].write("useradd: cannot create directory "+
path+": Permission denied"),1;if(400<=k.status)return b[2].write("useradd: cannot create directory "+path+": An internal error occurred"),1}c=[];"g"in l&&c.push(l.g);"G"in l&&(c=a.merge(c,l.G.split(",")));k=h.a("PUT","/users/"+d[1],{password:"!",email:d[2],home_directory:e,groups:c},{},!1);if(400===k.status||404===k.status&&"Cannot find file or directory"===k.responseJSON)return b[2].write("useradd: invalid home directory"),1;if(403===k.status)return b[2].write("useradd: cannot create user: Permission denied"),
1;if(500===k.status)return b[2].write("count not create user: server timed out"),1;h.a("PATCH","/files"+e,"",{"File-Owner":d[1]},!1);return 0};b.commands.passwd=function(b,e,d,c,l){2>e&&(d.push(c.USER),++e);var k=a.Deferred();b[0].n().progress(function(a){a=a.p();l.m();a=h.a("PATCH","/users/"+d[1],{password:a},{},!1);400===a.status?(b[2].write("useradd: invalid home directory"),k.resolve(1)):403===a.status?(b[2].write("useradd: cannot create user: Permission denied"),k.resolve(1)):500==a.status?(b[2].write("count not create user: server timed out"),
k.resolve(1)):k.resolve(0)});b[1].write("Password: ");l.m();return k};b.commands.cp=function(a,b,d,c){3!==b&&a[2].write("cp: invalid number of parameters");b=p(d[1],c.PWD,c.HOME);d=p(d[2],c.PWD,c.HOME);c=h.a("PUT","/files"+d,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);return 404===c.status?(a[2].write("cp: cannot create regular file "+d+": No such file or directory"),1):403===c.status?(a[2].write("cp: cannot create regular file "+d+": Permission denied"),1):400<=c.status&&"Invalid file data source"===
c.responseJSON?(a[2].write("cp: cannot stat "+b+": No such file or directory"),1):0};b.commands.mv=function(a,b,c,f){if(3!==b)return a[2].write("mv: invalid number of parameters"),1;b=p(c[1],f.PWD,f.HOME);c=p(c[2],f.PWD,f.HOME);f=h.a("PUT","/files"+c,b,{"Content-Type":"application/vnd.webbash.filepath"},!1);if(404===f.status)return a[2].write("mv: cannot create regular file "+c+": No such file or directory"),1;if(403===f.status)return a[2].write("mv: cannot create regular file "+c+": Permission denied"),
1;if(400<=f.status&&"Invalid file data source"===f.responseJSON)return a[2].write("mv: cannot stat "+b+": No such file or directory"),1;f=h.a("DELETE","/files"+b,"",{},!1);return 403===f.status?(a[2].write("mv: cannot remove "+b+": Permission denied"),1):0};b.commands.rmdir=function(a,b,c,f){for(var l=1;l<b;l++){var k=p(c[l],f.PWD,f.HOME),m=h.a("GET","/files"+k,{},{},!1);404===m.status?a[2].write("rmdir: cannot remove "+k+": No such directory"):403===m.status?a[2].write("rmdir: cannot remove "+k+
": Permission denied"):"directory"===m.getResponseHeader("File-Type")&&2===m.responseJSON.length?h.a("DELETE","/files"+k,"",{},!1):a[2].write("rmdir: cannot remove "+k+": Non-empty directory")}return 0};b.commands.rm=function(b,c,d,f){c=a.b(d,"r");var l=c[0];d=c[1];c=d.length;if("string"===a.type(l))return b[2].write(l),1;var k=!1,m;for(m in l)l.hasOwnProperty(m)&&"r"===m&&(k=!0);for(l=1;l<c;l++){m=p(d[l],f.PWD,f.HOME);var q=h.a("GET","/files"+m,{},{},!1);"directory"!==q.getResponseHeader("File-Type")||
k?(q=h.a("DELETE","/files"+m,"",{},!1),404===q.status?b[2].write("rm: cannot remove "+m+": No such file or directory"):403===q.status&&b[2].write("rm: cannot remove "+m+": Permission denied")):b[2].write("rm: cannot remove "+m+": File is a directory")}return 0};b.commands.chmod=function(a,b,c,f){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var l=2;l<b;l++){var k=p(c[l],f.PWD,f.HOME),m=h.a("PATCH","/files"+k,"",{"File-Permissions":c[1]},!1);404===m.status?a[2].write("chown: cannot access "+
k+": No such file or directory"):403===m.status&&a[2].write("chown: changing permissions of "+k+": Permission denied")}return 0};b.commands.chgrp=function(a,b,c,f){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var l=2;l<b;l++){var k=p(c[l],f.PWD,f.HOME),m=h.a("PATCH","/files"+k,"",{"File-Group":c[1]},!1);if(404===m.status)a[2].write("chown: cannot access "+k+": No such file or directory");else if(403===m.status)a[2].write("chown: changing ownership of "+k+": Permission denied");
else if(400<=m.status&&"Invalid group"===m.responseJSON)return a[2].write("chown: invalid group: "+c[1]),1}return 0};b.commands.chown=function(a,b,c,f){if(3>b)return a[2].write("chown: needs at least 2 parameters"),1;for(var l=2;l<b;l++){var k=p(c[l],f.PWD,f.HOME),m=h.a("PATCH","/files"+k,"",{"File-Owner":c[1]},!1);if(404===m.status)a[2].write("chown: cannot access "+k+": No such file or directory");else if(403===m.status)a[2].write("chown: changing ownership of "+k+": Permission denied");else if(400<=
m.status&&"Invalid owner"===m.responseJSON)return a[2].write("chown: invalid user: "+c[1]),1}return 0};b.commands.uname=function(b,c,d){c=a.b(d,"asnr")[0];if("string"===a.type(c))return b[2].write(c),1;d=h.a("GET","/","",{},!1);if(200!==d.status)return b[2].write("uname: cannot access server"),1;var f="";if("s"in c||"a"in c)f+=d.responseJSON.kernel+" ";if("n"in c||"a"in c)f+=d.responseJSON.hostname+" ";if("r"in c||"a"in c)f+=d.responseJSON.version+" ";b[1].write(f);return 0}})(jQuery,w);
