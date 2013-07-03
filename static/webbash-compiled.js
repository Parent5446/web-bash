function n(a, b, g) {
  var f = a[0];
  "~" === f ? a = g + "/" + a : "/" !== f && (a = b + "/" + a);
  a = a.substr(1).split("/");
  b = [];
  for(g = 0;g < a.length;g++) {
    "." !== a[g] && "" !== a[g] && (".." === a[g] ? b.pop() : b.push(a[g]))
  }
  return"/" + b.join("/")
}
;function r(a, b) {
  var g, f;
  "undefined" === typeof b && (b = 0);
  "undefined" === typeof g && (g = " ");
  "undefined" === typeof f && (f = "left");
  if(b + 1 >= a.length) {
    switch(f) {
      case "left":
        a = Array(b + 1 - a.length).join(g) + a;
        break;
      case "both":
        f = b - a.length;
        var c = Math.ceil(f / 2);
        a = Array(f - c + 1).join(g) + a + Array(c + 1).join(g);
        break;
      default:
        a = a + Array(b + 1 - a.length).join(g)
    }
  }
  return a
}
;$.b = function(a, b) {
  for(var g = {}, f = [a[0]], c = 1;c < a.length;c++) {
    if("-" !== a[c][0]) {
      if("+" === b[0]) {
        f = $.merge(f, a.slice(c));
        break
      }else {
        f.push(a[c]);
        continue
      }
    }else {
      if("--" === a[c]) {
        f = $.merge(f, a.slice(c));
        break
      }
    }
    for(var d = 1;d < a[c].length;d++) {
      var e = a[c][d], h = b.indexOf(e);
      if(-1 === h) {
        return"Unknown option -" + e
      }
      if(":" === b[h + 1]) {
        if(d === a[c].length - 1 && "-" !== a[c + 1][0]) {
          g[e] = a[++c]
        }else {
          if(":" !== b[h + 2]) {
            return"Option -" + e + " requires an argument"
          }
          g[e] = !0
        }
      }else {
        g[e] = !0
      }
    }
  }
  return[g, f]
};
function s(a) {
  for(var b = "", g = [], f = !1, c = !1, d = !1, e = 0;e < a.length;e++) {
    " " === a[e] && (f || c) ? b += a[e] : " " !== a[e] || f || c ? "\\" === a[e] ? d || f ? (b += "\\", d = !1) : d = !0 : "'" === a[e] ? d ? (b += "'", d = !1) : c ? b += "'" : f = !f : '"' === a[e] ? d ? (b += '"', d = !1) : f ? b += '"' : c = !c : "$" === a[e] && f ? b += "\\$" : (b += a[e], d = !1) : 0 < b.length && (g.push(b), b = "")
  }
  b = $.trim(b);
  "" !== b && g.push(b);
  return g
}
;window.Terminal = function() {
  this.i = null;
  this.c = "root@ubuntu> ";
  this.b = [];
  this.h = 0;
  this.promise = null;
  this.s = function() {
    $("#cursor").remove();
    $("body > ul > li:last-child").append($('<div id="cursor" class="userinput">&nbsp;</div>'));
    "Password: " !== this.c ? ($("#cursor").before($('<div class="userinput"></div>')), $("#cursor").after($('<div class="userinput></div>'))) : ($("#cursor").before($('<div id="hiddentext" class="userinput"></div>')), $("#cursor").after($('<div id="hiddentext" class="userinput"></div>')));
    $(window).scrollTop($(document).height())
  };
  this.v = function() {
    $("body > ul").empty()
  };
  this.k = function() {
    this.promise = null;
    $("body > ul").append("<li>" + this.c + "</li>");
    this.s()
  };
  this.w = function(a) {
    var b = $('<div id="system_output"></div>');
    b.text(a);
    $("body > ul > li:last-child").append(b);
    this.s()
  };
  this.u = function() {
    $("#cursor").toggleClass("blink")
  };
  this.r = function() {
    var a = $("#cursor"), b, g, f = a.prev(), c = a.next();
    if(0 === f.length || !f.hasClass("userinput")) {
      return!1
    }
    var d = f.text();
    if(0 === d.length) {
      return!1
    }
    b = d.substr(d.length - 1);
    g = a.text();
    0 === c.length && "&nbsp;" !== g && (c = $('<div class="userinput"></div>'), a.after(c));
    f.text(d.substring(0, d.length - 1));
    a.text(b);
    return"&nbsp;" !== g ? (c.prepend(g), !0) : !1
  };
  this.l = function() {
    var a = $("#cursor"), b, g, f, c = a.prev(), d = a.next();
    if(0 === d.length || !d.hasClass("userinput")) {
      return!1
    }
    f = d.text();
    if(0 === f.length) {
      return!1
    }
    b = f[0];
    g = a.text();
    if(0 === d.length) {
      return a.html("&nbsp;"), !1
    }
    d.text(f.substr(1));
    a.text(b);
    c.append(g);
    return!0
  };
  this.o = function(a) {
    var b = $("#cursor").parent().children(".userinput").text();
    this.b[this.h] = b.substr(0, b.length - 1);
    a = this.h + a;
    a < this.b.length && 0 <= a && (this.h = a, a = $("#cursor"), a.next().text(""), a.html("&nbsp;"), a.prev().text(this.b[this.h]))
  };
  this.A = function(a) {
    var b;
    if(37 === a.which) {
      a.preventDefault(), this.r()
    }else {
      if(39 === a.which) {
        a.preventDefault(), this.l()
      }else {
        if(38 === a.which) {
          a.preventDefault(), this.o(-1)
        }else {
          if(40 === a.which) {
            a.preventDefault(), this.o(1)
          }else {
            if(35 === a.which) {
              for(;this.l();) {
              }
            }else {
              if(36 === a.which) {
                for(;this.r();) {
                }
              }else {
                if(a.ctrlKey && !a.metaKey && !a.shiftKey && 67 === a.which) {
                  a.preventDefault(), $("#cursor").next().append("^C"), this.k()
                }else {
                  if(a.ctrlKey && !a.metaKey && !a.shiftKey && 68 === a.which) {
                    a.preventDefault(), this.promise && this.promise.m ? ($("#cursor").next().append("^D"), this.promise.m.close()) : (this.i.b(this), this.i.j.b(), window.open("", "_self", ""), window.close(), self.close())
                  }else {
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
                          b = $("#cursor").parent().children(".userinput").not(".completed"), a = b.text(), a = $.trim(a.substr(0, a.length - 1)), b.addClass("completed"), $("#cursor").prev().append($("#cursor").text() + "<br >"), this.promise && this.promise.m ? this.promise.m.write(a) : 0 < a.length ? (this.b[this.b.length] = a, this.h = this.b.length, this.promise = this.i.k($.trim(a), this), this.promise.progress($.proxy(this.w, this)).always($.proxy(this.k, this))) : this.k()
                        }else {
                          if(222 === a.which && a.shiftKey) {
                            a.preventDefault(), b = $("#cursor").prev(), b.append('"'), this.l()
                          }else {
                            if(222 === a.which) {
                              a.preventDefault(), b = $("#cursor").prev(), b.append("'"), this.l()
                            }else {
                              if(!a.ctrlKey && !a.metaKey) {
                                b = $("#cursor").prev();
                                a.preventDefault();
                                var g = {1:"!", 2:"@", 3:"#", 4:"$", 5:"%", 6:"^", 7:"&", 8:"*", 9:"(", 0:")", ",":"<", ".":">", "/":"?", ";":":", "'":'"', "[":"{", "]":"}", "\\":"|", "`":"~", "-":"_", "=":"+"}, f = {96:48, 97:49, 98:50, 99:51, 100:52, 101:53, 102:54, 103:55, 104:56, 105:57, 106:42, 107:43, 109:45, 110:46, 111:47, 173:45, 186:59, 187:61, 188:44, 189:45, 190:46, 191:47, 192:96, 219:91, 220:92, 221:93, 222:39}, c = a.which;
                                0 <= [16, 37, 38, 39, 40, 20, 17, 18, 91].indexOf(c) ? a = !1 : ("undefined" !== typeof f[c] && (c = f[c]), f = String.fromCharCode(c), a.shiftKey ? "undefined" !== typeof g[f] && (f = g[f]) : f = f.toLowerCase(), a = f);
                                a && b.append(a)
                              }
                            }
                          }
                        }
                      }
                    }
                  }
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
    null !== this.i && this.i.b.call(this.i, this);
    this.i = a;
    this.i.l.call(this.i, this);
    this.k()
  };
  $(window.document).keydown($.proxy(this.A, this));
  $(window).bind("beforeunload", function() {
    this.i.b.call(this.i, this)
  });
  window.setInterval(this.u, 500);
  window.setInterval($.proxy(function() {
    this.i.b(this)
  }, this), 1E4)
};
function u(a) {
  this.e = {"?":"0"};
  this.h = {};
  this.o = /[\w\?\-\!]+/i;
  this.f = a;
  this.c = 0;
  this.j = new v;
  this.l = function(b) {
    var a = this.j.a("GET", "/users/" + this.f, {}, {}, !1), f = this.j.a("GET", "/users/" + this.f + "/history", {}, {}, !1), a = a.responseJSON.homedir;
    this.e.USER = this.f;
    this.e.HOME = a;
    this.e.PWD = a;
    b.c = this.f + "@ubuntu " + a + " $ ";
    200 === f.status && (b.b = f.responseJSON, this.c = b.h = f.responseJSON.length)
  };
  this.b = function(b) {
    this.c < b.b.length && (this.j.a("PATCH", "/users/" + this.f + "/history", {history:b.b.slice(this.c)}), this.c = b.b.length)
  };
  this.k = function(b, a) {
    var f = $.Deferred();
    f.m = new w;
    setTimeout($.proxy(function() {
      var c = this.B(s(b));
      this.q(c, a, f)
    }, this), 0);
    var c = f.promise();
    c.m = f.m;
    return c
  };
  this.q = function(b, a, f) {
    var c, d = [f.m, new w, new w];
    b[0] in this.h && (b = $.merge(s(this.h[b[0]]), b.slice(1)));
    if("exit" === b[0]) {
      this.b(a), this.j.b(), window.open("", "_self", ""), window.close(), self.close()
    }else {
      if("clear" === b[0]) {
        a.v()
      }else {
        if("alias" === b[0]) {
          for(c = 1;c < b.length;++c) {
            var e = b[c].split("=", 2);
            2 == e.length && (this.h[e[0]] = e[1])
          }
          c = "0"
        }else {
          if(b[0] in u.commands) {
            var h = e = !1;
            for(c = b.indexOf(">");-1 !== c;c = b.indexOf(">", c)) {
              var e = !0, k = n(b[c + 1], this.e.PWD, this.e.HOME);
              d[1].n().done($.proxy(function(f) {
                f = f.p();
                this.j.a("PATCH", "/files" + k, f, {"Content-Type":"text/plain"})
              }, this));
              b.splice(c, 2)
            }
            for(c = b.indexOf("2>");-1 !== c;c = b.indexOf("2>", c)) {
              h = !0, k = n(b[c + 1], this.e.PWD, this.e.HOME), d[2].n().done($.proxy(function(f) {
                f = f.p();
                this.j.a("PATCH", "/files" + k, f, {"Content-Type":"text/plain"})
              }, this)), b.splice(c, 2)
            }
            for(c = b.indexOf("<");-1 !== c;c = b.indexOf("<", c)) {
              k = n(b[c + 1], this.e.PWD, this.e.HOME), d[0] = new w, this.j.a("GET", "/files" + k).done(function(f) {
                d[0].write(f);
                d[0].close()
              }), b.splice(c, 2)
            }
            e || (d[1].write = function(c) {
              f.notify([c])
            });
            h || (d[2].write = function(c) {
              f.notify([c])
            });
            c = u.commands[b[0]](d, b.length, b, this.e)
          }else {
            b[0] && (f.notify(["error: unknown command " + b[0]]), c = "127")
          }
        }
      }
    }
    b = $.proxy(function(c) {
      this.e["?"] = c.toString();
      a.c = this.f + "@ubuntu " + this.e.PWD + " $ ";
      d[0].close();
      d[1].close();
      d[2].close();
      f.resolve()
    }, this);
    "object" === $.type(c) && void 0 !== c.then ? c.then(b) : b(c)
  };
  this.B = function(b) {
    for(var a = 1;a < b.length;++a) {
      for(var f = b[a].indexOf("$");0 <= f;f = b[a].indexOf("$", f + 1)) {
        if(0 !== f && "\\" === b[a][f - 1]) {
          b[a] = b[a].substr(0, f - 1) + b[a].substr(f)
        }else {
          var c = this.o.exec(b[a].substr(f + 1))[0];
          null !== c && ("undefined" === typeof this.e[c] && (this.e[c] = ""), b[a] = b[a].substr(0, f) + this.e[c] + b[a].substr(f + c.length + 1))
        }
      }
    }
    return b
  }
}
u.commands = {};
window.WebBash = u;
window.WebBashLogin = function() {
  this.j = new v;
  this.f = "";
  this.l = function(a) {
    a.c = "Username: "
  };
  this.b = function() {
  };
  this.k = function(a, b) {
    var g = $.Deferred();
    setTimeout($.proxy(function() {
      this.q(a, b, g)
    }, this), 0);
    return g.promise()
  };
  this.q = function(a, b, g) {
    "" === this.f ? (this.f = a, "" !== a && (b.c = "Password: "), g.resolve()) : this.j.c(this.f, a).done($.proxy(function() {
      b.bind(new u(this.f))
    }, this)).fail($.proxy(function(f) {
      g.notify(f.responseText);
      this.f = "";
      b.c = "Username: ";
      g.resolve()
    }, this))
  }
};
function w() {
  this.h = 0;
  this.b = "";
  this.c = $.Deferred();
  this.write = function(a) {
    this.b += a;
    null !== this.c && this.c.notify(this)
  };
  this.p = function() {
    var a = "";
    this.h >= this.b.length ? a = "" : (a = this.b.substr(this.h), this.h = this.b.length);
    return a
  };
  this.n = function() {
    return this.c.promise()
  };
  this.close = function() {
    this.c.resolve(this)
  }
}
;function v() {
  this.t = this.f = "";
  this.c = function(a, b) {
    this.f = a;
    this.t = b;
    return this.a("GET", "/login").then($.proxy(function(a) {
      return this.a("PUT", "/login", {username:this.f, password:this.t, token:a.token})
    }, this))
  };
  this.b = function() {
    this.a("DELETE", "/login")
  };
  this.a = function(a, b, g, f, c) {
    var d = "application/x-www-form-urlencoded";
    void 0 !== f && "Content-Type" in f && (d = f["Content-Type"]);
    return $.ajax({async:void 0 === c ? !0 : c, contentType:d, data:g, headers:f, type:a, url:"api.php" + b})
  }
}
;(function(a, b) {
  b.commands["false"] = function() {
    return 1
  };
  b.commands["true"] = function() {
    return 0
  };
  b.commands.echo = function(a, f, c) {
    c.shift();
    a[1].write(c.join(" "));
    return 0
  };
  b.commands["export"] = function(a, f, c, b) {
    for(a = 1;a < f;++a) {
      var e = c[a].split("=", 2);
      b[e[0]] = e[1]
    }
    return 0
  };
  b.commands.unset = function(a, f, c, b) {
    for(a = 1;a < f;++a) {
      b[c[a]] = ""
    }
    return 0
  };
  b.commands.pwd = function(a, f, c, b) {
    a[1].write(b.PWD);
    return 0
  };
  b.commands.help = function(a) {
    a[2].write("Web-Bash implements a command line interface just like BASH on linux. Type a command like 'date' to test it out. ");
    a[2].write("To see a full list of commands, type 'commands' ");
    return 0
  };
  b.commands.commands = function(a) {
    var f = [], c;
    for(c in b.commands) {
      b.commands.hasOwnProperty(c) && f.push(c)
    }
    a[1].write(f.join("\n"));
    return 0
  };
  b.commands.whoami = function(a, f, c, b) {
    a[1].write(b.USER);
    return 0
  };
  b.commands.sleep = function(b, f, c) {
    if(2 > f) {
      return b[2].write("sleep: missing operand"), 1
    }
    b = c[1][c[1].length - 1];
    f = 0;
    -1 === ["s", "m", "h", "d"].indexOf(b) ? (f = parseInt(c[1], 10), b = "s") : f = parseInt(c[1].substr(0, -1), 10);
    switch(b) {
      case "d":
        f *= 24;
      case "h":
        f *= 60;
      case "m":
        f *= 60;
      case "s":
        f *= 1E3
    }
    var d = a.Deferred();
    setTimeout(function() {
      d.resolve(0)
    }, f);
    return d.promise()
  };
  b.commands.date = function(a, f) {
    if(1 < f) {
      return a[2].write("error: date takes no args"), 1
    }
    var c = new Date, b = Array(7);
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
    4 === c.getTimezoneOffset() / 60 && (h = "EDT");
    var b = b[c.getDay()].toString() + " " + e[c.getMonth()].toString() + " " + c.getDate().toString() + " ", k = c.getHours(), e = k.toString();
    10 > k && (e = "0" + k.toString());
    var l = c.getMinutes(), k = l.toString();
    10 > l && (k = "0" + l.toString());
    var l = c.getSeconds(), m = l.toString();
    10 > l && (m = "0" + l.toString());
    b += e + ":" + k + ":" + m + " " + h + " " + c.getFullYear().toString() + " ";
    a[1].write(b);
    return 0
  }
})(jQuery, u);
(function(a, b) {
  var g = new v;
  b.commands.cd = function(a, b, d, e) {
    var h = "", h = 1 >= b ? e.HOME : "/" === d[1][0] ? n(d[1]) : n(d[1], e.PWD, e.HOME);
    b = g.a("GET", "/files" + h, {}, {}, !1);
    if("directory" !== b.getResponseHeader("File-Type")) {
      return a[2].write("cd: " + h + ": Not a directory"), 1
    }
    if(404 === b.status) {
      return a[2].write("cd: " + h + ": No such file or directory"), 1
    }
    if(403 === b.status) {
      return a[2].write("cd: " + h + ": Permission denied"), 1
    }
    if(200 !== b.status) {
      return a[2].write("cd: " + h + ": An internal error occurred"), 1
    }
    e.PWD = h;
    return 0
  };
  b.commands.ls = function(b, c, d, e) {
    d = a.b(d, "la");
    var h = d[0];
    d = d[1];
    c = d.length;
    1 === c && (d[c++] = "");
    for(c = 1;c < d.length;c++) {
      var k = n(d[c], e.PWD, e.HOME), l = g.a("GET", "/files" + k, {}, {}, !1);
      if(null === l || 200 !== l.status) {
        b[2].write("ls: cannot access " + k + ": No such file or directory")
      }else {
        if("string" === typeof l.responseJSON) {
          l.responseJSON = [l.responseJSON]
        }else {
          if(null === l.responseJSON || void 0 === l.responseJSON) {
            l.responseJSON = []
          }
        }
        for(var m = "", k = 0, x = l.responseJSON.length - 1;k < l.responseJSON.length;k++, x--) {
          var y = b[1], p = l.responseJSON[k], t = x;
          if("." !== p[6] && ".." !== p[6] || "a" in h) {
            if(m = m + p[6] + "\t\t", "l" in h) {
              for(var m = "d" === p[0] ? "d" : "-", t = 0, q = 256;3 > t;t++, q >>= 1) {
                m += q & p[1] ? "r" : "-", q >>= 1, m += q & p[1] ? "w" : "-", q >>= 1, m += q & p[1] ? "x" : "-"
              }
              m += " " + r(p[2], 10);
              m += " " + r(p[3], 6);
              m += " " + r(p[4].toString(), 6);
              m += " " + p[5].date;
              m += " " + p[6];
              m += "\n";
              y.write(m);
              m = ""
            }else {
              m += "\n   ", 0 === t % 4 && (y.write(m), m = "")
            }
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
    e = g.a("PUT", "/files" + d, "", {"File-Type":"link", "Content-Location":b}, !1);
    return 404 === e.status ? (a[2].write("ln: failed to create symbolic link " + d + ": No such file or directory"), 1) : 403 === e.status ? (a[2].write("ln: failed to create symbolic link " + d + ": Permission denied"), 1) : 400 <= e.status ? (a[2].write("ln: failed to create symbolic link " + d + ": An internal error occurred"), 1) : 0
  };
  b.commands.touch = function(a, b, d, e) {
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.a("POST", "/files" + k, "", {}, !1);
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
    1 >= b && (d.push("-"), ++b);
    for(var h = !1, k = 1;k < b;k++) {
      if("-" === d[k]) {
        h = !0, a[0].n().progress(function(b) {
          a[1].write(b.p())
        })
      }else {
        var l = n(d[k], e.PWD, e.HOME);
        req = g.a("GET", "/files" + l, "", {}, !1);
        200 === req.status ? "directory" === req.getResponseHeader("File-Type") ? a[2].write("cat: " + l + ": Is a directory") : "application/json" !== req.getResponseHeader("Content-Type") ? a[1].write(req.responseText) : a[1].write(req.responseJSON) : 404 === req.status ? a[2].write("cat: " + l + ": No such file or directory") : 403 === req.status && a[2].write("cat: " + l + ": Permission denied")
      }
    }
    return h ? a[0].n() : 0
  };
  b.commands.mkdir = function(a, b, d, e) {
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.a("GET", "/files" + k, "", {}, !1);
      404 !== l.status && a[2].write("mkdir: cannot create directory " + k + ": File exists");
      l = g.a("PUT", "/files" + k, "", {"File-Type":"directory"}, !1);
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
  b.commands.useradd = function(b, c, d, e) {
    d = a.b(d, "d:g:G:mM");
    var h = d[0];
    d = d[1];
    c = d.length;
    if(2 > c) {
      return b[2].write("error in usage: useradd [OPTIONS] LOGIN [EMAIL]"), 1
    }
    3 !== c && d.push(d[1] + "@localhost");
    var k = g.a("GET", "/users/" + d[1], "", {}, !1);
    if(404 !== k.status) {
      return b[2].write("useradd: User " + d[1] + " already exists"), 1
    }
    c = "/home/" + d[1];
    "d" in h && (c = h.d);
    c = n(c, e.PWD, e.HOME);
    if("m" in h && !("M" in h)) {
      k = g.a("PUT", "/files" + c, "", {"File-Type":"directory"}, !1);
      if(404 === k.status) {
        return b[2].write("useradd: cannot create directory " + path + ": No such file or directory"), 1
      }
      if(403 === k.status) {
        return b[2].write("useradd: cannot create directory " + path + ": Permission denied"), 1
      }
      if(400 <= k.status) {
        return b[2].write("useradd: cannot create directory " + path + ": An internal error occurred"), 1
      }
    }
    e = [];
    "g" in h && e.push(h.g);
    "G" in h && (e = a.merge(e, h.G.split(",")));
    k = g.a("PUT", "/users/" + d[1], {password:"!", email:d[2], home_directory:c, groups:e}, {}, !1);
    if(400 === k.status || 404 === k.status && "Cannot find file or directory" === k.responseJSON) {
      return b[2].write("useradd: invalid home directory"), 1
    }
    if(403 === k.status) {
      return b[2].write("useradd: cannot create user: Permission denied"), 1
    }
    if(500 === k.status) {
      return b[2].write("count not create user: server timed out"), 1
    }
    g.a("PATCH", "/files" + c, "", {"File-Owner":d[1]}, !1);
    return 0
  };
  b.commands.passwd = function(b, c, d, e) {
    2 > c && (d.push(e.USER), ++c);
    var h = a.Deferred();
    b[0].n().progress(function(a) {
      a = a.p();
      a = g.a("PATCH", "/users/" + d[1], {password:a}, {}, !1);
      400 === a.status ? (b[2].write("useradd: invalid home directory"), h.resolve(1)) : 403 === a.status ? (b[2].write("useradd: cannot create user: Permission denied"), h.resolve(1)) : 500 == a.status ? (b[2].write("count not create user: server timed out"), h.resolve(1)) : h.resolve(0)
    });
    b[1].write("Password: ");
    return h
  };
  b.commands.cp = function(a, b, d, e) {
    3 !== b && a[2].write("cp: invalid number of parameters");
    b = n(d[1], e.PWD, e.HOME);
    d = n(d[2], e.PWD, e.HOME);
    e = g.a("PUT", "/files" + d, b, {"Content-Type":"application/vnd.webbash.filepath"}, !1);
    return 404 === e.status ? (a[2].write("cp: cannot create regular file " + d + ": No such file or directory"), 1) : 403 === e.status ? (a[2].write("cp: cannot create regular file " + d + ": Permission denied"), 1) : 400 <= e.status && "Invalid file data source" === e.responseJSON ? (a[2].write("cp: cannot stat " + b + ": No such file or directory"), 1) : 0
  };
  b.commands.mv = function(a, b, d, e) {
    3 !== b && a[2].write("mv: invalid number of parameters");
    b = n(d[1], e.PWD, e.HOME);
    d = n(d[2], e.PWD, e.HOME);
    e = g.a("PUT", "/files" + d, b, {"Content-Type":"application/vnd.webbash.filepath"}, !1);
    if(404 === e.status) {
      return a[2].write("mv: cannot create regular file " + d + ": No such file or directory"), 1
    }
    if(403 === e.status) {
      return a[2].write("mv: cannot create regular file " + d + ": Permission denied"), 1
    }
    if(400 <= e.status && "Invalid file data source" === e.responseJSON) {
      return a[2].write("mv: cannot stat " + b + ": No such file or directory"), 1
    }
    e = g.a("DELETE", "/files" + b, "", {}, !1);
    return 403 === e.status ? (a[2].write("mv: cannot remove " + b + ": Permission denied"), 1) : 0
  };
  b.commands.rmdir = function(a, b, d, e) {
    for(var h = 1;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.a("GET", "/files" + k, {}, {}, !1);
      404 === l.status ? a[2].write("rmdir: cannot remove " + k + ": No such directory") : 403 === l.status ? a[2].write("rmdir: cannot remove " + k + ": Permission denied") : "directory" === l.getResponseHeader("File-Type") && 2 === l.responseJSON.length ? g.a("DELETE", "/files" + k, "", {}, !1) : a[2].write("rmdir: cannot remove " + k + ": Non-empty directory")
    }
    return 0
  };
  b.commands.rm = function(b, c, d, e) {
    c = a.b(d, "r");
    var h = c[0];
    d = c[1];
    c = d.length;
    var k = !1, l;
    for(l in h) {
      h.hasOwnProperty(l) && "r" === l && (k = !0)
    }
    for(h = 1;h < c;h++) {
      l = n(d[h], e.PWD, e.HOME);
      var m = g.a("GET", "/files" + l, {}, {}, !1);
      "directory" !== m.getResponseHeader("File-Type") || k ? (m = g.a("DELETE", "/files" + l, "", {}, !1), 404 === m.status ? b[2].write("rm: cannot remove " + l + ": No such file or directory") : 403 === m.status && b[2].write("rm: cannot remove " + l + ": Permission denied")) : b[2].write("rm: cannot remove " + l + ": File is a directory")
    }
    return 0
  };
  b.commands.chmod = function(a, b, d, e) {
    if(3 > b) {
      return a[2].write("chown: needs at least 2 parameters"), 1
    }
    for(var h = 2;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.a("PATCH", "/files" + k, "", {"File-Permissions":d[1]}, !1);
      404 === l.status ? a[2].write("chown: cannot access " + k + ": No such file or directory") : 403 === l.status && a[2].write("chown: changing permissions of " + k + ": Permission denied")
    }
    return 0
  };
  b.commands.chgrp = function(a, b, d, e) {
    if(3 > b) {
      return a[2].write("chown: needs at least 2 parameters"), 1
    }
    for(var h = 2;h < b;h++) {
      var k = n(d[h], e.PWD, e.HOME), l = g.a("PATCH", "/files" + k, "", {"File-Group":d[1]}, !1);
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
      var k = n(d[h], e.PWD, e.HOME), l = g.a("PATCH", "/files" + k, "", {"File-Owner":d[1]}, !1);
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
  b.commands.uname = function(b, c, d) {
    c = a.b(d, "asnr")[0];
    d = g.a("GET", "/", "", {}, !1);
    if(200 !== d.status) {
      return b[2].write("uname: cannot access server"), 1
    }
    var e = "";
    if("s" in c || "a" in c) {
      e += d.responseJSON.kernel + " "
    }
    if("n" in c || "a" in c) {
      e += d.responseJSON.hostname + " "
    }
    if("r" in c || "a" in c) {
      e += d.responseJSON.version + " "
    }
    b[1].write(e);
    return 0
  }
})(jQuery, u);

