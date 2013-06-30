function n(a, b, g) {
  var c = a[0];
  "~" === c ? a = g + "/" + a : "/" !== c && (a = b + "/" + a);
  a = a.substr(1).split("/");
  b = [];
  for(g = 0;g < a.length;g++) {
    "." !== a[g] && "" !== a[g] && (".." === a[g] ? b.pop() : b.push(a[g]))
  }
  return"/" + b.join("/")
}
;function r(a, b) {
  var g, c;
  "undefined" === typeof b && (b = 0);
  "undefined" === typeof g && (g = " ");
  "undefined" === typeof c && (c = "left");
  if(b + 1 >= a.length) {
    switch(c) {
      case "left":
        a = Array(b + 1 - a.length).join(g) + a;
        break;
      case "both":
        c = b - a.length;
        var f = Math.ceil(c / 2);
        a = Array(c - f + 1).join(g) + a + Array(f + 1).join(g);
        break;
      default:
        a = a + Array(b + 1 - a.length).join(g)
    }
  }
  return a
}
;$.a = function(a, b) {
  for(var g = {}, c = [a[0]], f = 1;f < a.length;f++) {
    if("-" !== a[f][0]) {
      if("+" === b[0]) {
        c = $.merge(c, a.slice(f));
        break
      }else {
        c.push(a[f]);
        continue
      }
    }else {
      if("--" === a[f]) {
        c = $.merge(c, a.slice(f));
        break
      }
    }
    var d = a[f].substr(1), e = b.indexOf(d);
    if(-1 === e) {
      return"Unknown option -" + d
    }
    if(":" === b[e + 1]) {
      if("-" !== a[f + 1][0]) {
        g[d] = a[++f]
      }else {
        if(":" !== b[e + 2]) {
          return"Option -" + d + " requires an argument"
        }
        g[d] = !0
      }
    }else {
      g[d] = !0
    }
  }
  return[g, c]
};
function s(a) {
  for(var b = "", g = [], c = !1, f = !1, d = !1, e = 0;e < a.length;e++) {
    " " === a[e] && (c || f) ? b += a[e] : " " !== a[e] || c || f ? "\\" === a[e] ? d || c ? (b += "\\", d = !1) : d = !0 : "'" === a[e] ? d ? (b += "'", d = !1) : f ? b += "'" : c = !c : '"' === a[e] ? d ? (b += '"', d = !1) : c ? b += '"' : f = !f : "$" === a[e] && c ? b += "\\$" : (b += a[e], d = !1) : 0 < b.length && (g.push(b), b = "")
  }
  b = $.trim(b);
  "" !== b && g.push(b);
  return g
}
;window.Terminal = function() {
  this.f = null;
  this.b = "root@ubuntu> ";
  this.a = [];
  this.d = 0;
  this.promise = null;
  this.o = function() {
    $("#cursor").remove();
    $("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));
    "Password: " !== this.b ? ($("#cursor").before($('<div class="userinput"></div>')), $("#cursor").after($('<div class="userinput></div>'))) : ($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')), $("#cursor").after($('<div id="hiddentext" class="userinput"></div>')));
    $(window).scrollTop($(document).height())
  };
  this.r = function() {
    $("body > ul").empty()
  };
  this.g = function() {
    this.promise = null;
    $("body > ul").append("<li>" + this.b + "</li>");
    this.o()
  };
  this.s = function(a) {
    var b = $('<div id="system_output"></div>');
    b.text(a);
    $("body > ul > li:last-child").append(b);
    this.o()
  };
  this.q = function() {
    $("#cursor").toggleClass("blink")
  };
  this.n = function() {
    var a = $("#cursor"), b, g, c = a.prev(), f = a.next();
    if(0 === c.length || !c.hasClass("userinput")) {
      return!1
    }
    var d = c.text();
    if(0 === d.length) {
      return!1
    }
    b = d.substr(d.length - 1);
    g = a.text();
    0 === f.length && "&nbsp;" !== g && (f = $('<div class="userinput"></div>'), a.after(f));
    c.text(d.substring(0, d.length - 1));
    a.text(b);
    return"&nbsp;" !== g ? (f.prepend(g), !0) : !1
  };
  this.i = function() {
    var a = $("#cursor"), b, g, c, f = a.prev(), d = a.next();
    if(0 === d.length || !d.hasClass("userinput")) {
      return!1
    }
    c = d.text();
    if(0 === c.length) {
      return!1
    }
    b = c[0];
    g = a.text();
    if(0 === d.length) {
      return a.html("&nbsp;"), !1
    }
    d.text(c.substr(1));
    a.text(b);
    f.append(g);
    return!0
  };
  this.j = function(a) {
    var b = $("#cursor").parent().children(".userinput").text();
    this.a[this.d] = b.substr(0, b.length - 1);
    a = this.d + a;
    a < this.a.length && 0 <= a && (this.d = a, a = $("#cursor"), a.next().text(""), a.html("&nbsp;"), a.prev().text(this.a[this.d]))
  };
  this.t = function(a) {
    var b;
    if(37 === a.which) {
      a.preventDefault(), this.n()
    }else {
      if(39 === a.which) {
        a.preventDefault(), this.i()
      }else {
        if(38 === a.which) {
          a.preventDefault(), this.j(-1)
        }else {
          if(40 === a.which) {
            a.preventDefault(), this.j(1)
          }else {
            if(35 === a.which) {
              for(;this.i();) {
              }
            }else {
              if(36 === a.which) {
                for(;this.n();) {
                }
              }else {
                if(!a.ctrlKey || a.metaKey || a.shiftKey || 67 !== a.which) {
                  if(!a.ctrlKey || a.metaKey || a.shiftKey || 68 !== a.which) {
                    if(46 === a.which) {
                      if(b = $("#cursor"), a = b.next(), 0 !== a.length && a.hasClass("userinput")) {
                        var g = a.text();
                        0 !== g.length ? (b.text(g.substr(0, 1)), a.text(g.substr(1))) : b.html("&nbsp;")
                      }else {
                        b.html("&nbsp;")
                      }
                    }else {
                      if(8 === a.which) {
                        a.preventDefault(), b = $("#cursor").prev(), 0 < b.length && b.hasClass("userinput") && b.text(b.text().slice(0, -1))
                      }else {
                        if(13 === a.which) {
                          b = $("#cursor").parent().children(".userinput").not(".completed"), a = b.text(), a = a.substr(0, a.length - 1), b.addClass("completed"), a = $.trim(a), 0 < a.length && (this.a[this.a.length] = a, this.d = this.a.length), $("#cursor").prev().append($("#cursor").text()), $("#cursor").next().after($(" <br> ")), null !== this.promise ? this.promise.k.write(a) : 0 < a.length ? (this.promise = this.f.g($.trim(a), this), this.promise.progress($.proxy(this.s, this)).always($.proxy(this.g, 
                          this))) : this.g()
                        }else {
                          if(222 === a.which && a.shiftKey) {
                            a.preventDefault(), b = $("#cursor").prev(), b.append('"'), this.i()
                          }else {
                            if(222 === a.which) {
                              a.preventDefault(), b = $("#cursor").prev(), b.append("'"), this.i()
                            }else {
                              b = $("#cursor").prev();
                              var g = {1:"!", 2:"@", 3:"#", 4:"$", 5:"%", 6:"^", 7:"&", 8:"*", 9:"(", 0:")", ",":"<", ".":">", "/":"?", ";":":", "'":'"', "[":"{", "]":"}", "\\":"|", "`":"~", "-":"_", "=":"+"}, c = {96:48, 97:49, 98:50, 99:51, 100:52, 101:53, 102:54, 103:55, 104:56, 105:57, 106:42, 107:43, 109:45, 110:46, 111:47, 173:45, 186:59, 187:61, 188:44, 189:45, 190:46, 191:47, 192:96, 219:91, 220:92, 221:93, 222:39}, f = a.which;
                              0 <= [16, 37, 38, 39, 40, 20, 17, 18, 91].indexOf(f) ? a = !1 : ("undefined" !== typeof c[f] && (f = c[f]), c = String.fromCharCode(f), a.shiftKey ? "undefined" !== typeof g[c] && (c = g[c]) : c = c.toLowerCase(), a = c);
                              a && b.append(a)
                            }
                          }
                        }
                      }
                    }
                  }else {
                    a.preventDefault(), this.f.b(this), this.f.a.a(), window.open("", "_self", ""), window.close(), self.close()
                  }
                }else {
                  a.preventDefault(), $("#cursor").next().append("^C"), this.g()
                }
              }
            }
          }
        }
      }
    }
    $(window).scrollTop($(document).height())
  };
  this.bind = function(a) {
    null !== this.f && this.f.b.call(this.f, this);
    this.f = a;
    this.f.i.call(this.f, this);
    this.g()
  };
  $(window.document).keydown($.proxy(this.t, this));
  $(window).bind("beforeunload", function() {
    this.f.b.call(this.f, this)
  });
  window.setInterval(this.q, 500);
  window.setInterval($.proxy(function() {
    this.f.b(this)
  }, this), 1E4)
};
function t(a) {
  this.h = {"?":"0"};
  this.j = /[\w\?\-\!]+/i;
  this.e = a;
  this.d = 0;
  this.a = new u;
  this.i = function(b) {
    var a = this.a.c("GET", "/users/" + this.e, {}, {}, !1), c = this.a.c("GET", "/users/" + this.e + "/history", {}, {}, !1), a = a.responseJSON.homedir;
    this.h.USER = this.e;
    this.h.HOME = a;
    this.h.PWD = a;
    b.b = this.e + "@ubuntu " + a + " $ ";
    200 === c.status && (b.a = c.responseJSON, this.d = b.d = c.responseJSON.length)
  };
  this.b = function(a) {
    this.d < a.a.length && (this.a.c("PATCH", "/users/" + this.e + "/history", {history:a.a.slice(this.d)}), this.d = a.a.length)
  };
  this.g = function(a, g) {
    var c = $.Deferred();
    c.k = new B;
    setTimeout($.proxy(function() {
      var f = this.u(s(a));
      this.l(f, g, c)
    }, this), 0);
    var f = c.promise();
    f.k = c.k;
    return f
  };
  this.l = function(a, g, c) {
    var f;
    "exit" === a[0] ? (this.b(g), this.a.a(), window.open("", "_self", ""), window.close(), self.close()) : "clear" === a[0] ? g.r() : "undefined" !== typeof t.commands[a[0]] ? (f = [c.k, new B, new B], f[1].flush = function(a) {
      a = a.m();
      c.notify([a])
    }, f[2].flush = function() {
      var a = stream.m(stream);
      c.notify([a])
    }, f = t.commands[a[0]](f, a.length, a, this.h)) : void 0 !== a[0] && "" !== a[0] && (c.notify(["error: unknown command " + a[0]]), f = "127");
    a = $.proxy(function(a) {
      this.h["?"] = a.toString();
      g.b = this.e + "@ubuntu " + this.h.PWD + " $ ";
      c.resolve()
    }, this);
    "object" === $.type(f) && void 0 !== f.then ? f.then(a) : a(f)
  };
  this.u = function(a) {
    for(var g = 1;g < a.length;++g) {
      for(var c = a[g].indexOf("$");0 <= c;c = a[g].indexOf("$", c + 1)) {
        if(0 !== c && "\\" === a[g][c - 1]) {
          a[g] = a[g].substr(0, c - 1) + a[g].substr(c)
        }else {
          var f = this.j.exec(a[g].substr(c + 1))[0];
          null !== f && ("undefined" === typeof this.h[f] && (this.h[f] = ""), a[g] = a[g].substr(0, c) + this.h[f] + a[g].substr(c + f.length + 1))
        }
      }
    }
    return a
  }
}
t.commands = {};
window.WebBash = t;
window.WebBashLogin = function() {
  this.a = new u;
  this.e = "";
  this.i = function(a) {
    a.b = "Username: "
  };
  this.b = function() {
  };
  this.g = function(a, b) {
    var g = $.Deferred();
    setTimeout($.proxy(function() {
      this.l(a, b, g)
    }, this), 0);
    return g.promise()
  };
  this.l = function(a, b, g) {
    "" === this.e ? (this.e = a, "" !== a && (b.b = "Password: "), g.resolve()) : this.a.b(this.e, a).done($.proxy(function() {
      b.bind(new t(this.e))
    }, this)).fail($.proxy(function(a) {
      g.notify(a.responseText);
      this.e = "";
      b.b = "Username: ";
      g.resolve()
    }, this))
  }
};
function B() {
  this.b = 0;
  this.a = "";
  this.d = $.Deferred();
  this.write = function(a) {
    this.a += a;
    this.flush(this);
    null !== this.d && this.d.notify(this)
  };
  this.m = function(a) {
    var b = "";
    this.b >= this.a.length ? b = "" : void 0 === a ? (b = this.a.substr(this.b), this.b = this.a.length) : (b = this.a.substr(this.b, a), this.b += a);
    return b
  };
  this.g = function() {
    return this.d.promise()
  };
  this.flush = function() {
  }
}
;function u() {
  this.p = this.e = "";
  this.b = function(a, b) {
    this.e = a;
    this.p = b;
    return this.c("GET", "/login").then($.proxy(function(a) {
      return this.c("PUT", "/login", {username:this.e, password:this.p, token:a.token})
    }, this))
  };
  this.a = function() {
    this.c("DELETE", "/login")
  };
  this.c = function(a, b, g, c, f) {
    var d = "application/x-www-form-urlencoded";
    void 0 !== c && "Content-Type" in c && (d = c["Content-Type"]);
    return $.ajax({async:void 0 === f ? !0 : f, contentType:d, data:g, headers:c, type:a, url:"api.php" + b})
  }
}
;(function(a, b) {
  b.commands["false"] = function() {
    return 1
  };
  b.commands["true"] = function() {
    return 0
  };
  b.commands.echo = function(a, c, f) {
    f.shift();
    a[1].write(f.join(" "));
    return 0
  };
  b.commands["export"] = function(a, c, f, b) {
    for(a = 1;a < c;++a) {
      var e = f[a].split("=", 2);
      b[e[0]] = e[1]
    }
    return 0
  };
  b.commands.unset = function(a, c, f, b) {
    for(a = 1;a < c;++a) {
      b[f[a]] = ""
    }
    return 0
  };
  b.commands.pwd = function(a, c, f, b) {
    a[1].write(b.PWD);
    return 0
  };
  b.commands.help = function(a) {
    a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
    a[2].write("To see a full list of commands, type 'commands' ");
    return 0
  };
  b.commands.commands = function(a) {
    var c = [], f;
    for(f in b.commands) {
      b.commands.hasOwnProperty(f) && c.push(f)
    }
    a[1].write(c.join("\n"));
    return 0
  };
  b.commands.whoami = function(a, c, f, b) {
    a[1].write(b.USER);
    return 0
  };
  b.commands.sleep = function(b, c, f) {
    if(2 > c) {
      return b[2].write("sleep: missing operand"), 1
    }
    b = f[1][f[1].length - 1];
    c = 0;
    -1 === ["s", "m", "h", "d"].indexOf(b) ? (c = parseInt(f[1], 10), b = "s") : c = parseInt(f[1].substr(0, -1), 10);
    switch(b) {
      case "d":
        c *= 24;
      case "h":
        c *= 60;
      case "m":
        c *= 60;
      case "s":
        c *= 1E3
    }
    var d = a.Deferred();
    setTimeout(function() {
      d.resolve(0)
    }, c);
    return d.promise()
  };
  b.commands.date = function(a, c) {
    if(1 < c) {
      return a[2].write("error: date takes no args"), 1
    }
    var f = new Date, b = Array(7);
    b[0] = "Sun";
    b[1] = "Mon";
    b[2] = "Tue";
    b[3] = "Wed";
    b[4] = "Thu";
    b[5] = "Fri";
    b[6] = "Sat";
    var e = Array(12);
    e[0] = "Jan";
    e[1] = "Feb";
    e[2] = "Mar";
    e[3] = "Apr";
    e[4] = "May";
    e[5] = "Jun";
    e[6] = "Jul";
    e[7] = "Aug";
    e[8] = "Sep";
    e[9] = "Oct";
    e[10] = "Nov";
    e[11] = "Dec";
    var h = "UTC";
    4 === f.getTimezoneOffset() / 60 && (h = "EDT");
    var b = b[f.getDay()].toString() + " " + e[f.getMonth()].toString() + " " + f.getDate().toString() + " ", k = f.getHours(), e = k.toString();
    10 > k && (e = "0" + k.toString());
    var l = f.getMinutes(), k = l.toString();
    10 > l && (k = "0" + l.toString());
    var l = f.getSeconds(), m = l.toString();
    10 > l && (m = "0" + l.toString());
    b += e + ":" + k + ":" + m + " " + h + " " + f.getFullYear().toString() + " ";
    a[1].write(b);
    return 0
  }
})(jQuery, t);
(function(a, b) {
  var g = new u;
  b.commands.cd = function(a, b, d, e) {
    var h = "", h = 1 >= b ? e.HOME : "/" === d[1][0] ? n(d[1]) : n(d[1], e.PWD, e.HOME);
    b = g.c("GET", "/files" + h, {}, {}, !1);
    if(200 === b.status) {
      return e.PWD = h, 0
    }
    404 === b.status ? a[2].write("cd: " + h + ": No such file or directory") : 403 === b.status ? a[2].write("cd: " + h + ": Permission denied") : a[2].write("cd: " + h + ": An internal error occurred");
    return 1
  };
  b.commands.ls = function(c, b, d, e) {
    d = a.a(d, "la");
    var h = d[0];
    d = d[1];
    b = d.length;
    1 === b && (d[b++] = "");
    for(b = 1;b < d.length;b++) {
      var k = n(d[b], e.PWD, e.HOME), l = g.c("GET", "/files" + k, {}, {}, !1);
      if(404 === l.status) {
        c[2].write("ls: cannot access " + k + ": No such file or directory")
      }else {
        "string" === typeof l.responseJSON && (l.responseJSON = [l.responseJSON]);
        for(var m = "", k = 0, w = l.responseJSON.length - 1;k < l.responseJSON.length;k++, w--) {
          var x = c[1], p = l.responseJSON[k], y = h, m = m + p[6] + "\t\t", q = !0, z = !1, v = void 0;
          for(v in y) {
            if(y.hasOwnProperty(v)) {
              switch(v) {
                case "a":
                  z = !0;
                  break;
                case "l":
                  for(var m = "d" === p[0] ? "d" : "-", q = 256, A = 0;3 > A;A++) {
                    m = q & p[1] ? m + "r" : m + "-", q >>= 1, m = q & p[1] ? m + "w" : m + "-", q >>= 1, m = q & p[1] ? m + "x" : m + "-"
                  }
                  m += " " + r(p[2], 10);
                  m += " " + r(p[3], 6);
                  m += " " + r(p[4].toString(), 6);
                  m += " " + p[5].date;
                  m += " " + p[6];
                  q = !1
              }
            }
          }
          if("." !== p[6] && ".." !== p[6] || z) {
            q ? (m += "\n   ", 0 === w % 4 && (x.write(m), m = "")) : (m += "\n", x.write(m), m = "")
          }
        }
      }
    }
    return 0
  };
  b.commands.ln = function(a, b, d, e) {
    3 !== b && a[2].write("ln: invalid number of parameters");
    b = n(d[1], e.PWD, e.HOME);
    d = n(d[2], e.PWD, e.HOME);
    e = g.c("PUT", "/files" + d, "", {"File-Type":"link", "Content-Location":b}, !1);
    return 404 === e.status ? (a[2].write("ln: failed to create symbolic link " + d + ": No such file or directory"), 1) : 403 === e.status ? (a[2].write("ln: failed to create symbolic link " + d + ": Permission denied"), 1) : 400 <= e.status ? (a[2].write("ln: failed to create symbolic link " + d + ": An internal error occurred"), 1) : 0
  };
  b.commands.touch = function(a, b, d, e) {
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.c("POST", "/files" + k, "", {}, !1);
      if(404 === l.status) {
        return a[2].write("touch: cannot touch " + k + ": No such file or directory"), 1
      }
      if(403 === l.status) {
        return a[2].write("touch: cannot touch " + k + ": Permission denied"), 1
      }
      if(400 <= l.status) {
        return a[2].write("touch: cannot touch " + k + ": An internal error occurred"), 1
      }
    }
    return 0
  };
  b.commands.cat = function(a, b, d, e) {
    if(1 >= b) {
      return a[2].write("cat: invalid number of parameters"), 1
    }
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME);
      req = g.c("GET", "/files" + k, "", {}, !1);
      200 === req.status ? "directory" === req.getResponseHeader("File-Type") ? a[2].write("cat: " + k + ": Is a directory") : a[1].write(req.responseText) : 404 === req.status ? a[2].write("cat: " + k + ": No such file or directory") : 403 === req.status && a[2].write("cat: " + k + ": Permission denied")
    }
    return 0
  };
  b.commands.mkdir = function(a, b, d, e) {
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.c("PUT", "/files" + k, "", {"File-Type":"directory"}, !1);
      if(404 === l.status) {
        return a[2].write("mkdir: cannot create directory " + k + ": No such file or directory"), 1
      }
      if(403 === l.status) {
        return a[2].write("mkdir: cannot create directory " + k + ": Permission denied"), 1
      }
      if(400 <= l.status) {
        return a[2].write("mkdir: cannot create directory " + k + ": An internal error occurred"), 1
      }
    }
    return 0
  };
  b.commands.useradd = function(a, b, d) {
    if(2 !== b) {
      return a[2].write("error in usage: useradd LOGIN [EMAIL]"), 1
    }
    3 !== b && d.push(d[1] + "@localhost");
    b = g.c("PUT", "/users/" + d[1], {password:"!", email:d[2], home_directory:"/" + d[1]}, {}, !1);
    return 400 === b.status ? (a[2].write("useradd: invalid home directory"), 1) : 403 === b.status ? (a[2].write("useradd: cannot create user: Permission denied"), 1) : 500 == b.status ? (a[2].write("count not create user: server timed out"), 1) : 0
  };
  b.commands.passwd = function(b, f, d, e) {
    2 > f && (d.push(e.USER), ++f);
    var h = a.Deferred();
    b[0].g().progress(function(a) {
      a = a.m();
      console.log(a);
      a = g.c("PATCH", "/users/" + d[1], {password:a}, {}, !1);
      400 === a.status ? (b[2].write("useradd: invalid home directory"), h.resolve(1)) : 403 === a.status ? (b[2].write("useradd: cannot create user: Permission denied"), h.resolve(1)) : 500 == a.status ? (b[2].write("count not create user: server timed out"), h.resolve(1)) : h.resolve(0)
    });
    b[1].write("Password: ");
    return h
  };
  b.commands.cp = function(a, b, d, e) {
    3 !== b && a[2].write("cp: invalid number of parameters");
    b = n(d[1], e.PWD, e.HOME);
    d = n(d[2], e.PWD, e.HOME);
    e = g.c("PUT", "/files" + d, b, {"Content-Type":"application/vnd.webbash.filepath"}, !1);
    return 404 === e.status ? (a[2].write("cp: cannot create regular file " + d + ": No such file or directory"), 1) : 403 === e.status ? (a[2].write("cp: cannot create regular file " + d + ": Permission denied"), 1) : 400 <= e.status && "Invalid file data source" === e.responseJSON ? (a[2].write("cp: cannot stat " + b + ": No such file or directory"), 1) : 0
  };
  b.commands.mv = function(a, b, d, e) {
    3 !== b && a[2].write("mv: invalid number of parameters");
    b = n(d[1], e.PWD, e.HOME);
    d = n(d[2], e.PWD, e.HOME);
    e = g.c("PUT", "/files" + d, b, {"Content-Type":"application/vnd.webbash.filepath"}, !1);
    if(404 === e.status) {
      return a[2].write("mv: cannot create regular file " + d + ": No such file or directory"), 1
    }
    if(403 === e.status) {
      return a[2].write("mv: cannot create regular file " + d + ": Permission denied"), 1
    }
    if(400 <= e.status && "Invalid file data source" === e.responseJSON) {
      return a[2].write("mv: cannot stat " + b + ": No such file or directory"), 1
    }
    e = g.c("DELETE", "/files" + b, "", {}, !1);
    return 403 === e.status ? (a[2].write("mv: cannot remove " + b + ": Permission denied"), 1) : 0
  };
  b.commands.rm = function(a, b, d, e) {
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME);
      req = g.c("DELETE", "/files" + k, "", {}, !1);
      404 === req.status ? a[2].write("mv: cannot remove " + src + ": No such file or directory") : 403 === req.status && a[2].write("mv: cannot remove " + src + ": Permission denied")
    }
    return 0
  };
  b.commands.chmod = function() {
    return 0
  };
  b.commands.chgrp = function(a, b, d, e) {
    if(3 > b) {
      return a[2].write("chown: needs at least 2 parameters"), 1
    }
    for(var h = 2;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.c("PATCH", "/files" + k, "", {"File-Group":d[1]}, !1);
      if(404 === l.status) {
        a[2].write("chown: cannot access " + k + ": No such file or directory")
      }else {
        if(403 === l.status) {
          a[2].write("chown: changing ownership of " + k + ": Permission denied")
        }else {
          if(400 <= l.status && "Invalid group" === l.responseJSON) {
            return a[2].write("chown: invalid group: " + d[1]), 1
          }
        }
      }
    }
    return 0
  };
  b.commands.chown = function(a, b, d, e) {
    if(3 > b) {
      return a[2].write("chown: needs at least 2 parameters"), 1
    }
    for(var h = 2;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.c("PATCH", "/files" + k, "", {"File-Owner":d[1]}, !1);
      if(404 === l.status) {
        a[2].write("chown: cannot access " + k + ": No such file or directory")
      }else {
        if(403 === l.status) {
          a[2].write("chown: changing ownership of " + k + ": Permission denied")
        }else {
          if(400 <= l.status && "Invalid owner" === l.responseJSON) {
            return a[2].write("chown: invalid user: " + d[1]), 1
          }
        }
      }
    }
    return 0
  };
  b.commands.uname = function(b, f, d) {
    f = a.a(d, "asnr")[0];
    d = g.c("GET", "/", "", {}, !1);
    if(200 !== d.status) {
      return b[2].write("uname: cannot access server"), 1
    }
    var e = "";
    if("s" in f || "a" in f) {
      e += d.responseJSON.kernel + " "
    }
    if("n" in f || "a" in f) {
      e += d.responseJSON.hostname + " "
    }
    if("r" in f || "a" in f) {
      e += d.responseJSON.version + " "
    }
    b[1].write(e);
    return 0
  }
})(jQuery, t);

