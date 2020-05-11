System.register(["./p-3369a689.system.js","./p-d7fc1715.system.js","./p-fa4e7901.system.js","./p-44df65c4.system.js","./p-cf18e915.system.js","./p-030976a5.system.js"],(function(e){"use strict";var t,i,n,s,o;return{setters:[function(e){t=e.r;i=e.h},function(){},function(){},function(e){n=e.T},function(e){s=e.C},function(e){o=e.B}],execute:function(){var a=undefined&&undefined.__decorate||function(e,t,i,n){var s=arguments.length,o=s<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,a;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)if(a=e[l])o=(s<3?a(o):s>3?a(t,i,o):a(t,i))||o;return s>3&&o&&Object.defineProperty(t,i,o),o};var l=e("psk_input",function(){function e(e){var i=this;t(this,e);this.__keyUpHandler=function(e){e.stopImmediatePropagation();var t=e.target.value;if(i["changeModel"]){i["changeModel"].call(i,"value",t)}else{console.warn("[psk-input] Function named -=changeModel=- is not defined!")}};this.type="text";this.label=null;this.value=null;this.name=null;this.placeholder=null;this.required=false;this.readOnly=false;this.invalidValue=null;this.specificProps={}}e.prototype.render=function(){var e=this.invalidValue===null?"":this.invalidValue?"is-invalid":"is-valid";var t=this.name?this.name:this.label&&this.label.replace(/( |:|\/|\.|-)/g,"").toLowerCase();return i("div",{class:"form-group"},this.label&&i("psk-label",{for:t,label:this.label}),i("input",Object.assign({type:this.type,value:this.value,name:t,class:"form-control "+e,placeholder:this.placeholder,required:this.required,readOnly:this.readOnly,onKeyUp:this.__keyUpHandler.bind(this)},this.specificProps)))};return e}());a([s(),o()],l.prototype,"render",null);a([n({description:["Specifies the type psk-input to display.",'The full list of type and explanations can be found at: <a href="https://www.w3schools.com/html/html_form_input_types.asp">HTML Input Types</a>'],isMandatory:false,propertyType:"string",defaultValue:"text",specialNote:'If no value is provided, "text" is assumed'})],l.prototype,"type",void 0);a([n({description:['By filling out this property, the component will display above it, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.'],isMandatory:false,propertyType:"string",specialNote:"If this property is not provided, the component will be displayed without any label"})],l.prototype,"label",void 0);a([n({description:["Specifies the value of an psk-input component.",'This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link page="forms/using-forms">Using forms</psk-link>.'],isMandatory:false,propertyType:"string"})],l.prototype,"value",void 0);a([n({description:["Specifies the name of a psk-input component. It is used along with the psk-label component."],isMandatory:false,propertyType:"string"})],l.prototype,"name",void 0);a([n({description:["Specifies a short hint that describes the expected value of an psk-input component"],isMandatory:false,propertyType:"string"})],l.prototype,"placeholder",void 0);a([n({description:["Specifies that an input field must be filled out before submitting the form.",'Accepted values: "true" and "false"'],isMandatory:false,propertyType:"boolean"})],l.prototype,"required",void 0);a([n({description:["\tSpecifies that an input field is read-only.",'Accepted values: "true" and "false"'],isMandatory:false,propertyType:"boolean"})],l.prototype,"readOnly",void 0);a([n({description:["This property indicates if the value entered by the user is a valid one according to some validation present in the controller."],isMandatory:false,propertyType:"boolean"})],l.prototype,"invalidValue",void 0)}}}));