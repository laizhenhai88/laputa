webpackJsonp([1],{54:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(67),a=n(68),s=!1,r=n(1)(i.a,a.a,!1,function(e){s||n(65)},"data-v-cdce58de",null);r.options.__file="src/pages/detail.vue",r.esModule&&Object.keys(r.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),t.default=r.exports},65:function(e,t,n){var i=n(66);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n(5)("de2c7692",i,!1)},66:function(e,t,n){(e.exports=n(2)(!0)).push([e.i,"\n.container[data-v-cdce58de]{\n  margin:0px auto;\n  width: 1000px;\n  text-align: center;\n}\n","",{version:3,sources:["/Users/laihongyu/WebstormProjects/laputa/src/pages/src/pages/detail.vue?4e4a3cb8"],names:[],mappings:";AA6BA;EACA,gBAAA;EACA,cAAA;EACA,mBAAA;CACA",file:"detail.vue",sourcesContent:["<template>\n  <div class=\"container\" v-if='d.main'>\n    <h1 v-title='d.main.title'>{{d.main.title}}</h1>\n    <p>{{d.main.time}}</p>\n    <p>{{d.main.note}}</p>\n    <img :src=\"'/' + d.main._id + '.jpg'\">\n    <img :src=\"'/' + item._id + '-image.jpg'\" v-for=\"(item, index) in d.items\" :key=\"index\">\n  </div>\n</template>\n\n<script>\nexport default {\n  props: ['_id'],\n  data() {\n    return {\n      d:{\n      }\n    }\n  },\n  created: async function() {\n    let result = await this.$http.get(`/fuli/detail/${this._id}`);\n    this.d = result.body;\n  },\n  methods: {\n  }\n}\n<\/script>\n\n<style scoped>\n.container{\n  margin:0px auto;\n  width: 1000px;\n  text-align: center;\n}\n</style>\n"],sourceRoot:""}])},67:function(e,t,n){"use strict";t.a={props:["_id"],data:()=>({d:{}}),created:async function(){let e=await this.$http.get(`/fuli/detail/${this._id}`);this.d=e.body},methods:{}}},68:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.d.main?n("div",{staticClass:"container"},[n("h1",{directives:[{name:"title",rawName:"v-title",value:e.d.main.title,expression:"d.main.title"}]},[e._v(e._s(e.d.main.title))]),e._v(" "),n("p",[e._v(e._s(e.d.main.time))]),e._v(" "),n("p",[e._v(e._s(e.d.main.note))]),e._v(" "),n("img",{attrs:{src:"/"+e.d.main._id+".jpg"}}),e._v(" "),e._l(e.d.items,function(e,t){return n("img",{key:t,attrs:{src:"/"+e._id+"-image.jpg"}})})],2):e._e()};i._withStripped=!0;var a={render:i,staticRenderFns:[]};t.a=a}});