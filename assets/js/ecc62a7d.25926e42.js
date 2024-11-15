"use strict";(self.webpackChunkeliza_docs=self.webpackChunkeliza_docs||[]).push([[9882],{14673:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>s,toc:()=>a});const s=JSON.parse('{"id":"interfaces/Content","title":"Content","description":"@ai16z/eliza v1.0.0 / Content","source":"@site/api/interfaces/Content.md","sourceDirName":"interfaces","slug":"/interfaces/Content","permalink":"/eliza/api/interfaces/Content","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"Actor","permalink":"/eliza/api/interfaces/Actor"},"next":{"title":"ConversationExample","permalink":"/eliza/api/interfaces/ConversationExample"}}');var t=i(74848),c=i(28453);const r={},l="Interface: Content",d={},a=[{value:"Indexable",id:"indexable",level:2},{value:"Properties",id:"properties",level:2},{value:"text",id:"text",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"action?",id:"action",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"source?",id:"source",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"url?",id:"url",level:3},{value:"Defined in",id:"defined-in-3",level:4},{value:"inReplyTo?",id:"inreplyto",level:3},{value:"Defined in",id:"defined-in-4",level:4},{value:"attachments?",id:"attachments",level:3},{value:"Defined in",id:"defined-in-5",level:4}];function o(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",p:"p",strong:"strong",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"/eliza/api/",children:"@ai16z/eliza v1.0.0"})," / Content"]}),"\n",(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"interface-content",children:"Interface: Content"})}),"\n",(0,t.jsxs)(n.p,{children:["Represents the content of a message, including its main text (",(0,t.jsx)(n.code,{children:"content"}),"), any associated action (",(0,t.jsx)(n.code,{children:"action"}),"), and the source of the content (",(0,t.jsx)(n.code,{children:"source"}),"), if applicable."]}),"\n",(0,t.jsx)(n.h2,{id:"indexable",children:"Indexable"}),"\n",(0,t.jsxs)(n.p,{children:["[",(0,t.jsx)(n.code,{children:"key"}),": ",(0,t.jsx)(n.code,{children:"string"}),"]: ",(0,t.jsx)(n.code,{children:"unknown"})]}),"\n",(0,t.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,t.jsx)(n.h3,{id:"text",children:"text"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"text"}),": ",(0,t.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L12",children:"packages/core/src/types.ts:12"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"action",children:"action?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"action"}),": ",(0,t.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-1",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L13",children:"packages/core/src/types.ts:13"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"source",children:"source?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"source"}),": ",(0,t.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-2",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L14",children:"packages/core/src/types.ts:14"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"url",children:"url?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"url"}),": ",(0,t.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-3",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L15",children:"packages/core/src/types.ts:15"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"inreplyto",children:"inReplyTo?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"inReplyTo"}),": `${string}-${string}-${string}-${string}-${string}`"]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-4",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L16",children:"packages/core/src/types.ts:16"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"attachments",children:"attachments?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"attachments"}),": ",(0,t.jsx)(n.a,{href:"/eliza/api/type-aliases/Media",children:(0,t.jsx)(n.code,{children:"Media"})}),"[]"]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-5",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/ai16z/eliza/blob/main/packages/core/src/types.ts#L17",children:"packages/core/src/types.ts:17"})})]})}function h(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},28453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>l});var s=i(96540);const t={},c=s.createContext(t);function r(e){const n=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(c.Provider,{value:n},e.children)}}}]);