"use strict";(self.webpackChunkeliza_docs=self.webpackChunkeliza_docs||[]).push([[9082],{367:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"packages/agent","title":"\ud83e\udd16 Agent Package","description":"The Agent Package (@eliza/agent) provides the high-level orchestration layer for Eliza, managing agent lifecycles, character loading, client initialization, and runtime coordination.","source":"@site/docs/packages/agent.md","sourceDirName":"packages","slug":"/packages/agent","permalink":"/eliza/docs/packages/agent","draft":false,"unlisted":false,"editUrl":"https://github.com/ai16z/eliza/tree/main/docs/docs/packages/agent.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Client Packages","permalink":"/eliza/docs/packages/clients"},"next":{"title":"Plugin System","permalink":"/eliza/docs/packages/plugins"}}');var r=a(74848),i=a(28453);const s={sidebar_position:1},c="\ud83e\udd16 Agent Package",l={},o=[{value:"Architecture Overview",id:"architecture-overview",level:2},{value:"Key Responsibilities",id:"key-responsibilities",level:2},{value:"Installation",id:"installation",level:2},{value:"Quick Start",id:"quick-start",level:2},{value:"Core Features",id:"core-features",level:2},{value:"Character Loading",id:"character-loading",level:3},{value:"Agent Creation",id:"agent-creation",level:3},{value:"Client Initialization",id:"client-initialization",level:3},{value:"Best Practices",id:"best-practices",level:2},{value:"Token Management",id:"token-management",level:3},{value:"Database Selection",id:"database-selection",level:3},{value:"Common Issues &amp; Solutions",id:"common-issues--solutions",level:2},{value:"Related Resources",id:"related-resources",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",mermaid:"mermaid",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"-agent-package",children:"\ud83e\udd16 Agent Package"})}),"\n",(0,r.jsxs)(n.p,{children:["The Agent Package (",(0,r.jsx)(n.code,{children:"@eliza/agent"}),") provides the high-level orchestration layer for Eliza, managing agent lifecycles, character loading, client initialization, and runtime coordination."]}),"\n",(0,r.jsx)(n.h2,{id:"architecture-overview",children:"Architecture Overview"}),"\n",(0,r.jsx)(n.mermaid,{value:'graph TD\n    AP["Agent Package"]\n    AP --\x3e CS["Character System"]\n    AP --\x3e RT["Runtime Management"]\n    AP --\x3e DB["Database Integration"]\n    AP --\x3e CL["Client Management"]\n    \n    CS --\x3e CF["Character Loading"]\n    CS --\x3e CP["Plugin Loading"]\n    CS --\x3e CT["Token Management"]\n    \n    RT --\x3e AR["Agent Runtime"]\n    RT --\x3e AM["Agent Monitoring"]\n    RT --\x3e AH["Shell Interface"]\n    \n    DB --\x3e PS["PostgreSQL Support"]\n    DB --\x3e SL["SQLite Support"]\n    \n    CL --\x3e DC["Direct Client"]\n    CL --\x3e PC["Platform Clients"]\n    \n    %% Simple styling with black text\n    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px,color:black\n    classDef highlight fill:#e9e9e9,stroke:#333,stroke-width:2px,color:black\n    \n    class AP highlight'}),"\n",(0,r.jsx)(n.h2,{id:"key-responsibilities",children:"Key Responsibilities"}),"\n",(0,r.jsxs)(n.p,{children:["The Agent Package (",(0,r.jsx)(n.code,{children:"@ai16z/agent"}),") serves as the orchestration layer for Eliza, handling:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Character and plugin loading"}),"\n",(0,r.jsx)(n.li,{children:"Runtime initialization and management"}),"\n",(0,r.jsx)(n.li,{children:"Database adapter selection"}),"\n",(0,r.jsx)(n.li,{children:"Client initialization and coordination"}),"\n",(0,r.jsx)(n.li,{children:"Token and environment management"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"pnpm add @ai16z/agent\n"})}),"\n",(0,r.jsx)(n.h2,{id:"quick-start",children:"Quick Start"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'import { startAgents, loadCharacters } from "@ai16z/agent";\n\n// Load characters from files\nconst args = parseArguments();\nconst characters = await loadCharacters(args.characters || args.character);\n\n// Start agent system\nawait startAgents();\n'})}),"\n",(0,r.jsx)(n.h2,{id:"core-features",children:"Core Features"}),"\n",(0,r.jsx)(n.h3,{id:"character-loading",children:"Character Loading"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'export async function loadCharacters(charactersArg: string): Promise<Character[]> {\n  const characterPaths = normalizeCharacterPaths(charactersArg);\n  const loadedCharacters = [];\n\n  for (const path of characterPaths) {\n    try {\n      const character = JSON.parse(fs.readFileSync(path, "utf8"));\n      \n      // Load plugins if specified\n      if (character.plugins) {\n        character.plugins = await Promise.all(\n          character.plugins.map(async plugin => {\n            const importedPlugin = await import(plugin);\n            return importedPlugin;\n          })\n        );\n      }\n      \n      loadedCharacters.push(character);\n    } catch (error) {\n      console.error(`Error loading character from ${path}: ${error}`);\n    }\n  }\n\n  // Fall back to default if none loaded\n  return loadedCharacters.length > 0 ? loadedCharacters : [defaultCharacter];\n}\n'})}),"\n",(0,r.jsx)(n.h3,{id:"agent-creation",children:"Agent Creation"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"export async function createAgent(\n  character: Character,\n  db: IDatabaseAdapter,\n  token: string\n) {\n  return new AgentRuntime({\n    databaseAdapter: db,\n    token,\n    modelProvider: character.modelProvider,\n    character,\n    plugins: [\n      bootstrapPlugin,\n      nodePlugin,\n      character.settings.secrets.WALLET_PUBLIC_KEY ? solanaPlugin : null\n    ].filter(Boolean),\n    providers: [],\n    actions: [],\n    services: [],\n    managers: []\n  });\n}\n"})}),"\n",(0,r.jsx)(n.h3,{id:"client-initialization",children:"Client Initialization"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'export async function initializeClients(\n  character: Character,\n  runtime: IAgentRuntime\n) {\n  const clients = [];\n  const clientTypes = character.clients?.map(str => str.toLowerCase()) || [];\n\n  if (clientTypes.includes("discord")) {\n    clients.push(await DiscordClientInterface.start(runtime));\n  }\n  if (clientTypes.includes("telegram")) {\n    clients.push(await TelegramClientInterface.start(runtime));\n  }\n  if (clientTypes.includes("twitter")) {\n    clients.push(await TwitterClientInterface.start(runtime));\n  }\n  if (clientTypes.includes("auto")) {\n    clients.push(await AutoClientInterface.start(runtime));\n  }\n\n  return clients;\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"best-practices",children:"Best Practices"}),"\n",(0,r.jsx)(n.h3,{id:"token-management",children:"Token Management"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"export function getTokenForProvider(\n  provider: ModelProviderName,\n  character: Character\n) {\n  switch (provider) {\n    case ModelProviderName.OPENAI:\n      return character.settings?.secrets?.OPENAI_API_KEY || settings.OPENAI_API_KEY;\n    case ModelProviderName.ANTHROPIC:\n      return character.settings?.secrets?.ANTHROPIC_API_KEY || settings.ANTHROPIC_API_KEY;\n    // Handle other providers...\n  }\n}\n"})}),"\n",(0,r.jsx)(n.h3,{id:"database-selection",children:"Database Selection"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'function initializeDatabase() {\n  if (process.env.POSTGRES_URL) {\n    return new PostgresDatabaseAdapter({\n      connectionString: process.env.POSTGRES_URL\n    });\n  } \n  return new SqliteDatabaseAdapter(new Database("./db.sqlite"));\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"common-issues--solutions",children:"Common Issues & Solutions"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"Character Loading"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'// Handle missing character files\nif (!characters || characters.length === 0) {\n  console.log("No characters found, using default character");\n  characters = [defaultCharacter];\n}\n'})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"Plugin Loading"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"// Handle plugin import errors\ntry {\n  character.plugins = await Promise.all(\n    character.plugins.map(plugin => import(plugin))\n  );\n} catch (error) {\n  console.error(`Error loading plugin: ${error.message}`);\n  character.plugins = [];\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"related-resources",children:"Related Resources"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../../packages/plugins",children:"Plugin System"})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},28453:(e,n,a)=>{a.d(n,{R:()=>s,x:()=>c});var t=a(96540);const r={},i=t.createContext(r);function s(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);