webpackJsonp([2],{35:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(38),a=s(39),r=s(0)(n.a,a.a,!1,null,null,null);r.options.__file="src/pages/admin.vue",r.esModule&&Object.keys(r.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),e.default=r.exports},38:function(t,e,s){"use strict";e.a={created:async function(){let t=await this.$http.get(`/monitor/`);this.list=[t.body]},data:()=>({columns:[{title:"进行中任务",key:"runningWorkers"},{title:"待分配任务",key:"tasks"},{title:"偷懒的工人",key:"workers"},{title:"延时的任务",key:"delayTasks"}],list:[]})}},39:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"layout-content-main"},[s("Table",{attrs:{columns:t.columns,data:t.list}})],1)};n._withStripped=!0;var a={render:n,staticRenderFns:[]};e.a=a}});