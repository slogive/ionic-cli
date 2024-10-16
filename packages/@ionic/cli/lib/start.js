"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STARTER_TEMPLATES = exports.SUPPORTED_FRAMEWORKS = exports.getStarterProjectTypes = exports.getStarterList = exports.getAdvertisement = exports.readStarterManifest = exports.verifyOptions = exports.STARTER_BASE_URL = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_terminal_1 = require("@ionic/utils-terminal");
const lodash = tslib_1.__importStar(require("lodash"));
const constants_1 = require("../constants");
const guards_1 = require("../guards");
const color_1 = require("./color");
const errors_1 = require("./errors");
const project_1 = require("./project");
const emoji_1 = require("./utils/emoji");
const http_1 = require("./utils/http");
exports.STARTER_BASE_URL = 'https://d2ql0qc7j8u4b2.cloudfront.net';
function verifyOptions(options, { log }) {
    // If the action is list then lets just end here.
    if (options['list']) {
        const typeOption = options['type'] ? String(options['type']) : undefined;
        if (typeOption && !constants_1.PROJECT_TYPES.includes(typeOption)) {
            throw new errors_1.FatalException(`${(0, color_1.input)(typeOption)} is not a valid project type.\n` +
                `Valid project types are: ${getStarterProjectTypes().map(type => (0, color_1.input)(type)).join(', ')}`);
        }
        const headers = ['name', 'description'].map(h => (0, color_1.strong)(h));
        const starterTypes = typeOption ? [typeOption] : getStarterProjectTypes();
        for (const starterType of starterTypes) {
            const starters = exports.STARTER_TEMPLATES.filter(template => template.projectType === starterType);
            log.rawmsg(`\n${(0, color_1.strong)(`Starters for ${(0, project_1.prettyProjectName)(starterType)}`)} (${(0, color_1.input)(`--type=${starterType}`)})\n\n`);
            log.rawmsg((0, utils_terminal_1.columnar)(starters.map(({ name, description }) => [(0, color_1.input)(name), description || '']), { ...constants_1.COLUMNAR_OPTIONS, headers }));
            log.rawmsg('\n');
        }
        throw new errors_1.FatalException('', 0);
    }
    if (options['skip-deps']) {
        log.warn(`The ${(0, color_1.input)('--skip-deps')} option has been deprecated. Please use ${(0, color_1.input)('--no-deps')}.`);
        options['deps'] = false;
    }
    if (options['skip-link']) {
        log.warn(`The ${(0, color_1.input)('--skip-link')} option has been deprecated. Please use ${(0, color_1.input)('--no-link')}.`);
        options['link'] = false;
    }
    if (options['pro-id']) {
        log.warn(`The ${(0, color_1.input)('--pro-id')} option has been deprecated. Please use ${(0, color_1.input)('--id')}.`);
        options['id'] = options['pro-id'];
    }
    if (options['id']) {
        if (options['link'] === false) {
            log.warn(`The ${(0, color_1.input)('--no-link')} option has no effect with ${(0, color_1.input)('--id')}. App must be linked.`);
        }
        options['link'] = true;
        if (!options['git']) {
            log.warn(`The ${(0, color_1.input)('--no-git')} option has no effect with ${(0, color_1.input)('--id')}. Git must be used.`);
        }
        options['git'] = true;
    }
}
exports.verifyOptions = verifyOptions;
async function readStarterManifest(p) {
    try {
        const manifest = await (0, utils_fs_1.readJson)(p);
        if (!(0, guards_1.isStarterManifest)(manifest)) {
            throw new Error(`${p} is not a valid starter manifest.`);
        }
        return manifest;
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            throw new Error(`${p} not found`);
        }
        else if (e instanceof SyntaxError) {
            throw new Error(`${p} is not valid JSON.`);
        }
        throw e;
    }
}
exports.readStarterManifest = readStarterManifest;
function getAdvertisement() {
    const choices = [getAppflowAdvertisement, getAdvisoryAdvertisement, getEnterpriseAdvertisement];
    const idx = Math.floor(Math.random() * choices.length);
    return `${choices[idx]()}\n\n`;
}
exports.getAdvertisement = getAdvertisement;
function getAppflowAdvertisement() {
    return `
  ──────────────────────────────────────────────────────────────

        ${(0, color_1.title)('Ionic Appflow')}, the mobile DevOps solution by Ionic

           Continuously build, deploy, and ship apps ${(0, emoji_1.emoji)('🚀', '')}
        Focus on building apps while we automate the rest ${(0, emoji_1.emoji)('🎁', '')}

        ${(0, emoji_1.emoji)('         👉 ', 'Learn more:')} ${(0, color_1.strong)('https://ion.link/appflow')} ${(0, emoji_1.emoji)(' 👈', '')}

  ──────────────────────────────────────────────────────────────
`;
}
function getAdvisoryAdvertisement() {
    return `
  ──────────────────────────────────────────────────────────────────────────────

         ${(0, color_1.title)('Ionic Advisory')}, tailored solutions and expert services by Ionic

                             Go to market faster ${(0, emoji_1.emoji)('🏆', '')}
                    Real-time troubleshooting and guidance ${(0, emoji_1.emoji)('💁', '')}
        Custom training, best practices, code and architecture reviews ${(0, emoji_1.emoji)('🔎', '')}
      Customized strategies for every phase of the development lifecycle ${(0, emoji_1.emoji)('🔮', '')}

               ${(0, emoji_1.emoji)('         👉 ', 'Learn more:')} ${(0, color_1.strong)('https://ion.link/advisory')} ${(0, emoji_1.emoji)(' 👈', '')}

  ──────────────────────────────────────────────────────────────────────────────
`;
}
function getEnterpriseAdvertisement() {
    return `
  ──────────────────────────────────────────────────────────────────────

      ${(0, color_1.title)('Ionic Enterprise')}, platform and solutions for teams by Ionic

                  Powerful library of native APIs ${(0, emoji_1.emoji)('⚡️', '')}
                 A supercharged platform for teams ${(0, emoji_1.emoji)('💪', '')}

         ${(0, emoji_1.emoji)('         👉 ', 'Learn more:')} ${(0, color_1.strong)('https://ion.link/enterprise')} ${(0, emoji_1.emoji)(' 👈', '')}

  ──────────────────────────────────────────────────────────────────────
`;
}
async function getStarterList(config, tag = 'latest') {
    const { req } = await (0, http_1.createRequest)('GET', `${exports.STARTER_BASE_URL}/${tag === 'latest' ? '' : `${tag}/`}starters.json`, config.getHTTPConfig());
    const res = await req;
    // TODO: typecheck
    return res.body;
}
exports.getStarterList = getStarterList;
function getStarterProjectTypes() {
    return lodash.uniq(exports.STARTER_TEMPLATES.map(t => t.projectType));
}
exports.getStarterProjectTypes = getStarterProjectTypes;
exports.SUPPORTED_FRAMEWORKS = [
    {
        name: 'Angular',
        type: 'angular',
        description: 'https://angular.io',
    },
    {
        name: 'React',
        type: 'react',
        description: 'https://reactjs.org',
    },
    {
        name: 'Vue',
        type: 'vue',
        description: 'https://vuejs.org',
    },
];
exports.STARTER_TEMPLATES = [
    // Vue
    {
        name: 'tabs',
        projectType: 'vue',
        type: 'managed',
        description: 'A starting project with a simple tabbed interface',
        id: 'vue-vite-official-tabs',
    },
    {
        name: 'sidemenu',
        projectType: 'vue',
        type: 'managed',
        description: 'A starting project with a side menu with navigation in the content area',
        id: 'vue-vite-official-sidemenu',
    },
    {
        name: 'blank',
        projectType: 'vue',
        type: 'managed',
        description: 'A blank starter project',
        id: 'vue-vite-official-blank',
    },
    {
        name: 'list',
        projectType: 'vue',
        type: 'managed',
        description: 'A starting project with a list',
        id: 'vue-vite-official-list',
    },
    // Angular
    {
        name: 'tabs',
        projectType: 'angular',
        type: 'managed',
        description: 'A starting project with a simple tabbed interface',
        id: 'angular-official-tabs',
    },
    {
        name: 'sidemenu',
        projectType: 'angular',
        type: 'managed',
        description: 'A starting project with a side menu with navigation in the content area',
        id: 'angular-official-sidemenu',
    },
    {
        name: 'blank',
        projectType: 'angular',
        type: 'managed',
        description: 'A blank starter project',
        id: 'angular-official-blank',
    },
    {
        name: 'list',
        projectType: 'angular',
        type: 'managed',
        description: 'A starting project with a list',
        id: 'angular-official-list',
    },
    {
        name: 'my-first-app',
        projectType: 'angular',
        type: 'repo',
        description: 'A template for the "Build Your First App" tutorial',
        repo: 'https://github.com/ionic-team/photo-gallery-capacitor-ng',
    },
    {
        name: 'tabs',
        projectType: constants_1.ANGULAR_STANDALONE,
        type: 'managed',
        description: 'A starting project with a simple tabbed interface',
        id: 'angular-standalone-official-tabs',
    },
    {
        name: 'sidemenu',
        projectType: constants_1.ANGULAR_STANDALONE,
        type: 'managed',
        description: 'A starting project with a side menu with navigation in the content area',
        id: 'angular-standalone-official-sidemenu',
    },
    {
        name: 'blank',
        projectType: constants_1.ANGULAR_STANDALONE,
        type: 'managed',
        description: 'A blank starter project',
        id: 'angular-standalone-official-blank',
    },
    {
        name: 'list',
        projectType: constants_1.ANGULAR_STANDALONE,
        type: 'managed',
        description: 'A starting project with a list',
        id: 'angular-standalone-official-list',
    },
    {
        name: 'my-first-app',
        projectType: constants_1.ANGULAR_STANDALONE,
        type: 'repo',
        description: 'A template for the "Build Your First App" tutorial',
        repo: 'https://github.com/ionic-team/photo-gallery-capacitor-ng',
    },
    // React
    {
        name: 'blank',
        projectType: 'react',
        type: 'managed',
        description: 'A blank starter project',
        id: 'react-vite-official-blank',
    },
    {
        name: 'list',
        projectType: 'react',
        type: 'managed',
        description: 'A starting project with a list',
        id: 'react-vite-official-list',
    },
    {
        name: 'my-first-app',
        projectType: 'react',
        type: 'repo',
        description: 'A template for the "Build Your First App" tutorial',
        repo: 'https://github.com/ionic-team/photo-gallery-capacitor-react',
    },
    {
        name: 'sidemenu',
        projectType: 'react',
        type: 'managed',
        description: 'A starting project with a side menu with navigation in the content area',
        id: 'react-vite-official-sidemenu',
    },
    {
        name: 'tabs',
        projectType: 'react',
        type: 'managed',
        description: 'A starting project with a simple tabbed interface',
        id: 'react-vite-official-tabs',
    },
];
